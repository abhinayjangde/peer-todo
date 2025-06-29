import express from 'express';
import {
    createTodo,
    deleteTodo,
    getAllTodos,
    getTodoById,
    getTodosByUser,
    toggleTodoCompletion,
    updateTodo,
} from '../controllers/todo.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create-todo', isLoggedIn, createTodo);
router.get('/get-todos', isLoggedIn, getAllTodos);
router.delete('/delete-todo/:id', isLoggedIn, deleteTodo);
router.put('/update-todo/:id', isLoggedIn, updateTodo);
router.get('/get-todo/:id', isLoggedIn, getTodoById);
router.get('/get-todos-by-user', isLoggedIn, getTodosByUser);
router.put('/toggle-todo/:id', isLoggedIn, toggleTodoCompletion);

export default router;
