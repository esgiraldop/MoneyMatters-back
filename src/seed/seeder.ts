import { Injectable, OnModuleInit } from '@nestjs/common';
import { SeedersService } from './seeder.service';

@Injectable()
export class AppInitializer implements OnModuleInit {
  constructor(
    private readonly seederService: SeedersService ,
  ) {}

  async onModuleInit() {
    await this.seederService.insertCategories();

  }
}