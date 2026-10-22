import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

const PUSH_ENDPOINT = 'https://api.line.me/v2/bot/message/push';
const MAX_TEXT_LENGTH = 5000;

/**
 * Sends staff alerts through a LINE Official Account (Messaging API push message).
 * LINE Notify was discontinued in 2025, so an OA channel is the supported route.
 * Configure LINE_CHANNEL_ACCESS_TOKEN and LINE_NOTIFY_TO (a user, group or room id);
 * when either is missing, notifications are skipped and the caller carries on.
 */
@Injectable()
export class LineMessagingService {
  private readonly logger = new Logger(LineMessagingService.name);

  constructor(private readonly config: ConfigService) {}

  get isConfigured(): boolean {
    return Boolean(
      this.config.get('LINE_CHANNEL_ACCESS_TOKEN') &&
      this.config.get('LINE_NOTIFY_TO'),
    );
  }

  /** Resolves to true when LINE accepted the message; never throws. */
  async pushText(text: string): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn(
        'LINE notification skipped: LINE_CHANNEL_ACCESS_TOKEN / LINE_NOTIFY_TO not set',
      );
      return false;
    }

    try {
      const response = await fetch(PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.get<string>('LINE_CHANNEL_ACCESS_TOKEN')}`,
          'X-Line-Retry-Key': randomUUID(),
        },
        body: JSON.stringify({
          to: this.config.get<string>('LINE_NOTIFY_TO'),
          messages: [{ type: 'text', text: text.slice(0, MAX_TEXT_LENGTH) }],
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        this.logger.error(
          `LINE push failed: HTTP ${response.status} ${await response.text()}`,
        );
        return false;
      }
      return true;
    } catch (error) {
      this.logger.error(
        `LINE push failed: ${error instanceof Error ? error.message : error}`,
      );
      return false;
    }
  }
}
