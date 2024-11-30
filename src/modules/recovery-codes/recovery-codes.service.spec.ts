import { Test, TestingModule } from '@nestjs/testing';
import { RecoveryCodesService } from './recovery-codes.service';

describe('RecoveryCodesService', () => {
  let service: RecoveryCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecoveryCodesService],
    }).compile();

    service = module.get<RecoveryCodesService>(RecoveryCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
