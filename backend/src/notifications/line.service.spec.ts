import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LineService } from './line.service';

const TOKEN = 'test-token-SECRET-value-1234567890';
const USER_ID = 'U0123456789abcdef0123456789abcdef';

function createService(env: Record<string, string | undefined>): LineService {
  return new LineService(new ConfigService(env));
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('LineService', () => {
  let fetchMock: jest.SpyInstance;
  let logged: string[];

  beforeEach(() => {
    fetchMock = jest.spyOn(global, 'fetch');
    logged = [];
    for (const level of ['log', 'warn', 'error'] as const) {
      jest
        .spyOn(Logger.prototype, level)
        .mockImplementation((message: unknown) => {
          logged.push(String(message));
        });
    }
  });

  afterEach(() => jest.restoreAllMocks());

  describe('when not configured', () => {
    it('reports not ready and skips sending without calling LINE', async () => {
      const line = createService({});
      expect(line.getStatus()).toEqual({
        tokenConfigured: false,
        recipientConfigured: false,
        ready: false,
      });
      await expect(line.pushToAdmin('hello')).resolves.toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('treats a token without a user id as not ready (user id can be added later)', async () => {
      const line = createService({ LINE_CHANNEL_ACCESS_TOKEN: TOKEN });
      line.onModuleInit();
      expect(line.getStatus().ready).toBe(false);
      await expect(line.pushToAdmin('hello')).resolves.toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
      expect(logged.join('\n')).toContain('LINE_ADMIN_USER_ID is not set');
    });

    it('ignores whitespace-only values', () => {
      const line = createService({
        LINE_CHANNEL_ACCESS_TOKEN: '  ',
        LINE_ADMIN_USER_ID: ' ',
      });
      expect(line.getStatus().ready).toBe(false);
    });
  });

  describe('when configured', () => {
    const line = () =>
      createService({
        LINE_CHANNEL_ACCESS_TOKEN: TOKEN,
        LINE_ADMIN_USER_ID: USER_ID,
      });

    it('pushes a text message to the admin user with the bearer token', async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, {}));
      await expect(line().pushToAdmin('New inquiry')).resolves.toBe(true);

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://api.line.me/v2/bot/message/push');
      expect(init.headers.Authorization).toBe(`Bearer ${TOKEN}`);
      expect(JSON.parse(init.body)).toEqual({
        to: USER_ID,
        messages: [{ type: 'text', text: 'New inquiry' }],
      });
    });

    it('returns false on a LINE error without leaking the token', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(401, { message: `Authentication failed for ${TOKEN}` }),
      );
      await expect(line().pushToAdmin('x')).resolves.toBe(false);
      expect(logged.join('\n')).toContain('HTTP 401');
      expect(logged.join('\n')).not.toContain(TOKEN);
    });

    it('returns false on a network error without throwing or leaking the token', async () => {
      fetchMock.mockRejectedValue(new Error(`socket hang up (${TOKEN})`));
      await expect(line().pushToAdmin('x')).resolves.toBe(false);
      expect(logged.join('\n')).not.toContain(TOKEN);
    });

    it('verifies the token via bot info without sending a message', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(200, { displayName: 'Erotic Garden' }),
      );
      await expect(line().verifyToken()).resolves.toEqual({
        valid: true,
        botName: 'Erotic Garden',
      });
      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://api.line.me/v2/bot/info',
      );
      expect(fetchMock.mock.calls[0][1].method).toBeUndefined();
    });

    it('reports an invalid token with a token-free reason', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(401, { message: 'Authentication failed' }),
      );
      const result = await line().verifyToken();
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('HTTP 401 Authentication failed');
    });
  });
});
