import { Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { NextFunction, Request, Response } from "express";
import { REQUEST_ID_HEADER, sanitizePath } from "../http/request-context";

type RequestWithContext = Request & {
  requestId?: string;
};

const logger = new Logger("HttpRequest");

function resolveRequestId(request: Request): string {
  const incoming = request.header(REQUEST_ID_HEADER);
  if (typeof incoming === "string" && incoming.trim().length > 0) {
    return incoming.trim();
  }
  return randomUUID();
}

export function requestContextMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const requestId = resolveRequestId(request);
  const startedAtMs = Date.now();

  (request as RequestWithContext).requestId = requestId;
  response.setHeader(REQUEST_ID_HEADER, requestId);

  response.on("finish", () => {
    const durationMs = Date.now() - startedAtMs;
    const path = sanitizePath(request.originalUrl ?? request.url ?? "/");
    logger.log(
      `${request.method} ${path} ${response.statusCode} ${durationMs}ms request_id=${requestId}`
    );
  });

  next();
}

