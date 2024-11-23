import { Request, Response } from "express";
import { AppDataSource } from "../data-source";  // Importe o DataSource
import { Usuario } from "../entities/Usuario";   // Importe a entidade Usuario
import bcrypt from "bcrypt"; 
import jwt from 'jsonwebtoken';

const SECRET_KEY = "seu_secret_key"; // Use uma chave secreta segura para o JWT

export const cadastrarUsuario = async (req: Request, res: Response) => {
    const { nome, email, senha, telefone, rua, cidade, uf, cep, bairro, complemento } = req.body;

    // Validação básica dos campos
    if (!nome || !email || !senha || !telefone) {
        return res.status(400).json({ error: "Nome, email, senha e telefone são obrigatórios." });
    }

    const usuarioRepository = AppDataSource.getRepository(Usuario); // Use o DataSource aqui

    try {
        // Verificar se o usuário já existe
        const usuarioExistente = await usuarioRepository.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: "Este email já está cadastrado." });
        }

        // Criar um novo objeto de usuário
        const usuario = new Usuario();
        usuario.nome = nome;
        usuario.email = email;

        // Hash da senha antes de salvar
        const hashedSenha = await bcrypt.hash(senha, 10);
        usuario.senha = hashedSenha;

        // Informações adicionais
        usuario.telefone = telefone;
        usuario.rua = rua;
        usuario.cidade = cidade;
        usuario.uf = uf;
        usuario.cep = cep;
        usuario.bairro = bairro;
        usuario.complemento = complemento;

        // Salvar no banco de dados
        await usuarioRepository.save(usuario);

        return res.status(201).json({ message: "Usuário cadastrado com sucesso" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao cadastrar o usuário", details: error});
    }
};
export const loginUsuario = async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const usuarioRepository = AppDataSource.getRepository(Usuario);

    try {
        const usuario = await usuarioRepository.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ error: "Usuário não encontrado." });
        }

        const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Senha incorreta." });
        }

        // Gerar o token JWT
        const token = jwt.sign({ id: usuario.idUsuario, email: usuario.email }, SECRET_KEY, { expiresIn: "1h" });

        return res.status(200).json({ message: "Login realizado com sucesso", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao realizar o login", details: error });
    }
};

export const buscarUsuarios = async (req: Request, res: Response) => {
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    try {
        const usuarios = await usuarioRepository.find();
        return res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar os usuários", details: error });
    }
};

export const buscarUsuarioPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    try {
        const usuario = await usuarioRepository.findOne({ where: { idUsuario: parseInt(id, 10) } });
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar o usuário", details: error });
    }
};

export const deletarUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    try {
        const usuario = await usuarioRepository.findOne({ where: { idUsuario: parseInt(id, 10) } });
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        await usuarioRepository.delete(usuario.idUsuario);
        return res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao deletar o usuário", details: error });
    }
};

export const atualizarUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, email, senha, telefone, rua, cidade, uf, cep, bairro, complemento } = req.body;
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    try {
        const usuario = await usuarioRepository.findOne({ where: { idUsuario: parseInt(id, 10) } });
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Atualizar campos somente se enviados no corpo da requisição
        if (nome) usuario.nome = nome;
        if (email) usuario.email = email;
        if (senha) {
            const hashedSenha = await bcrypt.hash(senha, 10);
            usuario.senha = hashedSenha;
        }
        if (telefone) usuario.telefone = telefone;
        if (rua) usuario.rua = rua;
        if (cidade) usuario.cidade = cidade;
        if (uf) usuario.uf = uf;
        if (cep) usuario.cep = cep;
        if (bairro) usuario.bairro = bairro;
        if (complemento) usuario.complemento = complemento;

        await usuarioRepository.save(usuario);
        return res.status(200).json({ message: "Usuário atualizado com sucesso", usuario });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao atualizar o usuário", details: error });
    }
};


