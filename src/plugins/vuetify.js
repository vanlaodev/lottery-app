import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import zhHant from 'vuetify/lib/locale/zh-Hant';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      light: {
        primary: colors.deepPurple
      },
      dark: {
        primary: colors.deepPurple
      }
    }
  },
  lang: {
    locales: {
      zhHant
    },
    current: 'zhHant',
  },
});