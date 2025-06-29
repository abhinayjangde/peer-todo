import Todo from "../models/todo.model.js";


export const createTodo = async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const todo = await Todo.create({
            title,
            description,
            user: req.user.id // coming from auth middleware
        });

        return res.status(201).json({
            success: true,
            message: "Todo created successfully",
            todo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating todo",
            error: error.message
        });
    }
}

export const getAllTodos = async (req, res) => {
    const user = req.user; // coming from auth middleware
    try {
        // const todos = await Todo.find({ user: user.id }).populate('user', 'name email');
        const todos = await Todo.find({ user: user.id })
        return res.status(200).json({
            success: true,
            todos
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching todos",
            error: error.message
        });
    }
}

export const deleteTodo = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Todo ID is required"
        });
    }

    try {
        const todo = await Todo.findByIdAndDelete(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting todo",
            error: error.message
        });
    }
}

export const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!id || !title || !description) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const todo = await Todo.findByIdAndUpdate(id, { title, description }, { new: true });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            todo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating todo",
            error: error.message
        });
    }
}

export const getTodoById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Todo ID is required"
        });
    }

    try {
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        return res.status(200).json({
            success: true,
            todo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching todo",
            error: error.message
        });
    }
}

export const getTodosByUser = async (req, res) => {
    const userId = req.user.id; // coming from auth middleware

    try {
        const todos = await Todo.find({ user: userId });

        return res.status(200).json({
            success: true,
            todos
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching todos",
            error: error.message
        });
    }
}

export const toggleTodoCompletion = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Todo ID is required"
        });
    }

    try {
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        todo.completed = !todo.completed;
        await todo.save();

        return res.status(200).json({
            success: true,
            message: "Todo completion status updated",
            todo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error toggling todo completion",
            error: error.message
        });
    }
}
