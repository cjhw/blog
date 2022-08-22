import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, UserAuth, Article, Comment, Tag } from './entity/index';

const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

const AppDataSource = new DataSource({
  type: 'mysql',
  host,
  port,
  username,
  password,
  database,
  entities: [User, UserAuth, Article, Comment, Tag],
  synchronize: false,
  logging: true,
});

let connection: DataSource;

export const create = async () => {
  connection = await AppDataSource.initialize();
  return connection;
};

export const get = () => {
  return connection;
};

export const has = () => {
  return connection !== null;
};

export const getDataBaseConnection = () => {
  if (!has()) {
    return create();
  } else {
    const current = get();
    if (get()?.isInitialized) {
      return current;
    } else {
      return create();
    }
  }
};
