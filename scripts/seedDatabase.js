var db = require('../models');

async function seedStatuses() {
    const statuses = [
        { status: 'Not Started' },
        { status: 'Started' },
        { status: 'Completed' },
        { status: 'Deleted' }
    ];

    const existingStatuses = await db.Status.count();
    if (existingStatuses === 0) {
        await db.Status.bulkCreate(statuses);
        console.log('Statuses have been seeded');
    } else {
        console.log('Statuses are already seeded');
    }
}

module.exports = seedStatuses;