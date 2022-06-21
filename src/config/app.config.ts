export default () => ({
    environment: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5433
    },
    secret: '87TfeR21S0R1f2s8ZZE98FpMZEsd4SD4zerSd32',
    jwt_token_time_before_expiration: '60s',
});