// src/entity/Produto.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Categoria } from './Categoria';
import { Pedido } from './Pedido'; // Importar a entidade Pedido

@Entity('produto')
export class Produto {
    @PrimaryGeneratedColumn({ name: 'idProduto' }) // Aqui você pode mapear explicitamente a coluna para `idProduto`
    idProduto: number;

    @Column({ type: 'varchar', length: 45 })
    nome: string;   

    @Column({ type: 'int' })
    quantidade: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    preco: number;

    @Column({ type: 'varchar', length: 200 })
    descricao: string;

    @Column({ type: 'varchar', length: 45 })
    tamanho: string;

    @ManyToOne(() => Categoria)
    @JoinColumn({ name: 'categoria_idCategoria' })
    categoria: Categoria;
}