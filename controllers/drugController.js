const { Drug } = require('../models');
const { ObjectId } = require('bson');
const createError = require('http-errors');
const { returnJson } = require('../my_modules/json_response');

const getDrugs = async (req, res, next) => {
    try {
        const result = await Drug.getAllWithAlternativesAndPharmacies();

        if (!result.status) {
        return next(createError(500, result.message));
        }

        res.json({
        status: {
            status: true,
            message: '',
        },
        data: result.data,
        });
    } catch (err) {
        next(createError(500, err.message));
    }
};

const getDrugByName = async (req, res, next) => {
    try {
        const name = req.query.name || req.body.name;
        if (!name) {
            return next(createError(400, 'Drug name is required'));
        }

        const result = await Drug.getByNameWithAlternativesAndPharmacies(name);
        if (!result.status) {
            return next(createError(404, result.message));
        }

        res.json({
            status: { status: true, message: '' },
            data: result.data
        });
    } catch (err) {
        next(createError(500, err.message));
    }
};

const addDrug = (req, res, next) => {
    const drugData = req.body;

    const validation = Drug.validate(drugData);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    const drug = new Drug(drugData);

    drug.save((result) => {
        if (result.status) {
            return returnJson(res, 201, true, result.message, { _id: result._id, ...drugData });
        } else {
            return next(createError(500, result.message));
        }
    });
};

const updateDrug = (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return next(createError(400, 'Id is not valid'));
    }
    const _id = new ObjectId(req.params.id);
    const data = req.body;

    const validation = Drug.validate(data);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    Drug.update(_id, data, (result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, result.message, null);
    });
};

const removeDrug = (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return next(createError(400, 'Id is not valid'));
    }
    const _id = new ObjectId(req.params.id);

    Drug.remove(_id, (result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, result.message, null);
    });
};

module.exports = {
    getDrugs,
    getDrugByName,
    addDrug,
    updateDrug,
    removeDrug
};