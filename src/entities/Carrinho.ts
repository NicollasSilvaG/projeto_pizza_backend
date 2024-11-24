import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Column } from 'typeorm';
import { Usuario } from './Usuario';
import { PedidoProduto } from './PedidoProduto'; // Relacionamento com os produtos no carrinho

@Entity('carrinho')
export class Carrinho {
    @PrimaryGeneratedColumn()
    idCarrinho: number;

    @ManyToOne(() => Usuario, usuario => usuario.carrinhos)
    @JoinColumn({ name: 'idUsuario' })
    usuario: Usuario;

    @OneToMany(() => PedidoProduto, pedidoProduto => pedidoProduto.carrinho)
    pedidoProdutos: PedidoProduto[];

    @Column({
        type: 'enum',
        enum: ['ativo', 'finalizado'],
        default: 'ativo'
    })
    status: 'ativo' | 'finalizado';
}
