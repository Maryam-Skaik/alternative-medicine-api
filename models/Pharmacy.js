const { dbConnection } = require('../configurations')
const { pharmacyValidator } = require('../validators')

class Pharmacy{

    constructor(pharmacyData){
        this.pharmacyData = pharmacyData;
    }

    save(cb) {
        dbConnection('pharmacies', async (collection) => {
            try {
                const result = await collection.insertOne({
                    name: this.pharmacyData.name,
                    address: this.pharmacyData.address
                });

                cb({
                    status: true,
                    message: 'Pharmacy created successfully',
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
        dbConnection('pharmacies', async (collection) => {
            try {
                const result = await collection.updateOne(
                    { _id },
                    {
                        $set: {
                            name: data.name,
                            address: data.address
                        }
                    }
                );

                cb({
                    status: true,
                    message: result.matchedCount > 0
                        ? 'Pharmacy updated successfully'
                        : 'No pharmacy was updated'
                });
            } catch (err) {
                cb({
                    status: false,
                    message: err.message
                });
            }
        });
    }


    static validate(pharmacyData){
        const validation = pharmacyValidator.validate(pharmacyData);
        return validation;
    }

    static remove(_id, cb){
        dbConnection('pharmacies', async (collection) => {
            try{
                await collection.deleteOne({_id});

                cb({
                    status: true,
                    message: 'Pharmacy deleted successfully'
                });
            }catch(err){
                cb({
                    status: false,
                    message: err.message
                });
            }
        })
    }

    static getOne(_id){
        return new Promise((resolve, reject) => {
            dbConnection('pharmacies', async (collection) => {
                try{
                    const pharmacy = await collection.findOne({_id});

                    if(pharmacy){
                        resolve({
                            status: true,
                            message: 'Pharmacy found',
                            data: pharmacy
                        });
                    }else{
                        resolve({
                            status: false,
                            message: 'Pharmacy not found'
                        });
                    }
                }catch(err){
                    reject({
                        status: false,
                        message: err.message
                    });
                }
            })
        })
    }
}

module.exports = Pharmacy