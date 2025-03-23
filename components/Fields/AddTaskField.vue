<template>
  <v-container>
    <CreateTaskBatchModal
      ref="childModal"
      @uploadBatchTasks="uploadBatchTasks"
    />
    <CreateTaskModal @createTask="createTask" />
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="blue-grey" class="white--text" v-bind="attrs" v-on="on">
          Új hozzáadása
          <v-icon right dark>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="openCreateTaskBatchModal">
          <v-list-item-title>Helyszínek betöltése</v-list-item-title>
        </v-list-item>
        <v-list-item @click="openCreateTaskModal">
          <v-list-item-title>Megbízás hozzáadása</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-container>
</template>

<script>
import CreateTaskBatchModal from './CreateTaskBatchModal.vue';
import CreateTaskModal from './CreateTaskModal.vue';

export default {
  components: { CreateTaskBatchModal, CreateTaskModal },
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
    createTask(data) {
      this.$emit('createTask', data);
    }
  }
};
</script>
