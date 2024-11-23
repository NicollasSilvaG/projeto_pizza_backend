import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'; // Alterar o caminho conforme necessário
import { Entrega } from '../entities/Entrega'; // Alterar o caminho conforme necessário

const entregaRepository = AppDataSource.getRepository(Entrega);

const EntregaController = {
  // Criar uma nova entrega
  criarEntrega: async (req: Request, res: Response): Promise<Response> => {
    const { entrega, retirada, status, dataEntrega } = req.body; // Incluído dataEntrega

    try {
      // Criar a nova entrega
      const novaEntrega = entregaRepository.create({
        entrega,
        retirada,
        status,
        dataEntrega: dataEntrega ? new Date(dataEntrega) : new Date(), // Configurando dataEntrega
      });

      // Salvar a entrega no banco de dados
      const entregaSalva = await entregaRepository.save(novaEntrega);

      return res.status(201).json({
        message: 'Entrega criada com sucesso.',
        entrega: entregaSalva,
      });
    } catch (error) {
      console.error('Erro ao criar entrega:', error);
      return res.status(500).json({
        error: 'Erro ao criar entrega.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Buscar todas as entregas
  buscarEntregas: async (req: Request, res: Response): Promise<Response> => {
    try {
      const entregas = await entregaRepository.find();

      return res.status(200).json(
        entregas.map((entrega) => ({
          ...entrega,
          dataEntrega: entrega.dataEntrega, // Garantindo o retorno de dataEntrega
        }))
      );
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
      return res.status(500).json({
        error: 'Erro ao buscar entregas.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Buscar uma entrega específica pelo id
  buscarEntregaPorId: async (req: Request, res: Response): Promise<Response> => {
    const { idEntrega } = req.params;

    try {
      const entrega = await entregaRepository.findOne({ where: { idEntrega: Number(idEntrega) } });

      if (!entrega) {
        return res.status(404).json({ error: 'Entrega não encontrada.' });
      }

      return res.status(200).json(entrega);
    } catch (error) {
      console.error('Erro ao buscar entrega:', error);
      return res.status(500).json({
        error: 'Erro ao buscar entrega.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Atualizar uma entrega pelo id
  atualizarEntrega: async (req: Request, res: Response): Promise<Response> => {
    const { idEntrega } = req.params;
    const { entrega, retirada, status, dataEntrega } = req.body; // Incluído dataEntrega

    try {
      const entregaExistente = await entregaRepository.findOne({ where: { idEntrega: Number(idEntrega) } });

      if (!entregaExistente) {
        return res.status(404).json({ error: 'Entrega não encontrada.' });
      }

      // Atualizar os campos
      entregaExistente.entrega = entrega;
      entregaExistente.retirada = retirada;
      entregaExistente.status = status;
      entregaExistente.dataEntrega = dataEntrega ? new Date(dataEntrega) : entregaExistente.dataEntrega; // Atualizar dataEntrega

      const entregaAtualizada = await entregaRepository.save(entregaExistente);

      return res.status(200).json({
        message: 'Entrega atualizada com sucesso.',
        entrega: entregaAtualizada,
      });
    } catch (error) {
      console.error('Erro ao atualizar entrega:', error);
      return res.status(500).json({
        error: 'Erro ao atualizar entrega.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Deletar uma entrega pelo id
  deletarEntrega: async (req: Request, res: Response): Promise<Response> => {
    const { idEntrega } = req.params;

    try {
      const entrega = await entregaRepository.findOne({ where: { idEntrega: Number(idEntrega) } });

      if (!entrega) {
        return res.status(404).json({ error: 'Entrega não encontrada.' });
      }

      await entregaRepository.remove(entrega);

      return res.status(200).json({ message: 'Entrega deletada com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar entrega:', error);
      return res.status(500).json({
        error: 'Erro ao deletar entrega.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },
};

export default EntregaController;
