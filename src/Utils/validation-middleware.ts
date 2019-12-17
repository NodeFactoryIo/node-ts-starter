import Joi from "@hapi/joi";

export const validate = (schema) => {
    return (req, res, next): void => {
        let errors = [];
        for (const propType in schema) {
            if (Object.prototype.hasOwnProperty.call(schema, propType)) {
                const {error} = Joi.validate(req[propType], schema[propType], {abortEarly: false});
                if (error !== null) {
                    errors = errors.concat(error.details);
                }
            }
        }
        if (errors.length === 0) {
            next();
        } else {
            res.status(400).json({errors});
        }
    };
};
