import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecoveryCodesService } from './recovery-codes.service';
import { CreateRecoveryCodeDto } from './dto/create-recovery-code.dto';
import { UpdateRecoveryCodeDto } from './dto/update-recovery-code.dto';

@Controller('recovery-codes')
export class RecoveryCodesController {
  constructor(private readonly recoveryCodesService: RecoveryCodesService) {}

  @Post()
  create(@Body() createRecoveryCodeDto: CreateRecoveryCodeDto) {
    return this.recoveryCodesService.create(createRecoveryCodeDto);
  }

  @Get()
  findAll() {
    return this.recoveryCodesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recoveryCodesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecoveryCodeDto: UpdateRecoveryCodeDto) {
    return this.recoveryCodesService.update(+id, updateRecoveryCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recoveryCodesService.remove(+id);
  }
}
