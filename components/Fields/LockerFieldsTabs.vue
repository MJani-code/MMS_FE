<template>
  <v-col cols="12" sm="4" md="8" lg="11" xl="11" style="padding-top: unset">
    <v-card :style="{ width: cardWidth }">
      <v-tabs v-model="tab" background-color="primary" dark show-arrows>
        <v-tab> Ellenőrző </v-tab>
        <v-tab> Javítás </v-tab>
        <v-tab class="tab-general"> Általános </v-tab>
      </v-tabs>

      <v-tabs-slider color="teal lighten-3"></v-tabs-slider>

      <v-tabs-items v-model="tab">
        <!-- Check -->
        <v-tab-item class="tabitem-check">
          <v-form>
            <v-btn color="primary" class="mx-2" small @click="verifyLocker"
              >Állapot ellenőrző</v-btn
            ><br /><br />
            <div class="px-2">
              <v-icon :color="locker.is_registered ? 'success' : 'error'"
                >mdi-link-plus</v-icon
              >
              <v-icon :color="locker.is_active ? 'success' : 'error'"
                >mdi-check-circle</v-icon
              >
              <v-icon :color="!locker.privateKey1Error ? 'success' : 'error'"
                >mdi-key</v-icon
              >
              <v-icon :color="isConnectionLost ? 'error' : 'success'"
                >mdi-access-point-remove</v-icon
              >
              <v-icon color="success">{{ locker.currentVersion }}</v-icon>
            </div>
            <br />
            <v-list-item-title class="ml-2"
              >Utolsó csatlakozási idő:
              <span
                :class="isConnectionLost ? 'error--text' : 'success--text'"
                >{{ formattedLastConnectionTimestamp }}</span
              >
            </v-list-item-title>
            <br />
            <v-col cols="12" sm="6" md="6" lg="5" xl="5">
              <v-textarea
                v-model="fault"
                label="Hiba"
                @change="
                  updateLockerData(fault, locker.id, 'task_lockers', 'fault')
                "
                outlined
                clearable
              ></v-textarea>
            </v-col>
          </v-form>
        </v-tab-item>

        <!-- Repair -->
        <v-tab-item class="tabitem-repair">
          <v-row no-gutters>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
              <v-card class="ma-2">
                <v-card-text>
                  <v-form ref="form" @submit.prevent="addIntervention()">
                    <v-row class="px-4 d-grid" style="gap: 10px">
                      <v-select
                        style="max-width: 350px"
                        :value="newIntervention.issues.map((i) => i.id)"
                        @change="onIssuesChange"
                        :items="issues"
                        item-text="name"
                        item-value="id"
                        label="Hiba kiválasztása"
                        multiple
                        chips
                        clearable
                      >
                      </v-select>
                      <v-select
                        v-model="newIntervention.interventionId"
                        :items="interventionList"
                        item-text="name"
                        item-value="id"
                        label="Beavatkozás kiválasztása"
                        chips
                        clearable
                      >
                      </v-select>
                    </v-row>
                    <v-row class="px-4 d-grid" style="gap: 10px">
                      <v-select
                        style="max-width: 330px"
                        :value="newIntervention.parts.map((p) => p.stockId)"
                        @change="checkValue($event)"
                        :items="spareparts"
                        item-text="name"
                        item-value="stockId"
                        label="Alkatrész hozzáadása"
                        multiple
                        chips
                        clearable
                      >
                      </v-select>
                      <v-checkbox
                        v-model="checkbox"
                        @change="
                          (val) =>
                            (newIntervention.issues =
                              newIntervention.issues.map((i) => ({
                                ...i,
                                solved: val
                              })))
                        "
                        label="Hiba kijavítva"
                      ></v-checkbox>
                    </v-row>
                    <v-row class="px-4">
                      <v-textarea
                        v-model="newIntervention['notes']"
                        label="Leírás"
                        counter="500"
                        auto-grow
                        outlined
                        clearable
                      ></v-textarea>
                    </v-row>
                    <v-row class="d-flex justify-end">
                      <div class="px-4">
                        <v-btn type="submit" class="mb-2" small>Hozzáad</v-btn>
                      </div>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="5" class="px-6">
              <repair-reports
                :interventions="interventions"
                :locker="locker"
                :taskId="taskId"
              ></repair-reports>
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- General -->
        <v-tab-item class="tabitem-general">
          <v-form ref="">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="2" xl="2">
                <v-text-field
                  v-model="brand"
                  label="Brand"
                  class="px-2"
                  @change="
                    updateLockerData(brand, locker.id, 'task_lockers', 'brand')
                  "
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="2" xl="2">
                <v-text-field
                  v-model="type"
                  label="Típus"
                  class="px-2"
                  @change="
                    updateLockerData(type, locker.id, 'task_lockers', 'type')
                  "
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <!-- controller Id -->
              <v-col cols="12" sm="6" md="6" lg="2" xl="2">
                <v-text-field
                  v-model="controllerId"
                  label="Controller Id"
                  class="px-2"
                  @change="
                    updateLockerData(
                      controllerId,
                      locker.id,
                      'task_lockers',
                      'controller_id'
                    )
                  "
                ></v-text-field>
              </v-col>
            </v-row>
            <v-checkbox
              v-model="isRegistered"
              label="Regisztrált"
              class="mt-0 px-2"
              @change="
                updateLockerData(
                  isRegistered ? 1 : 0,
                  locker.id,
                  'task_lockers',
                  'is_registered'
                )
              "
            ></v-checkbox>
            <v-checkbox
              v-model="isActive"
              label="Aktív"
              class="mt-0 px-2"
              @change="
                updateLockerData(
                  isActive ? 1 : 0,
                  locker.id,
                  'task_lockers',
                  'is_active'
                )
              "
            ></v-checkbox>
          </v-form>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-col>
