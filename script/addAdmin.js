require('dotenv').config();
const { dbConnection } = require('../configurations');
const { hashSync } = require('bcrypt');

const adminData = {
    name: 'Admin Name',
    email: 'admin@example.com',
    username: 'admin',
    password: hashSync('AdminPassword123', 10)
};

dbConnection('users', async (collection) => {
    try {
        const exists = await collection.findOne({ username: adminData.username });
        if (exists) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const result = await collection.insertOne(adminData);
        console.log('Admin user created with ID:', result.insertedId);
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
});