import { ValidationOptions, registerDecorator } from 'class-validator';

/**
 * Accepts an https:// URL, an uploaded file path (/uploads/...), or a site-relative
 * asset path (images/...). Rejects javascript:, data: and other schemes.
 */
export function IsImageUrl(options?: ValidationOptions): PropertyDecorator {
  return (object, propertyName) =>
    registerDecorator({
      name: 'isImageUrl',
      target: object.constructor,
      propertyName: propertyName as string,
      options: {
        message: `${String(propertyName)} must be an https URL or an uploaded image path`,
        ...options,
      },
      validator: {
        validate: (value: unknown) =>
          typeof value === 'string' &&
          value.length <= 500 &&
          (/^https:\/\/[^\s]+$/i.test(value) ||
            /^\/uploads\/[\w./-]+$/.test(value) ||
            /^images\/[\w./-]+$/.test(value)) &&
          !value.includes('..'),
      },
    });
}
