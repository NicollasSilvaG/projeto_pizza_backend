import express, { json } from "express";
import { dataSource } from "../db/typeorm";
import { Usuario } from "../entities/Usuario";
const app = express();
app.use(json());
app.get('/normal', (req, res) => {
    res.send('Hello World + ' + req.headers['origin']);
});
app.get('/erro', (req, res, next) => {
    const error = new Error('Algo deu errado!');
    if (error == null) {
        res.status(200).send('Requisição bem sucedida');
    }
    else {
        next(error);
    }
});
app.get('/usuarios', async (req, res) => {
    try {
        const usuario = dataSource.getRepository(Usuario);
        const usuarios = await usuario.find(); // Busca todos os usuarios
        res.json(usuarios);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cupons', error });
    }
});
dataSource.initialize().then(() => {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
});
