export type UserStatus = "ACTIVE" | "INVITED" | "DISABLED";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

export interface ApiSuccess<TData, TMeta = Record<string, unknown>> {
  data: TData;
  meta: TMeta;
  error: null;
}

export interface ApiError<TMeta = Record<string, unknown>> {
  data: null;
  meta: TMeta;
  error: {
    code: string;
    message: string;
  };
}
