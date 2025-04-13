<template>
  <v-row>
    <FieldsLockerFieldsTabs
      :locker="locker"
      :taskId="taskId"
      @updateLockerData="$emit('updateLockerData', $event)"
      @verifyLocker="$emit('verifyLocker', $event)"
    />
  </v-row>
</template>

<script>
export default {
  props: {
    locker: {
      type: Object,
      required: true
    },
    taskId: {
      type: Number,
      required: true
    }
  }
};
</script>
