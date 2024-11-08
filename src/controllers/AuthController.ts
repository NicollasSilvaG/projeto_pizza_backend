import { Request, Response } from 'express';
import { Autenticacao } from '../entities/Autenticacao';  // Certifique-se de importar a entidade correta
import { AppDataSource } from '../data-source';  // Certifique-se de importar o AppDataSource corretamente

export class AuthController {
  async cadastrar(req: Request, res: Response) {
    const { nome, login, senha } = req.body;
    console.log('Dados recebidos:', { nome, login, senha });

    if (!nome || !login || !senha) {
      return res.status(400).json({ error: 'Nome, login e senha são obrigatórios.' });
    }

    // Criação de uma nova instância de Autenticacao
    const usuario = new Autenticacao();
    usuario.nome = nome;
    usuario.login = login;
    usuario.senha = senha;

    try {
      // Salva o usuário no banco de dados
      const usuarioRepository = AppDataSource.getRepository(Autenticacao);
      await usuarioRepository.save(usuario);

      res.status(200).json({
        message: 'Usuário cadastrado com sucesso!',
        usuario: { nome: usuario.nome, login: usuario.login }
      });
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      res.status(500).json({ error: 'Erro ao cadastrar o usuário' });
    }
  }
}
