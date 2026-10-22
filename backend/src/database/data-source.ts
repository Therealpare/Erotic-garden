import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './database.config';

/** Entry point for the TypeORM CLI (`npm run migration:run`). */
export default new DataSource(buildDataSourceOptions(process.env));
