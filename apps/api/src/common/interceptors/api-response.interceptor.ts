import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import type { Request } from "express";
import { map, Observable } from "rxjs";
import { getRequestId } from "../http/request-context";

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = getRequestId(request);
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {
          requestId,
          timestamp
        },
        error: null
      }))
    );
  }
}
