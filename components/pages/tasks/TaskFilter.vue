<template>
  <v-row align="center" justify="end">
    <v-col
      v-if="$store.getters['hasPermission']('3')"
      cols="12"
      sm="12"
      md="3"
      lg="5"
    >
      <v-row align="center" justify="center">
        <AddTaskField
          @uploadBatchTasks="uploadBatchTasks"
          @createTask="createTask"
        />
      </v-row>
    </v-col>
    <v-col cols="12" sm="12" md="3" lg="3">
      <SearchField @search="search" />
    </v-col>
    <v-col cols="12" sm="12" md="3" lg="2">
      <v-select
        id="serialFilter"
        v-model="selectedSerialFilter"
        :items="serialFilterOptions"
        label="Serial"
        outlined
      />
    </v-col>
    <v-col
      v-if="$store.getters['hasPermission']('22')"
      cols="12"
      sm="12"
      md="3"
      lg="2"
    >
      <v-select
        id="tofShopIdFilter"
        v-model="selectedAdminFilter"
        :items="adminFilterOptions"
        label="Aktiv"
        outlined
      />
    </v-col>
  </v-row>
</template>

<script>
import SearchField from '@/components/Fields/SearchField.vue';
import AddTaskField from '../../Fields/AddTaskField.vue';
export default {
  components: { SearchField, AddTaskField },
  props: {
    adminFilterOptions: {
      type: Array,
      default: () => []
    },
    serialFilterOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedAdminFilter: null,
      selectedSerialFilter: null
    };
  },
  watch: {
    selectedAdminFilter: function () {
      this.$emit('tofShopIdFilter', {
        key: 'tofShopIdFilter',
        value: this.selectedAdminFilter
      });
    },
    selectedSerialFilter: function () {
      this.$emit('serialFilter', {
        key: 'serialFilter',
        value: this.selectedSerialFilter
      });
    }
  },
  methods: {
    search(data) {
      this.$emit('searchedValue', data);
    },
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
