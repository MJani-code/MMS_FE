import { taskMixin } from '@/mixins/taskMixin.js';

export const state = () => ({
  stockItems: []
});

export const mutations = {
  setStockItems(state, items) {
    state.stockItems = items;
  },
  addStockItem(state, item) {
    state.stockItems.push(item);
  },
  updateStockItem(state, { index, item }) {
    state.stockItems.splice(index, 1, item);
  },
  removeStockItem(state, index) {
    state.stockItems.splice(index, 1);
  }
};

export const actions = {
  async fetchStockItems({ commit, rootState }) {
    const token = rootState.token;
    const res = await taskMixin.methods.getStockItems(token);
    commit('setStockItems', res.data.payload);
    return res.data.payload;
  },
  //addStockItem
  async addStockItem({ commit, rootState }, item) {
    const token = rootState.token;
    const res = await taskMixin.methods.addStockItem(token, item);
    if (res.data.status === 200) {
      //fetchStockItems to sync
      await this.dispatch('sparePartStock/fetchStockItems');
    }
    return res;
  },
  //updateStockItem
  async updateStockItem({ commit, rootState, state }, item) {
    console.log('store updateStockItem', item);
    const token = rootState.token;
    const res = await taskMixin.methods.updateStockItem(token, {
      stockId: item.stockId,
      ownerId: item.ownerId,
      ownerIdChanged: item.ownerIdChanged,
      warehouseId: item.warehouseId,
      warehouseIdChanged: item.warehouseIdChanged,
      quantity: item.quantity,
      quantityDifference: item.quantityDifference,
      unitPrice: item.unitPrice,
      unitPriceChanged: item.unitPriceChanged,
      currency: item.currency,
      currencyChanged: item.currencyChanged,
      reference: item.reference,
      note: item.note,
      supplierId: item.supplierId['id'],
      supplierIdChanged: item.supplierIdChanged,
      part: {
        partId: item.partId,
        partName: item.partName,
        partNumber: item.partNumber,
        category: item.category,
        manufacturer: item.manufacturer,
        partNameChanged: item.partNameChanged,
        partNumberChanged: item.partNumberChanged,
        categoryIdChanged: item.categoryIdChanged,
        manufacturerIdChanged: item.manufacturerIdChanged
      }
    });
    if (res.data.status === 200) {
      //fetchStockItems to sync
      await this.dispatch('sparePartStock/fetchStockItems');
    }
    return res;
  }
};

export const getters = {
  getStockItems(state) {
    return state.stockItems;
  }
};
