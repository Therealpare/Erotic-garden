import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

const API_BASE = 'https://api.line.me/v2/bot';
const MAX_TEXT_LENGTH = 5000;
const TIMEOUT_MS = 8000;

export interface LineStatus {
  tokenConfigured: boolean;
  recipientConfigured: boolean;
  /** True when both values are present; says nothing about whether LINE accepts them. */
  ready: boolean;
}

export interface LineTokenCheck {
  valid: boolean;
  /** Display name of the Official Account the token belongs to, when valid. */
  botName?: string;
  /** Safe, token-free reason when not valid. */
  reason?: string;
}

/**
 * LINE Official Account integration (Messaging API). LINE Notify was discontinued in 2025.
 *
 * Configuration (backend environment only — never shipped to Angular):
 *   LINE_CHANNEL_ACCESS_TOKEN  long-lived channel access token
 *   LINE_ADMIN_USER_ID         user/group/room id that receives staff alerts
 *
 * Either value may be missing: alerts are skipped with a warning and the rest of the app
 * keeps working. The token is never written to logs, error messages or API responses.
 */
@Injectable()
export class LineService implements OnModuleInit {
  private readonly logger = new Logger(LineService.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const status = this.getStatus();
    if (status.ready) {
      this.logger.log('LINE alerts enabled');
    } else if (status.tokenConfigured || status.recipientConfigured) {
      const missing = status.tokenConfigured
        ? 'LINE_ADMIN_USER_ID'
        : 'LINE_CHANNEL_ACCESS_TOKEN';
      this.logger.warn(`LINE alerts disabled: ${missing} is not set`);
    } else {
      this.logger.log('LINE alerts disabled (not configured)');
    }
  }

  getStatus(): LineStatus {
    const tokenConfigured = Boolean(this.token);
    const recipientConfigured = Boolean(this.adminUserId);
    return {
      tokenConfigured,
      recipientConfigured,
      ready: tokenConfigured && recipientConfigured,
    };
  }

  /** Sends a text message to LINE_ADMIN_USER_ID. Resolves to true when LINE accepted it; never throws. */
  async pushToAdmin(text: string): Promise<boolean> {
    if (!this.getStatus().ready) {
      this.logger.warn(
        'LINE message skipped: LINE_CHANNEL_ACCESS_TOKEN / LINE_ADMIN_USER_ID not set',
      );
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/message/push`, {
        method: 'POST',
        headers: {
          ...this.authHeader(),
          'Content-Type': 'application/json',
          // Lets LINE de-duplicate if this exact request is ever retried.
          'X-Line-Retry-Key': randomUUID(),
        },
        body: JSON.stringify({
          to: this.adminUserId,
          messages: [{ type: 'text', text: text.slice(0, MAX_TEXT_LENGTH) }],
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!response.ok) {
        this.logger.error(
          `LINE push failed: ${await this.describeFailure(response)}`,
        );
        return false;
      }
      return true;
    } catch (error) {
      this.logger.error(`LINE push failed: ${this.describeError(error)}`);
      return false;
    }
  }

  /** Checks the token against LINE's bot-info endpoint. Sends no message. */
  async verifyToken(): Promise<LineTokenCheck> {
    if (!this.token)
      return { valid: false, reason: 'LINE_CHANNEL_ACCESS_TOKEN is not set' };

    try {
      const response = await fetch(`${API_BASE}/info`, {
        headers: this.authHeader(),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) {
        return { valid: false, reason: await this.describeFailure(response) };
      }
      const info = (await response.json()) as { displayName?: string };
      return { valid: true, botName: info.displayName };
    } catch (error) {
      return { valid: false, reason: this.describeError(error) };
    }
  }

  private get token(): string {
    return this.config.get<string>('LINE_CHANNEL_ACCESS_TOKEN')?.trim() ?? '';
  }

  private get adminUserId(): string {
    return this.config.get<string>('LINE_ADMIN_USER_ID')?.trim() ?? '';
  }

  private authHeader(): Record<string, string> {
    return { Authorization: `Bearer ${this.token}` };
  }

  /** LINE error bodies are `{ message, details }` and never echo the token; strip it anyway as a safeguard. */
  private async describeFailure(response: Response): Promise<string> {
    let detail = '';
    try {
      const body = (await response.json()) as { message?: string };
      detail = body.message ? ` ${body.message}` : '';
    } catch {
      // Non-JSON body — the status code is enough.
    }
    return this.redact(`HTTP ${response.status}${detail}`);
  }

  private describeError(error: unknown): string {
    if (error instanceof Error && error.name === 'TimeoutError')
      return 'request timed out';
    return this.redact(
      error instanceof Error ? error.message : 'unknown error',
    );
  }

  private redact(text: string): string {
    return this.token ? text.split(this.token).join('[redacted]') : text;
  }
}
