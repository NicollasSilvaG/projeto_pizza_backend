import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('cupom')  // Especifica que a entidade corresponde à tabela 'cupom'
export class Cupom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigo: string;

    @Column("decimal", { precision: 5, scale: 2 })
    porcentagem_desconto: number;

    @Column()
    quantidade: number;

    @Column()
    data_inicio: Date;

    @Column()
    data_fim: Date;
}
