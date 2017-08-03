exports = module.exports = {
    logger: {
        name: process.env.CLDK_WORKER_LOGGER_NAME || 'CLDK',
        level: process.env.CLDK_WORKER_LOGGER_LEVEL || 'debug'
    },
    database: {
        host: process.env.CLDK_WORKER_DB_HOST || 'localhost',
        database: process.env.CLDK_WORKER_DB_NAME || 'cloudoki_dev',
        user: process.env.CLDK_WORKER_DB_USER || 'root',
        password: process.env.CLDK_WORKER_DB_PASSWORD || 'cloudokidev',
        pool: {
            min: process.env.CLDK_WORKER_DB_POOL_MIN || 2,
            max: process.env.CLDK_WORKER_DB_POOL_MAX || 10
        }
    },
    queue: {
        uri: process.env.CLDK_WORKER_QUEUE_URI || 'amqps://mq.dev.cloudoki.com',
        reconnect: process.env.CLDK_WORKER_QUEUE_RECONNECT || 5000,
        options: {
            cert: process.env.CLDK_WORKER_QUEUE_CERT || 'ssl/cert.pem',
            key: process.env.CLDK_WORKER_QUEUE_KEY || 'ssl/key.pem',
            passphrase: process.env.CLDK_WORKER_QUEUE_CERT_PASS || 'cloudoki',
            ca: process.env.CLDK_WORKER_QUEUE_CA || 'ssl/cacert.pem'
        }
    },
    oauth2: {
      /** The time in minutes to expire the token */
      token_expiresIn: process.env.OAUTH2_TOKEN_EXPIRATION || 60 * 60, // 60 minutes
      /** The time in minutes to expire the code */
      code_expiresIn: process.env.OAUTH2_CODE_EXPIRATION || 5 * 60, // 5 minutes
      /** The time in minutes to expire the refresh token */
      refreshToken_expiresIn : process.env.OAUTH2__REFRESH_TOKEN_EXPIRATION || 52560000, // 100 years
      /** The time in minutes to check database for expired tokens */
      db_timeToCheckExpiredTokens : process.env.OAUTH2_DB_CHECK_TOKENS || 60 * 60, // 60 minutes
      debug: true,
      session : {
        /** The maximum age in milliseconds of the session. */
        maxAge: process.env.OAUTH2_SESSION_MAX_AGE || 3600000 * 24 * 7 * 52, // 1 year
        /** The session secret */
        secret: process.env.OAUTH2_SESSION_SECRET || '53kre7 TH@7 mUZt bE ch4Ng3D',
      }
    }
};
