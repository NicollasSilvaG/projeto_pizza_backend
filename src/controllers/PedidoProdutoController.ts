import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { PedidoProduto } from '../entities/PedidoProduto'; 
import { Pedido } from '../entities/Pedido'; 
import { Produto } from '../entities/Produto'; 
import { In } from 'typeorm';
import { Cupom } from '../entities/Cupom'; 

const PedidoProdutoController = {
  adicionarProdutosAoPedido: async (pedido: Pedido, produtos: { idProduto: number; quantidade: number; precoUnitario: number; desconto: number; observacoes: string, idCupom: number}[]): Promise<number> => {
    try {
      const produtoRepository = AppDataSource.getRepository(Produto);
      const pedidoProdutoRepository = AppDataSource.getRepository(PedidoProduto);
      const cupomRepository = AppDataSource.getRepository(Cupom);

      // Verificar se os produtos existem no banco
      const produtosIds = produtos.map(p => p.idProduto);
      const produtosEncontrados = await produtoRepository.find({
        where: { idProduto: In(produtosIds) },
      });

      if (produtosEncontrados.length !== produtos.length) {
        throw new Error('Alguns produtos não foram encontrados no banco de dados.');
      }

      let valorTotalPedido = 0;

      // Adicionar os produtos ao pedido
      const pedidoProdutos = produtosEncontrados.map(async (produto) => {
        const produtoData = produtos.find(p => p.idProduto === produto.idProduto);

        if (!produtoData) {
          throw new Error(`Dados do produto com ID ${produto.idProduto} não encontrados.`);
        }

        const pedidoProduto = new PedidoProduto();
        pedidoProduto.pedido = pedido;
        pedidoProduto.produto = produto;
        pedidoProduto.quantidade = produtoData.quantidade || 1;

        // Subtrair o desconto diretamente no precoUnitario
        pedidoProduto.precoUnitario = produtoData.precoUnitario - (produtoData.desconto || 0);

        // Calcular o valor total do produto (com desconto aplicado)
        let valorProduto = pedidoProduto.precoUnitario * produtoData.quantidade;

        pedidoProduto.valorTotal = parseFloat(valorProduto.toFixed(2));

        // Verificar e aplicar o desconto do cupom
        if (produtoData.idCupom) {
          const cupom = await cupomRepository.findOne({
            where: { idCupom: produtoData.idCupom }
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
        return pedidoProduto;
      });

      // Salvar os registros na tabela de junção PedidoProduto
      await pedidoProdutoRepository.save(await Promise.all(pedidoProdutos));

      // Retornar o valor total do pedido
      return valorTotalPedido;
    } catch (error) {
      console.error('Erro ao adicionar produtos ao pedido:', error);
      throw new Error(`Erro ao adicionar produtos ao pedido`);
    }
  },

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
  }
}

export default PedidoProdutoController;