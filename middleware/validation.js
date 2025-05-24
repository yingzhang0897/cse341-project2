const validator = require('../helpers/validate');

const saveItem = async (req, res, next) => {
    const validationRule = {
        "name": "required|string",
        "quantity": "required|numeric",
        "price": "required|regex:/^\\d+(\\.\\d{1,2})?$/",//up to 2 decimal places
        "description": "required|string",
        "category": "required|string",
        "supplier": "required|string",
        "lastUpdated": "required|date"
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}


const saveUser = async (req, res, next) => {
    const validationRule = {
        "name": "required|string",
        "gender": "required|in:Male,Female",
        "email": "required|email",
        "birthday": "required|string",
        "role": "required|in:admin,user,guest",
        "isMember": "required|in:true,false"
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}

module.exports = {
   saveItem, saveUser
};