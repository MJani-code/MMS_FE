// store/task/tasks.js
import { APIGET, APIPOST, APIPOST2, APIPUT, APIDELETE } from '@/api/apiHelper';

const FALLBACK_LOCALE = 'hu';

function normalizeLocale(locale) {
  if (!locale) return FALLBACK_LOCALE;
  return String(locale).toLowerCase().split('-')[0] || FALLBACK_LOCALE;
}

function pickLocalizedValue(source, baseKey, locale) {
  if (!source || typeof source !== 'object') {
    return undefined;
  }

  const normalizedLocale = normalizeLocale(locale);
  const localeCandidates = [normalizedLocale, FALLBACK_LOCALE, 'en'];

  if (source.translations && typeof source.translations === 'object') {
    for (const candidate of localeCandidates) {
      const localized = source.translations[candidate];
      if (localized && localized[baseKey] !== undefined) {
        return localized[baseKey];
      }
    }
  }

  for (const candidate of localeCandidates) {
    const localizedKey = `${baseKey}_${candidate}`;
    if (source[localizedKey] !== undefined) {
      return source[localizedKey];
    }
  }

  return source[baseKey];
}

function localizeNamedArray(items, locale) {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    ...item,
    name: pickLocalizedValue(item, 'name', locale) ?? item.name
  }));
}

function localizeHeaders(headers, locale) {
  if (!Array.isArray(headers)) return [];

  return headers.map((header) => ({
    ...header,
    text: pickLocalizedValue(header, 'text', locale) ?? header.text
  }));
}

function localizeStatusGroups(groups, locale) {
  if (!groups || typeof groups !== 'object') return {};

  return Object.fromEntries(
    Object.entries(groups).map(([statusId, group]) => [
      statusId,
      {
        ...group,
        title: pickLocalizedValue(group, 'title', locale) ?? group.title
      }
    ])
  );
}

export const state = () => ({
  //filters
  filters: {
    searchText: null
  },

  //serverItemLengthByStatus (statusId: { count: number })
  serverItemLengthByStatus: {},

  // Státusz csoportok (accordion fejlécek)
  statusGroups: {},

  // Task-ek státusz szerint (statusId: tasks[])
  tasksByStatus: {},

  // UI állapotok
  expandedAccordions: [],

  // Meta adatok
  headers: [],
  statuses: [],
  fees: [],
  allowedStatuses: [],
  locationTypes: [],
  companies: [],
  taskTypes: [],
  lockerSerials: [],
  responsibles: [],
  priorities: [],

  // Loading states
  isLoadingStatuses: false,
  loadingStatus: {}, // { [statusId]: boolean }
  loadingDeleteMedia: false,
  isSearchLoading: false
});

export const getters = {
  getServerItemLength: (state) => (statusId) => {
    if (!state.serverItemLengthByStatus[statusId]) {
      return state.serverItemLengthByStatus;
    }
    return state.serverItemLengthByStatus[statusId]?.count || 0;
  },

  getFilters: (state) => state.filters,

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
  },

  getTaskCountForStatus: (state) => (statusId) => {
    return state.tasksByStatus[statusId]?.length || 0;
  }
};

