import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
  register(app) {

    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });

    app.customFields.register({
      name: 'yt-clip-field',
      pluginId: 'yt-clip-field',
      type: 'json',
      intlLabel: {
        id: "yt-clip-field.yt-clip-field.label",
        defaultMessage: "YT Clip Field",
      },
      intlDescription: {
        id: "yt-clip-field.yt-clip-field.description",
        defaultMessage: "YT Clip Field",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import("./components/YtClipInputField"),
      },
      options: {
        // The options of the custom field
      },
    })
  },

  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
