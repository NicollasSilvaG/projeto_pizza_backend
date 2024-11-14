// src/entity/Pedido.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Usuario } from "./Usuario";
import { Cupom } from './Cupom';
import { Entrega } from './Entrega';
import { Produto } from './Produto';

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

    @Column({ type: 'varchar', length: 100, nullable: false })
    status: string;

    @ManyToOne(() => Cupom, (cupom) => cupom.pedidos, { nullable: true })
    @JoinColumn({ name: "idCupom" })
    cupom: Cupom;
  
    @ManyToOne(() => Entrega, (entrega) => entrega.pedidos, { nullable: true })
    @JoinColumn({ name: "idEntrega" })
    entrega: Entrega;

    @Column({
        type: 'enum',
        enum: TipoPagamento,
        nullable: false
    })
    tipo_pagamento: TipoPagamento;

    @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
    @JoinColumn({ name: "idUsuario" })
    usuario: Usuario;

    // Relacionamento muitos-para-muitos com Produtos
    @ManyToMany(() => Produto)
    @JoinTable({
        name: 'pedido_produto', // Nome da tabela de junção
        joinColumn: { name: 'idPedido', referencedColumnName: 'idPedido' }, // Referência para Pedido
        inverseJoinColumn: { name: 'idProduto', referencedColumnName: 'idProduto' } // Referência para Produto
    })
    produtos: Produto[];
}
