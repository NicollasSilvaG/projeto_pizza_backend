import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from "./Usuario";
import { Cupom } from './Cupom';
import { Entrega } from './Entrega';
import { Produto } from './Produto';
import { PedidoProduto } from './PedidoProduto'; // Importando a entidade PedidoProduto

export enum TipoPagamento {
    DINHEIRO = "dinheiro",
    PIX = "pix",
    DEBITO = "debito",
    CREDITO = "credito"
}

@Entity('pedido')
export class Pedido {
    @PrimaryGeneratedColumn()
    idPedido: number;

    @Column({ type: 'varchar', length: 100})
    status: string;
  
    @ManyToOne(() => Entrega, (entrega) => entrega.pedidos, { nullable: true })
    @JoinColumn({ name: "idEntrega" })
    entrega: Entrega;

    @Column({
        type: 'enum',
        enum: TipoPagamento
    })
    tipo_pagamento: TipoPagamento;

    @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
    @JoinColumn({ name: "idUsuario" })
    usuario: Usuario;

    // Relacionamento um-para-muitos com PedidoProduto (tabela de junção)
    @OneToMany(() => PedidoProduto, (pedidoProduto) => pedidoProduto.pedido)
    pedidoProdutos: PedidoProduto[];

    // Caso precise acessar os produtos diretamente, pode usar a relação reversa
    get produtos() {
        return this.pedidoProdutos.map(pp => pp.produto);
    }

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP', // Define o valor padrão como o horário atual
    })
    dataPedido: Date;
}
