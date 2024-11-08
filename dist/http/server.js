import express from "express";
import router from "./routes/usuario.routes";
const app = express();
app.use(express.json());
app.use("/api", router);
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
