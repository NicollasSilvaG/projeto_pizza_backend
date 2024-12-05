import { AppDataSource } from '../data-source';
import { Pedido } from '../entities/Pedido';
import { Request, Response } from 'express';
import { Cupom } from '../entities/Cupom';
import { Entrega } from '../entities/Entrega';
import { Usuario } from '../entities/Usuario';
import { DeepPartial } from 'typeorm';

const PedidoController = {
  // Método para criar um pedido
  criarPedido: async (req: Request, res: Response): Promise<Response> => {
    let { status, idCupom, idEntrega, tipo_pagamento, idUsuario, dataPedido } = req.body; // Incluído o campo dataPedido

    try {
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const cupomRepository = AppDataSource.getRepository(Cupom);
      const entregaRepository = AppDataSource.getRepository(Entrega);

      // Validação do usuário
      const usuario = await usuarioRepository.findOne({ where: { idUsuario } });
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      if (!status || !tipo_pagamento) {
        return res.status(400).json({ error: 'Status e tipo_pagamento são obrigatórios.' });
      }

      const cupom = await cupomRepository.findOne({ where: { idCupom } });
      if (!cupom) {
        return res.status(404).json({ error: 'Cupom não encontrado.' });
      }

      const entrega = await entregaRepository.findOne({ where: { idEntrega } });
      if (!entrega) {
        return res.status(404).json({ error: 'Entrega não encontrada.' });
      }

      const novoPedido: DeepPartial<Pedido> = {
        status,
        tipo_pagamento,
        usuario,
        entrega,
        dataPedido: dataPedido ? new Date(dataPedido) : new Date(), // Incluindo o campo dataPedido
      };

      // Salvar o pedido
      const pedidoSalvo = await pedidoRepository.save(novoPedido);

      return res.status(201).json({
        message: 'Pedido criado com sucesso.',
        idPedido: pedidoSalvo.idPedido,
        dataPedido: pedidoSalvo.dataPedido, // Retornando o campo no response
      });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return res.status(500).json({
        error: 'Erro ao criar pedido.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  buscarTodosPedidos: async (req: Request, res: Response): Promise<Response> => {
    try {
      const pedidoRepository = AppDataSource.getRepository(Pedido);

      // Buscar todos os pedidos com seus relacionamentos
      const pedidos = await pedidoRepository.find({
        relations: ['usuario', 'entrega'], // Incluindo os relacionamentos necessários
      });

      if (!pedidos || pedidos.length === 0) {
        return res.status(404).json({ error: 'Nenhum pedido encontrado.' });
      }

      return res.status(200).json(
        pedidos.map((pedido) => ({
          ...pedido,
          dataPedido: pedido.dataPedido, // Incluindo o campo no response
        }))
      );
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return res.status(500).json({
        error: 'Erro ao buscar pedidos.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Método para buscar um pedido por ID
buscarPedidoPorId: async (req: Request, res: Response): Promise<Response> => {
  const { idPedido } = req.params;

  if (!idPedido) {
    return res.status(400).json({ error: 'ID do pedido é obrigatório.' });
  }

  try {
    const pedidoRepository = AppDataSource.getRepository(Pedido);

    // Buscar o pedido pelo ID com seus relacionamentos
    const pedido = await pedidoRepository.findOne({
      where: { idPedido: parseInt(idPedido, 10) },
      relations: ['usuario', 'entrega'], // Incluindo os relacionamentos necessários
    });

    if (!pedido) {
      return res.status(404).json({ error: `Pedido com ID ${idPedido} não encontrado.` });
    }

    return res.status(200).json({
      ...pedido,
      dataPedido: pedido.dataPedido, // Incluindo o campo no response
    });
  } catch (error) {
    console.error('Erro ao buscar pedido por ID:', error);
    return res.status(500).json({
      error: 'Erro ao buscar pedido.',
      details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },

  // Método para cancelar um pedido
cancelarPedido: async (req: Request, res: Response): Promise<Response> => {
  const { idPedido } = req.params;

  if (!idPedido) {
    return res.status(400).json({ error: 'ID do pedido é obrigatório.' });
  }

  try {
    const pedidoRepository = AppDataSource.getRepository(Pedido);

    // Buscar o pedido pelo ID
    const pedido = await pedidoRepository.findOne({
      where: { idPedido: parseInt(idPedido, 10) },
    });

    if (!pedido) {
      return res.status(404).json({ error: `Pedido com ID ${idPedido} não encontrado.` });
    }

    // Verificar se o pedido já está cancelado
    if (pedido.status === 'Cancelado') {
      return res.status(400).json({ error: 'O pedido já está cancelado.' });
    }

    // Atualizar o status do pedido para "Cancelado"
    pedido.status = 'Cancelado';

    await pedidoRepository.save(pedido);

    return res.status(200).json({
      message: `Pedido com ID ${idPedido} foi cancelado com sucesso.`,
      pedido,
    });
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    return res.status(500).json({
      error: 'Erro ao cancelar pedido.',
      details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },
};

export default PedidoController;
