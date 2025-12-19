import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
  // CAMBIO CLAVE: Ahora apuntamos a SRC y archivos .ts
  entities: ['src/**/*.entity.ts'], 
  migrations: ['src/migrations/*.ts'], 
  synchronize: false,
});
