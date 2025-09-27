import express from "express";
import calculateRoutes from "./routes/calculateRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api", calculateRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});