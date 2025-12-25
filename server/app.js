import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import { MongoClient } from "mongodb";
import OAuthServer from 'express-oauth-server';
import 'dotenv/config';
import register from "./register.js";
import oAuthModel from './oAuthModel.js';
import api from "./routes/api.js"

const app = express();
const port = 3000;
const connectionString = process.env.MONGODB_CONNECTION_STRING;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const clientBuild = path.join(__dirname, "../client/dist");
  app.use(express.static(clientBuild));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


try {
  const client = new MongoClient(connectionString);
  await client.connect();
  const db = client.db('users');
  
  app.set('db', db);

  // we add TTL indexes to expiration fields to automatically remove expired entries
  db.collection('token').createIndex({ accessTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
  db.collection('token').createIndex({ refreshTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
  db.collection('token').createIndex({ emailTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

  const oauth = new OAuthServer({ model: oAuthModel(db) }); // create oauth middleware
  
  // backend routes

  app.post("/api/token", oauth.token({requireClientAuthentication: { password: false, refresh_token: false } })); 
  app.use('/api/register', register);
  app.use('/api', oauth.authenticate(), api); 
  
  // start server
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
} catch (err) {
  console.error(err);
}

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server on http://localhost:${port}`));
