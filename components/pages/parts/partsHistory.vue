<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    loading-text="Loading... Please wait"
    class="elevation-1 parts-history"
  >
    <template v-slot:item.taskTypes="{ item }">
      <template v-if="item.taskTypes.length > 0">
        <v-chip
          v-for="(taskType, index) in item.taskTypes"
          :key="index"
          :color="taskType.color"
        >
          {{ taskType.name }}
        </v-chip>
      </template>
    </template>

    <template v-slot:item.reason="{ item }">
      <v-chip :color="colorForReason(item.reason)">
        {{ item.reason }}
      </v-chip>
    </template>

    <template v-slot:item.createdByName="{ item }">
      <v-chip :color="colorForUser(item.createdByName)">
        {{ item.createdByName }}
      </v-chip>
    </template>
    <!-- <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>Készletmozgás</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template> -->
  </v-data-table>
</template>

<script>
export default {
  props: {
    headerLength: {
      type: Number,
      required: false
    },
    partId: {
      type: Number,
      required: true
    },
    ownerId: {
      type: Number,
      required: false
    },
    warehouseId: {
      type: Number,
      required: false
    },
    supplierId: {
      type: Number,
      required: false
    }
  },
  data: () => ({
    dialog: false,
    loading: false,
    dialogDelete: false,
    headers: [
      {
        text: 'id',
        align: 'center',
        value: 'id'
      },
      {
        text: 'Task ID',
        align: 'center',
        value: 'taskId'
      },
      { text: 'feladat típus', align: 'center', value: 'taskTypes' },
      { text: 'tofShopId', align: 'center', value: 'tofShopId' },
      { text: 'boxId', align: 'center', value: 'boxId' },
      {
        text: 'serial',
        align: 'center',
        value: 'serial'
      },
      {
        text: 'mennyiség',
        align: 'center',
        value: 'changeAmount'
      },
      {
        text: 'művelet',
        align: 'center',
        value: 'reason'
      },
      {
        text: 'referencia',
        align: 'center',
        value: 'reference'
      },
      {
        text: 'megjegyzés',
        align: 'center',
        value: 'note'
      },
      {
        text: 'felhasználó',
        align: 'center',
        value: 'createdByName'
      },
      {
        text: 'dátum',
        align: 'center',
        value: 'createdAt'
      }
    ],
    items: []
  }),

  computed: {},

  watch: {
    '$store.state.sparePartStock.stockItems': {
      handler(newVal) {
        if (this.partId == null) return;
        // refresh the history when sparePartStock changes
        this.fetchParts();
      },
      deep: true
    }
  },

  created() {
    this.fetchParts();
  },

  methods: {
    async fetchParts() {
      this.loading = true;
      const res = await this.$store.dispatch(
        'parts/partsHistory/fetchPartsHistory',
        {
          partId: this.partId,
          ownerId: this.ownerId,
          warehouseId: this.warehouseId,
          supplierId: this.supplierId
        }
      );
      this.items = res;
      this.loading = false;
      return res;
    },
    colorForReason(reason) {
      switch (reason) {
        case 'IN':
          return 'green';
        case 'OUT':
          return 'orange';
        case 'ADJUSTMENT':
          return 'blue lighten-2';
        default:
          return 'grey';
      }
    },
    colorForUser(userName) {
      // Simple hash function to generate a color based on the userName
      let hash = 0;
      for (let i = 0; i < userName.length; i++) {
        hash = userName.charCodeAt(i) + ((hash << 4) - hash);
      }
      const color = `hsl(${hash % 300}, 80%, 50%)`;
      return color;
    }
  }
};
</script>

<style>
.theme--light thead.v-data-table-header th:nth-child(1),
.theme--light thead.v-data-table-header th:nth-child(2) {
  background: none !important;
}

thead.v-data-table-header th:nth-child(1),
thead.v-data-table-header th:nth-child(2) {
  position: relative !important;
  z-index: 0 !important;
}

thead.v-data-table-header th:nth-child(2) {
  left: unset !important;
}

/* .parts-history {
  background-color: #f5f5f5 !important;
} */
</style>
