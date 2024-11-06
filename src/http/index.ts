import express, {json, NextFunction, Request, Response} from "express";
import {dataSource} from "../db/typeorm";
import { Usuario } from "../entities/Usuario";
import { UsuarioController } from "../controllers/UsuarioController";

const app = express()
app.use(json());

app.get('/normal',(req: Request, res: Response)=> {
   res.send('Hello World + ' + req.headers['origin']);
});



app.get('/erro', (req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Algo deu errado!');
    if(error == null){
        res.status(200).send('Requisição bem sucedida');
    }else{
        next(error);
    }
});

app.get('/usuarios', async (req: Request, res: Response) => {
    try {
        const usuario = dataSource.getRepository(Usuario);
        const usuarios = await usuario.find(); // Busca todos os usuarios
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cupons', error });
    }
});


dataSource.initialize().then(() => {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
})

