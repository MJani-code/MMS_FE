<template>
  <v-container>
    <AddTaskModal ref="childModal" @uploadBatchTasks="uploadBatchTasks" />
    <v-row>
      <v-col cols="12" md="3">
        <v-btn color="blue-grey" class="ma-2 white--text" @click="openModal">
          Feledatok betöltése
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <SearchField @search="search" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddTaskModal from './AddTaskModal.vue';
import SearchField from './SearchField.vue';

export default {
  components: { AddTaskModal, SearchField },
  data: () => ({
    isModalOpen: false
  }),
  methods: {
    openModal() {
      //this.$refs.childModal.open();
      this.$store.commit('openUploadModal');
    },
    uploadBatchTasks(files) {
      //this.$store.commit('turnOnLoading');
      this.$emit('uploadBatchTasks', files);
      console.log(files);
    },
    search(data) {
      this.$emit('searchedValue', data);
    }
  }
};
</script>
