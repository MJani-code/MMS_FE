<template>
  <v-container class="ma-2" style="padding: unset !important">
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel class="accordion">
        <v-expansion-panel-header style="border-bottom: #f07b00 5px solid">
          Beavatkozás
          <span class="text-right ml-2">Timestamp</span>
          <span class="text-right ml-2">
            <v-icon class="mdi mdi-trash-can"></v-icon>
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="pt-2">
          <v-row align="center">
            <v-card-subtitle>Hibák:</v-card-subtitle>
            <v-chip>Hiba 1</v-chip>
            <v-chip>Hiba 2</v-chip>
          </v-row>
          <v-row align="center" class="pt-2">
            <v-card-subtitle>Felhasznált alkatrészek:</v-card-subtitle>
            <v-chip>Alkatrész 1</v-chip>
            <v-chip>Alkatrész 1</v-chip>
            <v-chip>Alkatrész 1</v-chip>
            <v-chip>Alkatrész 1</v-chip>
          </v-row>
          <v-row align="center" class="pt-4">
            <v-textarea
              v-model="repairReport"
              auto-grow
              label="Javítás leírása"
              outlined
              disabled
            ></v-textarea>
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
    repairReport: 'Javítás leírása'
  })
};
</script>
