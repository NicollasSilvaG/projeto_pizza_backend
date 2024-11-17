import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { PedidoProduto } from '../entities/PedidoProduto'; // A entidade de relacionamento
import { Pedido } from '../entities/Pedido'; // Entidade do Pedido
import { Produto } from '../entities/Produto'; // Entidade do Produto
import { In } from 'typeorm'; // Para buscar múltiplos IDs

const PedidoProdutoController = {

 adicionarProdutosAoPedido: async (pedido: Pedido, produtos: { idProduto: number; quantidade: number; precoUnitario: number; desconto: number; observacoes: string }[]): Promise<void> => {
    try {
      const produtoRepository = AppDataSource.getRepository(Produto);
      const pedidoProdutoRepository = AppDataSource.getRepository(PedidoProduto);

      // Verificar se os produtos existem no banco
      const produtosIds = produtos.map(p => p.idProduto); // Extrair apenas os IDs dos produtos
      const produtosEncontrados = await produtoRepository.find({
        where: { idProduto: In(produtosIds) },
      });

      if (produtosEncontrados.length !== produtos.length) {
        throw new Error('Alguns produtos não foram encontrados.');
      }

      // Adicionar os produtos ao pedido
      const pedidoProdutos = produtosEncontrados.map((produto) => {
        // Encontrar os dados específicos do produto que foi enviado na requisição
        const produtoData = produtos.find(p => p.idProduto === produto.idProduto);

        if (!produtoData) {
          throw new Error(`Dados do produto com ID ${produto.idProduto} não encontrados.`);
        }

        const pedidoProduto = new PedidoProduto();
        pedidoProduto.pedido = pedido;
        pedidoProduto.produto = produto;
        pedidoProduto.quantidade = produtoData.quantidade || 1;   // Usando a quantidade fornecida
        pedidoProduto.precoUnitario = produtoData.precoUnitario; // Usando o preço unitário fornecido
        pedidoProduto.valorTotal = (produtoData.precoUnitario * produtoData.quantidade) - (produtoData.desconto || 0);  // Calculando o valor total
        pedidoProduto.desconto = produtoData.desconto || 0;
        pedidoProduto.observacoes = produtoData.observacoes || ''; // Observações fornecidas
        return pedidoProduto; 
      });

      // Salvar os registros na tabela de junção PedidoProduto
      await pedidoProdutoRepository.save(pedidoProdutos);
    } catch (error) {
      console.error('Erro ao adicionar produtos ao pedido:', error);
      throw error; // Lança o erro para ser tratado no controller
    }
  },

buscarTodosPedidosComProdutos: async (req: Request, res: Response): Promise<Response> => {
  try {
    const pedidoProdutoRepository = AppDataSource.getRepository(PedidoProduto);

    // Buscar todos os pedidos com seus produtos relacionados
    const pedidosComProdutos = await pedidoProdutoRepository
    .createQueryBuilder('pedidoProduto')
    .leftJoinAndSelect('pedidoProduto.pedido', 'pedido') // Join com Pedido
    .leftJoinAndSelect('pedidoProduto.produto', 'produto') // Join com Produto
    .orderBy('pedidoProduto.idPedidoProduto', 'ASC') // Ordenar por ID do PedidoProduto
    .getMany();

    if (!pedidosComProdutos || pedidosComProdutos.length === 0) {
      return res.status(404).json({ error: 'Nenhum pedido encontrado com produtos.' });
    }

    return res.status(200).json(pedidosComProdutos);
  } catch (error) {
    console.error('Erro ao buscar pedidos com produtos:', error);
    return res.status(500).json({
      error: 'Erro ao buscar pedidos com produtos.',
      details: error instanceof Error ? error.message : 'Erro desconhecido.',
    });
  }
},
}


export default PedidoProdutoController;