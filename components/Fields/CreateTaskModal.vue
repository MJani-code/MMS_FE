<template>
  <v-row justify="center">
    <v-dialog :value="isOpen" persistent max-width="600">
      <v-card>
        <v-card-title>Megbízás létrehozása</v-card-title>
        <v-form ref="createTask" @submit.prevent="onSubmit">
          <v-container>
            <v-row>
              <!-- TODO: Megbízás leírása, helyszín, megbízás típusa, locker uuid, tervezett kezdési időpont, megbízott -->
              <v-col cols="12" md="6">
                <v-combobox
                  v-model="data.selectedLocation"
                  :items="payload.locations ? payload.locations : []"
                  item-text="nameAndAddress"
                  item-value="tofShopId"
                  label="Helyszín"
                  :rules="[rules.required]"
                >
                </v-combobox>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="data.taskType"
                  :items="payload.taskTypes ? payload.taskTypes : []"
                  item-text="name"
                  item-value="id"
                  label="Megbízás típusa"
                  :rules="[rules.required]"
                >
                </v-select>
              </v-col>
              <v-col v-if="isLockerTask" cols="12" md="6">
                <v-select
                  v-model="selectedLockers"
                  :items="filteredLockers"
                  item-text="serial"
                  label="Locker"
                  :rules="[rules.required]"
                  multiple
                  @change="updateLockers"
                >
                </v-select>
              </v-col>
              <v-col v-if="data.taskType === 3" cols="12" md="4">
                <v-text-field
                  v-model="data.location.fixingMethod"
                  label="Rögzítés módja"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col v-if="data.taskType === 3" cols="12" md="6">
                <v-text-field
                  v-model="data.location.requiredSitePreparation"
                  label="Szükséges helyszín előkészítés"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col v-if="data.taskType === 3" cols="12" md="12">
                <v-textarea
                  v-model="data.location.comment"
                  label="Megjegyzés"
                  hide-details
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                v-for="(locker, index) in data.lockers"
                :key="index"
                cols="12"
                md="6"
              >
                <v-card class="pa-6 mx-2">
                  <v-card-title class="text-body-2">
                    <v-icon left>mdi-locker</v-icon>
                    {{ locker.uuid }}
                  </v-card-title>
                  <v-row
                    v-for="(issue, issueIndex) in locker.issues"
                    :key="issueIndex"
                  >
                    <v-col cols="12" md="12" class="pa-2">
                      <v-select
                        v-model="issue.type"
                        :items="
                          payload.lockerIssueTypes
                            ? payload.lockerIssueTypes
                            : []
                        "
                        item-text="name"
                        item-value="id"
                        label="Hibatípus"
                        :rules="[rules.lockerIssueRequired]"
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="12" class="pa-2">
                      <v-text-field
                        v-model="issue.compartmentNumber"
                        label="Rekesz szám"
                        hide-details
                        :rules="
                          [1, 2].includes(Number(issue.type))
                            ? [rules.required]
                            : []
                        "
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-btn @click="addIssue(index)" class="mt-4"
                    >Új hiba hozzáadása</v-btn
                  >
                  <v-textarea
                    v-model="locker.description"
                    label="Leírás"
                    hide-details
                  ></v-textarea>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="data.plannedDeliveryDate"
                  type="date"
                  class="date"
                  label="Határidő"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="data.responsible"
                  :items="payload.responsibles ? payload.responsibles : []"
                  item-text="name"
                  item-value="id"
                  label="Megbízott"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn @click="closeModal">Mégsem</v-btn>
              <v-btn type="submit" class="primary">Feltöltés</v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { taskMixin } from '@/mixins/taskMixin.js';

export default {
  mixins: [taskMixin],
  props: { loading: { type: Boolean, default: false } },
  data() {
    return {
      data: {
        selectedLocation: '',
        lockers: [],
        plannedDeliveryDate: '',
        responsible: '',
        taskType: '',
        location: {
          fixingMethod: '',
          requiredSitePreparation: '',
          comment: ''
        }
      },
      rules: {
        required: (value) => !!value || 'Kötelező mező',
        lockerIssueRequired: (value) => {
          if ([1, 2, 8].includes(Number(this.data.taskType))) {
            return !!value || 'Kötelező mező';
          }
          return true;
        }
      },
      payload: [],
      selectedLockers: []
    };
  },
  computed: {
    isOpen() {
      return this.$store.state.isModalCreateTaskOpen;
    },
    filteredLockers() {
      if (!this.data.selectedLocation) return [];
      return this.payload.lockers.filter(
        (locker) => locker.tofShopId === this.data.selectedLocation['tofShopId']
      );
    },
    getLockerIssueRules() {
      return this.selectedLockers.length > 0 ? [this.rules.required] : [];
    },
    isLockerTask() {
      return [1, 2, 8].includes(Number(this.data.taskType));
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.turnOnLoading();
        this.handleGetDataForCreateTask();
      }
    }
  },
  methods: {
    async handleGetDataForCreateTask() {
      try {
        const result = await this.getDataForCreateTask();
        if (result.data.status === 200) {
          this.payload = result.data.payload;
        } else {
          this.showNotification('error', result.data.message);
        }
      } catch (error) {
        this.showNotification('error', error.message);
      } finally {
        this.turnOffLoading();
      }
    },
    closeModal() {
      this.$store.commit('closeCreateTaskModal');
    },
    async onSubmit() {
      const isValid = await this.$refs.createTask.validate();
      if (!isValid) {
        return;
      } else {
        this.createTask(this.data);
        //making form empty
        this.$refs.createTask.reset();
        this.data.lockers = [];
        this.selectedLockers = [];
      }
    },
    createTask() {
      this.turnOnLoading();
      //emit event to parent
      this.$emit('createTask', this.data);
    },
    turnOnLoading() {
      this.$store.commit('turnOnLoading');
    },
    turnOffLoading() {
      this.$store.commit('turnOffLoading');
    },
    showNotification($type, $message) {
      this.$store.dispatch('notification/addNotification', {
        type: $type,
        message: $message,
        timeout: 5000
      });
    },
    getLockerSerial(lockerId) {
      const locker = this.payload.lockers.find((l) => l.id === lockerId);
      return locker ? locker.serial : '';
    },
    updateLockers(selectedLockers) {
      var lockerId = this.filteredLockers.find(
        (l) => l.serial === selectedLockers[0]
      )
        ? this.filteredLockers.find((l) => l.serial === selectedLockers[0]).id
        : '';
      var brand = this.filteredLockers.find(
        (l) => l.serial === selectedLockers[0]
      )
        ? this.filteredLockers.find((l) => l.serial === selectedLockers[0])
            .brand
        : '';
      var type = this.filteredLockers.find(
        (l) => l.serial === selectedLockers[0]
      )
        ? this.filteredLockers.find((l) => l.serial === selectedLockers[0]).type
        : '';
      this.data.lockers = selectedLockers.map((serial) => ({
        serial,
        lockerId,
        brand,
        type,
        issues: [
          {
            type: '',
            compartmentNumber: ''
          }
        ],
        description: ''
      }));
      console.log('Lockers', this.data.lockers);
    },
    addIssue(lockerIndex) {
      this.data.lockers[lockerIndex].issues.push({
        type: '',
        compartmentNumber: ''
      });
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
