import { Test, TestingModule } from '@nestjs/testing';
import { RecoveryCodesController } from './recovery-codes.controller';
import { RecoveryCodesService } from './recovery-codes.service';

describe('RecoveryCodesController', () => {
  let controller: RecoveryCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecoveryCodesController],
      providers: [RecoveryCodesService],
    }).compile();

    controller = module.get<RecoveryCodesController>(RecoveryCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
