import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { User, USER_ROLES, UserRole } from '../../users/entities/user.entity';
import { buildDataSourceOptions } from '../database.config';

/**
 * Creates (or resets the password of) one admin account from environment variables, so no
 * credentials ever live in the repository:
 *   ADMIN_EMAIL=… ADMIN_PASSWORD=… [ADMIN_NAME=…] [ADMIN_ROLE=ADMIN|EDITOR] npm run seed:admin
 */
async function main(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || 'Administrator';
  const role = (process.env.ADMIN_ROLE ?? 'ADMIN') as UserRole;

  if (!email || !password)
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  if (password.length < 12)
    throw new Error('ADMIN_PASSWORD must be at least 12 characters');
  if (!USER_ROLES.includes(role))
    throw new Error(`ADMIN_ROLE must be one of ${USER_ROLES.join(', ')}`);

  const dataSource = await new DataSource(
    buildDataSourceOptions(process.env),
  ).initialize();
  try {
    const users = dataSource.getRepository(User);
    const existing = await users
      .createQueryBuilder('u')
      .where('LOWER(u.email) = LOWER(:email)', { email })
      .getOne();
    const passwordHash = await bcrypt.hash(password, 12);

    if (existing) {
      await users.update(existing.id, {
        name,
        role,
        passwordHash,
        refreshTokenHash: null,
        isActive: true,
      });
      console.log(`Updated ${role} account ${email}`);
    } else {
      await users.insert({ name, email, role, passwordHash });
      console.log(`Created ${role} account ${email}`);
    }
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
