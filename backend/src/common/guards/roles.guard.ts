import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../../auth/jwt-payload';
import { UserRole } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

/** Must run after JwtAuthGuard. Routes without @Roles() are open to any authenticated user. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const user: JwtPayload | undefined = context
      .switchToHttp()
      .getRequest().user;
    if (!user || !required.includes(user.role)) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
