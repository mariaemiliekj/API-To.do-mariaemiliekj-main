var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");

var CategoryService = require("../services/CategoryService");
var categoryService = new CategoryService(db);

const isAuth = require('../middleware/middleware');

router.use(jsend.middleware);


// Get all categories for the logged-in user
router.get('/', isAuth, async (req, res) => {
      // #swagger.tags = ['Category']
      // #swagger.description = "Get all categories for the logged-in user."
      // #swagger.produces = ['text/html']
    const userId = req.user.id; 
    try {
        const categories = await categoryService.getAll(userId); 
        res.jsend.success({ 
            statusCode: 200, 
            result: categories
        });
    } catch (error) {
        console.error(error);
        res.status(500).jsend.error({
            statusCode: 500,
            message: "Error retrieving categories. " + error.message
        });
    }
});



// Create a new category
router.post('/', isAuth, async (req, res) => {
    // #swagger.tags = ['Category']
	// #swagger.description = "Endpoint to create a new category"
	/*	#swagger.parameters['obj'] = {
			in: 'body',
			description: 'Category example.',
			required: true,
			schema: { 
			  $ref: "#/definitions/Category" 
			} 
	} */
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).jsend.fail({
            statusCode: 400,
            message: 'Category name is required'
        });
    }

    try {
        const newCategory = await categoryService.create({ name, UserId: userId });
        res.jsend.success({ 
            statusCode: 200, 
            result: { message: 'Category created', category: newCategory }
        });
    } catch (error) {
        console.error(error); 
        res.status(500).jsend.error({
            statusCode: 500,
            message: "Error creating category: " + error.message
        });
    }
});




// Edit a category
router.put('/:id', isAuth, async (req, res) => {
    // #swagger.tags = ['Category']
    // #swagger.description = "Endpoint to edit a category"
	/*	#swagger.parameters['obj'] = {
			in: 'body',
			description: 'Category example.',
			required: true,
			schema: { 
			  $ref: "#/definitions/CategoryEdit" 
			} 
	} */
    const userId = req.user.id;
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).jsend.fail({
            statusCode: 400,
            message: 'New category name is required'
        });
    }

    try {
        const category = await categoryService.getCategoryByIdAndUser(id, userId);
        if (category) {
            await categoryService.update(id, name);
            res.jsend.success({
                statusCode: 200,
                message: 'Category updated'
            });
        } else {
            res.status(404).jsend.fail({
                statusCode: 404,
                message: 'Category not found or you do not have permission to update it'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).jsend.error({
            statusCode: 500,
            message: "Error updating category: " + error.message
        });
    }
});



// Delete a category
router.delete('/:id', isAuth, async (req, res) => {
    // #swagger.tags = ['Category']
    // #swagger.description = "Endpoint to delete a category"
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const category = await categoryService.getCategoryByIdAndUser(id, userId);
        if (category) {
            await categoryService.delete(id);
            res.jsend.success({
                statusCode: 200,
                message: 'Category deleted'
            });
        } else {
            res.status(404).jsend.fail({
                statusCode: 404,
                message: 'Category not found or you do not have permission to delete it'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).jsend.error({
            statusCode: 500,
            message: "Error deleting category: " + error.message
        });
    }
});

module.exports = router;
