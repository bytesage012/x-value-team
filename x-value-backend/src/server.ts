import http from "http";
import app from "./app";
import { config } from "./config/env";
import { database } from "./data/database";

export const startServer = async () => {
  await database.init();

  const server = http.createServer(app);

  return new Promise<http.Server>((resolve) => {
    server.listen(config.port, () => {
      console.log(`🚀 Server ready on http://localhost:${config.port}`);
      resolve(server);
    });
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
}
