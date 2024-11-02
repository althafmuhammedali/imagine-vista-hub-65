export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication failed. Please check your API key.') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}