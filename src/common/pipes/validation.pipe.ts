import {
  BadRequestException,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

export class GlobalValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: false,
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const errorMessages = errors.reduce((acc, error) => {
          if (error.constraints) {
            acc.push(
              `${error.property} - ${Object.values(error.constraints).join(', ')}`,
            );
          }
          return acc;
        }, []);
        return new BadRequestException({
          statusCode: 400,
          message: errorMessages,
        });
      },
      ...options, // This allows the user to pass additional options
    });
  }
}
