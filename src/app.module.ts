import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfigService } from "./common/config/database.config";
import { ConfigModule } from "@nestjs/config";
import { EnvConfig } from "./common/config/env.config";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtStrategy } from "./modules/auth/strategies/jwt.strategy";
import { UsersModule } from "./modules/users/users.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { BudgetModule } from "./modules/budget/budget.module";
import { CategoryModule } from "./modules/category/category.module";
import { RecoveryCodesModule } from "./modules/recovery-codes/recovery-codes.module";
import { AppInitializer } from "./seed/seeder";
import { SeedersService } from "./seed/seeder.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      load: [EnvConfig],
    }),
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfigService }),
    AuthModule,
    UsersModule,
    TransactionsModule,
    BudgetModule,
    CategoryModule,
    RecoveryCodesModule,
  ],
  controllers: [],
  providers: [JwtStrategy, AppInitializer, SeedersService],
})
export class AppModule {}
