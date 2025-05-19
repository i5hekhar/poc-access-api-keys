import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Access Key Service API')
    .setDescription('The Access Key Service API documentation')
    .setVersion('1.0')
    .addTag('admin', 'Admin related endpoints')
    .addTag('user', 'User related endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);

  console.info(`Start Listening at ${await app.getUrl()}`);
}
bootstrap();
