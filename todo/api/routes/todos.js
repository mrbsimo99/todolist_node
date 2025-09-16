const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todos');
const { authUser } = require('../../middleware/auth');

router.use(authUser());

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.post('/:id/status', todoController.changeStatus);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