</template>

<script>
import RepairReports from '../pages/tasks/RepairReports.vue';
export default {
  components: { RepairReports },
  props: {
    locker: {
      type: Object,
      required: true
    },
    taskId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    tab: null,
    isActive: 0,
    isRegistered: 0,
    isConnectionLost: 0,
    allowSpaces: false,
    checkbox: false,
    max: 0,
    brand: '',
    fault: '',
    type: '',
    controllerId: '',
    newIntervention: {
      issues: [],
      interventionId: null,
      uuid: null,
      parts: [],
      notes: ''
    }
  }),
  computed: {
    cardWidth() {
      //kijelző szélességétől függően állítja a kártya szélességét
      return window.innerWidth < 600 ? '220px' : '100%';
    },
    formattedLastConnectionTimestamp() {
      const timestamp = this.locker.lastConnectionTimestamp;
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    },
    issues() {
      return this.$store.getters['locker/repair/getIssues'];
    },
    interventionList() {
      return this.$store.getters['locker/repair/getInterventionList'] || [];
    },
    spareparts() {
      return this.$store.getters['locker/repair/getSpareParts'] || [];
    },
    interventions() {
      return this.$store.getters['locker/repair/getInterventions'] || [];
    }
  },
  async mounted() {
    this.updateLocalLockerData();
    await this.fetchIssues();
  },
  watch: {
    locker: {
      handler() {
        this.updateLocalLockerData();
        this.checkConnectionStatus();
      },
      deep: true
    }
  },
  methods: {
    checkValue(val) {
      console.log('Selected spare parts:', val);
      const selected = Array.isArray(val) ? val : [];
      const partsByStockId = (this.spareparts || []).reduce((acc, p) => {
        acc[p.stockId] = p;
        return acc;
      }, {});
      this.newIntervention.parts = selected.map((stockId) => {
        const existing = (this.newIntervention.parts || []).find(
          (p) => p.stockId === stockId
        );
        const part = partsByStockId[stockId] || {};
        const unitPrice = part.unitPrice ?? part.unit_price ?? 0;
        return {
          stockId,
          quantity: existing ? existing.quantity : 1,
          unitPrice,
          supplierId: part.supplierId
        };
      });

      // (val) =>
      //   (newIntervention.parts = val.map((stockId) => ({
      //     stockId,
      //     quantity: 1
      //   })));
    },
    updateLockerData(value, lockerId, dbTable, dbColumn) {
      this.$emit('updateLockerData', {
        id: lockerId,
        task_id: this.taskId,
        dbTable: dbTable,
        dbColumn: dbColumn,
        value: value
      });
    },
    updateLocalLockerData() {
      this.isActive = this.locker.is_active;
      this.isRegistered = this.locker.is_registered;
      this.brand = this.locker.brand;
      this.fault = this.locker.fault;
      this.type = this.locker.type;
      this.controllerId = this.locker.controllerId;
      // ensure the newIntervention.uuid is populated from the locker prop
      // use locker.serial (consistent with fetchIssues usage)
      this.newIntervention.uuid = this.locker.serial;
    },
    verifyLocker() {
      this.$emit('verifyLocker', {
        taskId: this.taskId,
        data: this.locker
      });
    },
    checkConnectionStatus() {
      const timestamp = this.locker.lastConnectionTimestamp;
      if (!timestamp) return;
      const date = new Date(timestamp * 1000);
      //Ha a timestamp a jelenlegi időpponttól több mint 12 órával kevesebb, akkor a kapcsolat megszakadt
      this.isConnectionLost = date < new Date(Date.now() - 12 * 60 * 60 * 1000);
    },
    async fetchIssues() {
      // Explicit hívás a fetchIssuesAction-re
      await this.$store.dispatch('locker/repair/fetchIssuesAction', {
        taskId: this.taskId,
        uuid: this.locker.serial
      });
    },
    onIssuesChange(val) {
      // detect removal: if new selection length is smaller than previous, uncheck the checkbox
      const prevLen = (this.newIntervention.issues || []).length;
      const issues = (val || []).map((id) => ({ id }));
      if (val.length < prevLen) {
        this.checkbox = false;
        // ensure solved flag is false for remaining issues
        issues.forEach((i) => (i.solved = false));
      }
      this.newIntervention.issues = issues;
    },
    addIntervention(form) {
      console.log('Adding intervention with data:', this.newIntervention);
      this.$store.dispatch('locker/repair/addInterventionAction', {
        taskId: this.taskId,
        interventionData: this.newIntervention
      });
    }
  }
};
</script>
