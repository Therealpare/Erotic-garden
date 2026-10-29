import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UPLOADS_DIR, UPLOADS_URL_PREFIX } from './storage/storage.service';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Behind a hosting proxy (Render, Railway, Fly…) the client IP arrives in X-Forwarded-For;
  // rate limiting keys on that IP, so trust exactly one proxy hop when told to.
  if (configService.get('TRUST_PROXY') === 'true') {
    app.set('trust proxy', 1);
  }

  // Images are loaded by the Angular site from another origin, so allow cross-origin reads of resources.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // Locally stored admin uploads (StorageService "local" driver). Never lists directories.
  app.useStaticAssets(UPLOADS_DIR, {
    prefix: UPLOADS_URL_PREFIX,
    index: false,
    dotfiles: 'deny',
    maxAge: '7d',
    immutable: true,
  });
  // Comma-separated so the deployed site and local dev can both be allowed.
  app.enableCors({
    origin: configService
      .get<string>('FRONTEND_ORIGIN', 'http://localhost:4200')
      .split(',')
      .map((origin) => origin.trim()),
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
