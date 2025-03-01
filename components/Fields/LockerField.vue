<template>
  <v-row>
    <v-col cols="12" sm="8" md="8" lg="4" xl="6">
      <v-form ref="form">
        <v-text-field
          v-model="brand"
          label="Brand"
          @change="updateLockerData(brand, locker.id, 'task_lockers', 'brand')"
        ></v-text-field>
        <v-text-field
          v-model="type"
          label="Típus"
          @change="updateLockerData(type, locker.id, 'task_lockers', 'type')"
        ></v-text-field>
        <v-checkbox
          v-model="isRegistered"
          label="Regisztrált"
          class="mt-0"
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
          class="mt-0"
          @change="
            updateLockerData(
              isActive ? 1 : 0,
              locker.id,
              'task_lockers',
              'is_active'
            )
          "
        ></v-checkbox>
        <v-btn color="primary" @click="verifyLocker">Állapot ellenőrző</v-btn
        ><br /><br />
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
        <br />

        <v-list-item-title
          >Utolsó csatlakozási idő:
          <span :class="isConnectionLost ? 'error--text' : 'success--text'">{{
            formattedLastConnectionTimestamp
          }}</span>
        </v-list-item-title>
        <v-textarea
          v-model="fault"
          label="Hiba"
          @change="updateLockerData(fault, locker.id, 'task_lockers', 'fault')"
        ></v-textarea>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
export default {
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
    isActive: 0,
    isRegistered: 0,
    isConnectionLost: 0,
    allowSpaces: false,
    match: 'Foobar',
    max: 0,
    brand: '',
    fault: '',
    type: ''
  }),
  mounted() {
    this.updateLocalLockerData();
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
  computed: {
    formattedLastConnectionTimestamp() {
      const timestamp = this.locker.lastConnectionTimestamp;
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    }
  },
  methods: {
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
    }
  }
};
</script>
