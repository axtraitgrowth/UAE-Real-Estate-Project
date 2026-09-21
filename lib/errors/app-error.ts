/**
 * Custom Application Error Hierarchy
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number = 500, code: string = "INTERNAL_SERVER_ERROR", details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_FAILED");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Permission denied for this operation") {
    super(message, 403, "PERMISSION_DENIED");
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "A conflict occurred with an existing resource") {
    super(message, 409, "RESOURCE_CONFLICT");
  }
}

export class TenantIsolationError extends AppError {
  constructor(message: string = "Access to the requested organization is forbidden") {
    super(message, 403, "TENANT_ACCESS_DENIED");
  }
}
