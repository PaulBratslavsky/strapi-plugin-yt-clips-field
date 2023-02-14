'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('yt-clip-field')
      .service('myService')
      .getWelcomeMessage();
  },
});
