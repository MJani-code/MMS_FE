<template>
  <v-row align="" justify="space-between">
    <v-row align="center">
      <v-col
        v-if="$store.getters['hasPermission']('3')"
        cols="12"
        sm="12"
        md="3"
        lg="3"
      >
        <AddTaskField
          v-if="$store.getters['hasPermission']('14')"
          @uploadBatchTasks="uploadBatchTasks"
          @createTask="createTask"
        />
      </v-col>
    </v-row>
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
    <v-col
      v-if="$store.getters['hasPermission']('25')"
      cols="12"
      sm="12"
      md="3"
      lg="2"
    >
      <DownloadField @downloadPoints="downloadPoints" />
    </v-col>
  </v-row>
</template>

<script>
import SearchField from '@/components/Fields/SearchField.vue';
import AddTaskField from '../../Fields/AddTaskField.vue';
import DownloadField from '../../Fields/DownloadField.vue';

export default {
  components: { SearchField, AddTaskField, DownloadField },
  props: {
    adminFilterOptions: {
      type: Array,
      default: () => []
    },
    serialFilterOptions: {
      type: Array,
      default: () => []
    },
    tasks: {
      type: Array,
      default: () => []
    },
    downloadNewPoints: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      selectedAdminFilter: null,
      selectedSerialFilter: null
    };
  },
  computed: {},
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
    },
    async downloadPoints() {
      //Körbejárni a tasks-ot és a megfelelő elemeket kigyűjteni
      const filteredTasks = this.tasks.filter((task) => {
        // Példa feltételek
        return (
          (task.status_exohu_id === 6 ||
            task.status_exohu_id === 9 ||
            task.status_exohu_id === 10) &&
          task.isActiveInAdmin == false &&
          task.box_id == task.pointId &&
          task.lockers.length > 0 &&
          task.lockers.every((locker) => locker.is_registered === 1) &&
          task.lockers.every((locker) => locker.is_active === 1) &&
          task.lockers.every((locker) => locker.fault === null)
        );
      });

      const response = await this.downloadNewPoints(
        filteredTasks,
        this.$store.state.token
      );

      // Létrehozunk egy URL-t a blob-hoz
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'newPoints.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>
