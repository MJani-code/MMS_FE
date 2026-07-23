<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.notification.modal.visible"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5 text-break">
          <p>{{ $store.state.notification.modal.message }}</p>
        </v-card-title>
        <!-- <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text> -->
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            v-for="(button, index) in $store.state.notification.modal.buttons"
            :key="index"
            :class="button.style"
            @click="button.action"
            :loading="isLoading(button.text)"
          >
            {{ button.text }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  methods: {
    isLoading(buttonText) {
      return (
        buttonText === 'Igen' && this.$store.state.task.tasks.loadingDeleteMedia
      );
    }
  }
};
</script>

<style scoped>
.text-break {
  word-break: break-word;
}
</style>
