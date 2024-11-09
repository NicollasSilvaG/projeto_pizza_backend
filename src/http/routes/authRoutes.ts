import { Router } from 'express';
import cors from 'cors';  // Importando o CORS
import { AuthController } from '../../controllers/AuthController'; // Verifique o caminho

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

export default router;
