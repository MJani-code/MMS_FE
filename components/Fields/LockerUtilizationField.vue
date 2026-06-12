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
          :value="locker"
          class="mr-2"
        >
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <span style="color: black; z-index: 2" v-bind="attrs" v-on="on">
                {{ Math.round(locker) }}%
              </span>
            </template>
            <span>{{ index }}</span>
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
      type: Object,
      required: true
    }
  }
};
</script>
