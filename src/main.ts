import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const bootstrap = async () => {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS (if needed)
    app.enableCors();

    // Setting up Swagger
    const config = new DocumentBuilder()
      .setTitle('Price Tracker API')
      .setDescription('API to track Ethereum and Polygon prices and send alerts')
      .setVersion('1.0')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    console.log(`Application is running on: http://localhost:3000`);
  } catch (error) {
    console.error('Error starting the application:', error);
  }
};

bootstrap();
