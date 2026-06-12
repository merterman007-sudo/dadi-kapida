import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { ApiResponseInterceptor } from "./common/interceptors/api-response.interceptor";
import { requestContextMiddleware } from "./common/middleware/request-context.middleware";

async function bootstrap() {
  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET.length < 32)
  ) {
    throw new Error("JWT_ACCESS_SECRET must contain at least 32 characters in production");
  }

  const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const app = await NestFactory.create(AppModule, {
    cors: allowedOrigins.length > 0 ? { origin: allowedOrigins, credentials: true } : true
  });

  app.getHttpAdapter().getInstance().set("trust proxy", 1);
  app.use(requestContextMiddleware);
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  if (process.env.NODE_ENV !== "production" || process.env.SWAGGER_ENABLED === "true") {
    const config = new DocumentBuilder()
      .setTitle("Dadi Kapida CRM API")
      .setDescription("Internal CRM API")
      .setVersion("0.1.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("swagger", app, document);
  }

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
}

bootstrap();
