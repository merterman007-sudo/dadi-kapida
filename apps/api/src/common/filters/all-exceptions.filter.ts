import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common";
import type { Request, Response } from "express";
import { getRequestId, sanitizePath } from "../http/request-context";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const requestId = getRequestId(request);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const code = this.resolveCode(exception, status);
    const message = this.resolveMessage(exception, status);
    this.logException(exception, status, code, request, requestId);

    response.status(status).json({
      data: null,
      meta: {
        requestId,
        timestamp: new Date().toISOString()
      },
      error: {
        code,
        message
      }
    });
  }

  private resolveCode(exception: unknown, status: number): string {
    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      if (
        typeof payload === "object" &&
        payload !== null &&
        "code" in payload &&
        typeof payload.code === "string" &&
        payload.code.trim().length > 0
      ) {
        return payload.code;
      }
    }

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return "BAD_REQUEST";
      case HttpStatus.UNAUTHORIZED:
        return "UNAUTHORIZED";
      case HttpStatus.FORBIDDEN:
        return "FORBIDDEN";
      case HttpStatus.NOT_FOUND:
        return "NOT_FOUND";
      case HttpStatus.CONFLICT:
        return "CONFLICT";
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return "VALIDATION_ERROR";
      case HttpStatus.TOO_MANY_REQUESTS:
        return "RATE_LIMITED";
      default:
        return status >= 500 ? "INTERNAL_ERROR" : "HTTP_ERROR";
    }
  }

  private resolveMessage(exception: unknown, status: number): string {
    if (status >= 500 && !(exception instanceof HttpException)) {
      return "Internal server error";
    }

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();

      if (typeof payload === "string") {
        return payload;
      }

      if (typeof payload === "object" && payload !== null && "message" in payload) {
        const message = payload.message;
        if (Array.isArray(message)) {
          return message.join(", ");
        }
        if (typeof message === "string" && message.trim().length > 0) {
          return message;
        }
      }

      return exception.message || "Request failed";
    }

    return "Internal server error";
  }

  private logException(
    exception: unknown,
    status: number,
    code: string,
    request: Request | undefined,
    requestId: string | undefined
  ): void {
    const method = request?.method ?? "UNKNOWN";
    const path = sanitizePath(request?.originalUrl ?? request?.url ?? "/");
    const requestIdPart = requestId ? ` request_id=${requestId}` : "";
    const summary = `${method} ${path} ${status} code=${code}${requestIdPart}`;

    if (status >= 500) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(summary, stack);
      return;
    }

    this.logger.warn(summary);
  }
}
