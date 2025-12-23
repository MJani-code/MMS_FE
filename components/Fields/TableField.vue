<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="filteredTasks"
      fixed-header
      :expanded.sync="expanded"
      show-expand
      show-select
      item-key="id"
      :item-class="tableClass"
      class="elevation-1 custom-table"
    >
      <!-- FilterRow in Desktop view-->
      <template v-slot:body.prepend>
        <tr v-if="!isMobile" class="filterRow">
          <td v-for="(header, index) in headers" :key="index">
            <v-select
              v-if="header.filterable && header.text === 'Típus'"
              v-model="filters[header.value]"
              :items="taskTypes"
              item-value="id"
              item-text="name"
              small-chips
              solo
              :placeholder="header.text"
              hide-details="auto"
              multiple
            />
            <v-text-field
              v-if="header.filterable && header.text === 'Zip'"
              v-model="filters[header.value]"
              :placeholder="header.text"
              solo
              hide-details="auto"
            />
            <v-text-field
              v-if="header.filterable && header.text === 'Település'"
              v-model="filters[header.value]"
              :placeholder="header.text"
              solo
              hide-details="auto"
            />
            <v-text-field
              v-if="header.filterable && header.text === 'Cím'"
              v-model="filters[header.value]"
              :placeholder="header.text"
              solo
              hide-details="auto"
            />
            <v-select
              v-if="header.filterable && header.text === 'Lokáció típus'"
              v-model="filters[header.value]"
              :items="locationTypes"
              item-value="id"
              item-text="name"
              small-chips
              solo
              :placeholder="header.text"
              hide-details="auto"
              multiple
            />
            <v-text-field
              v-if="
                header.filterable && header.text === 'Kivitelezési dátum(terv)'
              "
              v-model="filters.startDatePlan"
              type="datetime-local"
              class="datetime"
              label="Tól"
              hide-details="auto"
            />
            <v-text-field
              v-if="
                header.filterable && header.text === 'Kivitelezési dátum(terv)'
              "
              v-model="filters.endDatePlan"
              type="datetime-local"
              class="datetime"
              label="Ig"
              hide-details="auto"
            />
            <v-text-field
              v-if="
                header.filterable && header.text === 'Kivitelezési dátum(tény)'
              "
              v-model="filters.startDate"
              type="datetime-local"
              class="datetime"
              label="Tól"
              hide-details="auto"
            />
            <v-text-field
              v-if="
                header.filterable && header.text === 'Kivitelezési dátum(tény)'
              "
              v-model="filters.endDate"
              type="datetime-local"
              class="datetime"
              label="Ig"
              hide-details="auto"
            />
            <v-select
              v-if="header.filterable && header.text === 'Megbízottak'"
              v-model="filters[header.value]"
              :items="companies"
              item-value="id"
              item-text="name"
              small-chips
              solo
              :placeholder="header.text"
              hide-details="auto"
              multiple
            />
            <v-text-field
              v-if="header.filterable && header.text === 'Tof Shop Id'"
              v-model="filters[header.value]"
              :placeholder="header.text"
              solo
              hide-details="auto"
            />
            <v-text-field
              v-if="header.filterable && header.text === 'Box Id'"
              v-model="filters[header.value]"
              :placeholder="header.text"
              solo
              hide-details="auto"
            />
            <v-text-field
              v-if="header.filterable && header.text === 'Serial'"
              v-model="filters[header.value]"
              :placeholder="header.text"
              solo
              hide-details="auto"
            />
            <v-text-field
              v-if="header.filterable && header.text === 'Létrehozta'"
              v-model="filters.createdBy"
              :placeholder="header.text"
              solo
              hide-details="auto"
            />
            <v-text-field
              v-if="header.filterable && header.text === 'Létrehozva'"
              v-model="filters.startCreatedAt"
              type="datetime-local"
              class="datetime"
              label="Tól"
              hide-details="auto"
            />
            <v-text-field
              v-if="header.filterable && header.text === 'Létrehozva'"
              v-model="filters.endCreatedAt"
              type="datetime-local"
              class="datetime"
              label="Ig"
              hide-details="auto"
            />
          </td>
        </tr>

        <!-- FilterRow in Mobile view-->
        <v-expansion-panels v-else v-model="filtersAccordion">
          <v-expansion-panel class="accordion">
            <v-expansion-panel-header>Szűrők</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="4" md="4" sm="2">
                  <v-select
                    v-model="filters['type']"
                    :items="taskTypes"
                    item-value="id"
                    item-text="name"
                    small-chips
                    solo
                    placeholder="Típus"
                    hide-details="auto"
                    multiple
                  />
                </v-col>
                <v-col cols="4" md="4" sm="2">
                  <v-text-field
                    v-model="filters['zip']"
                    placeholder="Zip"
                    solo
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="4" md="4" sm="2">
                  <v-text-field
                    v-model="filters['city']"
                    placeholder="City"
                    solo
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4" md="4" sm="2">
                  <v-text-field
                    v-model="filters['tof_shop_id']"
                    placeholder="Tof ShopId"
                    solo
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="4" md="4" sm="2">
                  <v-text-field
                    v-model="filters['box_id']"
                    placeholder="Box Id"
                    solo
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="2">
                  <v-text-field
                    v-model="filters['serial']"
                    placeholder="Serial"
                    solo
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" md="4" sm="2">
                  <v-text-field
                    v-model="filters.startDatePlan"
                    type="datetime-local"
                    class="datetime"
                    label="Tól (tervezett)"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="6" md="4" sm="2">
                  <v-text-field
                    v-model="filters.endDatePlan"
                    type="datetime-local"
                    class="datetime"
                    label="Ig (tervezett)"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" md="4" sm="2">
                  <v-text-field
                    v-model="filters.startDate"
                    type="datetime-local"
                    class="datetime"
                    label="Tól (tény)"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="6" md="4" sm="2">
                  <v-text-field
                    v-model="filters.endDate"
                    type="datetime-local"
                    class="datetime"
                    label="Ig (tény)"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4" sm="2">
                  <v-text-field
                    v-model="filters.createdBy"
                    placeholder="Létrehozta"
                    solo
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="2">
                  <v-text-field
                    v-model="filters.createdAt"
                    type="datetime-local"
                    solo
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>

      <!-- Name -->
      <template #[`item.name`]="{ header, item }">
        <v-text-field
          v-model="item.name"
          solo
          hide-details="auto"
          class="partner_name"
          :disabled="isToDisable(header, item)"
          @change="
            updateTask(header, { id: item.location_id, value: item.name })
          "
        ></v-text-field>
      </template>

      <!-- Task Types -->
      <template #[`item.taskTypes`]="{ header, item }">
        <v-select
          v-model="item.taskTypes"
          :items="taskTypes"
          item-value="id"
          item-text="name"
          small-chips
          solo
          hide-details="auto"
          multiple
          :disabled="isToDisable(header, item)"
          @change="updateTask(header, { id: item.id, value: item.taskTypes })"
        >
          <template #selection="{ item: selectedItem }">
            <v-chip small :style="{ 'background-color': selectedItem.color }">
              <span>{{ selectedItem.name }}</span>
            </v-chip>
          </template>
        </v-select>
      </template>

      <!-- Status Partner ID -->
      <template #[`item.status_partner_id`]="{ header, item }">
        <v-select
          v-model="item.status_partner_id"
          :items="statuses"
          item-value="id"
          item-text="name"
          small-chips
          solo
          hide-details="auto"
          item-color="primary"
          @change="
            updateTask(header, { id: item.id, value: item.status_partner_id })
          "
        >
          <template #selection="{ item: selectedItem, index }">
            <v-chip
              v-if="index === 0"
              small
              :style="{ 'background-color': selectedItem.color }"
            >
              <span>{{ selectedItem.name }}</span>
            </v-chip>
          </template>
        </v-select>
      </template>

      <!-- Status Exohu ID -->
      <template #[`item.status_exohu_id`]="{ header, item }">
        <v-select
          v-model="item.status_exohu_id"
          :items="getStatuses(item.status_exohu_id, isToDisable(header, item))"
          item-value="id"
          item-text="name"
          small-chips
          solo
          hide-details="auto"
          :disabled="isToDisable(header, item)"
          @change="
            updateTask(header, {
              id: item.id,
              value: item.status_exohu_id
            })
          "
        >
          <template #selection="{ item: selectedItem, index }">
            <v-chip
              v-if="index === 0"
              small
              :style="{ 'background-color': selectedItem.color }"
            >
              <span>{{ selectedItem.name }}</span>
            </v-chip>
          </template>
        </v-select>
      </template>

      <!-- Zip -->
      <template #[`item.zip`]="{ header, item }">
        <v-text-field
          v-model="item.zip"
          solo
          hide-details="auto"
          class="zip"
          :disabled="isToDisable(header, item)"
          @change="
            updateTask(header, { id: item.location_id, value: item.zip })
          "
        ></v-text-field>
      </template>

      <!-- City -->
      <template #[`item.city`]="{ header, item }">
        <v-text-field
          v-model="item.city"
          solo
          hide-details="auto"
          class="city"
          :disabled="isToDisable(header, item)"
          @change="
            updateTask(header, { id: item.location_id, value: item.city })
          "
        ></v-text-field>
      </template>

      <!-- Address -->
      <template #[`item.address`]="{ header, item }">
        <v-text-field
          v-model="item.address"
          solo
          hide-details="auto"
          class="address"
          :disabled="isToDisable(header, item)"
          @change="
            updateTask(header, { id: item.location_id, value: item.address })
          "
        ></v-text-field>
      </template>

      <!-- Delivery Date -->
      <template #[`item.delivery_date`]="{ header, item }">
        <v-text-field
          v-model="item.delivery_date"
          solo
          hide-details="auto"
          type="datetime-local"
          class="datetime"
          :disabled="isToDisable(header, item)"
          @change="
            updateTask(header, { id: item.id, value: item.delivery_date })
          "
        ></v-text-field>
      </template>

      <!-- Planned Delivery Date -->
      <template #[`item.planned_delivery_date`]="{ header, item }">
        <v-text-field
          v-model="item.planned_delivery_date"
          type="datetime-local"
          class="datetime"
          solo
          hide-details="auto"
          :disabled="isToDisable(header, item)"
          @change="
            updateTask(header, {
              id: item.id,
              value: item.planned_delivery_date
            })
          "
        ></v-text-field>
      </template>

      <!-- Location Type -->
      <template #[`item.location_type`]="{ header, item }">
        <v-select
          v-model="item.location_type"
          :items="locationTypes"
          item-value="id"
          item-text="name"
          small-chips
          solo
          hide-details="auto"
          :disabled="isToDisable(header, item)"
          @change="
            updateTask(header, {
              id: item.location_id,
              value: item.location_type
            })
          "
        >
          <template #selection="{ item: selectedItem, index }">
            <v-chip
              v-if="index === 0"
              small
              :style="{ 'background-color': selectedItem.color }"
            >
              <span>{{ selectedItem.name }}</span>
            </v-chip>
          </template>
        </v-select>
      </template>

      <!-- Responsibles -->
      <template #[`item.responsibles`]="{ header, item }">
        <v-select
          v-model="item.responsibles"
          :items="companies"
          item-value="id"
          item-text="name"
          small-chips
          multiple
          solo
          hide-details="auto"
          deletable-chips
          :disabled="isToDisable(header, item)"
          @change="
            updateTask(header, { id: item.id, value: item.responsibles })
          "
        >
        </v-select>
      </template>

      <!-- Created By -->
      <template #[`item.createdBy`]="{ item }">
        <div class="createdBy">
          <v-chip color="primary">
            <v-avatar left>
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
            {{ item.createdBy }}
          </v-chip>
        </div>
      </template>

      <!-- Created At -->
      <template #[`item.createdAt`]="{ item }">
        <v-text-field
          v-model="item.createdAt"
          type="datetime-local"
          class="datetime"
          solo
          hide-details="auto"
          :disabled="true"
        ></v-text-field>
      </template>

      <!-- tofShopId -->
      <template #[`item.tof_shop_id`]="{ header, item }">
        <v-text-field
          v-model="item.tof_shop_id"
          solo
          hide-details="auto"
          class="tof_shop_id"
          :disabled="isToDisable(header, item)"
          @change="
            updateTask(header, {
              id: item.location_id,
              value: item.tof_shop_id
            })
          "
        >
          <template v-if="item.isActiveInAdmin == false" v-slot:append>
            <v-icon color="red"> mdi-cancel </v-icon>
          </template>
        </v-text-field>
      </template>

      <!-- box_id -->
      <template #[`item.box_id`]="{ header, item }">
        <v-text-field
          v-model="item.box_id"
          solo
          hide-details="auto"
          class="box_id"
          :disabled="isToDisable(header, item)"
          @change="
            updateTask(header, { id: item.location_id, value: item.box_id })
          "
        >
          <template
            v-if="item.box_id != item.pointId && item.pointId != null"
            v-slot:append
          >
            <v-icon color="red"> mdi-alert-circle </v-icon>
          </template>
        </v-text-field>
      </template>

      <!-- Serial -->
      <template #[`item.serial`]="{ header, item }">
        <v-combobox
          v-model="item.lockers"
          chips
          multiple
          solo
          :disabled="isToDisable(header, item)"
          @focus="getLengthOfSerials(item.lockers)"
          @change="addLocker(header, item)"
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              :color="checkLockerCondition(item)"
              close
              @click="select"
              @click:close="removeLocker(item)"
            >
              <v-icon v-if="item.fault" small> mdi-tools </v-icon>
              <v-icon
                small
                class="mr-2"
                @click.stop="copyToClipboard(item.serial)"
              >
                mdi-content-copy
              </v-icon>
              <strong>{{ item.serial }}</strong>
            </v-chip>
          </template>
        </v-combobox>
      </template>

      <!-- Footer -->
      <template v-slot:footer>
        <v-btn
          v-if="
            filteredTasks.length > 0 &&
            filteredTasks[0].status_exohu_id === 9 &&
            $store.getters['hasPermission']('21')
          "
          color="primary"
          dark
          class="ma-2"
          @click="downloadTig"
        >
          TIG letöltés
        </v-btn>
        <v-btn
          v-if="
            filteredTasks.length > 0 &&
            filteredTasks[0].status_exohu_id === 6 &&
            $store.getters['hasPermission']('24')
          "
          color="primary"
          dark
          class="ma-2"
          @click="downloadTasks"
        >
          Letöltés
        </v-btn>
        <p>
          show selected items
          {{ selected }}
        </p>
      </template>

      <!-- FillExpandedField -->
      <template #expanded-item="{ item }">
        <TableExpandedField
          :item="item"
          :headers="headers"
          :taskTypes="taskTypes"
          :lockerSerials="lockerSerials"
          :fees="fees"
          :rules="rules"
          @updateTask="updateTask"
          @updateLockerData="updateLockerData"
          @uploadTaskFile="uploadTaskFile"
          @addFee="addFee"
          @deleteFee="deleteFee"
          @verifyLocker="verifyLocker"
          @deletePhoto="deletePhoto"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import TableExpandedField from './TableExpandedField.vue';

