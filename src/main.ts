import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS com configurações básicas (Não sei se é a melhor abordagem)
  app.enableCors({
    origin: '*', // Permite qualquer origem.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Métodos HTTP permitidos
    credentials: true, // Permite envio de cookies com as requisições
  });

  await app.listen(3000);
}
bootstrap();
