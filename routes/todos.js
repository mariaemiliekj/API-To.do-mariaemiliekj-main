var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");

var TodoService = require("../services/TodoService");
var CategoryService = require("../services/CategoryService");
var StatusService = require('../services/StatusService');

var todoService = new TodoService(db);
var categoryService = new CategoryService(db);
var statusService = new StatusService(db);

const isAuth = require('../middleware/middleware');
router.use(jsend.middleware);



router.get('/', isAuth, async (req, res) => {
        // #swagger.tags = ['Todos']
        // #swagger.description = "Return all the logged in users todo's with the category associated with each todo and status that is not the deleted status."
        // #swagger.produces = ['text/html']
    const userId = req.user.id;

    try {
        const todos = await todoService.getAllExcludingDeleted(userId);

        res.jsend.success({ todos: todos });
    } catch (error) {
        console.error(error);
        res.status(500).jsend.error({ message: 'An error occurred while retrieving todos' + error.message});
    }
});


router.get('/all', isAuth, async (req, res) => {
    // #swagger.tags = ['Todos']
    // #swagger.description = "Return all the users todos including todos with a deleted status."
    // #swagger.produces = ['text/html']
    const userId = req.user.id; 

    try {
        const todos = await todoService.getAll(userId);

        res.jsend.success({ todos: todos });
    } catch (error) {
        console.error(error);
        res.status(500).jsend.error({ message: 'An error occurred while retrieving todos' + error.message});
    }
});




router.get('/deleted', isAuth, async (req, res) => {
    // #swagger.tags = ['Todos']
    // #swagger.description = "Return all the todos with the deleted status"
    // #swagger.produces = ['text/html']
    try {
        const userId = req.user.id;
        const deletedTodos = await todoService.getDeletedTodos(userId);

        if (deletedTodos) {
            res.jsend.success({
                statusCode: 200,
                message: 'Retrieved deleted todos successfully',
                data: deletedTodos
            });
        } else {
            res.jsend.fail({
                statusCode: 400,
                message: 'No deleted todos found'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).jsend.error({
            statusCode: 500,
            message: "Error retrieving deleted todos: " + error.message
        });
    }
});




router.post('/', isAuth, async (req, res) => {
    // #swagger.tags = ['Todos']
    // #swagger.description = "Endpoint to create a new todo with their category for the logged in user"
	/*	#swagger.parameters['obj'] = {
			in: 'body',
			description: 'Todo information.',
			required: true,
			schema: { 
			  $ref: "#/definitions/Todo" 
			} 
	} */
    const { name, description, categoryId, statusId } = req.body;

    if (!name || !description || !categoryId || !statusId) {
        return res.status(400).jsend.fail({ message: 'Missing required fields' });
    }
    try {
        const userId = req.user.id;
        const category = await categoryService.getCategoryByIdAndUser(categoryId, userId);

        if (!category) {
            return res.status(400).jsend.fail({ message: 'Invalid category ID' });
        }
        const todoData = {
            name,
            description,
            CategoryId: categoryId,
            StatusId: statusId,
            UserId: userId
        };
        const newTodo = await todoService.create(todoData);
        res.jsend.success({ message: 'New todo created successfully', todo: newTodo });

    } catch (error) {
        console.error(error);
        res.status(500).jsend.error({ message: 'An error occurred while creating the todo' + error.message });
    }
});




router.get('/statuses', async (req, res) => {
    // #swagger.tags = ['Todos']
    // #swagger.description = "Return all the statuses from the database"
    // #swagger.produces = ['text/html']
    try {
        const statuses = await statusService.getAllStatuses();

        res.jsend.success({
            statusCode: 200,
            message: 'Statuses retrieved successfully',
            data: statuses
        });
    } catch (error) {
        console.error(error);
        res.status(500).jsend.error({
            statusCode: 500,
            message: "Error retrieving statuses: " + error.message
        });
    }
});



router.put('/:id', isAuth, async (req, res) => {
    // #swagger.tags = ['Todos']
    // #swagger.description = "Endpoint to Change/update a specific todo for logged in user"
	/*	#swagger.parameters['obj'] = {
			in: 'body',
			description: 'Todo example.',
			required: true,
			schema: { 
			  $ref: "#/definitions/TodoEdit" 
			} 
	} */
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description, categoryId, statusId } = req.body;

    if (!name || !description || !categoryId || !statusId) {
        return res.status(400).jsend.fail({ message: 'Missing required fields' });
    }

    try {
        const todo = await todoService.getOne(id);
        if (!todo || todo.UserId !== userId) {
            return res.status(404).jsend.fail({ message: 'Todo not found or you do not have permission to update it' });
        }

        const updateData = {
            name,
            description,
            CategoryId: categoryId, 
            StatusId: statusId
        };

        await todoService.update(id, updateData);

        res.jsend.success({ message: 'Todo updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).jsend.error({ message: 'An error occurred while updating the todo' + error.message});
    }
});





router.delete('/:id', isAuth, async (req, res) => {
    // #swagger.tags = ['Todos']
    // #swagger.description = "Endpoint to delete a specific todo for the logged in user"
    const todoId = req.params.id;
    const userId = req.user.id;

    try {
        const todo = await todoService.getOne(todoId);
        if (!todo) {
            return res.status(404).jsend.fail({ message: 'Todo not found' });
        }

        if (todo.UserId !== userId) {
            return res.status(403).jsend.fail({ message: 'Not authorized to delete this todo' });
        }

        const deletedStatusId = 4;
        await todoService.update(todoId, { StatusId: deletedStatusId });

        res.jsend.success({ message: 'Todo marked as deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).jsend.error({ message: 'An error occurred while deleting the todo' });
    }
});



module.exports = router;

