import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Autenticacao } from '../entities/Autenticacao';
import { AppDataSource } from '../data-source';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-jwt-aqui';

export class AuthController {
  // Método para cadastro
  async cadastrar(req: Request, res: Response): Promise<Response> {
    const { nome, login, senha } = req.body;

    // Valida se os campos estão preenchidos
    if (!nome || !login || !senha) {
      return res.status(400).json({ error: 'Nome, login e senha são obrigatórios.' });
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    console.log("Senha criptografada:", senhaCriptografada); 

    const usuario = new Autenticacao();
    usuario.nome = nome;
    usuario.login = login;
    usuario.senha = senhaCriptografada;
try {
  const usuarioRepository = AppDataSource.getRepository(Autenticacao);
  await usuarioRepository.save(usuario);

  return res.status(201).json({
    message: 'Usuário cadastrado com sucesso!',
    usuario: { nome: usuario.nome, login: usuario.login },
  });
} catch (error) {
  console.error('Erro ao cadastrar usuário:', error); // Exibe o erro detalhado no console
  return res.status(500).json({ error: 'Erro ao cadastrar o usuário', details: error });
}
}
// Método para login
async login(req: Request, res: Response): Promise<Response> {
  const { login, senha } = req.body;

  // Valida se os campos estão preenchidos
  if (!login || !senha) {
    return res.status(400).json({ error: 'Login e senha são obrigatórios.' });
  }

  try {
    const usuarioRepository = AppDataSource.getRepository(Autenticacao);
    const usuario = await usuarioRepository.findOneBy({ login });

    // Verifica se o usuário existe
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Verifica se a senha é válida
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    console.log(`Senha fornecida: ${senha}`);
    console.log(`Senha armazenada (hash): ${usuario.senha}`);
    console.log(`Senha válida: ${senhaValida}`); // Isso deve ser true ou false

    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: usuario.idAutenticacao, login: usuario.login }, JWT_SECRET, {
      expiresIn: '1h', // Tempo de expiração do token
    });

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      login: usuario.login,
    });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return res.status(500).json({ error: 'Erro ao realizar login' });
  }
}
}
