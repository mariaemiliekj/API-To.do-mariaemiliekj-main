class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
    }

    async getCategoryByIdAndUser(categoryId, userId) {
        return await this.Category.findOne({
            where: {
                id: categoryId,
                UserId: userId
            }
        });
    }


    async getAll(userId) {
        return await this.Category.findAll({ 
            where: { UserId: userId } 
        });
    }
    

    async create(categoryData) {
        return this.Category.create(categoryData);
    }
    

    async update(id, name) {
		return this.Category.update({ name }, { where: { id } })
	}

    async delete(id) {
        return await this.Category.destroy({
            where: {
                id: id,
          },
        });
    }
}

module.exports = CategoryService;
