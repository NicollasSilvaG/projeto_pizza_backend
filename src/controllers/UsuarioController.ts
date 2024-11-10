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

