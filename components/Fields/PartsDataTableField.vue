<template>
  <v-data-table
    :headers="headers"
    :items="stock"
    sort-by="partName"
    class="elevation-1 parts-data-table"
  >
    <template v-slot:item.quantity="{ item }">
      <v-chip :color="item.quantity >= item.minStock ? 'green' : 'red'">
        {{ item.quantity }}
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
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.partNumber"
                        label="Cikkszám"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.categoryId"
                        :items="categories"
                        item-text="name"
                        item-value="id"
                        label="Kategória"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.supplierId"
                        :items="suppliers"
                        item-text="name"
                        item-value="id"
                        label="Beszállító"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.manufacturerId"
                        :items="manufacturers"
                        item-text="name"
                        item-value="id"
                        label="Gyártó"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.warehouseId"
                        :items="warehouses"
                        item-text="name"
                        item-value="id"
                        label="Raktár"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.unitPrice"
                        type="number"
                        label="Egységár"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.currency"
                        :items="currencies"
                        label="Valuta"
                        item-text="currency"
                        item-value="currency"
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
                        v-if="initialQuantity != editedItem.quantity"
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
                <v-btn class="primary" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
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
    dialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialogDelete: false,
      localDialog: this.dialog,
      headers: [
        {
          text: 'Alkatrész név',
          align: 'start',
          sortable: false,
          value: 'partName'
        },
        { text: 'Cikkszám', value: 'partNumber' },
        { text: 'Kategória', value: 'category' },
        { text: 'Beszállító', value: 'supplier' },
        { text: 'Raktár', value: 'warehouseName' },
        { text: 'Mennyiség', value: 'quantity' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        partName: '',
        partNumber: '',
        categoryId: '',
        supplierId: '',
        warehouseId: '',
        manufacturerId: '',
        unitPrice: 0,
        currency: '',
        reference: '',
        quantity: 0,
        quantityDifference: 0,
        note: ''
      },
      initialQuantity: 0,
      reasonForChangeQuantity: null,
      defaultItem: {
        partName: '',
        partNumber: '',
        categoryId: '',
        supplierId: '',
        warehouseId: '',
        manufacturerId: '',
        unitPrice: 0,
        currency: '',
        reference: '',
        quantity: 0,
        quantityDifference: 0,
        note: ''
      }
    };
  },

  computed: {
    stockItems() {
      return this.initialize();
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Új cikk felvitele' : 'Szerkesztés';
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
      this.editedItem.categoryId = selectedCategory;
      this.editedItem.warehouseId = selectedWarehouse;
      this.editedItem.supplierId = selectedSupplier;
      this.editedItem.manufacturerId = selectedManufacturer;

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
      // this.$nextTick(() => {
      //   this.editedItem = Object.assign({}, this.defaultItem);
      //   // this.editedIndex = -1;
      // });
    },

    save(item) {
      this.editedItem.quantity = parseInt(this.editedItem.quantity);
      this.editedItem.unitPrice = parseFloat(this.editedItem.unitPrice);
      if (this.editedIndex > -1) {
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
      } else {
        //új
        this.$emit('add-item', this.editedItem);
      }
      // this.close();
    }
  }
};
</script>

<style>
.v-data-table__wrapper {
  max-height: unset !important;
}

.parts-data-table tr td:first-child {
  font-weight: bold !important;
}
</style>
