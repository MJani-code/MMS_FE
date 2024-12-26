<template>
  <v-expansion-panel
    class="accordion"
    :style="'borderLeft: 4px solid' + tasks[0].status_color"
  >
    <v-expansion-panel-header
      >{{ title }}
      <span class="text-left ml-2">{{ tasks.length }}</span>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <TableField
        :tasks="tasks"
        :headers="headers"
        :statuses="statuses"
        :fees="fees"
        :allowedStatuses="allowedStatuses"
        :locationTypes="locationTypes"
        :taskTypes="taskTypes"
        :lockerSerials="lockerSerials"
        :users="users"
        @eventToAccordion="eventToTask"
        @updateLockerData="updateLockerData"
        @uploadTaskFile="eventToTask"
        @addFee="addFee"
        @addLocker="addLocker"
        @deleteFee="deleteFee"
        @removeLocker="removeLocker"
        @downloadTig="downloadTig"
        @verifyLocker="verifyLocker"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import TableField from './TableField.vue';

export default {
  components: { TableField },
  props: {
    title: String,
    tasks: Array,
    headers: Array,
    statuses: Array,
    fees: Array,
    allowedStatuses: Array,
    locationTypes: Array,
    taskTypes: Array,
    lockerSerials: Array,
    users: Array
  },
  data: () => ({
    panel: [0],
    readonly: false
  }),
  mounted() {},
  methods: {
    eventToTask(payload) {
      this.$emit('eventToTask', payload);
    },
    addFee(data) {
      this.$emit('addFee', data);
    },
    addLocker(data) {
      this.$emit('addLocker', data);
    },
    removeLocker(data) {
      this.$emit('removeLocker', data);
    },
    deleteFee(data) {
      this.$emit('deleteFee', data);
    },
    updateLockerData(data) {
      this.$emit('updateLockerData', data);
    },
    downloadTig(data) {
      this.$emit('downloadTig', data);
    },
    verifyLocker(data) {
      this.$emit('verifyLocker', data);
    }
  }
};
</script>

<style>
.accordion {
  margin-bottom: 10px;
}
.custom-border {
  border-left: 4px solid #42b983; /* Állítsd be a kívánt színt és vastagságot */
}
</style>
