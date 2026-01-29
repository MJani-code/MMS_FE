// store/task/tasks.js
import { APIGET, APIPOST, APIPOST2, APIPUT, APIDELETE } from '@/api/apiHelper';

export const state = () => ({
  // Státusz csoportok (accordion fejlécek)
  statusGroups: {},

  // Task-ek státusz szerint (statusId: tasks[])
  tasksByStatus: {},

  // Meta adatok
  headers: [],
  statuses: [],
  fees: [],
  allowedStatuses: [],
  locationTypes: [],
  taskTypes: [],
  lockerSerials: [],
  companies: [],
  priorities: [],

  // Loading states
  isLoadingStatuses: false,
  loadingStatus: {}, // { [statusId]: boolean }
  loadingDeleteMedia: false
});

export const getters = {
  getTasksForStatus: (state) => (statusId) => {
    // Return a shallow copy to ensure reactivity
    return state.tasksByStatus[statusId]
      ? [...state.tasksByStatus[statusId]]
      : [];
  },

  isStatusLoading: (state) => (statusId) => {
    return state.loadingStatus[statusId] || false;
  },

  getStatusGroup: (state) => (statusId) => {
    return state.statusGroups[statusId] || null;
  }
};

export const mutations = {
  SET_STATUS_GROUPS(state, groups) {
    state.statusGroups = groups;
  },

  SET_META_DATA(state, payload) {
    state.headers = payload.headers || [];
    state.statuses = payload.statuses || [];
    state.fees = payload.fees || [];
    state.allowedStatuses = payload.allowedStatuses || [];
    state.locationTypes = payload.locationTypes || [];
    state.taskTypes = payload.taskTypes || [];
    state.lockerSerials = payload.lockerSerials || [];
    state.companies = payload.companies || [];
    state.priorities = payload.priorities || [];
  },

  SET_TASKS_FOR_STATUS(state, { statusId, tasks }) {
    state.tasksByStatus = {
      ...state.tasksByStatus,
      [statusId]: tasks
    };
  },

  SET_LOADING_STATUSES(state, isLoading) {
    state.isLoadingStatuses = isLoading;
  },

  SET_LOADING_STATUS(state, { statusId, isLoading }) {
    state.loadingStatus = {
      ...state.loadingStatus,
      [statusId]: isLoading
    };
  },

  SET_LOADING_DELETE_MEDIA(state, isLoading) {
    state.loadingDeleteMedia = isLoading;
  },

  UPDATE_TASK_IN_STATUS(state, { statusId, taskId, updates }) {
    const tasks = state.tasksByStatus[statusId];
    if (tasks) {
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
      }
    }
  },

  UPDATE_TASK_LOCKER(state, { statusId, taskId, lockerId, updates }) {
    const tasks = state.tasksByStatus[statusId];
    if (tasks) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.lockers) {
        const lockerIndex = task.lockers.findIndex((l) => l.id === lockerId);
        if (lockerIndex !== -1) {
          task.lockers[lockerIndex] = {
            ...task.lockers[lockerIndex],
            ...updates
          };
        }
      }
    }
  },

  ADD_TASK_FEE(state, { statusId, taskId, fee }) {
    const tasks = state.tasksByStatus[statusId];
    if (tasks) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        if (!task.taskFees) task.taskFees = [];
        task.taskFees.push(fee);
      }
    }
  },

  REMOVE_TASK_FEE(state, { statusId, taskId, feeId }) {
    const tasks = state.tasksByStatus[statusId];
    if (tasks) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.taskFees) {
        task.taskFees = task.taskFees.filter((f) => f.id !== feeId);
      }
    }
  },

  SET_TASK_LOCKERS(state, { statusId, taskId, lockers }) {
    const tasks = state.tasksByStatus[statusId];
    if (tasks) {
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        // Create new task object to trigger reactivity
        const updatedTask = { ...tasks[taskIndex], lockers };
        tasks.splice(taskIndex, 1, updatedTask);
      }
    }
  },

  REMOVE_TASK_LOCKER(state, { statusId, taskId, lockerId }) {
    const tasks = state.tasksByStatus[statusId];
    if (tasks) {
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1 && tasks[taskIndex].lockers) {
        // Create new task object to trigger reactivity
        const updatedLockers = tasks[taskIndex].lockers.filter(
          (l) => l.id !== lockerId
        );
        const updatedTask = { ...tasks[taskIndex], lockers: updatedLockers };
        tasks.splice(taskIndex, 1, updatedTask);
      }
    }
  },

  ADD_TASK_PHOTO(state, { statusId, locationId, photoUrl }) {
    const tasks = state.tasksByStatus[statusId];
    if (tasks) {
      const taskIndex = tasks.findIndex((t) => t.location_id === locationId);
      if (taskIndex !== -1) {
        const task = tasks[taskIndex];
        const newPhotos = task.location_photos
          ? [...task.location_photos, { url: photoUrl }]
          : [{ url: photoUrl }];
        const updatedTask = { ...task, location_photos: newPhotos };
        tasks.splice(taskIndex, 1, updatedTask);
      }
    }
  },

  REMOVE_TASK_PHOTO(state, { statusId, locationId, photoUrl }) {
    const tasks = state.tasksByStatus[statusId];
    if (tasks) {
      const taskIndex = tasks.findIndex((t) => t.location_id === locationId);
      if (taskIndex !== -1 && tasks[taskIndex].location_photos) {
        const updatedPhotos = tasks[taskIndex].location_photos.filter(
          (p) => p.url !== photoUrl
        );
        const updatedTask = {
          ...tasks[taskIndex],
          location_photos: updatedPhotos
        };
        tasks.splice(taskIndex, 1, updatedTask);
      }
    }
  },

  MOVE_TASK_TO_STATUS(
    state,
    { taskId, fromStatusId, toStatusId, updatedTask }
  ) {
    // Eltávolítjuk a régi státuszból
    const fromTasks = state.tasksByStatus[fromStatusId];
    if (fromTasks) {
      state.tasksByStatus[fromStatusId] = fromTasks.filter(
        (t) => t.id !== taskId
      );
    }

    // Hozzáadjuk az új státuszhoz
    // Ha még nem létezik az új statusId tömbje, inicializáljuk
    if (!state.tasksByStatus[toStatusId]) {
      state.tasksByStatus = {
        ...state.tasksByStatus,
        [toStatusId]: []
      };
    }
    state.tasksByStatus[toStatusId].unshift(updatedTask);

    // Frissítjük a számláló értékeket
    if (state.statusGroups[fromStatusId]) {
      state.statusGroups[fromStatusId].count = Math.max(
        0,
        state.statusGroups[fromStatusId].count - 1
      );
    }
    if (state.statusGroups[toStatusId]) {
      state.statusGroups[toStatusId].count =
        state.statusGroups[toStatusId].count + 1;
    }
  },

  REMOVE_TASKS_FROM_STATUS(state, { statusId, taskIds }) {
    const tasks = state.tasksByStatus[statusId];
    if (tasks) {
      state.tasksByStatus[statusId] = tasks.filter(
        (t) => !taskIds.includes(t.id)
      );

      // Frissítjük a számlálót
      if (state.statusGroups[statusId]) {
        state.statusGroups[statusId].count = Math.max(
          0,
          state.statusGroups[statusId].count - taskIds.length
        );
      }
    }
  },

  UPDATE_STATUS_COUNT(state, { statusId, count }) {
    if (state.statusGroups[statusId]) {
      state.statusGroups[statusId].count = count;
    }
  }
};

