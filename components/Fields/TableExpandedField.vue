<template>
  <td :colspan="headers.length">
    <v-card>
      <v-tabs vertical>
        <v-tab class="location_photos_tab">Helyszín képek</v-tab>
        <v-tab class="fixing_method_tab">Rögzítési mód</v-tab>
        <v-tab class="required_site_preparation">Kivitelezés</v-tab>

        <v-tab-item class="location_photos_item">
          <v-card flat>
            <v-row>
              <v-col
                v-for="(photo, index) in item.location_photos"
                :key="index"
                class="d-flex child-flex"
                cols="2"
              >
                <a :href="photo.url" target="_blank" rel="noopener noreferrer">
                  <v-img
                    :src="photo.url"
                    aspect-ratio="1"
                    class="grey lighten-2"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </a>
              </v-col>
            </v-row>
          </v-card>
          <v-col cols="2">
            <form @submit.prevent="uploadTaskFile(item)">
              <v-file-input
                :rules="rules"
                v-model="taskFiles"
                accept="image/png, image/jpeg, image/bmp"
                prepend-icon="mdi-camera"
                color="deep-purple accent-4"
                counter
                label="File input"
                outlined
                required
              ></v-file-input>
              <v-btn type="submit">Feltöltés</v-btn>
            </form>
          </v-col>
        </v-tab-item>

        <v-tab-item class="fixing_method_item">
          <v-card flat>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="fixingMethod"
                solo
                @change="
                  updateData(
                    item,
                    'Task_locations',
                    'fixing_method',
                    'fixingMethod'
                  )
                "
              ></v-text-field>
            </v-col>
          </v-card>
        </v-tab-item>

        <v-tab-item class="required_site_preparation">
          <v-card flat>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="sitePreparation"
                solo
                @change="
                  updateData(
                    item,
                    'Task_locations',
                    'required_site_preparation',
                    'sitePreparation'
                  )
                "
              >
              </v-text-field>
            </v-col>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </td>
</template>

<script>
export default {
  props: {
    item: Object,
    headers: Array,
    rules: Array
  },
  data() {
    return {
      fixingMethod: this.item.fixing_method,
      sitePreparation: this.item.required_site_preparation,
      taskFiles: []
    };
  },
  methods: {
    uploadTaskFile(data) {
      console.log(data);
      this.$emit('uploadTaskFile', {
        taskId: data.id,
        locationId: data.location_id,
        fileUpload: true,
        file: this.taskFiles
      });
    },
    updateData(item, dbTable, dbColumn, key) {
      this.$emit(
        'updateTask',
        {
          dbTable: dbTable,
          dbColumn: dbColumn
        },
        { id: item.id, value: this[key] }
      );
    }
  }
};
</script>
