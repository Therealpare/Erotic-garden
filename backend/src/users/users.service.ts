import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  findById(id: number): Promise<User | null> {
    return this.users.findOne({ where: { id, isActive: true } });
  }

  /** Includes the password hash, which is excluded from every other query. */
  findByEmailWithSecrets(email: string): Promise<User | null> {
    return this.users
      .createQueryBuilder('user')
      .addSelect(['user.passwordHash', 'user.refreshTokenHash'])
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  findByIdWithSecrets(id: number): Promise<User | null> {
    return this.users
      .createQueryBuilder('user')
      .addSelect(['user.refreshTokenHash'])
      .where('user.id = :id', { id })
      .getOne();
  }

  async setRefreshTokenHash(id: number, hash: string | null): Promise<void> {
    await this.users.update(id, { refreshTokenHash: hash });
  }
}
