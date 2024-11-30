import { Module } from "@nestjs/common";
import { RecoveryCodesService } from "./recovery-codes.service";
import { RecoveryCodesController } from "./recovery-codes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecoveryCode } from "./entities/recovery-code.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RecoveryCode])],
  controllers: [RecoveryCodesController],
  providers: [RecoveryCodesService],
})
export class RecoveryCodesModule {}
