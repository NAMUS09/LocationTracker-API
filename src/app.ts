import express from "express";
import { port } from "./config/index.js";
import loader from "./loaders/index.js";

const app = express();

loader(app);

app.listen(port, (err?: Error) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
