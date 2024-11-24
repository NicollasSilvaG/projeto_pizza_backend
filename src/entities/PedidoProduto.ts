import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Produto } from './Produto'; 
import { Pedido } from './Pedido'; 
import { Cupom } from './Cupom';
import { Carrinho } from './Carrinho'; // Importar a entidade Cupom

@Entity('pedido_e_produto')
export class PedidoProduto {
    @PrimaryGeneratedColumn()
    idPedidoProduto: number;

    @ManyToOne(() => Pedido)
    @JoinColumn({ name: 'idPedido' })
    pedido: Pedido;

    @ManyToOne(() => Produto)
    @JoinColumn({ name: 'idProduto' })
    produto: Produto;
    
    @ManyToOne(() => Cupom, cupom => cupom.pedidoProdutos, { nullable: true }) // Relacionamento com Cupom
    @JoinColumn({ name: 'idCupom' }) // Nome do campo de chave estrangeira
    cupom: Cupom;

    @Column('int', { default: 1 })
    quantidade: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: false })
    precoUnitario: number;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    desconto: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: false })
    valorTotal: number;

    @Column('varchar', { length: 255, nullable: true })
    observacoes: string;

    @ManyToOne(() => Carrinho, carrinho => carrinho.pedidoProdutos)
    @JoinColumn({ name: 'idCarrinho' })
    carrinho: Carrinho;  ;

    @Column({
        type: 'enum',
        enum: ['carrinho', 'pedido'],
        default: 'carrinho'
    })
    status: 'carrinho' | 'pedido';
}
