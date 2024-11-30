import { PartialType } from '@nestjs/swagger';
import { CreateRecoveryCodeDto } from './create-recovery-code.dto';

export class UpdateRecoveryCodeDto extends PartialType(CreateRecoveryCodeDto) {}
