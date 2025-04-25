<template>
  <v-container class="ma-2" style="padding: unset !important">
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel
        v-for="intervention in interventions"
        v-bind:key="intervention.interventionId"
        class="accordion"
      >
        <v-expansion-panel-header style="border-bottom: #f07b00 5px solid">
          {{ intervention.name }}
          <span class="text-right ml-2">{{ intervention.timestamp }}</span>
          <span class="text-right ml-2">
            <v-icon class="mdi mdi-trash-can"></v-icon>
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="pt-2">
          <v-row align="center">
            <v-card-subtitle>Hibák:</v-card-subtitle>
            <v-chip v-for="(issue, index) in intervention.issues" :key="index">
              {{ issue.name }}
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
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    panel: [],
    selectedIssues: ['Hiba 1', 'Hiba 2'],
    replacedSpareparts: ['Alkatrész 1', 'Alkatrész 2'],
    repairReport: 'Javítás leírása',
    interventions: [
      {
        name: 'Alkatrészcsere',
        uuid: 'EXOHU-AR-E-000010',
        issues: [
          {
            name: 'LID NOT OPENING'
          }
        ],
        parts: [
          {
            name: 'Part1',
            quantity: 1
          }
        ],
        notes: 'Megjavítva, minden rendben működik',
        timestamp: '2024-10-01 12:00'
      }
    ]
  })
};
</script>
