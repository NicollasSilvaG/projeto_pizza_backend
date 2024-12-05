import "reflect-metadata"; 
import express from 'express';
import cors from 'cors';  
import { AppDataSource } from './data-source';  
import router from './http/routes/authRoutes';
import uploadRoutes from './http/routes/uploadRoutes';
import path from 'path';   

const app = express();


app.use(cors());  

AppDataSource.initialize()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida');
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
  });

app.use(express.json());

app.use('/autenticacao', router);
  
app.use('/flutter', router);

app.use('/api', uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'http', 'uploads')));

console.log("Caminho para os uploads:", path.join(__dirname, 'http', 'uploads'));



app.listen(3070, () => {
  console.log('Servidor rodando na porta 3070');
});
