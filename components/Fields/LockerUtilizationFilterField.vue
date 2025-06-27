<template>
  <v-expansion-panels v-model="expansionPanel" class="mt-4">
    <v-expansion-panel>
      <v-expansion-panel-header>Kihasználtság</v-expansion-panel-header>
      <v-expansion-panel-content color="#fafafa">
        <v-range-slider
          v-model="utilizationWeekly"
          :min="0"
          :max="100"
          hide-details
          class="mt-4 pt-0"
          label="Heti telitettség"
          @change="
            $emit('update-filter', {
              key: 'utilizationWeekly',
              value: $event
            })
          "
        >
          <template v-slot:prepend>
            <v-text-field
              :value="utilizationWeekly[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 40px"
              @change="
                $emit('update-filter', {
                  key: 'utilizationWeekly',
                  value: [parseInt($event), filters.utilizationWeekly[1]]
                }),
                  $set(utilizationWeekly, 0, $event)
              "
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
              :value="utilizationWeekly[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 40px"
              @change="
                $emit('update-filter', {
                  key: 'utilizationWeekly',
                  value: [filters.utilizationWeekly[0], parseInt($event)]
                }),
                  $set(utilizationWeekly, 1, $event)
              "
            ></v-text-field>
          </template>
        </v-range-slider>
        <v-range-slider
          v-model="utilizationMonthly"
          :min="0"
          :max="100"
          hide-details
          class="mt-4 pt-0"
          label="Havi telitettség"
          @change="
            $emit('update-filter', {
              key: 'utilizationMonthly',
              value: $event
            })
          "
        >
          <template v-slot:prepend>
            <v-text-field
              :value="utilizationMonthly[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 40px"
              @change="
                $emit('update-filter', {
                  key: 'utilizationMonthly',
                  value: [parseInt($event), filters.utilizationMonthly[1]]
                }),
                  $set(utilizationMonthly, 0, $event)
              "
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
              :value="utilizationMonthly[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 40px"
              @change="
                $emit('update-filter', {
                  key: 'utilizationMonthly',
                  value: [filters.utilizationMonthly[0], parseInt($event)]
                }),
                  $set(utilizationMonthly, 1, $event)
              "
            ></v-text-field>
          </template>
        </v-range-slider>
        <v-range-slider
          v-model="utilizationYearly"
          :min="0"
          :max="100"
          hide-details
          class="mt-4 pt-0"
          label="Éves telitettség"
          @change="
            $emit('update-filter', {
              key: 'utilizationYearly',
              value: $event
            })
          "
        >
          <template v-slot:prepend>
            <v-text-field
              :value="utilizationYearly[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 40px"
              @change="
                $emit('update-filter', {
                  key: 'utilizationYearly',
                  value: [parseInt($event), filters.utilizationYearly[1]]
                }),
                  $set(utilizationYearly, 0, $event)
              "
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
              :value="utilizationYearly[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 40px"
              @change="
                $emit('update-filter', {
                  key: 'utilizationYearly',
                  value: [filters.utilizationYearly[0], parseInt($event)]
                }),
                  $set(utilizationYearly, 1, $event)
              "
            ></v-text-field>
          </template>
        </v-range-slider>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    filters: {
      type: Object,
      required: true,
      default: () => ({
        utilizationWeekly: [0, 100],
        utilizationMonthly: [0, 100],
        utilizationYearly: [0, 100]
      })
    }
  },
  data() {
    return {
      expansionPanel: 0,
      utilizationWeekly: [0, 100],
      utilizationMonthly: [0, 100],
      utilizationYearly: [0, 100]
    };
  }
};
</script>
