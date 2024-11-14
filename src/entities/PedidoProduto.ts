import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Produto } from './Produto'; 
import { Pedido } from './Pedido'; 

@Entity('pedido_e_produto')
export class PedidoProduto {
    @PrimaryGeneratedColumn() // Adicionando a coluna primária
    idPedidoProduto: number;

    @ManyToOne(() => Pedido)
    @JoinColumn({ name: 'idPedido' })
    pedido: Pedido;

    @ManyToOne(() => Produto)
    @JoinColumn({ name: 'idProduto' })
    produto: Produto;

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
}
