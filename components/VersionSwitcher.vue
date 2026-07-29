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
import { getStoredVersion, setStoredVersion } from '@/utils/versioning';

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
    redirectToV1Subdomain() {
      if (typeof window === 'undefined') {
        return;
      }

      const { protocol, hostname, port, pathname, search, hash } =
        window.location;
      const parts = hostname.split('.');
      const hasSubdomain = parts.length > 2;
      const currentSubdomain = hasSubdomain ? parts[0] : '';

      let targetSubdomain = 'v1';
      if (currentSubdomain === 'dev') {
        targetSubdomain = 'dev-v1';
      }

      const targetHostname = hasSubdomain
        ? [targetSubdomain, ...parts.slice(1)].join('.')
        : [targetSubdomain, ...parts].join('.');
      const targetPort = port ? `:${port}` : '';
      const targetUrl = `${protocol}//${targetHostname}${targetPort}${pathname}${search}${hash}`;

      window.location.assign(targetUrl);
    },

    onVersionChange(version) {
      setStoredVersion(version);

      if (version === 'v1') {
        this.redirectToV1Subdomain();
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
