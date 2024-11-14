<template>
  <div class="mt-6">
    <AccordionField
      v-for="(group, statusId, index) in groupedTasks"
      :key="index"
      :title="group.title"
      :tasks="group.tasks"
      :headers="tasks.headers"
      @eventToTask="handleUpdatedTask"
      @addFee="handleAddFee"
      @deleteFee="handleDeleteFee"
    >
    </AccordionField>
  </div>
</template>

<script>
import { taskMixin } from '@/mixins/taskMixin.js';
import AccordionField from '../../components/Fields/AccordionField.vue';

export default {
  name: 'AdminTasks',
  components: { AccordionField },
  mixins: [taskMixin],
  data() {
    return {
      tasks: {
        data: [],
        headers: []
      }
    };
  },
  computed: {
    groupedTasks() {
      const statusMap = {
        4: 'Új',
        5: 'Folyamatban',
        6: 'Teljesítve',
        7: 'Felfüggesztve',
        8: 'Törölve'
      };

      return this.tasks.data.reduce((groups, task) => {
        const statusId = task.status_exohu_id;
        const statusText = statusMap[statusId] || 'Ismeretlen státusz';

        if (!groups[statusId]) {
          groups[statusId] = {
            title: statusText,
            tasks: []
          };
        }

        groups[statusId].tasks.push(task);
        return groups;
      }, {});
    }
  },
  async mounted() {
    await this.getTasks();
  },
  methods: {
    showModal() {
      this.$store.dispatch('notification/showModal', {
        message: 'Biztosan törölni szeretnéd?',
        buttons: [
          { text: 'Igen', style: 'primary', action: '' },
          {
            text: 'Mégse',
            style: 'secondary',
            action: () => this.$store.dispatch('notification/hideModal')
          }
        ]
      });
      console.log(this.$store.state.notification);
    },
    async getTasks() {
      const result = await this.fetchTasks();
      if (result.status === 200) {
        this.tasks = result.data;
        this.tasks.headers.unshift({ text: '', value: 'data-table-expand' });
        console.log(this.tasks);
      } else {
        this.showNotification('error', result.data.message);
      }
    },
    async handleUpdatedTask(payload) {
      const result = await this.updateTask(payload);
      const isPhotoUpload = result.data.payload?.photoUpload;

      if (result.data.status === 200 && isPhotoUpload) {
        const locationId = result.data.payload.locationId;
        const newUrl = result.data.payload.url;
        const location = this.tasks.data.find(
          (item) => item.location_id === locationId
        );
        if (location) {
          location.location_photos.push({ url: newUrl });
        } else {
          const error = 'Nem található a location_id: ' + locationId;
          this.showNotification('error', error);
        }
      }
      if (result.data.status === 200 && !isPhotoUpload) {
        const taskId = result.data.payload.taskId;
        const column = result.data.payload.column;
        const newValue = result.data.payload.value;

        const task = this.tasks.data.find((item) => item.id === taskId);
        if (task) {
          task[column] = newValue;
        } else {
          const error = 'Nem található a task_Id: ' + taskId;
          this.showNotification('error', error);
        }
      }
    },
    async handleAddFee(payload) {
      const result = await this.addFee(payload);

      if (result.data.status === 200) {
        const taskId = result.data.payload.taskId;
        const newFee = result.data.payload;
        const task = this.tasks.data.find((item) => item.id === taskId);
        if (task) {
          task.taskFees.push(newFee);
        } else {
          const error = 'Nem található a task_id: ' + taskId;
          this.showNotification('error', error);
        }
      }
    },
    async handleDeleteFee(payload) {
      const result = await this.deleteFee(payload);
      if (result.data.status === 200) {
        const idToRemove = result.data.payload.id;
        const taskIdToRemove = result.data.payload.taskId;

        const task = this.tasks.data.find((task) =>
          task.taskFees.some(
            (fee) => fee.id === idToRemove && fee.taskId === taskIdToRemove
          )
        );
        if (task) {
          // Szűrjük a taskFees tömbjét úgy, hogy kizárjuk a megadott id- és taskId párost
          task.taskFees = task.taskFees.filter(
            (fee) => !(fee.id === idToRemove && fee.taskId === taskIdToRemove)
          );
        }
      }
    },
    showNotification($type, $message) {
      this.$store.dispatch('notification/addNotification', {
        type: $type,
        message: $message,
        timeout: 5000
      });
    }
  }
};
</script>