export default {
  components: { TableExpandedField },
  props: {
    tasks: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    statuses: {
      type: Array,
      required: true
    },
    fees: {
      type: Array
    },
    allowedStatuses: {
      type: Array,
      required: true
    },
    locationTypes: {
      type: Array,
      required: true
    },
    taskTypes: {
      type: Array,
      required: true
    },
    lockerSerials: {
      type: Array
    },
    companies: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      serials: [],
      filters: {},
      selected: [],
      expanded: [],
      taskFiles: [],
      filtersAccordion: [],
      rules: [
        (value) =>
          !value ||
          value.size < 20000000 ||
          'Avatar size should be less than 20 MB!'
      ],
      isMobile: false
    };
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter((task) => {
        return Object.keys(this.filters).every((key) => {
          const filterValue = this.filters[key];

          if (!filterValue || filterValue.length === 0) {
            // Ha nincs szűrés, minden elem megjelenik
            return true;
          }
          if (key === 'startDatePlan' || key === 'endDatePlan') {
            // Ha a dátum oszlopról van szó, ellenőrizzük a tól-ig intervallumot
            const taskDate = new Date(task.planned_delivery_date); // Feltételezzük, hogy task.date a dátum
            const startDatePlan = new Date(this.filters.startDatePlan);
            const endDatePlan = new Date(this.filters.endDatePlan);

            return (
              (!this.filters.startDatePlan || taskDate >= startDatePlan) &&
              (!this.filters.endDatePlan || taskDate <= endDatePlan)
            );
          }
          if (key === 'startDate' || key === 'endDate') {
            // Ha a dátum oszlopról van szó, ellenőrizzük a tól-ig intervallumot
            const taskDate = new Date(task.delivery_date); // Feltételezzük, hogy task.date a dátum
            const startDate = new Date(this.filters.startDate);
            const endDate = new Date(this.filters.endDate);

            return (
              (!this.filters.startDate || taskDate >= startDate) &&
              (!this.filters.endDate || taskDate <= endDate)
            );
          }

          if (key === 'startCreatedAt' || key === 'endCreatedAt') {
            // Ha a 'startCreatedAt' vagy 'endCreatedAt' oszlopról van szó, ellenőrizzük a tól-ig intervallumot
            const taskDate = new Date(task.createdAt);
            const startDate = new Date(this.filters.startCreatedAt);
            const endDate = new Date(this.filters.endCreatedAt);

            return (
              (!this.filters.startCreatedAt || taskDate >= startDate) &&
              (!this.filters.endCreatedAt || taskDate <= endDate)
            );
          }

          if (key === 'responsibles') {
            // Ha a 'responsibles' oszlopról van szó, ellenőrizzük, hogy bármelyik felelős benne van-e
            if (Array.isArray(filterValue) && filterValue.length > 0) {
              return filterValue.some((responsibleId) =>
                task.responsibles.includes(responsibleId)
              );
            }
            return true; // Ha nincs szűrés, minden elem megjelenik
          }

          if (key === 'serial') {
            // Ha a 'serial' oszlopról van szó, ellenőrizzük, hogy bármelyik felelős benne van-e
            if (filterValue.length > 0) {
              return task.lockers.some(
                (locker) =>
                  locker.serial &&
                  locker.serial
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
              );
            }
            return true; // Ha nincs szűrés, minden elem megjelenik
          }

          if (key === 'taskTypes') {
            // Ha a 'tasTypes' oszlopról van szó, ellenőrizzük, hogy bármelyik típus benne van-e
            if (Array.isArray(filterValue) && filterValue.length > 0) {
              return filterValue.some((taskTypeId) =>
                task.taskTypes.includes(taskTypeId)
              );
            }
            return true; // Ha nincs szűrés, minden elem megjelenik
          }

          if (Array.isArray(filterValue)) {
            // Ha az összes lehetséges típus ki van jelölve, akkor minden elem megjelenik
            const allSelected = filterValue.length === this.taskTypes.length;
            return allSelected || filterValue.includes(task[key]);
          }

          // Más mezők egyszerű összehasonlítása
          return String(task[key])
            .toLowerCase()
            .includes(String(filterValue).toLowerCase());
        });
      });
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    checkLockerCondition(locker) {
      if (
        locker.fault ||
        locker.is_registered === 0 ||
        locker.is_active === 0 ||
        locker.privateKey1Error === 1
      ) {
        return 'error';
      } else {
        return 'success';
      }
    },
    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.showNotification('success', 'Szöveg másolva a vágólapra');
        })
        .catch((err) => {
          this.showNotification('error', err);
        });
    },
    getStatuses(statusId, isSelectionDisabled) {
      if (!isSelectionDisabled) {
        return this.allowedStatuses;
      } else {
        return this.statuses;
      }
    },
    isToDisable(header, item) {
      if (
        item.status_exohu_id === 10 &&
        !this.$store.getters['hasPermission']('7')
      ) {
        return true;
      }
      if (
        item.status_exohu_id === 9 &&
        !this.$store.getters['hasPermission']('8')
      ) {
        return true;
      }
      if (
        item.status_exohu_id === 9 &&
        !this.$store.getters['hasPermission']('21')
      ) {
        return true;
      }
      if (
        header.value === 'box_id' &&
        !this.$store.getters['hasPermission']('15')
      ) {
        return true;
      }
      if (
        header.value === 'tof_shop_id' &&
        !this.$store.getters['hasPermission']('16')
      ) {
        return true;
      }
    },
    updateTask(header, selectedItem) {
      let color = '';
      if (header.dbColumn === 'status_by_exohu_id') {
        color = this.getColorOfSelectedStatus(selectedItem['value']);
      }

      //Ha dátumot alaphelyzetbe állítjuk a backendnek 0000-00-00 00:00:00 formátumban kell elküldeni
      if (
        header.dbColumn === 'delivery_date' &&
        selectedItem[header.dbColumn] === ''
      ) {
        selectedItem[header.dbColumn] = '0000-00-00 00:00:00';
      }
      if (
        header.dbColumn === 'planned_delivery_date' &&
        selectedItem[header.dbColumn] === ''
      ) {
        selectedItem[header.dbColumn] = '0000-00-00 00:00:00';
      }

      this.$emit('eventToAccordion', {
        id: selectedItem.id,
        dbTable: header.dbTable,
        dbColumn: header.dbColumn,
        value: selectedItem['value'],
        color: color
      });
    },
    getColorOfSelectedStatus(statusId) {
      return this.statuses.find((status) => status.id === statusId).color;
    },
    updateLockerData(data) {
      this.$emit('updateLockerData', data);
    },
    addLocker(header, item) {
      if (item.lockers.length < this.lockerSerialsLengths) {
        this.$store.dispatch('notification/addNotification', {
          type: 'error',
          message: 'ez az elem már szerepel a listában',
          timeout: 5000
        });
        return;
      } else {
        const newValue = item.lockers.slice(-1)[0];
        this.$emit('addLocker', {
          task_id: item.id,
          tof_shop_id: item.tof_shop_id,
          task_locations_id: item.location_id,
          dbTable: header.dbTable,
          dbColumn: header.dbColumn,
          value: newValue
        });
      }
    },
    getLengthOfSerials(value) {
      if (value != undefined) {
        const lockerSerialsLengths = value.length;
        this.lockerSerialsLengths = lockerSerialsLengths;
      }
    },
    removeLocker(item) {
      this.$emit('removeLocker', {
        value: item.serial,
        id: item.id,
        taskId: item.task_id
      });
    },
    uploadTaskFile(item) {
      this.$emit('uploadTaskFile', item);
    },
    addFee(data) {
      this.$emit('addFee', data);
    },
    downloadTig() {
      this.$emit('downloadTig');
    },
    downloadTasks() {
      this.$emit('downloadTasks');
    },
    deleteFee(data) {
      this.$emit('deleteFee', data);
    },
    deletePhoto(data) {
      this.$emit('deletePhoto', data);
    },
    verifyLocker(locker) {
      this.$emit('verifyLocker', locker);
    },
    tableClass() {
      return 'table-row';
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 480;
    },
    showNotification($type, $message) {
      this.$store.dispatch('notification/addNotification', {
        type: $type,
        message: $message,
        timeout: 5000
      });
    }
  }
};
</script>

