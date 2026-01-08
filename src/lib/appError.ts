export type AppErrorCode =
  | 'AUTH_REQUIRED'
  | 'NOT_FOUND'
  | 'INVALID_INPUT'
  | 'UNSUPPORTED'
  | 'CONFIG'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly cause?: unknown;

  constructor(message: string, code: AppErrorCode = 'UNKNOWN', cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.cause = cause;
  }
}
