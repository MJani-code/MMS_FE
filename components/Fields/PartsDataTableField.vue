<template>
  <v-data-table
    :headers="headers"
    :items="stock"
    :expanded.sync="expanded"
    item-key="stockId"
    show-expand
    sort-by="partName"
    class="elevation-1 parts-data-table"
  >
    <template v-slot:item.quantity="{ item }">
      <v-chip :color="item.quantity >= item.minStock ? 'green' : 'red'">
        {{ item.quantity }}
      </v-chip>
    </template>

    <template v-slot:item.badQuantity="{ item }">
      <v-chip :color="item.badQuantity > 0 ? 'red' : 'green'">
        {{ item.badQuantity }}
      </v-chip>
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Készlet</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="localDialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue-grey"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
              @click="editedIndex = -1"
            >
              Hozzáadás
            </v-btn>
          </template>

          <v-form @submit.prevent="saveItem">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.partName"
                        label="Név"
                        :disabled="addingItem"
                        @change="editedItem.partNameChanged = true"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.partNumber"
                        label="Cikkszám"
                        :disabled="addingItem"
                        @change="editedItem.partNumberChanged = true"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.ownerId"
                        :items="companies"
                        item-text="name"
                        item-value="id"
                        label="Tulajdonos"
                        :disabled="addingItem"
                        @change="editedItem.ownerIdChanged = true"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.categoryId"
                        :items="categories"
                        item-text="name"
                        item-value="id"
                        label="Kategória"
                        :disabled="addingItem"
                        @change="editedItem.categoryIdChanged = true"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.supplierId"
                        :items="suppliers"
                        item-text="name"
                        item-value="id"
                        label="Beszállító"
                        :disabled="addingItem"
                        @change="editedItem.supplierIdChanged = true"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.manufacturerId"
                        :items="manufacturers"
                        item-text="name"
                        item-value="id"
                        label="Gyártó"
                        :disabled="addingItem"
                        @change="editedItem.manufacturerIdChanged = true"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.warehouseId"
                        :items="warehouses"
                        item-text="name"
                        item-value="id"
                        label="Raktár"
                        :disabled="addingItem"
                        @change="editedItem.warehouseIdChanged = true"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.unitPrice"
                        type="number"
                        label="Egységár"
                        :disabled="addingItem"
                        @change="editedItem.unitPriceChanged = true"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.currency"
                        :items="currencies"
                        label="Valuta"
                        item-text="currency"
                        item-value="currency"
                        :disabled="addingItem"
                        @change="editedItem.currencyChanged = true"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.quantity"
                        @change="quantityChanged(editedItem)"
                        label="Mennyiség"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      v-if="initialQuantity != editedItem.quantity"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.reference"
                        label="Szállítói azonosító"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.note"
                        label="Megjegyzés"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="secondary" text @click="close"> Cancel </v-btn>
                <v-btn class="primary" text @click="save(method)"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <parts-history
          :part-id="item.partId"
          :owner-id="item.ownerId"
          :warehouse-id="item.warehouseId"
          :supplier-id="item.supplierId"
          class="px-6"
        ></parts-history>
      </td>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small class="mr-2" @click="addItem(item)">
        mdi-plus-circle-outline
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import partsHistory from '../pages/parts/partsHistory.vue';
export default {
  components: { partsHistory },
  props: {
    stock: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    warehouses: {
      type: Array,
      required: true
    },
    suppliers: {
      type: Array,
      required: true
    },
    manufacturers: {
      type: Array,
      required: true
    },
    currencies: {
      type: Array,
      required: true
    },
    companies: {
      type: Array,
      required: true
    },
    dialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      expanded: [],
      dialogDelete: false,
      localDialog: this.dialog,
      addingItem: false,
      headers: [
        {
          text: 'Alkatrész név',
          align: 'center',
          sortable: false,
          value: 'partName'
        },
        { text: 'Cikkszám', align: 'center', value: 'partNumber' },
        { text: 'Kategória', align: 'center', value: 'category' },
        { text: 'Gyártó', align: 'center', value: 'manufacturerName' },
        { text: 'Tulajdonos', align: 'center', value: 'ownerName' },
        { text: 'Beszállító', align: 'center', value: 'supplier' },
        { text: 'Raktár', align: 'center', value: 'warehouseName' },
        { text: 'Mennyiség (jó készlet)', align: 'center', value: 'quantity' },
        {
          text: 'Mennyiség (rossz készlet)',
          align: 'center',
          value: 'badQuantity'
        },
        {
          text: 'Műveletek',
          align: 'center',
          value: 'actions',
          sortable: false
        },
        { text: 'Előzmények', align: 'center', value: 'data-table-expand' }
      ],
      editedIndex: -1,
      editedItem: {
        partName: '',
        partNumber: '',
        categoryId: '',
        supplierId: '',
        warehouseId: '',
        ownerId: '',
        manufacturerId: '',
        unitPrice: 0,
        currency: '',
        reference: '',
        quantity: 0,
        quantityDifference: 0,
        note: '',
        partNameChanged: false,
        partNumberChanged: false,
        categoryIdChanged: false,
        supplierIdChanged: false,
        warehouseIdChanged: false,
        ownerIdChanged: false,
        manufacturerIdChanged: false,
        unitPriceChanged: false,
        currencyChanged: false
      },
      initialQuantity: 0,
      reasonForChangeQuantity: null,
      defaultItem: {
        partName: '',
        partNumber: '',
        category: {
          id: '',
          name: ''
        },
        supplierId: '',
        warehouseId: '',
        ownerId: '',
        manufacturerId: '',
        unitPrice: 0,
        currency: '',
        reference: '',
        quantity: 0,
        quantityDifference: 0,
        note: '',
        partNameChanged: false
      }
    };
  },

  computed: {
    stockItems() {
      return this.initialize();
    },
    formTitle() {
      if (this.addingItem) {
        return 'Mennyiség hozzáadása egy meglévő alkatrészhez';
      }
      return this.editedIndex === -1 ? 'Új cikk felvitele' : 'Szerkesztés';
    },
    method() {
      if (this.addingItem) {
        return 'addQuantity';
      }
      if (this.editedIndex === -1) {
        return 'addNewItem';
      }
      return 'editing';
    }
  },

  watch: {
    // when parent updates prop, reflect to localDialog
    dialog(val) {
      this.localDialog = val;
      val || this.close();
    },
    // when local dialog changed (via activator or code), inform parent
    localDialog(val) {
      this.$emit('update:dialog', val);
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  created() {},

  methods: {
    editItem(item) {
      this.editedIndex = this.stock.indexOf(item);
      //kikeressük a kategóriát, raktárat, beszállítót az item alapján
      const selectedCategory = this.categories.find(
        (cat) => cat.name === item.category
      );

      const selectedWarehouse = this.warehouses.find(
        (wh) => wh.name === item.warehouseName
      );

      const selectedSupplier = this.suppliers.find(
        (sup) => sup.name === item.supplier
      );

      const selectedManufacturer = this.manufacturers.find(
        (man) => man.name === item.manufacturerName
      );

      this.editedItem = Object.assign({}, item);
      this.editedItem.partNameChanged = false;
      this.editedItem.partNumberChanged = false;
      this.editedItem.categoryIdChanged = false;
      this.editedItem.supplierIdChanged = false;
      this.editedItem.warehouseIdChanged = false;
      this.editedItem.ownerIdChanged = false;
      this.editedItem.manufacturerIdChanged = false;
      this.editedItem.unitPriceChanged = false;
      this.editedItem.currencyChanged = false;
      this.editedItem.categoryId = selectedCategory.id;
      this.editedItem.warehouseId = selectedWarehouse;
      this.editedItem.supplierId = selectedSupplier.id;
      this.editedItem.manufacturerId = selectedManufacturer.id;

      this.$emit('update:dialog', true);
      this.initialQuantity = item.quantity;
    },

    quantityChanged(item) {
      if (this.initialQuantity !== parseInt(item.quantity)) {
        this.reasonForChangeQuantity = true;
      } else {
        this.reasonForChangeQuantity = false;
      }
    },

    close() {
      this.$emit('update:dialog', false);
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        // this.editedIndex = -1;
        this.addingItem = false;
      });
    },

    addItem(item) {
      this.addingItem = true;
      this.editItem(item);

      console.log('quantity', this.editedItem.quantityDifference);
    },

    save(method) {
      this.editedItem.quantity = parseInt(this.editedItem.quantity);
      this.editedItem.unitPrice = parseFloat(this.editedItem.unitPrice);
      if (method === 'editing') {
        //szerkesztés
        if (this.editedItem.quantity < this.initialQuantity) {
          this.editedItem.quantityDifference =
            this.editedItem.quantity - this.initialQuantity;
        } else if (this.editedItem.quantity > this.initialQuantity) {
          this.editedItem.quantityDifference =
            this.editedItem.quantity - this.initialQuantity;
        } else {
          this.editedItem.quantityDifference = 0;
        }
        this.$emit('update-item', this.editedItem);
      } else if (method === 'addNewItem') {
        //új
        this.$emit('add-item', this.editedItem);
        console.log('új elem hozzáadva', this.editedItem);
      } else if (method === 'addQuantity') {
        //mennyiség hozzáadása
        this.editedItem.quantityDifference =
          this.editedItem.quantity - this.initialQuantity;
        this.$emit('add-item', this.editedItem);
      }
    }
  }
};
</script>

<style>
.v-data-table__wrapper {
  max-height: unset !important;
}

/* .parts-data-table tr td:first-child {
  font-weight: bold !important;
} */
</style>
