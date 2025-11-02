const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if(!authHeader){
        return next(createError(401, 'Authorization header not found'));
    }

    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET;

    
    try{
        const decode = jwt.verify(token, secretKey);
        req._user_id = decode._id;
        req._reviewer_id = decode._reviewer_id;
        next();
    }catch(err){
        return next(createError(401, 'Invalid token'));
    }
}