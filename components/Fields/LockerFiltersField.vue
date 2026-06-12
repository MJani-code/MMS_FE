<template>
  <v-container class="lighten-5 mt-6 d-flex">
    <v-row no-gutters style="gap: 2rem">
      <v-col cols="12" sm="12" md="3" lg="5">
        <v-select
          :v-model="filters.brand"
          :items="brands"
          item-text="name"
          item-value="id"
          label="Gyártó"
          @change="
            $emit('update-filter', {
              key: 'brand',
              value: parseInt($event)
            })
          "
        />
        <v-text-field
          v-model="search"
          label="Keresés"
          hide-details
          @input="
            $emit('update-filter', {
              key: 'search',
              value: $event
            })
          "
        ></v-text-field>
        <v-range-slider
          v-model="range"
          :min="0"
          :max="100"
          hide-details
          class="mt-4 pt-0"
          label="Akkumulátor szint"
          @change="
            $emit('update-filter', {
              key: 'range',
              value: $event
            })
          "
        >
          <template v-slot:prepend>
            <v-text-field
              :value="range[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 40px"
              @change="
                $emit('update-filter', {
                  key: 'range',
                  value: [parseInt($event), filters.range[1]]
                }),
                  $set(range, 0, $event)
              "
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
              :value="range[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 40px"
              @change="
                $emit('update-filter', {
                  key: 'range',
                  value: [filters.range[0], parseInt($event)]
                }),
                  $set(range, 1, $event)
              "
            ></v-text-field>
          </template>
        </v-range-slider>
        <locker-utilization-filter-field
          :filters="filters"
          @update-filter="$emit('update-filter', $event)"
        ></locker-utilization-filter-field>
      </v-col>
      <v-col cols="12" sm="12" md="3" lg="3">
        <v-switch
          v-model="isPassive"
          :label="
            isPassive
              ? 'Locker aktiválás ellenőrző kikapcsolása'
              : 'Locker aktiválás ellenőrző bekapcsolása'
          "
          @change="
            $emit('update-filter', {
              key: 'isPassive',
              value: $event
            })
          "
        />
        <v-switch
          v-model="privateKey1Error"
          :label="
            privateKey1Error
              ? 'PK ellenőrző kikpcsolása'
              : 'PK ellenőrző bekapcsolása'
          "
          @change="
            $emit('update-filter', {
              key: 'privateKey1Error',
              value: $event
            })
          "
        />
        <v-switch
          v-model="isConnectionError"
          :label="
            isConnectionError
              ? 'Kapcsolódás ellenőrző kikapcsolása'
              : 'Kapcsolódás ellenőrző bekacsolása'
          "
          @change="
            $emit('update-filter', {
              key: 'isConnectionError',
              value: $event
            })
          "
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LockerUtilizationFilterField from './LockerUtilizationFilterField.vue';
export default {
  components: { LockerUtilizationFilterField },
  props: {
    filters: {
      type: Object,
      required: true,
      default: () => ({
        brand: null,
        range: [0, 100],
        isPassive: false
      })
    }
  },
  data() {
    return {
      range: [0, 100],
      isPassive: false,
      privateKey1Error: false,
      isConnectionError: false,
      search: '',
      brands: [
        {
          id: 0,
          name: 'Összes'
        },
        {
          id: 1,
          name: 'Arka'
        },
        {
          id: 2,
          name: 'DC'
        }
      ]
    };
  }
};
</script>

<style scoped>
/* Egyedi stílusok, ha szükséges */
</style>
