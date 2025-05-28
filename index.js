import express from "express";
import morgan from "morgan";
import cors from "cors";
import usuariosRoutes from "./routers/usuariosrouters.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(usuariosRoutes);

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
