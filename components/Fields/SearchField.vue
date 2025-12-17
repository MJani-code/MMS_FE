<template>
  <v-text-field
    v-model="search"
    label="Keresés"
    clear-icon="mdi-close-circle"
    clearable
    outlined
    @input="searchQuery(search)"
    @click:clear="searchQuery('')"
  ></v-text-field>
</template>

<script>
export default {
  data() {
    return {
      search: ''
    };
  },
  methods: {
    clear(search) {
    },
    searchQuery(search) {
      this.$emit('search', { key: 'search', value: search });
    }
  }
};
</script>
