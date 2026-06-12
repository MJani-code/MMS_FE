<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title>Locker Részletek</v-card-title>
          <v-card-text>
            <div><strong>ID:</strong> locker.id</div>
            <div><strong>Név:</strong> locker.name</div>
            <div><strong>Cím:</strong> locker.address</div>
            <div><strong>Státusz:</strong> locker.status</div>
            <div>
              <strong>Utolsó csatlakozás:</strong>
              formatDate(locker.lastConnection)
            </div>
            <div><strong>Verzió:</strong> locker.version</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      locker: {}
    };
  },
  created() {
    this.fetchLockerDetails();
  },
  methods: {
    fetchLockerDetails() {
      // Itt töltsd be a locker részleteit az ID alapján
      // Például egy API hívással
      const lockerId = this.id;
      // Példa adat
      this.locker = {
        id: lockerId,
        name: 'Automata ' + lockerId,
        address: '1234 Budapest, Fő utca ' + lockerId,
        status: 'Aktív',
        lastConnection: 16346111702,
        version: '1.0.0'
      };
    },
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    }
  }
};
</script>

<style scoped>
/* Egyedi stílusok, ha szükséges */
</style>
