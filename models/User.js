const { dbConnection } = require('../configurations');
const { compareSync } = require('bcrypt')
const { loginValidator } = require('../validators');

class User {

    constructor(userData) {
        this.userData = userData;
    }

    static login(loginData){
        return new Promise((resolve, reject) => {
            const validation = loginValidator.validate(loginData);
            if(validation.error){
                return resolve({
                    status: false,
                    message: validation.error.message,
                    code: 400
                });
            }

            dbConnection('users', async (collection) => {
                try{
                    const user = await collection.findOne({ username: loginData.username });
                    if(!user || !compareSync(loginData.password, user.password)){
                        resolve({
                            status: false,
                            message: 'Invalid username or password',
                            code: 401
                        })
                    }

                    return resolve({
                        status: true,
                        data: user
                    });
                }catch(err){
                    reject({
                        status: false,
                        message: err.message
                    })
                }
            })
        })
    }

    static logout(token) {
        return new Promise((resolve, reject) => {
            dbConnection('blacklisted_tokens', async (collection) => {
                try {
                    await collection.insertOne({ token, createdAt: new Date() });
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
}

module.exports = User;