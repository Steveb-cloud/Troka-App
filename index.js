import express from "express";
import morgan from "morgan";
import cors from "cors";
import usuariosRoutes from "./routers/usuariosrouters.js";
import reputacionesRouter from "./routers/reputacionesRouter.js";
import truequesRouter from "./routers/truequesRouter.js";
import categoriasRouter from "./routers/categoriasRouter.js";
import publicacionesRouter from "./routers/publicacionesRouter.js";
import mensajesRouter from "./routers/mensajesRouter.js";
import authRouter from './routers/authRouter.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(usuariosRoutes);
app.use(reputacionesRouter);
app.use(truequesRouter);
app.use(categoriasRouter);
app.use(publicacionesRouter);
app.use(mensajesRouter);
app.use(authRouter);


app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
