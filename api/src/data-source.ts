import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Todo } from './todos/todo.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'todo',
  password: process.env.DATABASE_PASSWORD || 'todo',
  database: process.env.DATABASE_NAME || 'todo',
  entities: [Todo],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
