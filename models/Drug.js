const { dbConnection } = require('../configurations');
const { ObjectId } = require('bson');
const { drugValidator } = require('../validators');

class Drug{
    constructor(drugData) {
        this.drugData = drugData;
    }

    save(cb) {
        dbConnection('drugs', async (collection) => {
            try {
                const drug = {
                    name: this.drugData.name,
                    type: this.drugData.type || null,
                    manufacturer: this.drugData.manufacturer || null,
                    isAvailable: this.drugData.isAvailable || false,
                    note: this.drugData.note || null,
                    alternative_of: this.drugData.alternative_of ? new ObjectId(this.drugData.alternative_of) : null,
                    pharmacies: Array.isArray(this.drugData.pharmacies)
                        ? this.drugData.pharmacies.map(id => new ObjectId(id))
                        : []
                };

                const result = await collection.insertOne(drug);

                cb({
                    status: true,
                    message: 'Drug created successfully',
                    _id: result.insertedId
                });
            } catch (err) {
                cb({
                    status: false,
                    message: err.message
                });
            }
        });
    }

    static update(_id, data, cb) {
        dbConnection('drugs', async (collection) => {
            try {
                const updateDoc = {
                    name: data.name,
                    type: data.type || null,
                    manufacturer: data.manufacturer || null,
                    isAvailable: data.isAvailable || false,
                    note: data.note || null,
                    alternative_of: data.alternative_of ? new ObjectId(data.alternative_of) : null,
                    pharmacies: Array.isArray(data.pharmacies)
                        ? data.pharmacies.map(id => new ObjectId(id))
                        : []
                };

                const result = await collection.updateOne(
                    { _id },
                    { $set: updateDoc }
                );

                cb({
                    status: true,
                    message: result.matchedCount > 0
                        ? 'Drug updated successfully'
                        : 'No drug was updated'
                });
            } catch (err) {
                cb({
                    status: false,
                    message: err.message
                });
            }
        });
    }

    static validate(drugData) {
        return drugValidator.validate(drugData);
    }

    static remove(_id, cb) {
        dbConnection('drugs', async (collection) => {
            try {
                await collection.deleteOne({ _id });

                cb({
                    status: true,
                    message: 'Drug deleted successfully'
                });
            } catch (err) {
                cb({
                    status: false,
                    message: err.message
                });
            }
        });
    }

    static getOne(_id) {
        return new Promise((resolve, reject) => {
            dbConnection('drugs', async (collection) => {
                try {
                    const drug = await collection.findOne({ _id });

                    if (drug) {
                        resolve({
                            status: true,
                            message: 'Drug found',
                            data: drug
                        });
                    } else {
                        resolve({
                            status: false,
                            message: 'Drug not found'
                        });
                    }
                } catch (err) {
                    reject({
                        status: false,
                        message: err.message
                    });
                }
            });
        });
    }

    static getAll(skip = 0, limit = 10) {
        return new Promise((resolve, reject) => {
            dbConnection('drugs', async (collection) => {
                try {
                    const drugs = await collection.find({})
                        .skip(skip)
                        .limit(limit)
                        .toArray();

                    resolve({
                        status: true,
                        message: '',
                        data: drugs
                    });
                } catch (err) {
                    reject({
                        status: false,
                        message: err.message
                    });
                }
            });
        });
    }

    static async getAllWithAlternativesAndPharmacies() {
        return new Promise((resolve, reject) => {
            dbConnection('drugs', async (collection) => {
                try {
                const mainDrugs = await collection.find({ alternative_of: null }).toArray();

                const getPharmacies = async (drugs) => {
                    return Promise.all(drugs.map(async (drug) => {
                    if (drug.pharmacies && drug.pharmacies.length) {
                        const pharmacies = await new Promise((resolve, reject) => {
                            dbConnection('pharmacies', async (pharmacyCollection) => {
                                try {
                                const pharmacyObjs = await pharmacyCollection.find({
                                    _id: { $in: drug.pharmacies.map(id => new ObjectId(id)) }
                                }).toArray();

                                resolve(pharmacyObjs);
                                } catch (err) {
                                reject(err);
                                }
                            });
                        });

                        drug.pharmacies = pharmacies;
                    } else {
                        drug.pharmacies = [];
                    }

                    const alternatives = await collection.find({ alternative_of: new ObjectId(drug._id) }).toArray();

                    const populatedAlternatives = await getPharmacies(alternatives);

                    drug.alternatives = populatedAlternatives;

                    return drug;

                    }));
                };

                const populatedDrugs = await getPharmacies(mainDrugs);

                resolve({
                    status: true,
                    message: '',
                    data: populatedDrugs
                });

                } catch (error) {
                reject(error);
                }
            });
        });
    }

    static getByNameWithAlternativesAndPharmacies(name) {
        return new Promise((resolve, reject) => {
            dbConnection('drugs', async (drugsCollection) => {
                try {
                    const mainDrug = await drugsCollection.findOne({
                        name: name,
                        alternative_of: null
                    });

                    if (!mainDrug) {
                        return resolve({
                            status: false,
                            message: 'Drug not found by name',
                        });
                    }

                    const getPharmacies = (ids) => new Promise((resolve, reject) => {
                        if (ids.length === 0 && (ids === null || ids === undefined)) return resolve([]);

                        dbConnection('pharmacies', async (pharmacyCollection) => {
                            try {
                                const pharmacies = await pharmacyCollection.find({
                                    _id: { $in: ids.map(id => new ObjectId(id)) }
                                }).toArray();
                                resolve(pharmacies);
                            } catch (err) {
                                reject(err);
                            }
                        });
                    });

                    mainDrug.pharmacies = await getPharmacies(mainDrug.pharmacies || []);

                    const alternatives = await drugsCollection.find({
                        alternative_of: mainDrug._id 
                    }).toArray();

                    for (let alt of alternatives) {
                        alt.pharmacies = await getPharmacies(alt.pharmacies || []);
                        alt.alternatives = []; 
                    }

                    mainDrug.alternatives = alternatives;

                    resolve({
                        status: true,
                        message: '',
                        data: mainDrug
                    });

                } catch (err) {
                    reject({
                        status: false,
                        message: err.message
                    });
                }
            });
        });
    }
}

module.exports = Drug