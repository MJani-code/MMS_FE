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
          />
          <v-text-field
            type="number"
            v-model="item.quantity"
            :label="placeholder(item.feeId)"
          />
          <v-text-field
            v-if="item.feeId === 5"
            v-model="item.otherItems"
            label="Megjegyzés"
            required
          />
          <v-btn type="submit">Hozzáad</v-btn>
        </v-form>
      </div>
    </v-col>

    <v-col class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
      <v-list class="transparent">
        <v-list-item-title> Hozzáadott tételek </v-list-item-title>
        <v-list-item
          v-for="(addedItem, index) in addedItems"
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
            <v-icon @click="removeItem(index, addedItem.total)"
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
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fees: [
        { id: 1, name: 'Szállítási díj', value: 380 },
        { id: 2, name: 'Telepítési díj', value: 38000 },
        { id: 3, name: 'Karbantartás díj', value: 20000 },
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
      ],
      addedItems: this.item.taskFees,
      addedItemsTotal: 0,
      taskId: this.item.id
    };
  },
  methods: {
    addItem(item) {
      // Kiszámítja a total értéket (quantity * fee value)
      const fee = this.fees.find((f) => f.id === item.feeId);
      const total = fee ? item.quantity * fee.value : 0;
      this.addedItemsTotal = this.addedItemsTotal + total;

      const data = {
        taskId: this.taskId,
        feeId: item.feeId,
        otherItems: item.otherItems,
        quantity: item.quantity,
        total: total,
        method: 'insert'
      };

      this.$emit('addFee', data);

      // Hozzáadja az item-et az addedItems-hez a számított total értékkel
      // this.addedItems.push({
      //   ...item,
      //   total
      // });

      // // Az item mezőinek kiürítése
      // item.feeId = '';
      // item.quantity = '';
      // item.note = '';
    },
    removeItem(index, total) {
      this.addedItems.splice(index, 1);
      this.addedItemsTotal = this.addedItemsTotal - total;
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
      const feeNote = this.addedItems.find((f) => f.feeId === feeId);
      if (feeId === 5) {
        return fee ? feeNote.note : '';
      } else {
        return fee ? fee.name : '';
      }
    }
  }
};
</script>
