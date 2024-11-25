import { Request, Response } from 'express';
import { Produto } from '../entities/Produto';
import { AppDataSource } from '../data-source'; 
import { Categoria } from '../entities/Categoria';
import multer from 'multer';
import path from 'path';

const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const dest = path.resolve(__dirname, '../../uploads'); // Caminho fora de src
        console.log('Destination folder:', dest); // Para debug
        cb(null, dest);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        console.log('Generated filename:', uniqueName); // Para debug
        cb(null, uniqueName);
      },
    }),
  });
  
class ProdutoController {

    // Método para criar um novo produto
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const produtoRepository = AppDataSource.getRepository(Produto);
            const categoriaRepository = AppDataSource.getRepository(Categoria);
            const { nome, quantidade, preco, descricao, tamanho, categoria_idCategoria } = req.body;
            
            const categoria = await categoriaRepository.findOne({
                where: { idCategoria: categoria_idCategoria },
            });

            if (!categoria) {
                return res.status(404).json({ message: "Categoria não encontrada." });
            }

            const imagemCaminho = req.file ? `uploads/${req.file.filename}` : null;

            const produto = produtoRepository.create({
                nome, 
                quantidade,
                preco,
                descricao,
                tamanho,
                categoria, 
                imagem: imagemCaminho
            });

            await produtoRepository.save(produto);
            return res.status(201).json(produto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao criar produto." });
        }
    }

    // Método para buscar todos os produtos
    public async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const produtoRepository = AppDataSource.getRepository(Produto);
            const produtos = await produtoRepository.find({ relations: ["categoria"] });
    
            const produtosComImagens = produtos.map(produto => ({
                ...produto,
                imagemUrl: produto.imagem ? `http://localhost:3070/${produto.imagem}` : null,
            }));
            
            return res.status(200).json(produtosComImagens); 
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar produtos." });
        }
    }

    // Método para buscar um produto por ID
    public async findOne(req: Request, res: Response): Promise<Response> {
        try {
            const produtoRepository = AppDataSource.getRepository(Produto);
            const produto = await produtoRepository.findOne({
                where: { idProduto: Number(req.params.idProduto) },
                relations: ["categoria"]
            });

            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado." });
            }

            return res.status(200).json(produto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar produto." });
        }
    }

    // Método para atualizar um produto
    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const produtoRepository = AppDataSource.getRepository(Produto);
            const categoriaRepository = AppDataSource.getRepository(Categoria);

            // Buscar produto
            const produto = await produtoRepository.findOne({
                where: { idProduto: Number(req.params.idProduto) },
                relations: ["categoria"],
            });

            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado." });
            }

            // Atualizar informações
            produto.nome = req.body.nome || produto.nome;
            produto.quantidade = req.body.quantidade || produto.quantidade;
            produto.preco = req.body.preco || produto.preco;
            produto.descricao = req.body.descricao || produto.descricao;
            produto.tamanho = req.body.tamanho || produto.tamanho;

            // Atualizar categoria, se fornecida
            if (req.body.categoria_idCategoria) {
                const categoria = await categoriaRepository.findOne({
                    where: { idCategoria: req.body.categoria_idCategoria },
                });

                if (!categoria) {
                    return res.status(404).json({ message: "Categoria não encontrada." });
                }

                produto.categoria = categoria;
            }

            // Atualizar imagem, se fornecida
            if (req.file) {
                produto.imagem = `uploads/${req.file.filename}`;
            }

            await produtoRepository.save(produto);
            return res.status(200).json(produto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao atualizar produto." });
        }
    }
    
    // Método para deletar um produto
    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            const produtoRepository = AppDataSource.getRepository(Produto);
            const produto = await produtoRepository.findOne({
                where: { idProduto: Number(req.params.idProduto) },
                relations: ["categoria"],
            });

            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado." });
            }

            await produtoRepository.remove(produto);
            return res.status(200).json({ message: "Produto deletado com sucesso." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao deletar produto." });
        }
    }
}

export default new ProdutoController();
