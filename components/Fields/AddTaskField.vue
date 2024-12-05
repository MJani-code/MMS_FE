<template>
  <v-container>
    <AddTaskModal ref="childModal" @uploadTasks="uploadTask" />
    <v-row>
      <v-col cols="12" md="3">
        <v-btn color="blue-grey" class="ma-2 white--text" @click="openModal">
          Feledatok betöltése
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Keresés"
          clear-icon="mdi-close-circle"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddTaskModal from './AddTaskModal.vue';

export default {
  components: { AddTaskModal },
  data: () => ({
    isModalOpen: false,
    search: ''
  }),
  methods: {
    openModal() {
      this.$refs.childModal.open();
    },
    uploadTask(files) {
      //this.$store.commit('turnOnLoading');
      console.log(files);
    }
  }
};
</script>
