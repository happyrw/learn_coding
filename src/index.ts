import "dotenv/config";
import app from "./app.ts";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("Server running at http://localhost:3000/");
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled rejection:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
