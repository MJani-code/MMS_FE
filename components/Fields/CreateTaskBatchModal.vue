<template>
  <v-row justify="center">
    <v-dialog :value="isOpen" max-width="290">
      <v-card>
        <v-card-title>{{ $t('tasks.createTaskBatch.title') }}</v-card-title>
        <v-form ref="createTaskBatch" @submit.prevent="onSubmit">
          <v-file-input
            v-model="files"
            :rules="rules"
            accept=".xls, .xlsx"
            color="primary"
            class="ma-4"
            :label="$t('tasks.createTaskBatch.fileLabel')"
            :placeholder="$t('tasks.createTaskBatch.filePlaceholder')"
            prepend-icon="mdi-paperclip"
            outlined
            :show-size="1000"
          >
            <template v-slot:selection="{ index, text }">
              <v-chip v-if="index < 2" color="primary" dark label small>
                {{ text }}
              </v-chip>

              <span
                v-else-if="index === 2"
                class="text-overline grey--text text--darken-3 mx-2"
              >
                +{{ files.length - 2 }}
                {{ $t('tasks.createTaskBatch.filesSuffix') }}
              </span>
            </template>
          </v-file-input>
          <v-card-actions>
            <v-btn @click="closeModal">{{ $t('common.cancel') }}</v-btn>
            <v-btn type="submit" class="primary">{{
              $t('tasks.createTaskBatch.upload')
            }}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: { loading: { type: Boolean, default: false } },
  data() {
    return {
      files: [],
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          this.$t('tasks.createTaskBatch.fileTooLarge')
      ]
    };
  },
  computed: {
    isOpen() {
      return this.$store.state.isModalCreateTaskBatchOpen;
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('closeCreateTaskBatchModal');
    },
    async onSubmit() {
      const isValid = await this.$refs.createTaskBatch.validate();
      if (!isValid) {
        return;
      } else {
        this.createTaskBatch(this.files);
      }
      this.files = null;
    },
    createTaskBatch() {
      this.$store.commit('turnOnLoading');
      const formData = new FormData();
      formData.append('file', this.files);

      this.$emit('uploadBatchTasks', formData);
    }
  }
};
</script>

<style>
.v-dialog {
  opacity: 1 !important;
  background-color: white !important;
}
</style>
