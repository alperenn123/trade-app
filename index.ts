import express, { Express } from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import dotenv from "dotenv";
import { initDb } from "./utils/db";
import cors from "cors";

const app: Express = express();

dotenv.config();

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/api", routes);

(async () => {
  try {
    await initDb();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
})();