<style lang="scss">
td.text-start .v-input__slot {
  box-shadow: none !important;
}

.zip,
.tof_shop_id,
.createdBy,
.box_id {
  min-width: 100px !important;
}

.city {
  min-width: 120px !important;
}

.address,
.partner_name {
  min-width: 200px !important;
}
thead.v-data-table-header th:nth-child(1),
thead.v-data-table-header th:nth-child(2) {
  position: sticky;
  z-index: 20 !important; /* Biztosítsd, hogy a sticky oszlop a többi fölött legyen */
}
thead.v-data-table-header th:nth-child(1) {
  left: 0;
}
thead.v-data-table-header th:nth-child(2) {
  left: 40px;
}
.theme--light thead.v-data-table-header th:nth-child(1),
.theme--light thead.v-data-table-header th:nth-child(2) {
  background: white; /* Állítsd be a háttérszínt világos témához */
}
tr.table-row td:nth-child(1),
tr.table-row td:nth-child(2) {
  position: sticky;
  z-index: 1; /* Biztosítsd, hogy a sticky oszlop a többi fölött legyen */
}
.theme--dark tr.table-row td:nth-child(1) {
  left: 0;
}
.theme--light tr.table-row td:nth-child(1) {
  left: 0;
  background: white;
}
.theme--dark tr.table-row td:nth-child(2) {
  left: 40px;
}
.theme--light tr.table-row td:nth-child(2) {
  left: 40px;
  background: white;
}
tr.filterRow td:nth-child(1),
tr.filterRow td:nth-child(2) {
  position: sticky;
  z-index: 1; /* Biztosítsd, hogy a sticky oszlop a többi fölött legyen */
}
tr.filterRow td:nth-child(1) {
  left: 0;
}
tr.filterRow td:nth-child(2) {
  left: 40px;
}
.theme--dark tr.table-row td:nth-child(1),
.theme--dark tr.table-row td:nth-child(2) {
  background: #1e1e1e; /* Állítsd be a háttérszínt sötét témához */
}
.theme--dark tr.filterRow td:nth-child(1),
.theme--dark tr.filterRow td:nth-child(2) {
  background: #4f4e4e; /* Állítsd be a háttérszínt sötét témához */
}
.theme--light tr.filterRow td:nth-child(1),
.theme--light tr.filterRow td:nth-child(2) {
  background: #c3c1c1;
}
.v-data-table
  > .v-data-table__wrapper
  tbody
  tr.v-data-table__expanded__content {
  box-shadow: none;
}
.v-data-table
  > .v-data-table__wrapper
  tbody
  tr.v-data-table__expanded__content
  td {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.v-data-table
  > .v-data-table__wrapper
  tbody
  tr.v-data-table__expanded__content
  .v-tabs-items {
  padding-top: 12px !important;
}
.v-tab {
  font-size: 12px;
}
.filterRow input {
  min-width: 50px;
}
tr:hover {
  background-color: #f07c0018 !important;
}
.filterRow {
  background-color: rgba(128, 128, 128, 0.497) !important;
}
.filterRow:hover {
  background-color: rgba(128, 128, 128, 0.497) !important;
}
td.text-start {
  padding: 10px !important;
}
.datetime {
  padding: 10px 0px 10px 0px !important;
  min-width: 170px;
}
.v-list-item__title {
  font-size: inherit;
}
.table-row .v-text-field__details {
  display: none;
}
.table-row .v-input__slot {
  margin-bottom: unset;
}
.v-data-table__mobile-row {
  padding-bottom: 10px !important;
}
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 0px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}
.v-data-table__wrapper {
  max-height: 450px;
}
@media (max-width: 600px) {
  .filterRow {
    display: grid;
  }
}
@media (max-width: 480px) {
  .v-expansion-panel-content__wrap {
    padding: 0px 14px 16px !important;
  }
}
</style>
