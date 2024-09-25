const cron = require('node-cron');
const User = require('../models/User');
const updateRedisData = require('./updateRedisData');

// '*/2 * * * *' - > 2minutes
// '0 0 * * *' -> 12am

const cronTask = cron.schedule('0 0 * * *', async () => {
    try {
        const users = await User.find({}).select('_id');
        for (const user of users) { 
            console.log(`Updating profile for user: ${user._id}`);
            await updateRedisData(user._id);
        }
        console.log('User profiles updated successfully');
    } catch (error) {
        console.error('Error updating user profiles:', error);
    }
});

module.exports = cronTask;
