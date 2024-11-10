import { Router } from 'express';
import cors from 'cors';  // Importando o CORS
import { AuthController } from '../../controllers/AuthController';
import { cadastrarUsuario, loginUsuario } from '../../controllers/UsuarioController'; // Verifique o caminho

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

export default router;
