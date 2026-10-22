import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { LineService, LineStatus, LineTokenCheck } from './line.service';

/** Lets an admin confirm the LINE setup from the API. Responses never include the token or the user id. */
@Controller('admin/notifications/line')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminNotificationsController {
  constructor(private readonly line: LineService) {}

  /** Configuration flags plus a live token check against LINE (no message is sent). */
  @Get('status')
  async status(): Promise<LineStatus & { token: LineTokenCheck }> {
    return { ...this.line.getStatus(), token: await this.line.verifyToken() };
  }

  /** Sends one real test message to LINE_ADMIN_USER_ID. */
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('test')
  @HttpCode(200)
  async sendTest(): Promise<{ sent: boolean }> {
    const sent = await this.line.pushToAdmin(
      `✅ Erotic Garden & Teahouse: LINE alerts are working (${new Date().toISOString()})`,
    );
    return { sent };
  }
}
