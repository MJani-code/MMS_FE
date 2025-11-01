<template>
  <div>
    <!-- Bell icon -->
    <div class="d-flex ga-12 justify-center">
      <v-badge
        v-if="notifications?.data?.length > 0"
        color="red"
        :content="
          notifications?.data?.length > 0 ? notifications?.data?.length : ''
        "
        style="position: absolute"
      >
      </v-badge>
      <v-icon @click="toggleList">mdi-bell</v-icon>
    </div>

    <!-- Show notifications -->
    <template v-if="showList">
      <v-sheet
        class="d-flex align-center justify-center flex-wrap mx-auto px-4 pt-3"
        style="position: absolute; right: 20px; overflow: scroll"
        elevation="4"
        width="300"
        max-height="800px"
        rounded
      >
        <!-- Notifications list -->
        <template v-if="notifications?.data?.length > 0">
          <div
            v-for="(notification, index) in notifications.data"
            @click="readNotifications(notification.id)"
            :key="index"
            class="v-list-item--link mb-3"
            style="border-bottom: 2px solid gray"
          >
            <p class="text-body-2 mb-4">
              <!-- a typeName legyen bold -->
              <strong>{{ notification.typeNames }}</strong> megbízást kaptál
              {{ notification.location }} helyszínen
            </p>
            <!-- létrehozva:  -->
            <p class="text-body-3">{{ notification.createdAt }}</p>
          </div>
        </template>

        <!-- No notifications -->
        <template v-else>
          <p class="text-body-2 mb-4">Nincsenek új értesítéseid</p>
        </template>
      </v-sheet>
    </template>
  </div>
</template>

<script>
import { taskMixin } from '@/mixins/taskMixin.js';
import { toRef } from 'vue';

export default {
  mixins: [taskMixin],
  props: {
    userId: { type: Number, required: true }
  },
  data() {
    return {
      notifications: [
        {
          status: 0,
          rowCount: 0,
          newTaskCount: 0,
          data: [{}],
          since: null
        }
      ],
      lastCheck: Date.now(),
      showList: false,
      unreadCount: 0
    };
  },
  mounted() {
    this.initNotifications();
  },
  methods: {
    async initNotifications() {
      try {
        const res = await this.downloadNotifications({
          userId: this.userId
        });
        //ha van válasz
        if (res.data) {
          if (res.data.data.length > 0) {
            this.notifications = res.data;
            this.unreadCount += res.data.data.length;
          }
        }
        this.lastCheck = Date.now();
        setInterval(this.startPolling, 600000);
      } catch (err) {
        console.error('Értesítés lekérés hiba:', err);
      }
    },
    async startPolling() {
      try {
        const res = await this.downloadNotifications({
          userId: this.userId,
          downloadedIds:
            this.notifications && this.notifications.data.length
              ? this.notifications.data.map((n) => n.id).join(',')
              : ''
        });

        //ha van válasz
        if (res.data) {
          if (res.data.data.length > 0) {
            this.notifications.data.push(...res.data.data);
            this.notifications.rowCount += res.data.rowCount;
            this.unreadCount += res.data.data.length;
            this.playSound();
          }
        }
        this.lastCheck = Date.now();
      } catch (err) {
        console.error('Értesítés lekérés hiba:', err);
      }
    },
    async readNotifications(id) {
      const res = await this.markNotificationsAsRead(id);
      if (res.data.status === 200) {
        // BellNotifications.vue
        this.$store.dispatch('notification/triggerBellEvent', {
          type: 'special'
        });
        //remove id from notifications
        this.notifications.data = this.notifications.data.filter(
          (n) => n.id !== id
        );
        // ids = [];
        this.showList = !this.showList;
      }
    },
    playSound() {
      const audio = new Audio('/notify.mp3');
      audio.play().catch(() => {});
    },
    toggleList() {
      this.showList = !this.showList;
    }
  }
};
</script>
