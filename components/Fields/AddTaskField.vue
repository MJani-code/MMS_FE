<template>
  <v-container>
    <CreateTaskBatchModal
      ref="childModal"
      @uploadBatchTasks="uploadBatchTasks"
    />
    <CreateTaskModal @createTask="createTask" />
    <v-row>
      <v-col v-if="$store.getters['hasPermission']('3')" cols="12" md="3">
        <v-btn
          color="blue-grey"
          class="ma-2 white--text"
          @click="openCreateTaskBatchModal"
        >
          Helyszínek betöltése
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
        <v-btn
          color="blue-grey"
          class="ma-2 white--text"
          @click="openCreateTaskModal"
        >
          Megbízás hozzáadása
        </v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <SearchField @search="search" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CreateTaskBatchModal from './CreateTaskBatchModal.vue';
import CreateTaskModal from './CreateTaskModal.vue';
import SearchField from './SearchField.vue';

export default {
  components: { CreateTaskBatchModal, CreateTaskModal, SearchField },
  data: () => ({
    isModalOpen: false
  }),
  methods: {
    openCreateTaskBatchModal() {
      //this.$refs.childModal.open();
      this.$store.commit('openCreateTaskBatchModal');
    },
    openCreateTaskModal() {
      this.$store.commit('openCreateTaskModal');
    },
    uploadBatchTasks(files) {
      this.$store.commit('turnOnLoading');
      this.$emit('uploadBatchTasks', files);
    },
    search(data) {
      this.$emit('searchedValue', data);
    },
    createTask(data) {
      this.$emit('createTask', data);
    }
  }
};
</script>
