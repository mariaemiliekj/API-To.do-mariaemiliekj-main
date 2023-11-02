class StatusService {
    constructor(db) {
        this.Status = db.Status;
    }

    // all statuses
    async getAllStatuses() {
        return await this.Status.findAll();
    }

}

module.exports = StatusService;
