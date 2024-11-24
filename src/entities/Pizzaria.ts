import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pizzaria')
export class Pizzaria {
  @PrimaryGeneratedColumn()
  idPizzaria: number;

  @Column({ type: 'varchar', length: 45 })
  nome_fantasia: string;

  @Column({ type: 'varchar', length: 45 })
  cpnj: string;

  @Column({ type: 'varchar', length: 45 })
  rua: string;

  @Column({ type: 'varchar', length: 45 })
  bairro: string;

  @Column({ type: 'varchar', length: 45 })
  cidade: string;

  @Column({ type: 'varchar', length: 45 })
  cep: string;

  @Column({ type: 'varchar', length: 45 })
  uf: string;

  @Column({ type: 'varchar', length: 45 })
  razao_social: string;

  @Column({ type: 'varchar', length: 45 })
  horarioFuncionamento: string;
}
