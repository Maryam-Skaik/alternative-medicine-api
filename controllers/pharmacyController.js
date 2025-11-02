const { Pharmacy } = require('../models');
const createError = require('http-errors');
const { ObjectId } = require('bson');
const { returnJson } = require('../my_modules/json_response');
const { dbConnection } = require('../configurations');

const getPharmacies = (req, res, next) =>{
    const pageNum = parseInt(req.query.page);

    if(isNaN(pageNum)){
        res.status(400).json({
            status: false,
            message: "You should send a page number"
        })
    }

    const limit = 2;
    const skip = (pageNum - 1) * limit;

    dbConnection('pharmacies', async (collection) => {
        const pharmacies = await collection.find({}).limit(limit).skip(skip).toArray();

        return returnJson(res, 200, true, '', pharmacies);
    })
}

const getPharmaciesPageCount = (req, res, next) => {
    dbConnection('pharmacies', async (collection) => {
        const limit = 2;
        const count = await collection.count({});
        const pages = Math.ceil(count/limit);

        res.json({
            "pages": pages
        });
    })
}

const getPharmacyById = (req, res, next) => {
    if(!ObjectId.isValid(req.params.id)){
        const error = createError(400, 'Id is not valid')
        return next(error);
    }

    const _id = new ObjectId(req.params.id);

    Pharmacy.getOne(_id)
        .then(result => {
            if (!result.status) {
                return next(createError(404, result.message));
            }

            const pharmacy = result.data;

            if(!pharmacy){
                const error = createError(404, 'Pharmacy not found');
                return next(error);
            }

            res.json({
                "pharmacy": pharmacy
            })
        })
        .catch(err => next(createError(500, err.message)));
}

const add = (req, res, next) => {
    const pharmacyData = req.body;

    const validation = Pharmacy.validate(pharmacyData);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    const pharmacy = new Pharmacy(pharmacyData);

    pharmacy.save((result) => {
        if (result.status) {
            return returnJson(res, 200, true, result.message, pharmacy.pharmacyData);
        } else {
            return next(createError(500, result.message));
        }
    });
};

const update = (req, res, next) => {
    const _id = new ObjectId(req.params.id);
    const data = req.body;

    const validation = Pharmacy.validate(data);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    Pharmacy.update(_id, data, (result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, result.message, null);
    });
};

const remove = (req, res, next) => {
    const _id = new ObjectId(req.params.id);

    Pharmacy.remove(_id, (result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, result.message, null);
    });
};

module.exports = {
    getPharmacies, getPharmaciesPageCount, getPharmacyById, add, update, remove
}