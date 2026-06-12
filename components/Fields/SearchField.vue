<template>
  <v-text-field
    v-model="search"
    :label="$t('tasks.searchLabel')"
    clear-icon="mdi-close-circle"
    clearable
    outlined
    @input="onInput"
    @blur="submitSearch"
    @keydown.enter.prevent="submitSearch"
    @click:clear="clear()"
  ></v-text-field>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      debounceTimer: null,
      debounceMs: 1200,
      lastSubmittedValue: null
    };
  },
  beforeDestroy() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  },
  methods: {
    onInput() {
      const value = this.searchText ?? '';
      if (value === '') {
        this.runClearSearch();
        return;
      }

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        this.submitSearch();
      }, this.debounceMs);
    },

    submitSearch() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }

      const value = this.searchText ?? '';
      if (value === '') {
        this.runClearSearch();
        return;
      }

      if (value === this.lastSubmittedValue) {
        return;
      }

      this.lastSubmittedValue = value;
      if (value) {
        this.$store.dispatch('task/tasks/setSearchText', value);
      }
    },

    runClearSearch() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }

      if (this.lastSubmittedValue === '') {
        return;
      }

      this.lastSubmittedValue = '';
      this.$store.dispatch('task/tasks/clearSearchText', '');
    },

    clear() {
      this.searchText = '';
      this.runClearSearch();
    }
  }
};
</script>
