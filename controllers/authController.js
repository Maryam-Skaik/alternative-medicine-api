const { User } = require('../models')
const createError = require('http-errors')
const jwt = require('jsonwebtoken');

const login = (req, res, next) => {
    User.login(req.body)
        .then(result => {
            if(result.status){
                //generate token
                const jwtSecretKey = process.env.JWT_SECRET;
                const token = jwt.sign({
                    _id: result.data._id
                }, jwtSecretKey);

            return returnJson(res, 200, true, 'Login successful', { token: token });

            }else{
                return next(createError(result.code, result.message))
            }
        })
        .catch(err => {
            return next(createError(500, err.message))
        })
}

const logout = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ status: false, message: 'Token missing' });
    }

    User.logout(token)
        .then(() => {
            res.status(200).json({
                status: true,
                message: 'Logged out successfully'
            });
        })
        .catch(err => {
            next(createError(500, 'Logout failed: ' + err.message));
        });
};

module.exports = {
    login, logout
}