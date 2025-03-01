<template>
  <v-row>
    <v-col cols="12" sm="8" md="8" lg="4" xl="6">
      <div v-for="(item, index) in taskItemsToInvoice" :key="index">
        <v-list-item-title class="mb-2">Tételek hozzáadása </v-list-item-title>
        <v-form ref="form" @submit.prevent="addItem(item)">
          <v-select
            v-model="serial"
            :items="lockerSerials"
            item-value="id"
            item-text="serial"
            :rules="rules.lockerSerials"
            :disabled="disabled"
            small-chips
            solo
            hide-details="auto"
            placeholder="Locker"
            class="mb-4 ml-2"
          />
          <v-select
            v-model="item.feeId"
            :items="fees"
            :rules="rules.fees"
            item-value="id"
            item-text="name"
            small-chips
            solo
            hide-details="auto"
            :disabled="disabled"
            placeholder="Tételek"
            class="mb-4 ml-2"
          />
          <v-text-field
            type="number"
            v-model="item.quantity"
            :label="placeholder(item.feeId)"
            :rules="rules.quantity"
            :disabled="disabled"
            placeholder="Mennyiség"
            class="mb-4 ml-2"
          />
          <v-text-field
            v-if="item.feeId === 5"
            v-model="item.otherItems"
            label="Megjegyzés"
            required
            class="mb-4 ml-2"
          />
          <v-btn type="submit" :disabled="disabled" class="mt-4 mb-4 ml-2"
            >Hozzáad</v-btn
          >
        </v-form>
      </div>
      <v-divider class="divider-horizontal"></v-divider>
    </v-col>
    <v-divider vertical class="divider-vertical"></v-divider>
    <v-col cols="12" sm="8" md="4" lg="6" xl="6">
      <v-list class="transparent">
        <v-list-item-title> Hozzáadott tételek </v-list-item-title>
        <v-list-item class="pa-0">
          <v-list-item-subtitle>Megnevezés</v-list-item-subtitle>
          <v-list-item-subtitle>Mennyiség</v-list-item-subtitle>
          <v-list-item-subtitle>Érték</v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          v-for="(addedItem, index) in taskFees"
          :key="index"
          class="pa-0"
        >
          <v-list-item-subtitle class="text-wrap"
            >{{ getFeeName(addedItem.feeId, addedItem.id) }}
            <p>{{ addedItem.lockerSerial }}</p>
          </v-list-item-subtitle>

          <v-list-item-subtitle class="text-center">
            {{ addedItem.quantity }}
          </v-list-item-subtitle>

          <v-list-item-subtitle
            class="text-break text-center"
            style="overflow: visible"
          >
            {{ addedItem.total }}
          </v-list-item-subtitle>
          <v-list-item-icon>
            <v-icon @click="removeItem(addedItem)" :disabled="disabled"
              >mdi-delete</v-icon
            >
          </v-list-item-icon>
        </v-list-item>
        <div class="d-flex">
          <v-list-item-subtitle> Összesen: </v-list-item-subtitle>
          <v-list-item-subtitle class="text-right">
            {{ addedItemsTotal }}
          </v-list-item-subtitle>
        </div>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    taskTypes: {
      type: Array,
      required: true
    },
    fees: {
      type: Array
    },
    taskFees: {
      type: Array,
      required: true
    },
    lockers: {
      type: Array,
      required: true
    },
    taskId: {
      type: Number,
      required: true
    },
    lockerSerials: {
      type: Array
    },
    disabled: {
      Boolean
    }
  },
  data() {
    return {
      rules: {
        lockerSerials: [(v) => !!v || 'Kötelező megadni locker azonosítót'],
        fees: [(v) => !!v || 'Kötelező megadni díjat'],
        quantity: [(v) => !!v || 'Kötelező megadni mennyiséget']
      },
      serial: '',
      serials: ['1', '2'],
      taskItemsToInvoice: [
        {
          taskId: '',
          feeId: '',
          otherItems: '',
          quantity: ''
        }
      ]
    };
  },
  computed: {
    addedItemsTotal() {
      // Összegzi az addedItems tömb objektumainak "total" értékeit
      return this.taskFees.reduce((sum, item) => sum + (item.total || 0), 0);
    }
  },
  methods: {
    async addItem(item) {
      const isValid = await this.$refs.form[0].validate();
      if (!isValid) {
        return;
      } else {
        // Kiszámítja a total értéket (quantity * fee value)
        const fee = this.fees.find((f) => f.id === item.feeId);
        const total = fee ? item.quantity * fee.value : 0;

        const data = {
          taskId: this.taskId,
          feeId: item.feeId,
          otherItems: item.otherItems,
          quantity: item.feeId !== 5 ? item.quantity : 1,
          total: total,
          netUnitPrice: fee.value,
          lockerSerial: this.serial
        };

        this.$emit('addFee', data);

        // // Az item mezőinek kiürítése
        item.feeId = '';
        item.quantity = '';
        item.note = '';
        item.otherItems = '';
        this.serial = '';
        this.$refs.form[0].reset();
      }
    },
    removeItem(data) {
      this.$emit('deleteFee', data);
    },
    placeholder(feeId) {
      switch (feeId) {
        case 1:
          return 'Megtett km';
        case 2:
          return 'Db';
        case 3:
          return 'Db';
        case 4:
          return 'Munkaóra';
        case 5:
          return 'Összeg';
        default:
          return '';
      }
    },
    getFeeName(feeId, id) {
      const fee = this.fees.find((f) => f.id === feeId);
      const feeNote = this.taskFees.find((f) => f.id === id);
      if (feeId === 5) {
        return fee ? feeNote.otherItems : '';
      } else {
        return fee ? fee.name : '';
      }
    }
  }
};
</script>

<style scoped>
.divider-vertical {
  height: auto;
}

@media (max-width: 900px) {
  .divider-vertical {
    display: none;
  }
}

@media (min-width: 900px) {
  .divider-horizontal {
    display: none;
  }
}
</style>
