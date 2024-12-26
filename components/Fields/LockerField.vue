<template>
  <v-container class="ml-0">
    <v-row justify="space-between">
      <v-col class="col-12 col-sm-2 col-md-3 col-lg-3 col-xl-3 col mt-0">
        <v-form ref="form">
          <v-text-field
            v-model="brand"
            label="Brand"
            @change="updateLockerData(brand, locker.id, 'lockers', 'brand')"
          ></v-text-field>
          <v-text-field
            v-model="type"
            label="Típus"
            @change="updateLockerData(type, locker.id, 'lockers', 'type')"
          ></v-text-field>
          <v-checkbox
            v-model="isRegistered"
            label="Regisztrált"
            class="mt-0"
            @change="
              updateLockerData(
                isRegistered ? 1 : 0,
                locker.id,
                'lockers',
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
                'lockers',
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
            v-model="comment"
            label="Megjegyzés"
            @change="updateLockerData(comment, locker.id, 'lockers', 'comment')"
          ></v-textarea>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
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
    comment: '',
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
      this.comment = this.locker.comment;
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
      console.log(this.isConnectionLost);
    }
  }
};
</script>
