/**
 * Created by Sean on 7/19/2014.
 */

exports.handleError = function(err, res) {
    //TODO: logging
    res.send(err);
};

/**
 * Validates that the fields exist in obj
 * @param obj - the object to validate
 * @param fields - the fields to check for
 * @returns {object} - string or true. True indicates it is valid
 */
exports.validateFields = function(obj, fields) {
    var returnObject = {
        isValid: true,
        message: null
    };

    if (typeof obj === 'undefined') {
        returnObject.isValid = false;
        returnObject.message = 'Object is undefined!';
        return returnObject;
    }

    returnObject.invalidFields = [];
    fields.forEach(function(field) {
        if (typeof obj[field] === 'undefined') {
            if (returnObject.message === null) {
                returnObject.message = 'The following fields are required: '
            }
            returnObject.invalidFields.push(field);
            returnObject.message += field + ','
        }
    });

    if (returnObject.message !== null) {
        returnObject.isValid = false;
        returnObject.message = returnObject.message.replace(/,+$/, '');
    }

    return returnObject;
};