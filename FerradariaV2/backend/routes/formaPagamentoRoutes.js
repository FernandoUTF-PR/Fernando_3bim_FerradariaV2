const express = require('express');
const router = express.Router();
const formaPagamentoController = require('../controllers/formaPagamentoController');

// Rotas do CRUD de Unidades de Medida
router.get('/listar', formaPagamentoController.listarFormaPagamento);
router.get('/:id', formaPagamentoController.obterFormaPagamento);
router.post('/', formaPagamentoController.criarFormaPagamento);
router.put('/:id', formaPagamentoController.atualizarFormaPagamento);
router.delete('/:id', formaPagamentoController.deletarFormaPagamento);

module.exports = router;