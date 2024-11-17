import { Request, Response } from 'express';
import { Produto } from '../entities/Produto';
import { AppDataSource } from '../data-source'; 
import { Categoria } from '../entities/Categoria';

class ProdutoController {

    // Método para criar um novo produto
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const produtoRepository = AppDataSource.getRepository(Produto); // Usando AppDataSource
            const { nome, quantidade, preco, descricao, tamanho, categoria_idCategoria } = req.body;
            
            const produto = produtoRepository.create({
                nome, 
                quantidade,
                preco,
                descricao,
                tamanho,
                categoria: { idCategoria: categoria_idCategoria } // Referência à categoria
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
            const produtoRepository = AppDataSource.getRepository(Produto); // Usando AppDataSource
            const produtos = await produtoRepository.find({ relations: ["categoria"] }); // Incluindo relação com categoria
            return res.status(200).json(produtos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar produtos." });
        }
    }

    // Método para buscar um produto por ID
    public async findOne(req: Request, res: Response): Promise<Response> {
        try {
            const produtoRepository = AppDataSource.getRepository(Produto); // Usando AppDataSource
            const produto = await produtoRepository.findOne({
                where: { idProduto: Number(req.params.idProduto) }, // Convertendo para número
                relations: ["categoria"] // Incluindo a relação
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
    
            // Encontre o produto pelo ID
            const produto = await produtoRepository.findOne({
                where: { idProduto: Number(req.params.idProduto) },
                relations: ["categoria"] // Inclui a categoria na consulta
            });
    
            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado." });
            }
    
            // Atualizando as informações do produto
            produto.nome = req.body.nome || produto.nome;
            produto.quantidade = req.body.quantidade || produto.quantidade;
            produto.preco = req.body.preco || produto.preco;
            produto.descricao = req.body.descricao || produto.descricao;
            produto.tamanho = req.body.tamanho || produto.tamanho;
    
            // Verifica se um novo idCategoria foi fornecido e busca a categoria completa
            if (req.body.categoria_idCategoria) {
                const categoria = await categoriaRepository.findOne({
                    where: { idCategoria: req.body.categoria_idCategoria }
                });
    
                if (categoria) {
                    produto.categoria = categoria; // Atribui a categoria completa ao produto
                } else {
                    return res.status(404).json({ message: "Categoria não encontrada." });
                }
            }
    
            // Salva as alterações no produto
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
            const produtoRepository = AppDataSource.getRepository(Produto); // Usando AppDataSource
            const produto = await produtoRepository.findOne({
                where: { idProduto: Number(req.params.idProduto) }, // Aqui, a condição de busca
                relations: ["categoria"], // Relacionamento com categoria
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