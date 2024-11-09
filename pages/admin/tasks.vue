<template>
  <div>
    <AccordionField
      v-for="(group, statusId) in groupedTasks"
      :key="statusId"
      :title="group.title"
      :tasks="group.tasks"
      :headers="tasks.headers"
      @eventToTask="handleUpdatedTask"
      @addFee="addFee"
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
    async getTasks() {
      const tasks = await this.fetchTasks();
      if (tasks.status === 200) {
        this.tasks = tasks.data;
        this.tasks.headers.unshift({ text: '', value: 'data-table-expand' });
        console.log(this.tasks);
      }
    },
    async handleUpdatedTask(payload) {
      const result = await this.updateTask(payload);
      const isPhotoUpload = result.data.payload?.photoUpload;
      console.log(result);
      if (result.data.status === 200 && isPhotoUpload) {
        const locationId = result.data.payload.locationId;
        const newUrl = result.data.payload.url;
        const location = this.tasks.data.find(
          (item) => item.location_id === locationId
        );
        if (location) {
          location.location_photos.push({ url: newUrl });
        } else {
          console.error('Nem található a location_id:', locationId);
        }
      }
      if (result.data.status === 200 && !isPhotoUpload) {
        const taskId = result.data.payload.taskId;
        const column = result.data.payload.column;
        const newValue = result.data.payload.value;

        const task = this.tasks.data.find((item) => item.id === taskId);
        if (task) {
          task[column] = newValue;
          console.log(task);
        } else {
          console.error('Nem található a task_id:', taskId);
        }
      }
    },
    addFee(data) {
      console.log(data);
    }
  }
};
</script>
