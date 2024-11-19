import  ProdutoController  from '../../controllers/ProdutoController';
import multer from 'multer';
import path from 'path';
import express from 'express';

const router = express.Router();

// Configuração do Multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '../uploads'));     
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
});

// Endpoint para upload de imagem e criação de produto
router.post('/produtos/upload', (req, res, next) => {
  upload.single('imagem')(req, res, (err) => {
    if (err) {
      console.error('Erro de upload:', err);  // Log do erro
      return res.status(400).json({ message: 'Erro ao fazer o upload da imagem', error: err.message });
    }
    next();
  });
}, ProdutoController.create);

export default router;
