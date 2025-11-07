<template>
  <div class="mt-10">
    <PartsDataTableField
      :stock="stock"
      :categories="categories"
      :warehouses="warehouses"
      :suppliers="suppliers"
      :manufacturers="manufacturers"
      :currencies="currencies"
      @add-item="addItem($event)"
    />
  </div>
</template>

<script>
import { taskMixin } from '@/mixins/taskMixin.js';
import PartsDataTableField from '@/components/Fields/PartsDataTableField.vue';

export default {
  components: { PartsDataTableField },
  mixins: [taskMixin],
  data: () => ({
    categories: [],
    warehouses: [],
    suppliers: [],
    manufacturers: [],
    currencies: []
  }),
  watch: {},
  computed: {
    stock() {
      return this.$store.state.sparePartStock.stockItems;
    }
  },
  mounted() {
    this.fetchStockItems();
    this.fetchPartsMasterData();
  },
  methods: {
    async fetchStockItems() {
      const res = await this.$store.dispatch('sparePartStock/fetchStockItems');
      return res;
    },
    async fetchPartsMasterData() {
      const res = await this.$store.dispatch('partsMasterData/fetchMasterData');
      this.categories = res.categories;
      this.warehouses = res.warehouses;
      this.suppliers = res.suppliers;
      this.manufacturers = res.manufacturers;
      this.currencies = res.currencies;
      return res;
    },
    async addItem(newItem) {
      const res = await this.$store.dispatch(
        'sparePartStock/addStockItem',
        newItem
      );
      console.log('Add item response:', res);
      if (res.data.status !== 200) {
        //notification error store
        this.$store.dispatch('notification/addNotification', {
          type: 'error',
          message: res.data.message || 'Failed to add stock item.'
        });
      } else {
        //notification success store
        this.$store.dispatch('notification/addNotification', {
          type: 'success',
          message: res.data.message || 'Stock item added successfully.'
        });
        // Refresh stock items
        // this.fetchStockItems();
      }
      return res;
    }
  }
};
</script>
