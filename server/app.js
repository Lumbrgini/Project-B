import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./routes/api.js";
import { MongoClient } from "mongodb";
import 'dotenv/config';

const app = express();
const port = 3000;
const connectionString = process.env.MONGODB_CONNECTION_STRING;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const clientBuild = path.join(__dirname, "../client/dist");
  app.use(express.static(clientBuild));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

app.use(express.json());

app.use("/api", apiRouter);

try {
  const client = new MongoClient(connectionString);
  await client.connect();
  const db = client.db('users');

  app.set('db', db); // save a reference to the db to app config

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
} catch (err) {
  console.error(err);
}

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server on http://localhost:${port}`));
