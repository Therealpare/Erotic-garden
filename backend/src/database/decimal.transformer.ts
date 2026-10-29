import { ValueTransformer } from 'typeorm';

/** PostgreSQL returns NUMERIC as a string to avoid float loss; prices here fit safely in a JS number. */
export const DecimalTransformer: ValueTransformer = {
  to: (value: number | null | undefined) => value,
  from: (value: string | null) =>
    value === null || value === undefined ? null : Number(value),
};
