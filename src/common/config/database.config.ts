import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import * as glob from "glob";
import { join } from "path";
import { EnvConfig } from "./env.config";
import { User } from "src/modules/users/entities/user.entity";
import { Category } from "src/modules/category/entities/category.entity";
import { Transaction } from "src/modules/transactions/entities/transaction.entity";
import { Budget } from "src/modules/budget/entities/budget.entity";
import { RecoveryCode } from "src/modules/recovery-codes/entities/recovery-code.entity";

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const {
      database: { host, port, username, password, database },
    } = EnvConfig();

    return {
      type: "postgres",
      host,
      port,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize: true, //TO Do : Set to false in production for safety
      logging: true,
      logger: "advanced-console",
      entities: [User, Category, Transaction, Budget, RecoveryCode],
    };
  }
}
