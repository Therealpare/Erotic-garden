import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { LineService } from '../notifications/line.service';

/**
 * Checks the LINE setup from backend/.env without starting the API.
 *   npm run line:check   → verifies the token with LINE; sends nothing
 *   npm run line:test    → also sends ONE test message to LINE_ADMIN_USER_ID
 * Output never contains the token or the user id.
 */
async function main(): Promise<void> {
  const send = process.argv.includes('--send');
  const line = new LineService(new ConfigService(process.env));
  const status = line.getStatus();

  console.log(
    `LINE_CHANNEL_ACCESS_TOKEN: ${status.tokenConfigured ? 'set' : 'MISSING'}`,
  );
  console.log(
    `LINE_ADMIN_USER_ID:        ${status.recipientConfigured ? 'set' : 'MISSING'}`,
  );

  const token = await line.verifyToken();
  console.log(
    token.valid
      ? `Token valid ✔ (Official Account: ${token.botName ?? 'unknown'})`
      : `Token check failed ✘ ${token.reason}`,
  );

  if (!send) {
    console.log(
      '\nNo message sent. Run `npm run line:test` to send one test message.',
    );
    process.exit(token.valid ? 0 : 1);
  }

  if (!status.ready || !token.valid) {
    console.log('\nNot sending: fix the items above first.');
    process.exit(1);
  }

  const sent = await line.pushToAdmin(
    '✅ Erotic Garden & Teahouse: LINE test message from `npm run line:test`.',
  );
  console.log(
    sent
      ? '\nTest message sent ✔ — check LINE.'
      : '\nTest message failed ✘ — see the error above.',
  );
  process.exit(sent ? 0 : 1);
}

void main();
