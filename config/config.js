module.exports = {
    secret: process.env.SECRET_KEY || "R@MinAfH@Mi",
    database: process.env.DATABASE_ADDRESS || 'mongodb://mongo:27017/docker-node-mongo'
};
