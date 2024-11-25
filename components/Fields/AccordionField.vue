<template>
  <div>
    <v-expansion-panels v-model="panel" multiple class="accordion">
      <v-expansion-panel>
        <v-expansion-panel-header>{{ title }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <TableField
            :tasks="tasks"
            :headers="headers"
            :statuses="statuses"
            :allowedStatuses="allowedStatuses"
            :locationTypes="locationTypes"
            :taskTypes="taskTypes"
            :users="users"
            @eventToAccordion="eventToTask"
            @uploadTaskFile="eventToTask"
            @addFee="addFee"
            @addLocker="addLocker"
            @deleteFee="deleteFee"
            @removeLocker="removeLocker"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
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
    allowedStatuses: Array,
    locationTypes: Array,
    taskTypes: Array,
    users: Array
  },
  data: () => ({
    panel: [],
    readonly: false
  }),
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
    }
  }
};
</script>

<style>
.accordion {
  margin-bottom: 20px;
}
</style>
