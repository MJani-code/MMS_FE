<template>
  <v-row class="mt-2">
    <v-col cols="12" class="justify-center">
      <ProcessLoading :is-loading="isLoading" />
      <response-handler-modal></response-handler-modal>
    </v-col>
    <v-col cols="12">
      <h1>MMS</h1>
    </v-col>
    <v-col cols="12" class="text-center">
      <button v-if="!show" v-on:click="show = !show">
        <div id="login-button" class="mx-auto login-button">
          <v-img src="login-w-icon.png" />
        </div>
      </button>
      <transition name="fade">
        <div v-if="show" id="login-container">
          <h1>Bejelentkezés</h1>
          <span class="close-btn" v-on:click="show = !show">
            <v-img
              src="https://cdn4.iconfinder.com/data/icons/miu/22/circle_close_delete_-128.png"
            />
          </span>
          <v-sheet width="300" class="mx-auto">
            <v-form ref="form" @submit.prevent="onSubmit">
              <v-text-field
                :style="{ '--v-background-base': 'white' }"
                type="email"
                v-model="email"
                :rules="emailRule"
              >
                <template v-slot:label>
                  <span style="color: white"> Email </span>
                </template>
              </v-text-field>
              <v-text-field
                :style="{ '--v-background-base': 'white' }"
                type="password"
                v-model="password"
                :rules="passwordRule"
              >
                <template v-slot:label>
                  <span style="color: white"> Jelszó </span>
                </template>
              </v-text-field>
              <v-btn type="submit" block class="mt-2"> Bejelentkezés </v-btn>
            </v-form>
          </v-sheet>
        </div>
      </transition>
    </v-col>
    <v-col cols="12" v-if="!isLoading"> </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'login',
  components: {},
  layout: 'login',
  setup() {
    return {};
  },
  async beforeMount() {},
  data() {
    return {
      isLoading: false,
      show: false,
      email: '',
      password: '',
      response: [],
      emailRule: [
        (v) => !!v || 'Kötelező kitölteni',
        (v) => /.+@.+\..+/.test(v) || 'Érvénytelen email formátum'
      ],
      passwordRule: [(v) => !!v || 'Kötelező kitölteni']
    };
  },
  computed: {},
  watch: {},
  methods: {
    async onSubmit() {
      // const isValid = await this.$refs.form.validate();
      // if (!isValid) {
      //   return;
      // } else {
      //   this.login();
      // }
    },
    login() {
      // const user = {
      //   email: this.email,
      //   password: this.password,
      // };
      // this.$store.dispatch('login', user);
    }
  }
};
</script>
<style scoped>
h1 {
  font-family: 'Open Sans Condensed', sans-serif;
  position: relative;
  margin-top: 0px;
  text-align: center;
  font-size: 40px;
  color: #ddd;
  text-shadow: 3px 3px 10px #000;
  margin-top: 10px;
}

#login-container h1 {
  font-size: 20px;
}

.login-button {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 30px;
  margin: auto;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(3, 3, 3, 0.8);
  overflow: hidden;
  opacity: 0.4;
  box-shadow: 10px 10px 30px #000;
}

/* Login container */
#login-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 360px;
  height: 260px;
  border-radius: 5px;
  background: rgba(3, 3, 3, 0.25);
  box-shadow: 1px 1px 50px #000;
}

.close-btn {
  position: absolute;
  cursor: pointer;
  font-family: 'Open Sans Condensed', sans-serif;
  line-height: 18px;
  top: 3px;
  right: 3px;
  width: 20px;
  height: 20px;
  text-align: center;
  border-radius: 10px;
  opacity: 0.2;
  -webkit-transition: all 2s ease-in-out;
  -moz-transition: all 2s ease-in-out;
  -o-transition: all 2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.close-btn:hover {
  opacity: 0.5;
}

/* Inputs */
.v-sheet {
  font-family: 'Open Sans Condensed', sans-serif;
  text-decoration: none;
  position: relative;
  width: 80%;
  display: block;
  margin: 9px auto;
  font-size: 17px;
  color: #fff;
  padding: 8px;
  border-radius: 6px;
  border: none;
  background: rgba(3, 3, 3, 0.1);
  -webkit-transition: all 2s ease-in-out;
  -moz-transition: all 2s ease-in-out;
  -o-transition: all 2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

input:focus {
  outline: none;
  box-shadow: 3px 3px 10px #333;
  background: rgba(3, 3, 3, 0.18);
}

label.primary--text {
  color: white !important;
}

.v-application .primary--text {
  color: #e0e0e0 !important;
  caret-color: #e0e0e0 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.v-text-field >>> input {
  color: white;
}
</style>
