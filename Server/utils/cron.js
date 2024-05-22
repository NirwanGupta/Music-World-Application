const cron = require('node-cron');
const User = require('../models/User');
const { updateUserProfile } = require('../controllers/songController');

const task = cron.schedule('0 0 * * *', async () => {
    try {
        const users = await User.find({}).select('_id');
        for (const user of users) { // Corrected for-loop
            console.log(`Updating profile for user: ${user._id}`);
            await updateUserProfile(user._id);
        }
        console.log('User profiles updated successfully');
    } catch (error) {
        console.error('Error updating user profiles:', error);
    }
});

module.exports = task;
