import { Router } from 'express';
import cors from 'cors';  // Importando o CORS
import { AuthController } from '../../controllers/AuthController';
import { cadastrarUsuario, loginUsuario } from '../../controllers/UsuarioController';
import ProdutoController from '../../controllers/ProdutoController'; // Verifique o caminho

const router = Router();
const authController = new AuthController();

router.use(cors()); 

// Rota para cadastro de usuário com async/await
router.post('/cadastrar', async (req, res) => {
  try {
    await authController.cadastrar(req, res);
  } catch (error) { 
    res.status(500).json({ error: 'Erro no processamento da requisição' });
  }
});

// Rota para login de usuário com async/await
router.post('/login', async (req, res) => {
  try {
    await authController.login(req, res);  // Corrigido para chamar o método de login
  } catch (error) {
    res.status(500).json({ error: 'Erro no processamento da requisição' });
  }
});

router.post('/cadastro', async (req, res) => {
  try {
    await cadastrarUsuario(req, res);  // Usando a função cadastrarUsuario diretamente

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no processamento da requisição', details: error});
  }
});

router.post('/loginuser', async (req, res) => {
  try {
    await loginUsuario(req, res);  // Usando a função cadastrarUsuario diretamente

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no processamento da requisição', details: error});
  }
});

// Rota para adicionar um produto
router.post('/produto', async (req, res) => {
  try {
    await ProdutoController.create(req, res);  // Usando o ProdutoController para criar um produto
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o produto', details: error });
  }
});

// Rota para listar todos os produtos
router.get('/produtos', async (req, res) => {
  try {
    await ProdutoController.findAll(req, res);  // Usando o ProdutoController para listar produtos
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar produtos', details: error });
  }
});

// Rota para buscar um produto específico pelo ID
router.get('/produto/:idProduto', async (req, res) => {
  try {
    await ProdutoController.findOne(req, res);  // Usando o ProdutoController para buscar um produto pelo ID
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produto', details: error });
  }
});

export default router;
