import path from 'path';
import appLoader from 'sails-util-micro-apps';
import swagger from './swagger.json';
import config from './config/sails-app';
import bootstrap from './bootstrap';

module.exports = function init(sails) {
  const loader = appLoader(sails);
  return {
    config,
    swagger,
    bootstrap,
    configure() {
      loader.configure({
        config: `${__dirname}/config`, // Path to your hook's config
        assets: `${__dirname}/assets`,
        views: `${__dirname}/views`,
        policies: `${__dirname}/api/policies`, // Path to your hook's policies
      });
    },
    initialize(next) {
      loader.inject({
        responses: `${__dirname}/api/responses`,
        models: `${__dirname}/api/models`, // Path to your hook's models
        services: `${__dirname}/api/services`, // Path to your hook's services
        helpers: `${__dirname}/api/helpers`, // Path to your hook's helpers
        controllers: `${__dirname}/api/controllers`, // Path to your hook's controllers
      }, err => next(err));
    },
    customMiddleware(express, app, multipleViews, sails) {
      try {
        const maxAge = sails.config.http.cache;
        app.use('/assets', express.static(`${__dirname}/assets`, { maxAge }));
        multipleViews(app, path.join(__dirname, 'views'));
      } catch (e) {
        sails.log.error('run hook customMiddleware error', e);
        throw e;
      }
    },
  };
};
