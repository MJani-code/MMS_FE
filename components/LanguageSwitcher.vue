<template>
  <v-menu
    v-model="menu"
    offset-y
    bottom
    left
    transition="slide-y-transition"
    :close-on-content-click="true"
    min-width="160"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        text
        rounded
        v-bind="attrs"
        v-on="on"
        class="lang-btn px-2"
        :ripple="false"
      >
        <span class="lang-flag mr-1">{{ currentLang.flag }}</span>
        <span class="lang-code text-uppercase font-weight-medium">{{
          currentLang.code
        }}</span>
        <v-icon small class="ml-1" :class="{ 'rotate-180': menu }"
          >mdi-chevron-down</v-icon
        >
      </v-btn>
    </template>

    <v-list dense class="lang-menu py-1" elevation="4">
      <v-list-item
        v-for="lang in languages"
        :key="lang.code"
        @click="switchLang(lang.code)"
        class="lang-item px-3"
        :class="{ 'lang-item--active': currentLocale === lang.code }"
      >
        <v-list-item-icon class="mr-2 my-auto">
          <span class="lang-flag">{{ lang.flag }}</span>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="lang-name">{{
            lang.name
          }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon
          v-if="currentLocale === lang.code"
          class="my-auto ml-2"
        >
          <v-icon small color="primary">mdi-check</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'LanguageSwitcher',

  data() {
    return {
      menu: false,
      languages: [
        { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' }
      ]
    };
  },

  computed: {
    currentLocale() {
      if (this.$i18n && this.$i18n.locale) {
        return this.$i18n.locale;
      }
      return this.$store?.state?.locale || 'hu';
    },
    currentLang() {
      return (
        this.languages.find((lang) => lang.code === this.currentLocale) ||
        this.languages[0]
      );
    }
  },

  methods: {
    switchLang(code) {
      if (this.$store) {
        this.$store.commit('setLocale', code);
      }
      if (this.$i18n) {
        this.$i18n.setLocale(code);
      }
      this.$emit('change', code);
      this.menu = false;
    }
  }
};
</script>

<style scoped>
.lang-btn {
  min-width: unset !important;
  letter-spacing: 0.04em;
  transition: background 0.2s;
  color: inherit !important;
}

.lang-btn:hover {
  background: rgba(0, 0, 0, 0.06) !important;
}

.lang-flag {
  font-size: 0.85rem;
  line-height: 1;
  font-weight: 700;
}

.lang-code {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.v-icon.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.v-icon {
  transition: transform 0.2s ease;
}

.lang-menu {
  border-radius: 10px !important;
  overflow: hidden;
}

.lang-item {
  min-height: 40px !important;
  border-radius: 6px;
  margin: 2px 4px;
  transition: background 0.15s;
}

.lang-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.lang-item--active {
  background: rgba(240, 123, 0, 0.1);
}

.lang-name {
  font-size: 0.875rem !important;
  font-weight: 500;
}
</style>
