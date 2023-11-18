import express, { Express } from "express";

const app: Express = express();
const port: number = +process.env.PORT! || 3010;

app.get("/", (req, res) => {
  res.send("Hello, ExpressTS!");
});

app.listen(port, () => {
  console.log(`🚀 Server is lisening on port: ${port}`);
});
