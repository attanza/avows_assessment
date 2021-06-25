import * as Joi from '@hapi/joi';

export const configSchema = () => {
  return Joi.object({
    NODE_ENV: Joi.string().required(),
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    PORT: Joi.number().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION_TIME: Joi.string().required(),
    REDIS_URL: Joi.string().required(),
    REDIS_PREFIX: Joi.string().required(),
  });
};
