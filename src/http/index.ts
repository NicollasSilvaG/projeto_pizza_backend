import express, {json, NextFunction, Request, Response} from "express";
import {dataSource} from "../db/typeorm";
import { Cupom } from "../entities/Cupom";

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

app.get('/cupons', async (req: Request, res: Response) => {
    try {
        const cupom = dataSource.getRepository(Cupom);
        const cupons = await cupom.find(); // Busca todos os cupons
        res.json(cupons);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cupons', error });
    }
});


dataSource.initialize().then(() => {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
})