export const mutations = {
  SET_SERVER_ITEM_LENGTH(state, { statusId = null, data = null } = {}) {
    if (!data) return;

    if (statusId === null || statusId === undefined) {
      // Tömeges frissítés statusGroups objektumból
      const next = {};
      Object.entries(data).forEach(([id, group]) => {
        next[id] = { count: group?.count || 0 };
      });
      state.serverItemLengthByStatus = next;
      return;
    }

    if (!state.serverItemLengthByStatus[statusId]) {
      state.serverItemLengthByStatus[statusId] = { count: 0 };
    }
    state.serverItemLengthByStatus[statusId].count = data.count || 0;
  },

  SET_SEARCH_TEXT(state, text) {
    state.filters.searchText = text;
  },

  SET_FILTER(state, { key, value }) {
    state.filters[key] = value;
  },

  CLEAR_SEARCH_TEXT(state) {
    state.filters.searchText = null;
  },

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
    state.responsibles = payload.responsibles || [];
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

  SET_SEARCH_LOADING(state, isLoading) {
    state.isSearchLoading = isLoading;
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

  UPDATE_TASK_LOCKER(state, { taskId, lockerId, updates }) {
    const statusId = Object.keys(state.tasksByStatus).find((sId) =>
      state.tasksByStatus[sId].some((t) => t.id === taskId)
    );
    const tasks = state.tasksByStatus[statusId];
    if (tasks) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.lockers) {
        const lockerIndex = task.lockers.findIndex((l) => l.id === lockerId);
        if (lockerIndex !== -1) {
          // Locker adatok cseréje új objektummal a reaktivitás miatt
          task.lockers.splice(lockerIndex, 1, {
            ...task.lockers[lockerIndex],
            ...updates
          });
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

  SET_TASK_LOCKERS(state, { taskId, lockers }) {
    const statusId = Object.keys(state.tasksByStatus).find((sId) =>
      state.tasksByStatus[sId].some((t) => t.id === taskId)
    );
    const tasks = state.tasksByStatus[statusId];
    if (tasks) {
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        const currentLockers = Array.isArray(tasks[taskIndex].lockers)
          ? tasks[taskIndex].lockers
          : [];
        const incomingLockers = Array.isArray(lockers) ? lockers : [];

        // Hozzáfűzés meglévőkhöz; duplikáció csak egyértelműen azonos kulcsnál kerül kiszűrésre.
        const buildKey = (locker) => {
          if (!locker) return null;
          if (locker.id !== undefined && locker.id !== null) {
            return `id:${locker.id}`;
          }
          if (locker.serial) {
            return `serial:${locker.serial}`;
          }
          return null;
        };

        const seen = new Set();
        const mergedLockers = [];

        [...currentLockers, ...incomingLockers].forEach((locker) => {
          const key = buildKey(locker);
          if (!key) {
            mergedLockers.push(locker);
            return;
          }
          if (!seen.has(key)) {
            seen.add(key);
            mergedLockers.push(locker);
          }
        });

        const updatedTask = { ...tasks[taskIndex], lockers: mergedLockers };
        tasks.splice(taskIndex, 1, updatedTask);
      }
    }
  },

  REMOVE_TASK_LOCKER(state, { taskId, lockerId }) {
    const statusId = Object.keys(state.tasksByStatus).find((sId) =>
      state.tasksByStatus[sId].some((t) => t.id === taskId)
    );
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

  ADD_TASK_PHOTO(state, { locationId, photoUrl }) {
    const statusId = Object.keys(state.tasksByStatus).find((sId) =>
      state.tasksByStatus[sId].some((t) => t.location_id === locationId)
    );
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

  REMOVE_TASK_PHOTO(state, { locationId, photoUrl }) {
    const statusId = Object.keys(state.tasksByStatus).find((sId) =>
      state.tasksByStatus[sId].some((t) => t.location_id === locationId)
    );
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
    { taskId, toStatusId, updatedTask, toStatusMeta }
  ) {
    //kikeressük a régi státuszt a taskId alapján
    const fromStatusId = Object.keys(state.tasksByStatus).find((statusId) =>
      state.tasksByStatus[statusId].some((t) => String(t.id) === String(taskId))
    );

    if (fromStatusId === undefined) {
      return;
    }
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
    // Az új státuszhoz hozzáadjuk a frissített taskot
    state.tasksByStatus[toStatusId].unshift(updatedTask);

    // Frissítjük a számláló értékeket és hozzáadjuk az új státusz csoportot, ha szükséges
    if (state.serverItemLengthByStatus[fromStatusId]) {
      state.serverItemLengthByStatus[fromStatusId].count = Math.max(
        0,
        state.serverItemLengthByStatus[fromStatusId].count - 1
      );
    }
    const statusMeta =
      state.statuses.find((s) => String(s.id) === String(toStatusId)) ||
      state.allowedStatuses.find((s) => String(s.id) === String(toStatusId));
    const statusName =
      toStatusMeta?.status_exohu || statusMeta?.name || 'Ismeretlen státusz';
    const statusColor = toStatusMeta?.color || statusMeta?.color || '#ccc';

    if (!state.serverItemLengthByStatus[toStatusId]) {
      //statusGroupban is létrehozzuk az új státusz csoportot, ha még nem létezik
      if (!state.statusGroups[toStatusId]) {
        state.statusGroups[toStatusId] = {
          color: statusColor,
          count: 1,
          title: statusName
        };
      }

      state.serverItemLengthByStatus[toStatusId] = {
        color: statusColor,
        count: 1,
        title: statusName
      };
    } else {
      // Ha az új státusz csoport már létezik, növeljük a számlálót
      state.serverItemLengthByStatus[toStatusId].count =
        (state.serverItemLengthByStatus[toStatusId].count || 0) + 1;

      // Ha korábban 0-ra csökkent és töröltük a groupot, hozd vissza az első elemnél.
      if (!state.statusGroups[toStatusId]) {
        state.statusGroups[toStatusId] = {
          color: statusColor,
          count: state.serverItemLengthByStatus[toStatusId].count,
          title: statusName
        };
      } else {
        state.statusGroups[toStatusId].count =
          state.serverItemLengthByStatus[toStatusId].count;
      }
    }
    //Ha a számláló értéke 0, akkor eltávolítjuk a státusz csoportot
    if (
      state.serverItemLengthByStatus[fromStatusId] &&
      state.serverItemLengthByStatus[fromStatusId].count === 0
    ) {
      const { [fromStatusId]: _, ...rest } = state.statusGroups;
      state.statusGroups = rest;
      delete state.serverItemLengthByStatus[fromStatusId];
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

  REMOVE_GROUP_FROM_STATUS(state, statusId) {
    if (!statusId) {
      state.statusGroups = {};
      state.tasksByStatus = {};
      state.serverItemLengthByStatus = {};
      return;
    }

    // Eltávolítjuk a státusz csoportot
    const { [statusId]: _, ...rest } = state.statusGroups;
    state.statusGroups = rest;

    // Eltávolítjuk a státuszhoz tartozó taskokat
    if (state.tasksByStatus[statusId]) {
      delete state.tasksByStatus[statusId];
    }

    if (state.serverItemLengthByStatus[statusId]) {
      delete state.serverItemLengthByStatus[statusId];
    }
  },

  // UPDATE_STATUS_COUNT(state, { statusId, count, direction }) {
  //   if (direction == 'plus') {
  //     if (state.serverItemLengthByStatus[statusId]) {
  //       state.serverItemLengthByStatus[statusId].count =
  //         (state.serverItemLengthByStatus[statusId].count || 0) + 1;
  //     }
  //     return;
  //   }
  //   if (direction == 'minus') {
  //     if (state.serverItemLengthByStatus[statusId]) {
  //       state.serverItemLengthByStatus[statusId].count = Math.max(
  //         0,
  //         (state.serverItemLengthByStatus[statusId].count || 0) - 1
  //       );
  //     }
  //     return;
  //   }
  //   if (state.serverItemLengthByStatus[statusId] && typeof count === 'number') {
  //     state.serverItemLengthByStatus[statusId].count = count;
  //   }
  // },

  SET_EXPANDED_ACCORDIONS(state, indices) {
    state.expandedAccordions = Array.isArray(indices) ? indices : [];
  },

  // Vuetify v-expansion-panels uses panel indices (numbers) for v-model
  TOGGLE_ACCORDION(state, index) {
    if (state.expandedAccordions.includes(index)) {
      state.expandedAccordions = state.expandedAccordions.filter(
        (i) => i !== index
      );
    } else {
      state.expandedAccordions.push(index);
    }
  }
};

export const actions = {
  async fetchInitialData({ commit, rootState }) {
    commit('SET_LOADING_STATUSES', true);
    try {
      const token = rootState.token;
      const locale = rootState.locale || FALLBACK_LOCALE;
      const result = await APIGET('getInitialData', { locale }, token);

      if (result.data.status === 200) {
        const payload = result.data.payload;
        const localizedPayload = {
          ...payload,
          headers: localizeHeaders(payload.headers, locale),
          statuses: localizeNamedArray(payload.statuses, locale),
          fees: localizeNamedArray(payload.fees, locale),
          allowedStatuses: localizeNamedArray(payload.allowedStatuses, locale),
          locationTypes: localizeNamedArray(payload.locationTypes, locale),
          taskTypes: localizeNamedArray(payload.taskTypes, locale),
          lockerSerials: localizeNamedArray(payload.lockerSerials, locale),
          responsibles: localizeNamedArray(payload.responsibles, locale),
          priorities: localizeNamedArray(payload.priorities, locale),
          statusGroups: localizeStatusGroups(payload.statusGroups, locale)
        };

        // Meta adatok mentése
        commit('SET_META_DATA', localizedPayload);

        // Státusz csoportok mentése
        commit('SET_STATUS_GROUPS', localizedPayload.statusGroups || {});

        // Server item length mentése
        if (localizedPayload.statusGroups) {
          commit('SET_SERVER_ITEM_LENGTH', {
            statusId: null,
            data: localizedPayload.statusGroups
          });
        }

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

  async fetchTask(
    { commit, rootState, state },
    { statusId, page, itemsPerPage, sortBy = null, sortDesc = false }
  ) {
    commit('SET_LOADING_STATUS', { statusId, isLoading: true });
    try {
      const token = rootState.token;
      const result = await APIPOST(
        'getTask',
        {
          statusId,
          page,
          itemsPerPage,
          sortBy,
          sortDesc,
          filters: state.filters
        },
        token
      );

      if (result.data.status === 200) {
        let tasks = result.data.data || [];

        // D4ME lokációk adatainak betöltése
        // const d4meResult = await APIGET('getDirect4MeLocations', null, token);
        // if (d4meResult.data.status === 200) {
        //   const locations = d4meResult.data.data;
        //   tasks = enrichTasksWithLocationData(tasks, locations);
        // }

        if (statusId !== null && statusId !== undefined) {
          commit('SET_TASKS_FOR_STATUS', { statusId, tasks });
        }

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

  async setSearchText({ commit, dispatch, state }, text) {
    commit('SET_SEARCH_LOADING', true);
    try {
      commit('SET_SEARCH_TEXT', text);
      commit('REMOVE_GROUP_FROM_STATUS', null); // Minden státusz csoport és task eltávolítása a store-ból
      const result = await dispatch('fetchTask', {
        statusId: null,
        page: null,
        itemsPerPage: null
      });
      //serverItemLengthByStatus frissítése a kapott adatok alapján
      if (result.success && result.tasks) {
        const tasksByStatus = {};
        result.tasks.forEach((task) => {
          if (!tasksByStatus[task.status_exohu_id]) {
            tasksByStatus[task.status_exohu_id] = [];
          }
          tasksByStatus[task.status_exohu_id].push(task);
        });

        const statusGroups = {};
        Object.entries(tasksByStatus).forEach(([statusId, tasks]) => {
          const statusMeta =
            state.statuses.find((s) => String(s.id) === String(statusId)) ||
            state.allowedStatuses.find(
              (s) => String(s.id) === String(statusId)
            );

          statusGroups[statusId] = {
            title: statusMeta?.name || 'Ismeretlen státusz',
            color: statusMeta?.color || '#ccc',
            count: tasks.length
          };

          commit('SET_SERVER_ITEM_LENGTH', {
            statusId: statusId,
            data: { count: tasks.length }
          });
          commit('SET_TASKS_FOR_STATUS', { statusId, tasks });
        });

        commit('SET_STATUS_GROUPS', statusGroups);
      }
    } catch (error) {
      console.error('Error setting search text:', error);
    } finally {
      commit('SET_SEARCH_LOADING', false);
    }
  },

  async setFilter({ commit }, payload) {
    try {
      if (payload && Object.prototype.hasOwnProperty.call(payload, 'key')) {
        commit('SET_FILTER', { key: payload.key, value: payload.value });
        return;
      }

      if (payload && typeof payload === 'object') {
        Object.entries(payload).forEach(([key, value]) => {
          commit('SET_FILTER', { key, value });
        });
      }

      //fetchTask meghívása a szűrő értékek alapján
      await this.dispatch('task/tasks/fetchTask', {
        statusId: payload.statusId ?? null,
        page: payload.page ?? null,
        itemsPerPage: payload.itemsPerPage ?? null,
        sortBy: payload.sortBy ?? null,
        sortDesc: payload.sortDesc ?? false
      });
    } catch (error) {
      console.error('Error setting filter:', error);
    }
  },

  async clearSearchText({ commit, dispatch }) {
    commit('SET_SEARCH_LOADING', true);
    try {
      commit('CLEAR_SEARCH_TEXT');
      await dispatch('fetchInitialData');
    } catch (error) {
      console.error('Error clearing search text:', error);
    } finally {
      commit('SET_SEARCH_LOADING', false);
    }
  },

  async createTaskBatch({ dispatch, rootState }, payload) {
    try {
      const token = rootState.token;
      const locale = rootState.locale || 'hu';

      const formData = payload instanceof FormData ? payload : new FormData();
      if (!(payload instanceof FormData) && payload?.file) {
        formData.append('file', payload.file);
      }
      if (!formData.has('locale')) {
        formData.append('locale', locale);
      }

      const result = await APIPOST2('createTaskBatch', formData, token);

      if (result.data.status === 200) {
        await dispatch('fetchInitialData');
        return {
          success: true,
          data: result.data,
          message: result.data.message
        };
      }

      return { success: false, message: result.data.message };
    } catch (error) {
      console.error('Error creating task batch:', error);
      return {
        success: false,
        message: 'Hiba történt a kötegelt feladat létrehozása során'
      };
    }
  },

  async uploadBatchTasks({ dispatch }, payload) {
    return await dispatch('createTaskBatch', payload);
  },

  async createTask({ dispatch, rootState }, payload) {
    try {
      const token = rootState.token;
      const locale = rootState.locale || 'hu';
      const requestPayload = {
        ...(payload || {}),
        locale
      };

      const result = await APIPOST('createTask', requestPayload, token);

      if (result.data.status === 200) {
        await dispatch('fetchInitialData');
        return {
          success: true,
          data: result.data,
          message: result.data.message
        };
      }

      return { success: false, message: result.data.message };
    } catch (error) {
      console.error('Error creating task:', error);
      return {
        success: false,
        message: 'Hiba történt a feladat létrehozása során'
      };
    }
  },

  async updateTask({ commit, rootState, state }, payload) {
    try {
      const token = rootState.token;
      const result = await APIPOST('updateTask', payload, token);

      if (result.data.status === 200) {
        const responsePayload = result.data.payload;

        if (payload.column === 'status_by_exohu_id') {
          // Státusz váltás- megkeressük a taskot a régi státuszban, majd áthelyezzük az új státuszba
          const sourceStatusId =
            payload.statusId ??
            Object.keys(state.tasksByStatus).find((statusId) =>
              state.tasksByStatus[statusId].some(
                (t) => String(t.id) === String(payload.id)
              )
            );

          const task = sourceStatusId
            ? state.tasksByStatus[sourceStatusId]?.find(
                (t) => String(t.id) === String(payload.id)
              )
            : null;

          if (task) {
            commit('MOVE_TASK_TO_STATUS', {
              taskId: responsePayload.id,
              toStatusId: responsePayload.value,
              toStatusMeta: responsePayload,
              updatedTask: {
                ...task,
                status_exohu_id: responsePayload.value
              }
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

  async bulkUpdateTask({ commit, rootState, state }, payload) {
    try {
      const token = rootState.token;
      const result = await APIPOST('updateTaskInBatch', payload, token);

      if (result.data.status === 200) {
        const responsePayload = result.data.payload || {};

        if (
          payload.column === 'status_by_exohu_id' &&
          Array.isArray(payload.taskIds)
        ) {
          payload.taskIds.forEach((taskId) => {
            const sourceStatusId = Object.keys(state.tasksByStatus).find(
              (statusId) =>
                state.tasksByStatus[statusId].some(
                  (t) => String(t.id) === String(taskId)
                )
            );

            const task = sourceStatusId
              ? state.tasksByStatus[sourceStatusId]?.find(
                  (t) => String(t.id) === String(taskId)
                )
              : null;

            if (task) {
              commit('MOVE_TASK_TO_STATUS', {
                taskId,
                toStatusId: responsePayload.value ?? payload.value,
                toStatusMeta: responsePayload,
                updatedTask: {
                  ...task,
                  status_exohu_id: responsePayload.value ?? payload.value
                }
              });
            }
          });
        }

        return { success: true, data: result.data };
      }

      return {
        success: false,
        message: result.data.message || 'Hiba történt',
        data: result.data
      };
    } catch (error) {
      console.error('Error bulk updating tasks:', error);
      return {
        success: false,
        message: 'Hiba történt a tömeges frissítés során'
      };
    }
  },

  async updateTaskLocker({ commit, rootState }, payload) {
    try {
      const token = rootState.token;
      const result = await APIPOST('updateTask', payload, token);

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
        const taskId = responsePayload[0]?.task_id;

        commit('SET_TASK_LOCKERS', {
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
      const result = await APIPOST('removeLocker', payload, token);

      if (result.data.status === 200) {
        commit('REMOVE_TASK_LOCKER', {
          statusId: payload.statusId,
          taskId: payload.task_id,
          lockerId: payload.id
        });

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

  async verifyLocker({ commit, rootState }, payload) {
    try {
      const token = rootState.token;
      const result = await APIPOST('verifyLocker', payload, token);

      if (result.data.status === 200) {
        const responsePayload = result.data.payload;

        commit('UPDATE_TASK_LOCKER', {
          taskId: payload.task_id,
          lockerId: payload.id,
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
