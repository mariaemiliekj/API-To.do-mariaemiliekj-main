var express = require('express');
var router = express.Router();
var db = require("../models");
var StatusService = require("../services/StatusService");
var statusService = new StatusService(db);

// Route to retrieve all statuses
router.get('/', async (req, res) => {
      // #swagger.tags = ['Status']
      // #swagger.description = "Gets the list of all statuses."
      // #swagger.produces = ['text/html']
    try {
        const statuses = await statusService.getAllStatuses();
        res.json({ success: true, data: statuses });
    } catch (error) {
        console.error("An error occurred:", error); 
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
