const { Op } = require('sequelize');

class TodoService {
    constructor(db) {
      this.client = db.sequelize;
      this.Todo = db.Todo;
      this.Category = db.Category;
      this.Status = db.Status;
    }


    async getAll(userId) {
        return await this.Todo.findAll({
            where: { UserId: userId },
            include: ['Category', 'Status']
        });
    }
    

    async getOne(id) {
        return this.Todo.findOne({
            where: { id: id }
        });
    }


    async create(todoData) {
        return await this.Todo.create(todoData);
    }


    async update(id, updatedData) {
        return await this.Todo.update(updatedData, {
            where: { id: id },
        });
    }


    async delete(id) {
        return await this.Todo.destroy({
            where: { id: id }
        });
    }


    async getDeletedTodos(userId) {
        return await this.Todo.findAll({
            where: { 
                UserId: userId,
                StatusId: 4,
            },
            include: ['Category', 'Status']
        });
    }
    

    async getAllExcludingDeleted(userId) {
        const deletedStatus = await this.Status.findOne({ where: { status: 'deleted' } });
        return await this.Todo.findAll({
            where: { 
                UserId: userId,
                StatusId: {
                    [Op.ne]: deletedStatus.id 
                }
            },
            include: ['Category', 'Status']
            
        });
    }
  }

  
  
  module.exports = TodoService;