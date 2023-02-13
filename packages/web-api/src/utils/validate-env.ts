import { cleanEnv, host, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    POSTGRES: str(),
    WEBSOCKET_PORT: port(),
    HTTP_PORT: port(),
    STATIC_PATH: str({ default: '' }),

    LOG_LEVEL: str({ default: 'info' }),
    HOST: host({ default: 'localhost' }),

    SERVICE_NAME: str({ default: '' }),
    MOCK: str({ default: '' }),
  });
};

export default validateEnv;
