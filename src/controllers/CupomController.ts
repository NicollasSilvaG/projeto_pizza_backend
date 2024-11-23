import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'; // Alterar o caminho conforme necessário
import { Cupom } from '../entities/Cupom'; // Alterar o caminho conforme necessário

const cupomRepository = AppDataSource.getRepository(Cupom);

const CupomController = {

  // Criar um novo cupom
  criarCupom: async (req: Request, res: Response): Promise<Response> => {
    const { codigo, porcentagem_desconto, status, quantidade } = req.body;

    const cupomRepository = AppDataSource.getRepository(Cupom);

    const cupomExistente = await cupomRepository.findOne({ where: { codigo } });

    if (cupomExistente) {
        return res.status(400).json({ error: 'Já existe um cupom com este código.' });
      }

    try {
      // Criar o novo cupom
      const novoCupom = cupomRepository.create({
        codigo,
        porcentagem_desconto,
        status,
        quantidade
      });

      // Salvar o cupom no banco de dados
      const cupomSalvo = await cupomRepository.save(novoCupom);

      return res.status(201).json({
        message: 'Cupom criado com sucesso.',
        cupom: cupomSalvo,
      });

    } catch (error) {
      console.error('Erro ao criar cupom:', error);
      return res.status(500).json({
        error: 'Erro ao criar cupom.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Buscar todos os cupons
  buscarCupons: async (req: Request, res: Response): Promise<Response> => {
    try {
      const cupons = await cupomRepository.find();
      return res.status(200).json(cupons);
    } catch (error) {
      console.error('Erro ao buscar cupons:', error);
      return res.status(500).json({
        error: 'Erro ao buscar cupons.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Buscar um cupom específico pelo id
  buscarCupomPorId: async (req: Request, res: Response): Promise<Response> => {
    const { idCupom } = req.params;

    try {
      const cupom = await cupomRepository.findOne({ where: { idCupom: Number(idCupom) } });

      if (!cupom) {
        return res.status(404).json({ error: 'Cupom não encontrado.' });
      }

      return res.status(200).json(cupom);
    } catch (error) {
      console.error('Erro ao buscar cupom:', error);
      return res.status(500).json({
        error: 'Erro ao buscar cupom.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Atualizar um cupom pelo id
  atualizarCupom: async (req: Request, res: Response): Promise<Response> => {
    const { idCupom } = req.params;
    const { codigo, porcentagem_desconto, status, quantidade } = req.body;

    try {
      const cupom = await cupomRepository.findOne({ where: { idCupom: Number(idCupom) } });

      if (!cupom) {
        return res.status(404).json({ error: 'Cupom não encontrado.' });
      }

      // Atualizar os campos
      cupom.codigo = codigo;
      cupom.porcentagem_desconto = porcentagem_desconto;
      cupom.status = status;
      cupom.quantidade = quantidade;

      const cupomAtualizado = await cupomRepository.save(cupom);

      return res.status(200).json({
        message: 'Cupom atualizado com sucesso.',
        cupom: cupomAtualizado,
      });
    } catch (error) {
      console.error('Erro ao atualizar cupom:', error);
      return res.status(500).json({
        error: 'Erro ao atualizar cupom.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Deletar um cupom pelo id
  deletarCupom: async (req: Request, res: Response): Promise<Response> => {
    const { idCupom } = req.params;

    try {
      const cupom = await cupomRepository.findOne({ where: { idCupom: Number(idCupom) } });

      if (!cupom) {
        return res.status(404).json({ error: 'Cupom não encontrado.' });
      }

      await cupomRepository.remove(cupom);

      return res.status(200).json({ message: 'Cupom deletado com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar cupom:', error);
      return res.status(500).json({
        error: 'Erro ao deletar cupom.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },
// Aplicar um cupom e decrementar sua quantidade
aplicarCupom: async (req: Request, res: Response): Promise<Response> => {
  const { codigo } = req.body; // O código do cupom será passado no corpo da requisição

  try {
    // Buscar o cupom pelo código
    const cupom = await cupomRepository.findOne({ where: { codigo } });

    if (!cupom) {
      return res.status(404).json({ error: 'Cupom não encontrado.' });
    }

    if (cupom.quantidade <= 0 || cupom.status === 'inativo') {
      return res.status(400).json({ error: 'Este cupom não está mais ativo ou não possui quantidade disponível.' });
    }

    // Decrementar a quantidade do cupom
    cupom.quantidade -= 1;

    // Alterar o status para inativo se a quantidade chegar a 0
    if (cupom.quantidade === 0) {
      cupom.status = 'inativo';
    }

    // Salvar as alterações no banco de dados
    const cupomAtualizado = await cupomRepository.save(cupom);

    return res.status(200).json({
      message: 'Cupom aplicado com sucesso.',
      cupom: cupomAtualizado,
    });
  } catch (error) {
    console.error('Erro ao aplicar cupom:', error);
    return res.status(500).json({
      error: 'Erro ao aplicar cupom.',
      details: error instanceof Error ? error.message : 'Erro desconhecido.',
    });
  }
},
};


export default CupomController;
