<template>
  <v-row justify="center">
    <v-dialog :value="isOpen" max-width="290">
      <v-card>
        <v-card-title>Feladatok feltöltése</v-card-title>
        <v-form ref="addTask" @submit.prevent="onSubmit">
          <v-file-input
            v-model="files"
            :rules="rules"
            accept=".xls, .xlsx"
            color="primary"
            class="ma-4"
            label="File hozzáadása"
            placeholder="Válaszd ki a file-t"
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
                +{{ files.length - 2 }} File(s)
              </span>
            </template>
          </v-file-input>
          <v-card-actions>
            <v-btn @click="closeModal">Mégsem</v-btn>
            <v-btn type="submit" class="primary">Feltöltés</v-btn>
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
          'A file mérete nem lehet nagyobb 10MB-nál'
      ]
    };
  },
  computed: {
    isOpen() {
      return this.$store.state.isModalUploadOpen;
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('closeUploadModal');
    },
    async onSubmit() {
      const isValid = await this.$refs.addTask.validate();
      if (!isValid) {
        return;
      } else {
        this.addTask(this.files);
      }
      this.files = null;
    },
    addTask() {
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
