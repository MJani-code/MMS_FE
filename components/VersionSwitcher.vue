<template>
  <v-select
    v-model="selectedVersion"
    :items="versions"
    item-text="label"
    item-value="value"
    dense
    hide-details
    outlined
    class="version-switcher"
    :menu-props="{ offsetY: true }"
    @change="onVersionChange"
  />
</template>

<script>
import {
  applyVersionPrefix,
  getStoredVersion,
  setStoredVersion
} from '@/utils/versioning';

export default {
  name: 'VersionSwitcher',

  data() {
    return {
      selectedVersion: 'v2',
      versions: [
        { label: 'v2', value: 'v2' },
        { label: 'v1', value: 'v1' }
      ]
    };
  },

  mounted() {
    this.selectedVersion = getStoredVersion();
  },

  methods: {
    onVersionChange(version) {
      setStoredVersion(version);
      const targetPath = applyVersionPrefix(this.$route.fullPath, version);
      if (targetPath !== this.$route.fullPath) {
        this.$router.replace(targetPath);
      }
    }
  }
};
</script>

<style scoped>
.version-switcher {
  max-width: 90px;
}

.version-switcher :deep(.v-input__slot) {
  min-height: 36px !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.35) !important;
}

.version-switcher :deep(.v-select__selection),
.version-switcher :deep(.v-icon) {
  color: white !important;
}
</style>
