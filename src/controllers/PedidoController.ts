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
    console.log(req.body);  // Adicione essa linha para depurar
    let { status, idCupom, idEntrega, tipo_pagamento, idUsuario } = req.body;  // Usar 'let' em vez de 'const'

    
    try {
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const cupomRepository = AppDataSource.getRepository(Cupom);
      const entregaRepository = AppDataSource.getRepository(Entrega);
    
      // Validação do usuário
      const usuario = await usuarioRepository.findOne({ where: { "idUsuario": idUsuario } });
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      if (!status || !tipo_pagamento) {
        return res.status(400).json({ error: 'Status e tipo_pagamento são obrigatórios.' });
      }
    
      const cupom = await cupomRepository.findOne({ where: { "idCupom": idCupom } });
      if (!cupom) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
        
    const entrega = await entregaRepository.findOne({ where: { "idEntrega": idEntrega } });
      if (!entrega) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
          // Criar o novo pedido (sem incluir produtos)
      const novoPedido: DeepPartial<Pedido> = {
        status,
        tipo_pagamento,
        usuario,
        entrega,
      };
    
      // Salvar o pedido
      const pedidoSalvo = await pedidoRepository.save(novoPedido);
    
      return res.status(201).json({
        message: 'Pedido criado com sucesso.',
        idPedido: pedidoSalvo.idPedido,
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

      return res.status(200).json(pedidos);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return res.status(500).json({
        error: 'Erro ao buscar pedidos.',
        details: error instanceof Error ? error.message : 'Erro desconhecido.',
      });
    }
  },
};


export default PedidoController;
