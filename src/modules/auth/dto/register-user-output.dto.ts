import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Success or error message.',
    example: 'Registration successful',
  })
  message: string;
}
