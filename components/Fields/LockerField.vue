<template>
  <v-row>
    <FieldsLockerFieldsTabs
      :locker="locker"
      :taskId="taskId"
      :boxId="boxId"
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
    },
    boxId: {
      type: Number,
      required: false
    }
  }
};
</script>
