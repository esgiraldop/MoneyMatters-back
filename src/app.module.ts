import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfigService } from "./common/config/database.config";
import { ConfigModule } from "@nestjs/config";
import { EnvConfig } from "./common/config/env.config";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtStrategy } from "./modules/auth/strategies/jwt.strategy";
import { UsersModule } from "./modules/users/users.module";

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
    // RolesModule,
  ],
  controllers: [],
  providers: [
    // AppSeeder,
    // RoleSeeder,
    JwtStrategy,
  ],
})
export class AppModule {}
