import {
  ArgumentsHost,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

function run(exception: unknown): {
  status: number;
  body: Record<string, unknown>;
} {
  const result = { status: 0, body: {} as Record<string, unknown> };
  const response = {
    status(code: number) {
      result.status = code;
      return this;
    },
    json(body: Record<string, unknown>) {
      result.body = body;
    },
  };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => ({ method: 'GET', url: '/api/v1/x' }),
    }),
  } as unknown as ArgumentsHost;
  new HttpExceptionFilter().catch(exception, host);
  return result;
}

describe('HttpExceptionFilter', () => {
  beforeAll(() =>
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined),
  );
  afterAll(() => jest.restoreAllMocks());

  it('keeps the message of expected HTTP errors', () => {
    const { status, body } = run(new NotFoundException('Product 9 not found'));
    expect(status).toBe(404);
    expect(body.message).toBe('Product 9 not found');
  });

  it('passes structured details through (e.g. which sizes are out of stock)', () => {
    const { status, body } = run(
      new ConflictException({
        message: 'Sold out',
        items: [{ variantId: 3, available: 0 }],
      }),
    );
    expect(status).toBe(409);
    expect(body.items).toEqual([{ variantId: 3, available: 0 }]);
    expect(body.message).toBe('Sold out');
  });

  it('never echoes internal error text for unexpected failures', () => {
    const { status, body } = run(
      new Error('relation "secret_table" does not exist'),
    );
    expect(status).toBe(500);
    expect(body.message).toBe('Internal server error');
    expect(JSON.stringify(body)).not.toContain('secret_table');
  });
});
