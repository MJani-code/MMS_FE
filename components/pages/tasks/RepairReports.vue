<template>
  <v-container class="ma-2" style="padding: unset !important">
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel
        v-for="intervention in interventions"
        v-bind:key="intervention.id"
        class="accordion"
      >
        <v-expansion-panel-header style="border-bottom: #f07b00 5px solid">
          {{ intervention.name }}
          <span class="text-right ml-2">{{ intervention.createdAt }}</span>
        </v-expansion-panel-header>

        <v-expansion-panel-content class="pt-2">
          <v-row align="center">
            <v-card-subtitle>Hibák:</v-card-subtitle>
            <v-chip v-for="(issue, index) in intervention.issues" :key="index">
              {{ issue.issueTypeName }}
            </v-chip>
          </v-row>
          <v-row align="center" class="pt-2">
            <v-card-subtitle>Felhasznált alkatrészek:</v-card-subtitle>
            <v-chip v-for="(part, index) in intervention.parts" :key="index">
              {{ part.name }} ({{ part.quantity }})
            </v-chip>
          </v-row>
          <v-row align="center" class="pt-4">
            <v-col cols="12">
              <v-textarea
                v-model="intervention.notes"
                label="Leírás"
                outlined
                disabled
              ></v-textarea>
            </v-col>
          </v-row>
          <!-- Button for delete intervention -->
          <v-row>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                class="error"
                @click="
                  $store.dispatch('locker/repair/deleteIntervention', {
                    issues: intervention.issues,
                    interventionId: intervention.id,
                    lockerSerial: locker.serial,
                    taskId: taskId
                  })
                "
              >
                <v-icon left>mdi-delete</v-icon> Törlés
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
export default {
  props: {
    interventions: {
      type: Array,
      required: false
    },
    locker: {
      type: Object,
      required: false
    },
    taskId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    panel: []
  })
};
</script>
