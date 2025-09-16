const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todos');
const { authUser } = require('../../middleware/auth');

router.use(authUser());

router.get('/todos', todoController.getTodos);
router.post('/todos', todoController.createTodo);
router.put('/todos/:id', todoController.updateTodo);
router.post('/todos/:id/status', todoController.changeStatus);
router.delete('/todos/:id', todoController.deleteTodo);

module.exports = router;
