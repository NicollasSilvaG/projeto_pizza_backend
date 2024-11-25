import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { PedidoProduto } from '../entities/PedidoProduto'; 
import { Pedido, TipoPagamento } from '../entities/Pedido'; 
import { Produto } from '../entities/Produto'; 
import { In } from 'typeorm';
import { Cupom } from '../entities/Cupom'; 
import { Usuario } from '../entities/Usuario';
import { Entrega } from '../entities/Entrega';

const PedidoProdutoController = {
  adicionarProdutosAoPedido: async (
    usuarioId: number,
    produtos: { idProduto: number; quantidade: number; precoUnitario: number; desconto: number; observacoes: string; idCupom: number }[],
    idEntrega: number
  ): Promise<number> => {
    try {
      const produtoRepository = AppDataSource.getRepository(Produto);
      const pedidoProdutoRepository = AppDataSource.getRepository(PedidoProduto);
      const cupomRepository = AppDataSource.getRepository(Cupom);
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const entregaRepository = AppDataSource.getRepository(Entrega);  // Correct repository reference

      const usuario = await usuarioRepository.findOne({
        where: { idUsuario: usuarioId },
      });

      if (!usuario) {
        throw new Error(`Usuário com ID ${usuarioId} não encontrado.`);
      }

      // Verificar se os produtos existem no banco
      const produtosIds = produtos.map(p => p.idProduto);
      const produtosEncontrados = await produtoRepository.find({
        where: { idProduto: In(produtosIds) },
      });

      if (produtosEncontrados.length !== produtos.length) {
        throw new Error('Alguns produtos não foram encontrados no banco de dados.');
      }

      let valorTotalPedido = 0;

      // Criar um pedido vazio inicialmente
      let pedido: Pedido;

      // Adicionar os produtos ao pedido
      const pedidoProdutos = await Promise.all(
        produtosEncontrados.map(async (produto) => {
          const produtoData = produtos.find((p) => p.idProduto === produto.idProduto);

          if (!produtoData) {
            throw new Error(`Dados do produto com ID ${produto.idProduto} não encontrados.`);
          }

          const pedidoProduto = new PedidoProduto();
          pedidoProduto.produto = produto;
          pedidoProduto.quantidade = produtoData.quantidade; // Usando a quantidade definida no carrinho

          // Subtrair o desconto diretamente no precoUnitario
          pedidoProduto.precoUnitario = produtoData.precoUnitario - (produtoData.desconto || 0);

          // Calcular o valor total do produto (com desconto aplicado)
          let valorProduto = pedidoProduto.precoUnitario * produtoData.quantidade;
          pedidoProduto.valorTotal = parseFloat(valorProduto.toFixed(2));

          // Verificar e aplicar o desconto do cupom
          if (produtoData.idCupom) {
            const cupom = await cupomRepository.findOne({
              where: { idCupom: produtoData.idCupom },
            });

            if (cupom && cupom.porcentagem_desconto) {
              const porcentagemDesconto = parseFloat(cupom.porcentagem_desconto.toString());
              const descontoCupom = (pedidoProduto.valorTotal * porcentagemDesconto) / 100;
              pedidoProduto.valorTotal = parseFloat((pedidoProduto.valorTotal - descontoCupom).toFixed(2));
              pedidoProduto.cupom = cupom;
            } else {
              throw new Error('Cupom inválido ou sem desconto aplicado.');
            }
          }

          // Acumular o valor total do pedido
          valorTotalPedido += pedidoProduto.valorTotal;

          pedidoProduto.desconto = produtoData.desconto || 0;
          pedidoProduto.observacoes = produtoData.observacoes || '';

          // Inicializar o pedido se for o primeiro produto
          if (!pedido) {
            pedido = new Pedido();
            pedido.usuario = usuario; // Associando o usuário
            pedido.status = 'em andamento'; // Definindo como 'em andamento'
            pedido.dataPedido = new Date();
            pedido.tipo_pagamento = TipoPagamento.CREDITO;

            // Agora, em vez de 'idEntrega', você deve passar a instância de 'Entrega'
            const entrega = await entregaRepository.findOne({
              where: { idEntrega: idEntrega },
            });
            
            

            if (!entrega) {
              throw new Error(`Entrega com ID ${idEntrega} não encontrada.`);
            }

            pedido.entrega = entrega; // Atribuindo a instância da entrega

            pedido = await pedidoRepository.save(pedido);
          }

          pedidoProduto.pedido = pedido; // Associar o pedido ao produto
          return pedidoProduto;
        })
      );

      // Salvar os registros na tabela de junção PedidoProduto
      await pedidoProdutoRepository.save(pedidoProdutos);

      // Retornar o valor total do pedido
      return valorTotalPedido;
    } catch (error) {
      console.error('Erro ao adicionar produtos ao pedido:', error);
      throw new Error(`Erro ao adicionar produtos ao pedido`);
    }
  },
  // Resto dos métodos permanece o mesmo
  buscarCarrinho: async (idPedido: number): Promise<any> => {
    try {
      const pedidoProdutoRepository = AppDataSource.getRepository(PedidoProduto);
      
      // Buscar todos os produtos do pedido especificado
      const pedidoProdutos = await pedidoProdutoRepository.find({
        where: { pedido: { idPedido } },  // Filtra pelos produtos do pedido específico
        relations: ['pedido', 'produto', 'cupom'],  // Relacionamentos para carregar os dados completos
      });

      // Verificar se foram encontrados produtos no pedido
      if (!pedidoProdutos || pedidoProdutos.length === 0) {
        throw new Error(`Nenhum produto encontrado no pedido com ID ${idPedido}.`);
      }

      return pedidoProdutos;
    } catch (error) {
      console.error('Erro ao buscar produtos do carrinho do pedido:', error);
      throw new Error(`Erro ao buscar produtos do carrinho para o pedido com ID ${idPedido}`);
    }
  },

  removerTodosProdutosDoCarrinho: async (idPedido: number): Promise<void> => {
    try {
      const pedidoProdutoRepository = AppDataSource.getRepository(PedidoProduto);
      
      // Buscar os produtos associados ao pedido
      const pedidoProdutos = await pedidoProdutoRepository.find({
        where: { pedido: { idPedido } },  // Filtra pelos produtos do pedido específico
      });
  
      if (!pedidoProdutos || pedidoProdutos.length === 0) {
        throw new Error(`Nenhum produto encontrado no pedido com ID ${idPedido}.`);
      }
  
      // Remover todos os produtos associados ao pedido
      await pedidoProdutoRepository.remove(pedidoProdutos);
      
      console.log(`Produtos removidos com sucesso do carrinho ${idPedido}`);
    } catch (error) {
      console.error('Erro ao remover produtos do carrinho:', error);
      throw new Error(`Erro ao remover produtos do carrinho para o pedido com ID ${idPedido}`);
    }
  }
};

export default PedidoProdutoController;
