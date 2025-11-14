<template>
  <div class="notification-container">
    <v-slide-x-reverse-transition
      mode="in-out"
      v-for="(notification, index) in notifications"
      :key="index"
    >
      <v-alert
        dismissible
        :type="notification.type"
        @input="removeNotification(index)"
      >
        {{ notification.message }}
      </v-alert>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
export default {
  computed: {
    notifications() {
      return this.$store.state.notification.notifications;
    }
  },
  methods: {
    removeNotification(index) {
      this.$store.commit('notification/REMOVE_NOTIFICATION', index);
    }
  }
};
</script>

<style>
.notification-container {
  position: fixed;
  top: 70px;
  right: 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0px;
}
</style>
