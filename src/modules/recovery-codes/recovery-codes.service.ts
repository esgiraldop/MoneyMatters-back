import { Injectable } from '@nestjs/common';
import { CreateRecoveryCodeDto } from './dto/create-recovery-code.dto';
import { UpdateRecoveryCodeDto } from './dto/update-recovery-code.dto';

@Injectable()
export class RecoveryCodesService {
  create(createRecoveryCodeDto: CreateRecoveryCodeDto) {
    return 'This action adds a new recoveryCode';
  }

  findAll() {
    return `This action returns all recoveryCodes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recoveryCode`;
  }

  update(id: number, updateRecoveryCodeDto: UpdateRecoveryCodeDto) {
    return `This action updates a #${id} recoveryCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} recoveryCode`;
  }
}
