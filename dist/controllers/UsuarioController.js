import { Usuario } from "../entities/Usuario";
import { dataSource } from "../db/typeorm";
const usuarioRepository = dataSource.getRepository(Usuario);
export class UsuarioController {
    static async create(req, res) {
        const { nome, email, telefone, rua, cidade, uf, cep, bairro, complemento, permissao } = req.body;
        const usuario = usuarioRepository.create({ nome, email, telefone, rua, cidade, uf, cep, bairro, complemento, permissao });
        try {
            await usuarioRepository.save(usuario);
            return res.status(201).json(usuario);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro ao criar usuário!", error });
        }
    }
    static async getAll(req, res) {
        const usuarioRepository = dataSource.getRepository(Usuario);
        const usuarios = await usuarioRepository.find();
        return res.json(usuarios);
    }
}
export default UsuarioController;
