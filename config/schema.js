'use strict'

const schema = {
    env: {
        doc: 'The oauth2 worker environment.',
        format: ['production', 'staging', 'development'],
        default: 'development',
        env: 'HYPER_WORKER_OAUTH2_NODE_ENV'
    },
    database: {
        options:{
            doc: 'Database default options',
            format: Object,
            env: 'HYPER_WORKER_OAUTH2_DATABASE_OPTS',
            default: {}
        },
        pool: {
            min: {
                doc: 'minimum number of connection with the database',
                format: Number,
                env: 'HYPER_WORKER_OAUTH2_DB_POOL_MIN',
                default: 2
            },
            max: {
                doc: 'maximum number of connection with the database',
                format: Number,
                env: 'HYPER_WORKER_OAUTH2_DB_POOL_MAX',
                default: 10
            },
            refreshIdle: {
                doc: 'Specifies whether idle resources at or below the min threshold should be destroyed/re-created',
                format: Boolean,
                env: 'HYPER_WORKER_OAUTH2_DB_POOL_REFRESH_IDLE',
                default: false
            }
        }
    },
    seneca: {
        options: {
            doc: 'Seneca default options',
            format: Object,
            env: 'HYPER_WORKER_OAUTH2_SENECA_OPTS',
            default: {}
        },
        client: {
            type: {
                doc: 'Seneca CORS origin',
                format: String,
                env: 'HYPER_WORKER_OAUTH2_SENECA_CLIENT_TYPE',
                default: 'amqp'
            },
            url: {
                doc: 'Seneca broker connection url',
                format: String,
                env: 'HYPER_WORKER_OAUTH2_BROKER_URL'
            },
            name: {
                doc: 'Broker queue name',
                format: String,
                env: 'HYPER_WORKER_OAUTH2_BROKER_QUEUE_NAME',
                default: 'hyper.oauth2.queue'
            },
            pins: {
                doc: 'Seneca services pins',
                format: Array,
                env: 'HYPER_WORKER_OAUTH2_ENABLED_PINS',
                default: [
                    'role:client'
                ]
            }
        },
        rabbitOptions: {
            doc: 'Seneca Rabbit connector default options',
            format: Object,
            env: 'HYPER_WORKER_OAUTH2_SENECA_RABBIT_CONNECTOR_OPTS',
            default: {}
        }
    },
    logger: {
        name: {
            doc: 'API logger name',
            format: String,
            default: 'Hyper-Worker-Oauth2'
        },
        level: {
            doc: 'Logger level',
            format: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
            default: 'trace'
        }
    }
};

module.exports = schema;