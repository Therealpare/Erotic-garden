import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { StorageService, UPLOADS_DIR } from './storage.service';

const PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108020000009077',
  'hex',
);
const JPEG = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1,
]);

function file(
  buffer: Buffer,
  mimetype: string,
  size = buffer.length,
): Express.Multer.File {
  return {
    buffer,
    mimetype,
    size,
    originalname: 'x',
    fieldname: 'file',
  } as Express.Multer.File;
}

describe('StorageService (local driver)', () => {
  const storage = new StorageService(new ConfigService({}));
  const created: string[] = [];

  afterAll(async () => {
    await Promise.all(created.map((url) => storage.removeIfLocal(url)));
  });

  it('uses local storage when Cloudinary is not configured', () => {
    expect(storage.driver).toBe('local');
  });

  it('saves real PNG and JPEG images under /uploads with a random name', async () => {
    for (const [buffer, type, ext] of [
      [PNG, 'image/png', 'png'],
      [JPEG, 'image/jpeg', 'jpg'],
    ] as const) {
      const saved = await storage.saveImage(file(buffer, type));
      created.push(saved.url);
      expect(saved.url).toMatch(
        new RegExp(`^/uploads/[0-9a-f-]{36}\\.${ext}$`),
      );
      expect(existsSync(join(UPLOADS_DIR, saved.url.split('/').pop()!))).toBe(
        true,
      );
    }
  });

  it('rejects a missing file, a renamed non-image, SVG and oversized files', async () => {
    await expect(storage.saveImage(undefined)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(
      storage.saveImage(
        file(Buffer.from('hello world, not an image'), 'image/png'),
      ),
    ).rejects.toThrow(/Only JPEG/);
    await expect(
      storage.saveImage(
        file(Buffer.from('<svg xmlns="..."/>'), 'image/svg+xml'),
      ),
    ).rejects.toThrow(/Only JPEG/);
    await expect(
      storage.saveImage(file(PNG, 'image/png', 9 * 1024 * 1024)),
    ).rejects.toThrow(/8 MB/);
  });

  it('only ever deletes files directly inside the uploads folder', async () => {
    const decoy = join(UPLOADS_DIR, 'keep-me.png');
    await writeFile(decoy, PNG);
    await storage.removeIfLocal('/uploads/../package.json');
    await storage.removeIfLocal('images/garden/ero1.webp');
    await storage.removeIfLocal('https://example.com/keep-me.png');
    expect(existsSync(join(process.cwd(), 'package.json'))).toBe(true);
    expect(existsSync(decoy)).toBe(true);
    await storage.removeIfLocal('/uploads/keep-me.png');
    expect(existsSync(decoy)).toBe(false);
  });
});
