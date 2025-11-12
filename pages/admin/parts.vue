<template>
  <div class="mt-10">
    <PartsDataTableField
      :stock="stock"
      :categories="categories"
      :warehouses="warehouses"
      :suppliers="suppliers"
      :manufacturers="manufacturers"
      :currencies="currencies"
      :dialog="dialog"
      @update:dialog="dialog = $event"
      @add-item="addItem($event)"
      @update-item="updateItem($event)"
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
    currencies: [],
    dialog: false
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
        this.dialog = false;
      }
      return res;
    },
    async updateItem(updatedItem) {
      const res = await this.$store.dispatch(
        'sparePartStock/updateStockItem',
        updatedItem
      );
      if (res.data.status !== 200) {
        //notification error store
        this.$store.dispatch('notification/addNotification', {
          type: 'error',
          message: res.data.message || 'Failed to update stock item.'
        });
      } else {
        //notification success store
        this.$store.dispatch('notification/addNotification', {
          type: 'success',
          message: res.data.message || 'Stock item updated successfully.'
        });
        this.dialog = false;
      }
      return res;
    }
  }
};
</script>
