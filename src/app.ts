import "reflect-metadata";  // Importação obrigatória antes de usar qualquer decorador
import express from 'express';
import cors from 'cors';  // Importando o middleware CORS
import { AppDataSource } from './data-source';  // Importando o DataSource
import router from './http/routes/authRoutes';
import uploadRoutes from './http/routes/uploadRoutes';
import path from 'path';   // Supondo que seu arquivo de rotas esteja aqui

const app = express();


app.use(cors());  

// Iniciar a conexão com o banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida');
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
  });

// Middleware para interpretar JSON
app.use(express.json());

// Usar o roteador principal
app.use('/autenticacao', router);
  
app.use('/flutter', router);

app.use('/api', uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'http', 'uploads')));

console.log("Caminho para os uploads:", path.join(__dirname, 'http', 'uploads'));



app.listen(3070, () => {
  console.log('Servidor rodando na porta 3070');
});
