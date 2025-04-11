import { DataSourceOptions } from 'typeorm';
import { resolve } from 'path';
import { config } from './app-config';

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    username: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    database: config.POSTGRES_DATABASE,
    entities: [resolve(__dirname, '**/*.entity.{js,ts}')],
    migrations: [resolve(__dirname, 'migration/*.{js,ts}')],
};
