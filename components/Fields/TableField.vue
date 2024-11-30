<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="filteredTasks"
      fixed-header
      :expanded.sync="expanded"
      show-expand
      :item-class="tableClass"
      class="elevation-1 custom table"
    >
      <!-- FilterRow -->
      <template v-slot:body.prepend>
        <tr class="filterRow">
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
            <v-select
              v-if="header.filterable && header.text === 'Státusz(partner)'"
              v-model="filters[header.value]"
              :items="statuses"
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
              solo
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
              solo
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
              solo
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
              solo
              hide-details="auto"
            />
            <v-select
              v-if="header.filterable && header.text === 'Megbízottak'"
              v-model="filters[header.value]"
              :items="users"
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
              v-if="header.filterable && header.text === 'Serial'"
              v-model="filters['lockerSerials']"
              :placeholder="header.text"
              solo
              hide-details="auto"
            />
          </td>
        </tr>
      </template>

      <!-- FillCells -->
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
          :disabled="isToDisable(item)"
          @change="updateTask(header, { id: item.id, value: item.taskTypes })"
        >
          <template #selection="{ item: selectedItem }">
            <v-chip small :style="{ 'background-color': selectedItem.color }">
              <span>{{ selectedItem.name }}</span>
            </v-chip>
          </template>
        </v-select>
      </template>
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
      <template #[`item.status_exohu_id`]="{ header, item }">
        <v-select
          v-model="item.status_exohu_id"
          :items="getStatuses(item.status_exohu_id, isToDisable(item))"
          item-value="id"
          item-text="name"
          small-chips
          solo
          hide-details="auto"
          :disabled="isToDisable(item)"
          @change="
            updateTask(header, { id: item.id, value: item.status_exohu_id })
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
      <template #[`item.zip`]="{ header, item }">
        <v-text-field
          v-model="item.zip"
          solo
          hide-details="auto"
          class="zip"
          :disabled="isToDisable(item)"
          @change="updateTask(header, item)"
        ></v-text-field>
      </template>
      <template #[`item.city`]="{ header, item }">
        <v-text-field
          v-model="item.city"
          solo
          hide-details="auto"
          class="city"
          :disabled="isToDisable(item)"
          @change="updateTask(header, item)"
        ></v-text-field>
      </template>
      <template #[`item.address`]="{ header, item }">
        <v-text-field
          v-model="item.address"
          solo
          hide-details="auto"
          class="address"
          :disabled="isToDisable(item)"
          @change="updateTask(header, item)"
        ></v-text-field>
      </template>
      <template #[`item.delivery_date`]="{ header, item }">
        <v-text-field
          v-model="item.delivery_date"
          solo
          hide-details="auto"
          type="datetime-local"
          class="datetime"
          :disabled="isToDisable(item)"
          @change="updateTask(header, item)"
        ></v-text-field>
      </template>
      <template #[`item.planned_delivery_date`]="{ header, item }">
        <v-text-field
          v-model="item.planned_delivery_date"
          type="datetime-local"
          class="datetime"
          solo
          hide-details="auto"
          :disabled="isToDisable(item)"
          @change="updateTask(header, item)"
        ></v-text-field>
      </template>
      <template #[`item.location_type`]="{ header, item }">
        <v-select
          v-model="item.location_type"
          :items="locationTypes"
          item-value="id"
          item-text="name"
          small-chips
          solo
          hide-details="auto"
          :disabled="isToDisable(item)"
          @change="
            updateTask(header, { id: item.id, value: item.location_type })
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
      <template #[`item.responsibles`]="{ header, item }">
        <v-select
          v-model="item.responsibles"
          :items="users"
          item-value="id"
          item-text="name"
          small-chips
          multiple
          solo
          hide-details="auto"
          deletable-chips
          :disabled="isToDisable(item)"
          @change="
            updateTask(header, { id: item.id, value: item.responsibles })
          "
        >
        </v-select>
      </template>
      <template #[`item.tof_shop_id`]="{ header, item }">
        <v-text-field
          v-model="item.tof_shop_id"
          solo
          hide-details="auto"
          class="tof_shop_id"
          :disabled="isToDisable(item)"
          @change="updateTask(header, item)"
        ></v-text-field>
      </template>
      <template #[`item.serial`]="{ header, item }">
        <v-combobox
          v-model="item.lockerSerials"
          chips
          multiple
          solo
          :disabled="isToDisable(item)"
          @focus="getLengthOfSerials(item.lockerSerials)"
          @change="addLocker(header, item)"
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              @click="select"
              @click:close="removeLocker(item)"
            >
              <strong>{{ item }}</strong>
            </v-chip>
          </template>
        </v-combobox>
      </template>

      <!-- FillExpandedField -->
      <template #expanded-item="{ item }">
        <TableExpandedField
          :item="item"
          :headers="headers"
          :taskTypes="taskTypes"
          :rules="rules"
          @updateTask="updateTask"
          @uploadTaskFile="uploadTaskFile"
          @addFee="addFee"
          @deleteFee="deleteFee"
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
    users: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      lockerSerialsLengths: null,
      serials: [],
      filters: {},
      expanded: [],
      taskFiles: [],
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 20 MB!'
      ]
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

          if (key === 'responsibles') {
            // Ha a 'responsibles' oszlopról van szó, ellenőrizzük, hogy bármelyik felelős benne van-e
            if (Array.isArray(filterValue) && filterValue.length > 0) {
              return filterValue.some((responsibleId) =>
                task.responsibles.includes(responsibleId)
              );
            }
            return true; // Ha nincs szűrés, minden elem megjelenik
          }

          if (key === 'taskTypes') {
            // Ha a 'responsibles' oszlopról van szó, ellenőrizzük, hogy bármelyik felelős benne van-e
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
  mounted() {},
  methods: {
    getStatuses(statusId, isSelectionDisabled) {
      if (!isSelectionDisabled) {
        return this.allowedStatuses;
      } else {
        return this.statuses;
      }
    },
    isToDisable(item) {
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
    },
    updateTask(header, selectedItem) {
      this.$emit('eventToAccordion', {
        task_id: selectedItem.id,
        dbTable: header.dbTable,
        dbColumn: header.dbColumn,
        value: selectedItem['value']
          ? selectedItem['value']
          : selectedItem[header.dbColumn]
      });
    },
    addLocker(header, item) {
      if (item.lockerSerials.length < this.lockerSerialsLengths) {
        this.$store.dispatch('notification/addNotification', {
          type: 'error',
          message: 'ez az elem már szerepel a listában',
          timeout: 5000
        });
        return;
      } else {
        const newValue = item.lockerSerials.slice(-1)[0];
        console.log(newValue);
        this.$emit('addLocker', {
          task_id: item.id,
          tof_shop_id: item.tof_shop_id,
          dbTable: header.dbTable,
          dbColumn: header.dbColumn,
          value: newValue
        });
      }
    },
    getLengthOfSerials(value) {
      const lockerSerialsLengths = value.length;
      this.lockerSerialsLengths = lockerSerialsLengths;
      console.log(this.lockerSerialsLengths);
    },
    removeLocker(item) {
      this.$emit('removeLocker', { value: item });
    },
    uploadTaskFile(item) {
      this.$emit('uploadTaskFile', item);
    },
    addFee(data) {
      this.$emit('addFee', data);
    },
    deleteFee(data) {
      this.$emit('deleteFee', data);
    },
    tableClass() {
      return 'table-row';
    }
  }
};
</script>

<style lang="scss">
/* .v-text-field__details {
  display: none;
} */
td.text-start .v-input__slot {
  box-shadow: none !important;
}
/* .v-chip--clickable {
  background-color: #fa9702 !important;
} */
/* .theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
  background-color: unset;
}
.theme--dark.v-text-field--solo > .v-input__control > .v-input__slot {
  background-color: unset;
} */
.zip,
.tof_shop_id {
  min-width: 80px !important;
}
.city {
  min-width: 100px !important;
}
.address {
  min-width: 200px !important;
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

@media (max-width: 600px) {
  .filterRow {
    display: grid;
  }
}
</style>
