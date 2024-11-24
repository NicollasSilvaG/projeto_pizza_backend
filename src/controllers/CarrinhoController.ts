import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Carrinho } from '../entities/Carrinho';
import { Produto } from '../entities/Produto';
import { PedidoProduto } from '../entities/PedidoProduto';
import { Pedido } from '../entities/Pedido';
import { Usuario } from '../entities/Usuario';
import { TipoPagamento } from '../entities/Pedido'; // Enums podem ser importados aqui

export class CarrinhoController {
    
    // Criar um novo carrinho para o usuário
    public async criarCarrinho(req: Request, res: Response): Promise<Response> {
        const usuarioId = req.body.usuarioId; // Supondo que o ID do usuário seja passado no corpo da requisição
        
        const usuario = await AppDataSource.getRepository(Usuario).findOne({ where: { idUsuario: usuarioId } });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const carrinho = new Carrinho();
        carrinho.usuario = usuario;
        carrinho.status = 'ativo';

        await AppDataSource.getRepository(Carrinho).save(carrinho);
        
        return res.status(201).json(carrinho);
    }

    // Adicionar um produto ao carrinho
    public async adicionarProdutoAoCarrinho(req: Request, res: Response): Promise<Response> {
        const { carrinhoId, produtoId, quantidade } = req.body;
        
        const carrinho = await AppDataSource.getRepository(Carrinho).findOne({
            where: { idCarrinho: carrinhoId }, // Buscar o carrinho pelo ID
            relations: ['usuario', 'pedidoProdutos'] // Incluir as relações com usuario e produtos
        });

        if (!carrinho) {
            return res.status(404).json({ message: 'Carrinho não encontrado' });
        }

        const produto = await AppDataSource.getRepository(Produto).findOne({ where: { idProduto: produtoId } });
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        const pedidoProduto = new PedidoProduto();
        pedidoProduto.carrinho = carrinho;
        pedidoProduto.produto = produto;
        pedidoProduto.quantidade = quantidade;
        pedidoProduto.precoUnitario = produto.preco; // Assumindo que Produto tem o preço
        pedidoProduto.valorTotal = produto.preco * quantidade;

        await AppDataSource.getRepository(PedidoProduto).save(pedidoProduto);

        return res.status(200).json(pedidoProduto);
    }
    public async consultarCarrinho(req: Request, res: Response): Promise<Response> {
        const usuarioId = req.params.usuarioId;
        const carrinhoId = req.body.carrinhoId; // Certifique-se de que o 'carrinhoId' seja um número
        
        // Verificar se o 'usuarioId' é válido e convertido para número
        const usuarioIdNum = +usuarioId; // Converte o usuarioId para número
    
        if (isNaN(usuarioIdNum)) {
            return res.status(400).json({ message: 'ID do usuário deve ser um número válido' });
        }
    
        if (!carrinhoId) {
            return res.status(400).json({ message: 'Carrinho ID não fornecido' });
        }
    
        // Verifique se carrinhoId é um número
        if (isNaN(+carrinhoId)) {
            return res.status(400).json({ message: 'O ID do carrinho deve ser um número' });
        }
    
        // Buscar o usuário pelo 'usuarioId' com a conversão para número
        const usuario = await AppDataSource.getRepository(Usuario).findOne({
            where: { idUsuario: usuarioIdNum }, // Agora, 'idUsuario' é um número
        });
    
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
    
        const carrinho = await AppDataSource.getRepository(Carrinho).findOne({
            where: {
                idCarrinho: +carrinhoId,  // Converte carrinhoId para número
                usuario: usuario,  // Passando a entidade Usuario, não o id diretamente
            },
            relations: ['usuario', 'pedidoProdutos'], // Relacionamentos que devem ser carregados
        });
    
        if (!carrinho) {
            return res.status(404).json({ message: 'Carrinho não encontrado' });
        }
    
        return res.status(200).json(carrinho);
    }
    
    public async finalizarCarrinho(req: Request, res: Response): Promise<Response> {
        const carrinhoId = req.body.carrinhoId;
        const tipoPagamento: TipoPagamento = req.body.tipoPagamento; // Tipo de pagamento pode ser passado no corpo da requisição
        
        // Buscar o carrinho e as suas relações
        const carrinho = await AppDataSource.getRepository(Carrinho).findOne({
            where: { idCarrinho: carrinhoId },  // Buscar pelo ID do carrinho
            relations: ['pedidoProdutos', 'usuario']  // Carregar as relações necessárias
        });
    
        if (!carrinho) {
            return res.status(404).json({ message: 'Carrinho não encontrado' });
        }
    
        // Criar o pedido a partir do carrinho
        const pedido = new Pedido();
        pedido.status = 'pendente'; // Status inicial do pedido
        pedido.tipo_pagamento = tipoPagamento;
        pedido.usuario = carrinho.usuario;
        
        const pedidoSalvo = await AppDataSource.getRepository(Pedido).save(pedido);
    
        // Associar os produtos do carrinho ao pedido
        for (const pedidoProduto of carrinho.pedidoProdutos) {
            pedidoProduto.pedido = pedidoSalvo;
            pedidoProduto.status = 'pedido';
          }
          
          // Salvar todos os produtos do carrinho de uma vez
        await AppDataSource.getRepository(PedidoProduto).save(carrinho.pedidoProdutos);
    
        // Atualiza o status do carrinho para 'finalizado'
        carrinho.status = 'finalizado';
        await AppDataSource.getRepository(Carrinho).save(carrinho);
    
        return res.status(200).json({ message: 'Carrinho finalizado e convertido em pedido', pedido: pedidoSalvo });
    }
    
}

export const carrinhoController = new CarrinhoController(); // Instância única
