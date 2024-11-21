import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'; // Ajustar o caminho conforme necessário
import { Categoria } from '../entities/Categoria'; // Ajustar o caminho conforme necessário

const categoriaRepository = AppDataSource.getRepository(Categoria);

const CategoriaController = {
  // Criar uma nova categoria
  criarCategoria: async (req: Request, res: Response): Promise<Response> => {
    const { tipo } = req.body;
  
    try {
      // Verificar se já existe uma categoria com o mesmo tipo
      const categoriaExistente = await categoriaRepository.findOne({
        where: { tipo },
      });
  
      if (categoriaExistente) {
        return res.status(400).json({ error: 'Já existe uma categoria com este tipo.' });
      }
  
      // Criar a nova categoria
      const novaCategoria = categoriaRepository.create({ tipo });
      const categoriaSalva = await categoriaRepository.save(novaCategoria);
  
      return res.status(201).json({
        message: 'Categoria criada com sucesso.',
        categoria: categoriaSalva,
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      return res.status(500).json({
        error: 'Erro ao criar categoria.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Buscar todas as categorias
  buscarCategorias: async (req: Request, res: Response): Promise<Response> => {
    try {
      const categorias = await categoriaRepository.find();
      return res.status(200).json(categorias);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return res.status(500).json({
        error: 'Erro ao buscar categorias.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Buscar uma categoria específica pelo id
  buscarCategoriaPorId: async (req: Request, res: Response): Promise<Response> => {
    const { idCategoria } = req.params;

    try {
      const categoria = await categoriaRepository.findOne({
        where: { idCategoria: Number(idCategoria) },
      });

      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada.' });
      }

      return res.status(200).json(categoria);
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      return res.status(500).json({
        error: 'Erro ao buscar categoria.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Atualizar uma categoria pelo id
  atualizarCategoria: async (req: Request, res: Response): Promise<Response> => {
    const { idCategoria } = req.params;
    const { tipo } = req.body;

    try {
      const categoria = await categoriaRepository.findOne({
        where: { idCategoria: Number(idCategoria) },
      });

      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada.' });
      }

      // Atualizar os campos
      categoria.tipo = tipo;

      const categoriaAtualizada = await categoriaRepository.save(categoria);

      return res.status(200).json({
        message: 'Categoria atualizada com sucesso.',
        categoria: categoriaAtualizada,
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return res.status(500).json({
        error: 'Erro ao atualizar categoria.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Deletar uma categoria pelo id
  deletarCategoria: async (req: Request, res: Response): Promise<Response> => {
    const { idCategoria } = req.params;

    try {
      const categoria = await categoriaRepository.findOne({
        where: { idCategoria: Number(idCategoria) },
      });

      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada.' });
      }

      await categoriaRepository.remove(categoria);

      return res.status(200).json({ message: 'Categoria deletada com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      return res.status(500).json({
        error: 'Erro ao deletar categoria.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },
};

export default CategoriaController;
