<template>
  <v-row>
    <v-col class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
      <div v-for="(item, index) in taskItemsToInvoice" :key="index">
        <v-form @submit.prevent="addItem(item)">
          <v-select
            v-model="item.feeId"
            :items="fees"
            item-value="id"
            item-text="name"
            small-chips
            solo
            hide-details="auto"
            :disabled="disabled"
          />
          <v-text-field
            type="number"
            v-model="item.quantity"
            :label="placeholder(item.feeId)"
            :disabled="disabled"
          />
          <v-text-field
            v-if="item.feeId === 5"
            v-model="item.otherItems"
            label="Megjegyzés"
            required
          />
          <v-btn type="submit" :disabled="disabled">Hozzáad</v-btn>
        </v-form>
      </div>
    </v-col>

    <v-col class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
      <v-list class="transparent">
        <v-list-item-title> Hozzáadott tételek </v-list-item-title>
        <v-list-item
          v-for="(addedItem, index) in taskFees"
          :key="index"
          class="pa-0"
        >
          <v-list-item-subtitle class="text-wrap">{{
            getFeeName(addedItem.feeId)
          }}</v-list-item-subtitle>

          <v-list-item-subtitle>
            {{ addedItem.quantity }}
          </v-list-item-subtitle>

          <v-list-item-subtitle
            class="text-right text-break"
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
    taskFees: {
      type: Array,
      required: true
    },
    taskId: {
      type: Number,
      required: true
    },
    disabled: {
      Boolean
    }
  },
  data() {
    return {
      fees: [
        { id: 1, name: 'Szállítási díj', value: 380 },
        { id: 2, name: 'Telepítési díj', value: 38000 },
        { id: 3, name: 'Karbantartási díj', value: 20000 },
        { id: 4, name: 'Javítás', value: 8750 },
        { id: 5, name: 'Egyéb', value: 1 }
      ],
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
      console.log(this.disabled);
      // Összegzi az addedItems tömb objektumainak "total" értékeit
      return this.taskFees.reduce((sum, item) => sum + (item.total || 0), 0);
    }
  },
  methods: {
    addItem(item) {
      // Kiszámítja a total értéket (quantity * fee value)
      const fee = this.fees.find((f) => f.id === item.feeId);
      const total = fee ? item.quantity * fee.value : 0;

      const data = {
        taskId: this.taskId,
        feeId: item.feeId,
        otherItems: item.otherItems,
        quantity: item.quantity,
        total: total,
        netUnitPrice: fee.value
      };

      this.$emit('addFee', data);

      // // Az item mezőinek kiürítése
      item.feeId = '';
      item.quantity = '';
      item.note = '';
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
    getFeeName(feeId) {
      const fee = this.fees.find((f) => f.id === feeId);
      const feeNote = this.taskFees.find((f) => f.feeId === feeId);
      if (feeId === 5) {
        return fee ? feeNote.otherItems : '';
      } else {
        return fee ? fee.name : '';
      }
    }
  }
};
</script>
