<template>
  <v-container fluid>
    <v-row class="mt-0">
      <v-col cols="12" md="6" lg="6" xl="4">
        <template>
          <v-card class="">
            <v-card-title class="profile-title">
              Felhasználói profil
            </v-card-title>
            <v-card-text>
              <v-form ref="form" @submit.prevent="onSubmit">
                <v-row>
                  <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                    <v-text-field
                      v-model="user.lastName"
                      :clearable="editMode"
                      color="primary"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Vezetéknév"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                    <v-text-field
                      v-model="user.firstName"
                      :clearable="editMode"
                      color="primary"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Keresztnév"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" lg="12" xl="12">
                    <v-text-field
                      v-model="user.email"
                      :clearable="editMode"
                      color="primary"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="E-mail"
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="editMode" cols="12" lg="6" xl="6">
                    <v-text-field
                      v-model="user.password"
                      :clearable="editMode"
                      type="password"
                      color="primary"
                      :readonly="!editMode"
                      label="Jelszó"
                      :rules="passwordRule"
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="editMode" cols="12" lg="6" xl="6">
                    <v-text-field
                      v-model="user.newPassword"
                      :clearable="editMode"
                      type="password"
                      color="primary"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Új jelszó"
                      :rules="newPasswordRule"
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="editMode" cols="12" lg="6" xl="6">
                    <v-text-field
                      v-model="user.newPasswordConfirm"
                      :clearable="editMode"
                      type="password"
                      color="primary"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Új jelszó ismét"
                      :rules="newPasswordConfirmRule"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row> </v-row>
                <v-card-actions>
                  <v-btn
                    v-if="editMode"
                    class="ma-3"
                    @click="editMode = !editMode"
                    >Mégsem</v-btn
                  >
                  <v-btn
                    v-if="editMode"
                    type="submit"
                    class="ma-3"
                    color="primary"
                    >Profil mentése</v-btn
                  >
                </v-card-actions>
              </v-form>
              <v-btn v-if="!editMode" class="ma-3" @click="editMode = !editMode"
                >Szerkesztés</v-btn
              >
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { taskMixin } from '@/mixins/taskMixin.js';

export default {
  components: {},
  mixins: [taskMixin],
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        newPassword: '',
        newPasswordConfirm: ''
      },
      editMode: false,
      showAlert: false,
      alertMessage: '',
      alertType: '',
      passwordRule: [
        (v) => !!v || 'A módosításhoz szükséges a jelenlegi jelszavad!'
      ]
    };
  },
  computed: {
    newPasswordRule() {
      return [
        (v) =>
          !v ||
          /[A-Z]/.test(v) ||
          'A jelszónak legalább egy nagybetűt kell tartalmaznia',
        (v) =>
          !v ||
          /[0-9]/.test(v) ||
          'A jelszónak legalább egy számot kell tartalmaznia',
        (v) =>
          !v ||
          v.length >= 8 ||
          'A jelszónak legalább 8 karakter hosszúnak kell lennie'
      ];
    },
    newPasswordConfirmRule() {
      return [
        (v) => v === this.user.newPassword || 'A jelszavak nem egyeznek meg'
      ];
    }
  },
  mounted() {
    // Profiladatok lekérdezése
    this.GetUserData();
  },
  methods: {
    async GetUserData() {
      const result = await this.getUser();
      if (result.data.status === 200) {
        this.user = result.data.payload[0];
      } else {
        this.showNotification('error', result.data.message);
      }
    },
    async onSubmit() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      } else {
        this.saveProfile(this.user);
      }
    },
    async saveProfile(data) {
      // Felhasználói profil mentése
      const result = await this.updateUser(data);
      const message = result.data.message;
      if (result.data.status !== 200) {
        this.showNotification('error', message);
      } else {
        this.showNotification('success', message);
      }
      this.editMode = false;
    },
    showNotification($type, $message) {
      this.$store.dispatch('notification/addNotification', {
        type: $type,
        message: $message,
        timeout: 5000
      });
    }
  }
};
</script>

<style scoped>
.profile {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
