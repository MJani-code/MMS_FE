<template>
  <div>
    <strong>Locker kihasználtság</strong>
    <div class="progress-circular-container d-flex">
      <div v-for="(locker, index) in value" :key="index">
        <v-progress-circular
          :rotate="-90"
          :size="30"
          :width="15"
          color="primary"
          :value="locker.utilizationValue"
          class="mr-2"
        >
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <span style="color: black; z-index: 2" v-bind="attrs" v-on="on">
                {{ Math.round(locker.utilizationValue) }}%
              </span>
              <!-- <v-btn color="primary" dark v-bind="attrs" v-on="on">
                Left
              </v-btn> -->
            </template>
            <span>{{ locker.timeFrame }}</span>
          </v-tooltip>
        </v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LockerUtilizationField',
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  //print out the value prop in the console
  mounted() {
    console.log('LockerUtilizationField value:', this.value);
  }
};
</script>
