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
                <v-select
                  v-model="data.tofShopId"
                  :items="payload.locations ? payload.locations : []"
                  item-text="nameAndAddress"
                  item-value="tof_shop_id"
                  label="Helyszín"
                  :rules="[rules.required]"
                >
                </v-select>
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
              <v-col
                v-if="data.taskType === 1 || data.taskType === 2"
                cols="12"
                md="6"
              >
                <v-select
                  v-model="selectedLockers"
                  :items="filteredLockers"
                  item-text="serial"
                  item-value="serial"
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
                        :rules="getLockerIssueRules"
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="12" class="pa-2">
                      <v-text-field
                        v-model="issue.compartmentNumber"
                        label="Rekesz szám"
                        hide-details
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
                  :rules="[rules.required]"
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
                  :rules="[rules.required]"
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
        tofShopId: '',
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
        required: (value) => !!value || 'Kötelező mező'
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
      if (!this.data.tofShopId) return [];
      return this.payload.lockers.filter(
        (locker) => locker.tofShopId === this.data.tofShopId
      );
    },
    getLockerIssueRules() {
      return this.selectedLockers.length > 0 ? [this.rules.required] : [];
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
          console.log('payload', this.payload);
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
        console.log('data', this.data);
        this.createTask(this.data);
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
      this.data.lockers = selectedLockers.map((uuid) => ({
        uuid,
        issues: [
          {
            type: '',
            compartmentNumber: ''
          }
        ],
        description: ''
      }));
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
