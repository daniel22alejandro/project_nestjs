import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API de Daniel: NestJS y TypeORM')
    .setDescription('API para gestionar usuarios y sus posts asociados')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Intentar cargar @scalar/nestjs-api-reference dinámicamente porque algunas dependencias son ESM
  try { 
    const scalarMod: any = await import('@scalar/nestjs-api-reference');
    const apiReference = scalarMod?.apiReference ?? scalarMod?.default ?? scalarMod;
    if (apiReference) {
      app.use('/docs', apiReference({ content: document }));
    }
  } catch (err) {
    // Si falla la carga (p. ej. ESM vs CJS), no abortamos la app: mostramos aviso y seguimos con Swagger
    console.warn('Aviso: no se pudo cargar @scalar/nestjs-api-reference. Se omite la referencia de API. Error:', err?.message ?? err);
  }




  // Habilita validación de DTOs globalmente
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
