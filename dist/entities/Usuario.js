var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
let Usuario = class Usuario {
    idUsuario;
    nome;
    email;
    telefone;
    rua;
    cidade;
    uf;
    cep;
    bairro;
    complemento;
    permissao;
};
__decorate([
    PrimaryGeneratedColumn()
], Usuario.prototype, "idUsuario", void 0);
__decorate([
    Column({ type: "varchar" })
], Usuario.prototype, "nome", void 0);
__decorate([
    Column({ type: "varchar", unique: true })
], Usuario.prototype, "email", void 0);
__decorate([
    Column({ type: "varchar", length: 11, nullable: true })
], Usuario.prototype, "telefone", void 0);
__decorate([
    Column({ type: "varchar", length: 45, nullable: true })
], Usuario.prototype, "rua", void 0);
__decorate([
    Column({ type: "varchar", length: 45, nullable: true })
], Usuario.prototype, "cidade", void 0);
__decorate([
    Column({ type: "varchar", length: 2, nullable: true })
], Usuario.prototype, "uf", void 0);
__decorate([
    Column({ type: "varchar", length: 45, nullable: true })
], Usuario.prototype, "cep", void 0);
__decorate([
    Column({ type: "varchar", length: 45, nullable: true })
], Usuario.prototype, "bairro", void 0);
__decorate([
    Column({ type: "varchar", length: 45, nullable: true })
], Usuario.prototype, "complemento", void 0);
__decorate([
    Column({ type: "varchar", length: 10, default: "cliente" })
], Usuario.prototype, "permissao", void 0);
Usuario = __decorate([
    Entity("usuario")
], Usuario);
export { Usuario };
