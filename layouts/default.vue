<template>
  <v-app :dark="false">
    <BounceLoader :loading="loading" />
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item>
          <v-list-item-title
            ><b>Szia, {{ firstName }}</b></v-list-item-title
          >
        </v-list-item>
        <v-list-item
          v-for="(item, index) in routers"
          :key="index"
          router
          :to="item.to"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="" to="" class="v-list-item--link" @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> Kijelentkezés </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app class="app-bar-orange">
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        :style="{ color: 'white' }"
      />
      <v-toolbar-title :style="{ color: 'white' }">MMS </v-toolbar-title>
      <v-spacer />
      <v-icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        {{
          $vuetify.theme.dark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'
        }}
      </v-icon>
    </v-app-bar>
    <v-main>
      <v-container>
        <!-- Értesítő komponens megjelenítése -->
        <Notification />
        <Modal />
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span
        >&copy; {{ new Date().getFullYear() }} BY: Martolin. Version:
        1.0.0</span
      >
    </v-footer>
  </v-app>
</template>

<script>
import { routers } from '@/routers/routers.js';
import Notification from '../components/Notification.vue';
import Modal from '../components/Modal.vue';
import BounceLoader from '../components/BounceLoader.vue';

export default {
  name: 'DefaultLayout',
  components: { Notification, Modal, BounceLoader },
  data() {
    return {
      themeChangeIcon: '',
      clipped: false,
      drawer: false,
      fixed: true,
      routers,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      firstName: this.$store.state.firstName,
      showConfirmLogoutModal: false
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('notification/showModal', {
        message: 'Biztosan kijelentkezel?',
        buttons: [
          {
            text: 'Mégse',
            style: 'secondary',
            action: () => this.$store.dispatch('notification/hideModal')
          },
          {
            text: 'Igen',
            style: 'primary',
            action: () => this.logOutConfirm()
          }
        ]
      });
    },
    logOutConfirm() {
      this.$store.dispatch('notification/hideModal');
      this.$router.push('/');
      localStorage.removeItem('data');
    }
  }
};
</script>

<style scoped lang="scss">
.v-list-item:hover >>> i {
  color: white !important;
}

.v-list-item:not(:first-child):hover {
  background-color: $ehohu-base-orange !important;
  color: white !important;
  border-radius: 20px 0px 0px 20px;
}

.v-list-item--active:not(:first-child) {
  background-color: $ehohu-base-orange !important;
  color: white !important;
  border-radius: 20px 0px 0px 20px;
}

.v-select__selection {
  color: white !important;
}
</style>
