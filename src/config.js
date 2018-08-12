const config = {
  //set up basic config if it is deployed locally via docker
  app: {
    name: 'Event Organiser App',
    shortName: 'Event Organiser',
    port: 3001,
    env: 'local'
  },
  postgres: {
    user: 'postgres',
    database: 'postgres',
    password: 'password',
    host: '127.0.0.1',
    port: 5000,
    max: 10,
    idleTimeoutMillis: 20000
  }
};

// Environment setup
if (config.app.env === '' || !config.app.env) {
  config.app.env = 'local';
  config.postgres.post = 5000;
}

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'dev') {
  // Delete the local config if it has been deployed to dev, this will instead source from the env variable stored in heroku
  delete config.postgres.user;
  delete config.postgres.password;
  delete config.postgres.host;
  delete config.postgres.port;
  delete config.postgres.database;
  config.postgres.connectionString = process.env.DATABASE_URL
}

export default config;
