const Joi = require("joi");
const { outErrors } = require("../../db"); // Prende outErrors dal file index.js della cartella db
const Todo = require("../../db/models/Todo");

/**
 * Todo dell'utente loggato
 * @param {Request} req 
 * @param {Response} res 
 */
const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user._id }).lean();
        return res.status(200).json({ success: true, data: todos });
    } catch (error) {
        return outErrors(res, error);
    }
};

/**
 * Creare nuovo Todo
 * @param {Request} req 
 * @param {Response} res 
 */
const createTodo = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const todo = await new Todo({
            userId: req.user._id,
            ...data,
        }).save();

        return res.status(201).json({ success: true, data: todo.toObject() });
    } catch (error) {
        return outErrors(res, error);
    }
};

/**
 * Update todo by id
 * @param {Request} req 
 * @param {Response} res 
 */
const updateTodo = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            data,
            { new: true, lean: true }
        );

        if (!todo) return res.status(404).json({ success: false, error: "ToDo non trovato" });

        return res.status(200).json({ success: true, data: todo });
    } catch (error) {
        return outErrors(res, error);
    }
};

/**
 * Cambiare status Todo
 * @param {Request} req 
 * @param {Response} res 
 */
const changeStatus = async (req, res) => {
    const schema = Joi.object({
        completed: Joi.boolean().required(),
    });

    try {
        const { completed } = await schema.validateAsync(req.body);

        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { completed },
            { new: true, lean: true }
        );

        if (!todo) return res.status(404).json({ success: false, error: "ToDo non trovato" });

        return res.status(200).json({ success: true, data: todo });
    } catch (error) {
        return outErrors(res, error);
    }
};

/**
 * Delete todo by id
 * @param {Request} req 
 * @param {Response} res 
 */
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!todo) return res.status(404).json({ success: false, error: "ToDo non trovato" });

        return res.status(200).json({ success: true, message: "ToDo eliminato" });
    } catch (error) {
        return outErrors(res, error);
    }
};

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    changeStatus,
    deleteTodo,
};
