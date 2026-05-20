export interface ErrorResponse {
  status: "error";
  statusCode: number;
  message: string;
  stack?: string; // only in development
}
