// Custom API Error class
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    // Restore prototype chain for instance checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Higher-order function to wrap API route handlers
export const errorHandler = (
  handler: (req: Request, ...args: any[]) => Promise<Response>
) => {
  return async (req: Request, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error: any) {
      console.error("[API Error]", error);

      const message = error.message || "Internal Server Error";
      const status = error instanceof ApiError ? error.statusCode : 500;

      return new Response(
        JSON.stringify({
          success: false,
          error: message,
        }),
        {
          status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
};
