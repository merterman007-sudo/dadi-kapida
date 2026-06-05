import type { Request } from "express";

export const REQUEST_ID_HEADER = "x-request-id";

type RequestWithContext = Request & {
  requestId?: string;
};

export function getRequestId(request: Request | undefined): string | undefined {
  return (request as RequestWithContext | undefined)?.requestId;
}

export function sanitizePath(url: string): string {
  const [path = ""] = url.split("?");
  return path.length > 0 ? path : "/";
}
