import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

export const UPLOADS_DIR = resolve(process.cwd(), 'uploads');
export const UPLOADS_URL_PREFIX = '/uploads/';
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export interface StoredImage {
  /** `/uploads/...` for local storage, or an https URL for Cloudinary. */
  url: string;
  driver: 'local' | 'cloudinary';
}

/**
 * Stores admin-uploaded images. Uses Cloudinary when CLOUDINARY_CLOUD_NAME,
 * CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are all set; otherwise saves to
 * backend/uploads/ (served at /uploads/). Local storage suits development and
 * hosts with a persistent disk; most free hosts wipe the disk on redeploy.
 */
@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly config: ConfigService) {}

  get driver(): StoredImage['driver'] {
    return this.cloudinary ? 'cloudinary' : 'local';
  }

  async onModuleInit(): Promise<void> {
    if (this.driver === 'local') await mkdir(UPLOADS_DIR, { recursive: true });
    this.logger.log(`Image storage: ${this.driver}`);
  }

  async saveImage(file: Express.Multer.File | undefined): Promise<StoredImage> {
    if (!file)
      throw new BadRequestException(
        'No image file was uploaded (field name: "file")',
      );
    const extension = ALLOWED_TYPES[file.mimetype];
    if (!extension || !this.looksLikeImage(file.buffer, file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, WebP or AVIF images are allowed',
      );
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new BadRequestException('Image must be 8 MB or smaller');
    }
    return this.cloudinary
      ? this.uploadToCloudinary(file)
      : this.saveLocally(file.buffer, extension);
  }

  /** Best-effort removal of a locally stored upload; anything else (bundled assets, Cloudinary) is left alone. */
  async removeIfLocal(url: string | null | undefined): Promise<void> {
    if (!url?.startsWith(UPLOADS_URL_PREFIX)) return;
    const name = url.slice(UPLOADS_URL_PREFIX.length);
    if (!/^[\w-]+\.(jpg|png|webp|avif)$/.test(name)) return;
    await unlink(join(UPLOADS_DIR, name)).catch(() => undefined);
  }

  private async saveLocally(
    buffer: Buffer,
    extension: string,
  ): Promise<StoredImage> {
    const name = `${randomUUID()}.${extension}`;
    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(join(UPLOADS_DIR, name), buffer);
    return { url: `${UPLOADS_URL_PREFIX}${name}`, driver: 'local' };
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<StoredImage> {
    const { cloudName, apiKey, apiSecret } = this.cloudinary!;
    const folder = this.config.get<string>(
      'CLOUDINARY_FOLDER',
      'erotic-garden',
    );
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = createHash('sha1')
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    const form = new FormData();
    form.append(
      'file',
      new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }),
    );
    form.append('api_key', apiKey);
    form.append('timestamp', timestamp);
    form.append('folder', folder);
    form.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(30_000),
      },
    ).catch(() => null);
    const body = (await response?.json().catch(() => null)) as {
      secure_url?: string;
      error?: { message?: string };
    } | null;
    if (!response?.ok || !body?.secure_url) {
      this.logger.error(
        `Cloudinary upload failed: HTTP ${response?.status ?? 'network'} ${body?.error?.message ?? ''}`,
      );
      throw new BadRequestException('Image upload failed. Please try again.');
    }
    return { url: body.secure_url, driver: 'cloudinary' };
  }

  /** Checks magic bytes so a renamed non-image file cannot pass as an image. */
  private looksLikeImage(buffer: Buffer, mimetype: string): boolean {
    if (!buffer || buffer.length < 12) return false;
    switch (mimetype) {
      case 'image/jpeg':
        return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      case 'image/png':
        return buffer
          .subarray(0, 8)
          .equals(
            Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
          );
      case 'image/webp':
        return (
          buffer.toString('ascii', 0, 4) === 'RIFF' &&
          buffer.toString('ascii', 8, 12) === 'WEBP'
        );
      case 'image/avif':
        return (
          buffer.toString('ascii', 4, 8) === 'ftyp' &&
          /avi[fs]/.test(buffer.toString('ascii', 8, 12))
        );
      default:
        return false;
    }
  }

  private get cloudinary(): {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  } | null {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME')?.trim();
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY')?.trim();
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET')?.trim();
    return cloudName && apiKey && apiSecret
      ? { cloudName, apiKey, apiSecret }
      : null;
  }
}
