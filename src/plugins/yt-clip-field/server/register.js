'use strict';

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: 'yt-clip-field',
    plugin: 'yt-clip-field',
    type: 'json',
  });
};