export const actions = {
  async fetchTaskStatuses({ commit, rootState }) {
    commit('SET_LOADING_STATUSES', true);
    try {
      const token = rootState.token;
      const result = await APIGET('getTaskStatuses', null, token);

      if (result.data.status === 200) {
        const payload = result.data.payload;

        // Meta adatok mentése
        commit('SET_META_DATA', payload);

        // Státusz csoportok mentése
        commit('SET_STATUS_GROUPS', payload.statusGroups || {});

        return { success: true };
      } else {
        return {
          success: false,
          message: result.data.message || 'Hiba történt'
        };
      }
    } catch (error) {
      console.error('Error fetching task statuses:', error);
      return {
        success: false,
        message: 'Hiba történt a státuszok betöltése során'
      };
    } finally {
      commit('SET_LOADING_STATUSES', false);
    }
  },

  async fetchTasksByStatus({ commit, rootState }, statusId) {
    commit('SET_LOADING_STATUS', { statusId, isLoading: true });
    try {
      const token = rootState.token;
      const result = await APIGET('getTasksByStatus', { statusId }, token);

      if (result.data.status === 200) {
        let tasks = result.data.data || [];

        // D4ME lokációk adatainak betöltése
        const d4meResult = await APIGET('getDirect4MeLocations', null, token);
        if (d4meResult.data.status === 200) {
          const locations = d4meResult.data.data;
          tasks = enrichTasksWithLocationData(tasks, locations);
        }

        commit('SET_TASKS_FOR_STATUS', { statusId, tasks });
        return { success: true, tasks };
      } else {
        return {
          success: false,
          message: result.data.message || 'Hiba történt'
        };
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return {
        success: false,
        message: 'Hiba történt az adatok betöltése során'
      };
    } finally {
      commit('SET_LOADING_STATUS', { statusId, isLoading: false });
    }
  },

  async updateTask({ commit, rootState }, payload) {
    try {
      const token = rootState.token;
      const result = await APIPUT('updateTask', payload, token);

      if (result.data.status === 200) {
        const responsePayload = result.data.payload;
        const isPhotoUpload = responsePayload?.photoUpload;

        if (isPhotoUpload) {
          // Fotó feltöltés
          commit('ADD_TASK_PHOTO', {
            statusId: payload.statusId,
            locationId: responsePayload.locationId,
            photoUrl: responsePayload.url
          });
        } else if (payload.column === 'status_by_exohu_id') {
          // Státusz változtatás - NE frissítsük itt a store-t
          // A tasks.vue handleStatusChange fogja kezelni a MOVE_TASK_TO_STATUS mutation-nel
          // Csak a sikeres választ küldjük vissza
        } else if (payload.dbTable === 'task_locations') {
          // Location frissítés
          const task = this.state.task.tasks.tasksByStatus[
            payload.statusId
          ]?.find((t) => t.location_id === responsePayload.id);
          if (task) {
            commit('UPDATE_TASK_IN_STATUS', {
              statusId: payload.statusId,
              taskId: task.id,
              updates: { [responsePayload.column]: responsePayload.value }
            });
          }
        } else {
          // Task frissítés
          commit('UPDATE_TASK_IN_STATUS', {
            statusId: payload.statusId,
            taskId: responsePayload.id,
            updates: { [responsePayload.column]: responsePayload.value }
          });
        }

        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, message: 'Hiba történt a frissítés során' };
    }
  },

  async updateTaskLocker({ commit, rootState }, payload) {
    try {
      const token = rootState.token;
      const result = await APIPUT('updateTask', payload, token);

      if (result.data.status === 200) {
        const responsePayload = result.data.payload;

        commit('UPDATE_TASK_LOCKER', {
          statusId: payload.statusId,
          taskId: responsePayload.taskId,
          lockerId: responsePayload.id,
          updates: { [responsePayload.column]: responsePayload.value }
        });

        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      console.error('Error updating locker:', error);
      return { success: false, message: 'Hiba történt a frissítés során' };
    }
  },

  async uploadMedia({ commit, rootState }, payload) {
    try {
      const token = rootState.token;
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('taskId', payload.taskId);
      formData.append('locationId', payload.locationId);

      const result = await APIPOST2('uploadMedia', formData, token);

      if (result.data.status === 200) {
        const responsePayload = result.data.payload;

        commit('ADD_TASK_PHOTO', {
          statusId: payload.statusId,
          locationId: responsePayload.locationId,
          photoUrl: responsePayload.url
        });

        return {
          success: true,
          data: result.data,
          message: result.data.message
        };
      } else {
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      return {
        success: false,
        message: 'Hiba történt a fájl feltöltése során'
      };
    }
  },

  async addFee({ commit, rootState }, payload) {
    try {
      const token = rootState.token;
      const result = await APIPOST('addFee', payload, token);

      if (result.data.status === 200) {
        const responsePayload = result.data.payload;

        commit('ADD_TASK_FEE', {
          statusId: payload.statusId,
          taskId: responsePayload.taskId,
          fee: responsePayload
        });

        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      console.error('Error adding fee:', error);
      return { success: false, message: 'Hiba történt a díj hozzáadása során' };
    }
  },

  async deleteFee({ commit, rootState }, payload) {
    try {
      const token = rootState.token;
      const result = await APIDELETE('deleteFee', payload, token);

      if (result.data.status === 200) {
        const responsePayload = result.data.payload;

        commit('REMOVE_TASK_FEE', {
          statusId: payload.statusId,
          taskId: responsePayload.taskId,
          feeId: responsePayload.id
        });

        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      console.error('Error deleting fee:', error);
      return { success: false, message: 'Hiba történt a díj törlése során' };
    }
  },

  async addLocker({ commit, rootState }, payload) {
    try {
      const token = rootState.token;
      const result = await APIPOST('addLocker', payload, token);

      if (result.data.status === 200) {
        const responsePayload = result.data.payload;
        const taskId = responsePayload[0]?.taskId;

        commit('SET_TASK_LOCKERS', {
          statusId: payload.statusId,
          taskId: taskId,
          lockers: responsePayload
        });

        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      console.error('Error adding locker:', error);
      return {
        success: false,
        message: 'Hiba történt a locker hozzáadása során'
      };
    }
  },

  async removeLocker({ commit, rootState }, payload) {
    try {
      const token = rootState.token;
      const result = await APIDELETE('removeLocker', payload, token);

      if (result.data.status === 200) {
        // Megkeressük a taskot
        const tasks =
          this.state.task.tasks.tasksByStatus[payload.statusId] || [];
        const task = tasks.find((t) =>
          t.lockers?.some((l) => l.id === payload.id)
        );

        if (task) {
          commit('REMOVE_TASK_LOCKER', {
            statusId: payload.statusId,
            taskId: task.id,
            lockerId: payload.id
          });
        }

        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      console.error('Error removing locker:', error);
      return {
        success: false,
        message: 'Hiba történt a locker eltávolítása során'
      };
    }
  },

  async deletePhoto({ commit, rootState }, payload) {
    try {
      const token = rootState.token;
      const result = await APIDELETE('deletePhoto', payload, token);

      if (result.data.status === 200) {
        const responsePayload = result.data.payload;

        commit('REMOVE_TASK_PHOTO', {
          statusId: payload.statusId,
          locationId: responsePayload.taskLocationsId,
          photoUrl: responsePayload.url
        });

        return {
          success: true,
          data: result.data,
          message: result.data.message
        };
      } else {
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      return { success: false, message: 'Hiba történt a fotó törlése során' };
    }
  },

  async deleteMedia({ commit, rootState }, payload) {
    commit('SET_LOADING_DELETE_MEDIA', true);

    try {
      const token = rootState.token;
      const result = await APIDELETE(
        'deleteMedia',
        { url: payload.url },
        token
      );

      if (result.data.status === 200) {
        commit('REMOVE_TASK_PHOTO', {
          statusId: payload.statusId,
          locationId: payload.locationId,
          photoUrl: payload.url
        });

        commit('SET_LOADING_DELETE_MEDIA', false);

        return {
          success: true,
          data: result.data,
          message: result.data.message || 'A média sikeresen törölve'
        };
      } else {
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      commit('SET_LOADING_DELETE_MEDIA', false);
      return { success: false, message: 'Hiba történt a média törlése során' };
    }
  },

  async verifyLocker({ commit, rootState }, { statusId, taskId, data }) {
    try {
      const token = rootState.token;
      const result = await APIPOST('verifyLocker', data, token);

      if (result.data.status === 200) {
        const responsePayload = result.data.payload;

        commit('UPDATE_TASK_LOCKER', {
          statusId: statusId,
          taskId: taskId,
          lockerId: responsePayload.id,
          updates: responsePayload
        });

        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      console.error('Error verifying locker:', error);
      return {
        success: false,
        message: 'Hiba történt a locker ellenőrzése során'
      };
    }
  }
};

// Helper function
function enrichTasksWithLocationData(tasks, locations) {
  tasks.forEach((task) => {
    const location = locations.find((loc) => loc.id === task.box_id);
    if (location) {
      if (task.lockers && task.lockers.length > 0) {
        task.lockers.forEach((locker) => {
          locker['is_registered'] = 1;
          locker['is_active'] = 1;
        });
      }
      task['longitude'] = location.longitude;
      task['latitude'] = location.latitude;

      if (!task.location_photos) {
        task.location_photos = [];
      }

      if (location.images?.images?.length > 0) {
        const currentPhotos = task.location_photos.map((p) => p.url);
        location.images.images.forEach((image) => {
          if (image.imagePath && !currentPhotos.includes(image.imagePath)) {
            task.location_photos.push({ url: image.imagePath });
          }
        });
      }
    }
  });
  return tasks;
}
