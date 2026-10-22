import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserRole = 'ADMIN' | 'EDITOR';
export const USER_ROLES: UserRole[] = ['ADMIN', 'EDITOR'];

/** Mirrors spec §35 `users`, plus the hashed refresh token for spec §37 rotation/logout. */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: USER_ROLES,
    enumName: 'user_role',
    default: 'EDITOR',
  })
  role: UserRole;

  @Column({
    name: 'refresh_token_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  refreshTokenHash: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
