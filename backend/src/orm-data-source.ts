import { DataSource } from 'typeorm';
import { dataSourceOptions } from './orm-config';

export default new DataSource({
    ...dataSourceOptions,
});
