import ApiError from '../utils/ApiError.js';

const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map((d) => d.message);
    return next(new ApiError(400, 'Validation failed', details));
  }
  req.body = value;
  next();
};

export default validate;
