import { Router } from 'express';
import { AppDataSource } from '../../data-source';
import cors from 'cors';  // Importando o CORS
import { AuthController } from '../../controllers/AuthController';
import { cadastrarUsuario, loginUsuario, buscarUsuarios, buscarUsuarioPorId, deletarUsuario, atualizarUsuario} from '../../controllers/UsuarioController';
import ProdutoController from '../../controllers/ProdutoController';
import PedidoController from '../../controllers/PedidoController'; 
import PedidoProdutoController from '../../controllers/PedidoProdutoController';// Verifique o caminho
import { Pedido } from '../../entities/Pedido';
import CupomController  from '../../controllers/CupomController';
import EntregaController  from '../../controllers/EntregaController';
import CategoriaController from '../../controllers/CategoriaController';
import upload from '../../controllers/uploadService';
import { PizzariaController } from '../../controllers/PizzariaController';
import { carrinhoController } from '../../controllers/CarrinhoController';


const router = Router();
const authController = new AuthController();

router.use(cors()); 

// Rota para cadastro de usuário com async/await
router.post('/cadastrar', async (req, res) => {
  try {
    await authController.cadastrar(req, res);
  } catch (error) { 
    res.status(500).json({ error: 'Erro no processamento da requisição' });
  }
});

// Rota para login de usuário com async/await
router.post('/login', async (req, res) => {
  try {
    await authController.login(req, res);  // Corrigido para chamar o método de login
  } catch (error) {
    res.status(500).json({ error: 'Erro no processamento da requisição' });
  }
});

router.get('/usuariosAdmin', authController.buscarAdmin);
router.get('/usuariosAdmin/:id', authController.buscarPorIdAdmin);
router.put('/usuariosAdmin/:id', authController.atualizarAdmin);
router.delete('/usuariosAdmin/:id', authController.deletarAdmin);

router.post('/cadastro', async (req, res) => {
  try {
    await cadastrarUsuario(req, res);  // Usando a função cadastrarUsuario diretamente

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no processamento da requisição', details: error});
  }
});

router.post('/loginuser', async (req, res) => {
  try {
    await loginUsuario(req, res);  // Usando a função cadastrarUsuario diretamente

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no processamento da requisição', details: error});
  }
});

router.get('/usuarios', buscarUsuarios);
router.get('/usuarios/:id', buscarUsuarioPorId);
router.delete('/usuarios/:id', deletarUsuario);
router.put('/usuarios/:id', atualizarUsuario);

router.post('/produto', upload.single('imagem'), async (req, res) => {
  try {
    await ProdutoController.create(req, res);  // Usando o ProdutoController para criar um produto
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o produto', details: error });
  }
});

// Rota para listar todos os produtos
router.get('/produtos', async (req, res) => {
  try {
    await ProdutoController.findAll(req, res);  // Usando o ProdutoController para listar produtos
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar produtos', details: error });
  }
});

// Rota para buscar um produto específico pelo ID
router.get('/produto/:idProduto', async (req, res) => {
  try {
    await ProdutoController.findOne(req, res);  // Usando o ProdutoController para buscar um produto pelo ID
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produto', details: error });
  }
});

router.post('/pedido', async (req, res) => {
  try {
    await PedidoController.criarPedido(req, res);  // Usando o PedidoController para criar um pedido
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o pedido', details: error });
  }
});

// Rota para listar todos os pedidos
router.get('/pedidos', async (req, res) => {
  try {
    await PedidoController.buscarTodosPedidos(req, res);  // Usando o PedidoController para listar pedidos
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar pedidos', details: error });
  }
});

router.get('/pedido/:idPedido', async (req, res) => {
  try {
    await PedidoController.buscarTodosPedidos(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar pedido', details: error });
  }
});

router.post('/pedido-produto', async (req, res) => {
  const { idPedido, produtos } = req.body; 

  if (!idPedido || !produtos || produtos.length === 0) {
    return res.status(400).json({ error: 'idPedido e produtos são obrigatórios.' });
  }

  try {
    const pedido = await AppDataSource.getRepository(Pedido).findOneBy({ idPedido });

    if (!pedido) {
      return res.status(404).json({ error: `Pedido com id ${idPedido} não encontrado.` });
    }

    // Agora passando os dados necessários diretamente para o controller
    await PedidoProdutoController.adicionarProdutosAoPedido(pedido.idPedido, produtos); // Passando o idPedido (número)

    res.status(201).json({ message: 'Produtos associados ao pedido com sucesso.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao associar produto ao pedido', details: error });
  }
});

router.get('/carrinho/:idPedido', async (req, res) => {
  try {
    const idPedido = parseInt(req.params.idPedido, 10);
    const produtos = await PedidoProdutoController.buscarCarrinho(idPedido);
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
router.delete('/carrinho/:idPedido/removerall', async (req, res) => {
  const { idPedido } = req.params;

  try {
    // Chama o método para remover todos os produtos do pedido
    await PedidoProdutoController.removerTodosProdutosDoCarrinho(Number(idPedido));
    return res.status(200).json({ message: `Todos os produtos foram removidos do carrinho do pedido com ID ${idPedido}.` });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

/*router.delete('/carrinho/:idPedido/produto/:idProduto', async (req, res) => {
  const { idPedido, idProduto } = req.params;

  try {
    // Chama o método para remover um produto específico
    await PedidoProdutoController.removerProdutoDoCarrinho(Number(idPedido), Number(idProduto));
    return res.status(200).json({ message: `Produto com ID ${idProduto} removido do carrinho com sucesso.` });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});*/



router.post('/cupom', CupomController.criarCupom);

// Rota para buscar todos os cupons
router.get('/cupons', CupomController.buscarCupons);

// Rota para buscar um cupom pelo id
router.get('/cupom/:idCupom', CupomController.buscarCupomPorId);

// Rota para atualizar um cupom
router.put('/cupom/:idCupom', CupomController.atualizarCupom);

router.delete('/cupom/:idCupom', CupomController.deletarCupom);

router.post('/aplicar-cupom', CupomController.aplicarCupom);

router.post('/entrega', EntregaController.criarEntrega);

// Rota para buscar todas as entregas
router.get('/entregas', EntregaController.buscarEntregas);

// Rota para buscar uma entrega pelo id
router.get('/entrega/:idEntrega', EntregaController.buscarEntregaPorId);

// Rota para atualizar uma entrega
router.put('/entrega/:idEntrega', EntregaController.atualizarEntrega);

// Rota para deletar uma entrega
router.delete('/entrega/:idEntrega', EntregaController.deletarEntrega);

router.post('/categoria', CategoriaController.criarCategoria);

// Rota para buscar todas as categorias
router.get('/categorias', CategoriaController.buscarCategorias);

// Rota para buscar uma categoria pelo ID
router.get('/categoria/:idCategoria', CategoriaController.buscarCategoriaPorId);

// Rota para atualizar uma categoria pelo ID
router.put('/categoria/:idCategoria', CategoriaController.atualizarCategoria);

// Rota para deletar uma categoria pelo ID
router.delete('/categoria/:idCategoria', CategoriaController.deletarCategoria);

router.post('/pizzaria', PizzariaController.create);

router.get('/pizzarias', PizzariaController.buscarTodasPizzarias);

router.post('/carrinhos/criar', carrinhoController.criarCarrinho);

router.post('/carrinho/adicionar', carrinhoController.adicionarProdutoAoCarrinho);

router.get('/carrinho/consultar/:usuarioId', carrinhoController.consultarCarrinho);

router.post('/carrinho/finalizar', carrinhoController.finalizarCarrinho);


export default router;

