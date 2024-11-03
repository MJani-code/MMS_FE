<template>
  <v-row>
    <v-col class="pa-2 col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
      <v-card elevation="12" outlined tile height="100%">
        <router-link
          to="documents"
          class="routerLink"
          :style="{ color: this.$vuetify.theme.dark ? 'white' : 'black' }"
        >
          <v-list-item two-line>
            <v-banner class="custom">
              <v-avatar slot="icon" color="#359756" size="50">
                <v-icon icon="mdi-calendar-multiple" color="white" class="ma-2"
                  >mdi-delete</v-icon
                >
              </v-avatar>
            </v-banner>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1"> 1 </v-list-item-title>
              <v-list-item-subtitle class="text-truncate">
                nyitott számla
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-card>
    </v-col>
    <v-col class="pa-2 col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
      <v-card elevation="12" outlined tile height="100%">
        <router-link
          to="events"
          class="routerLink"
          :style="{ color: this.$vuetify.theme.dark ? 'white' : 'black' }"
        >
          <v-list-item two-line>
            <v-banner class="custom">
              <v-avatar slot="icon" color="#359756" size="50">
                <v-icon icon="mdi-calendar-multiple" color="white" class="ma-2"
                  >mdi-calendar-multiple</v-icon
                >
              </v-avatar>
            </v-banner>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1"> 5 </v-list-item-title>
              <v-list-item-subtitle class="text-truncate">
                közeli esemény
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-card>
    </v-col>
    <v-col class="pa-2 col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
      <v-card elevation="12" outlined tile height="100%">
        <router-link
          to="polls"
          class="routerLink"
          :style="{ color: this.$vuetify.theme.dark ? 'white' : 'black' }"
        >
          <v-list-item two-line>
            <v-banner class="custom">
              <v-avatar slot="icon" color="#359756" size="50">
                <v-icon icon="mdi-calendar-multiple" color="white" class="ma-2"
                  >mdi-poll</v-icon
                >
              </v-avatar>
            </v-banner>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1"> 0 </v-list-item-title>
              <v-list-item-subtitle class="text-truncate">
                aktuális szavazások
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-card>
    </v-col>
    <v-col class="pa-2 col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
      <v-card elevation="12" outlined tile height="100%">
        <router-link
          to="todo"
          class="routerLink"
          :style="{ color: this.$vuetify.theme.dark ? 'white' : 'black' }"
        >
          <v-list-item two-line>
            <v-banner class="custom">
              <v-avatar slot="icon" color="#359756" size="50">
                <v-icon icon="mdi-calendar-multiple" color="white" class="ma-2"
                  >mdi-calendar-check</v-icon
                >
              </v-avatar>
            </v-banner>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1"> 3 </v-list-item-title>
              <v-list-item-subtitle class="text-truncate">
                elvégzendő feladat
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-card>
    </v-col>
    <v-col class="pa-2 col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
      <v-card elevation="12" outlined tile height="100%">
        <router-link
          to="statements"
          class="routerLink"
          :style="{ color: this.$vuetify.theme.dark ? 'white' : 'black' }"
        >
          <v-list-item two-line>
            <v-banner class="custom">
              <v-avatar slot="icon" color="#359756" size="50">
                <v-icon icon="mdi-calendar-multiple" color="white" class="ma-2"
                  >mdi-message-badge</v-icon
                >
              </v-avatar>
            </v-banner>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1"> 2 </v-list-item-title>
              <v-list-item-subtitle class="text-truncate">
                nyitott bejelentés
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-card>
    </v-col>
  </v-row>
</template>

<style>
.custom > div {
  border-bottom: unset !important;
}

.routerLink {
  text-decoration: none;
  /* color: initial !important; */
}

.v-application .text-truncate {
  text-overflow: unset !important;
  white-space: normal !important;
}
</style>
