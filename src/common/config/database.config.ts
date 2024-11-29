import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { EnvConfig } from './env.config';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const {
      database: { host, port, username, password, database },
    } = EnvConfig();
    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      logger: 'advanced-console',
    };
  }
}
