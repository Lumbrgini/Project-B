import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./routes/api.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use(cors({origin: 'http://localhost:5173', credentials: true}));

app.use("/api", apiRouter);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const clientBuild = path.join(__dirname, "../client/dist");
  app.use(express.static(clientBuild));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on http://localhost:${port}`));