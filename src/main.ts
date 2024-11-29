import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DataSource } from "typeorm";
import { GlobalValidationPipe } from "./common/pipes/validation.pipe";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { SucessfulResponseInterceptor } from "./common/interceptors/sucessful-response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const datasource = app.get(DataSource);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SucessfulResponseInterceptor());
  if (datasource.isInitialized) {
    console.log("\n\nConnection with the database established\n\n");
  } else {
    console.log("\n\nThere was an error connecting to the database\n\n");
  }

  const PORT = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle("Money matters API")
    .setDescription(
      "This API is the app Money Matters, an app for managing budgets"
    )
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
}
bootstrap();
