import { taskMixin } from '@/mixins/taskMixin.js';

const repairTexts = {
  hu: {
    confirmDeleteIntervention: 'Biztosan törlöd a beavatkozást?',
    cancel: 'Mégse',
    yes: 'Igen',
    deleteSuccess: 'Beavatkozás sikeresen törölve.',
    addSuccess: 'Beavatkozás sikeresen hozzáadva.'
  },
  en: {
    confirmDeleteIntervention:
      'Are you sure you want to delete the intervention?',
    cancel: 'Cancel',
    yes: 'Yes',
    deleteSuccess: 'Intervention deleted successfully.',
    addSuccess: 'Intervention added successfully.'
  },
  sl: {
    confirmDeleteIntervention: 'Ali ste prepricani, da zelite izbrisati poseg?',
    cancel: 'Preklici',
    yes: 'Da',
    deleteSuccess: 'Poseg je bil uspesno izbrisan.',
    addSuccess: 'Poseg je bil uspesno dodan.'
  }
};

function getRepairText(locale, key) {
  const selectedLocale = repairTexts[locale] ? locale : 'hu';
  return repairTexts[selectedLocale][key] || repairTexts.hu[key] || '';
}

export const state = () => ({
  issues: [],
  interventionList: [],
  spareParts: [],
  interventions: [],
  loading: false,
  successMessage: '',
  errorMessage: ''
});

export const mutations = {
  setIssue(state, issues) {
    state.issues = issues;
  },
  setInterventionList(state, interventionList) {
    state.interventionList = interventionList;
  },
  setSpareParts(state, spareParts) {
    state.spareParts = spareParts;
  },
  setInterventions(state, interventions) {
    state.interventions = interventions;
  }
};

export const actions = {
  async fetchIssuesAction({ commit, rootState }, payload) {
    const token = rootState.token;
    const res = await taskMixin.methods.fetchIssues(payload, token);
    commit('setIssue', res.data.payload.issues);
    commit('setInterventionList', res.data.payload.interventionList);
    commit('setSpareParts', res.data.payload.spareParts);
    commit('setInterventions', res.data.payload.interventions);
  },

  async deleteIntervention({ dispatch, commit, rootState }, data) {
    const locale = rootState.locale || 'hu';

    dispatch(
      'notification/showModal',
      {
        message: getRepairText(locale, 'confirmDeleteIntervention'),
        buttons: [
          {
            text: getRepairText(locale, 'cancel'),
            style: 'secondary',
            action: () => dispatch('notification/hideModal', {}, { root: true })
          },
          {
            text: getRepairText(locale, 'yes'),
            style: 'primary',
            action: () =>
              dispatch('locker/repair/confirmDeleteIntervention', data, {
                root: true
              })
          }
        ]
      },
      { root: true }
    );
  },

  async confirmDeleteIntervention({ dispatch, commit, rootState }, data) {
    const token = rootState.token;
    const locale = rootState.locale || 'hu';

    const res = await taskMixin.methods.deleteIntervention(data, token);
    if (res.data.status === 200) {
      dispatch(
        'notification/addNotification',
        {
          message: getRepairText(locale, 'deleteSuccess'),
          type: 'success'
        },
        { root: true }
      );

      // Removel item from interventions list in state
      const updatedInterventions = rootState.locker.repair.interventions.filter(
        (item) => item.id !== data.interventionId
      );
      commit('setInterventions', updatedInterventions);

      // Fetch updated interventions list using fetchIssuesAction
      await dispatch('fetchIssuesAction', {
        taskId: data.taskId,
        uuid: data.lockerSerial
      });

      // Broadcast event to notify other components about the update
      this.$broadcast.send('taskUpdated', { id: data.taskId });
    } else {
      dispatch(
        'notification/addNotification',
        {
          message: res.data.message || 'Hiba történt a törlés során.',
          type: 'error'
        },
        { root: true }
      );
    }
    dispatch('notification/hideModal', {}, { root: true });
  },

  async addInterventionAction(
    { dispatch, commit, rootState },
    { taskId, interventionData }
  ) {
    const token = rootState.token;
    const locale = rootState.locale || 'hu';
    const res = await taskMixin.methods.addIntervention(
      taskId,
      interventionData,
      token
    );
    if (res.data.status === 200) {
      dispatch(
        'notification/addNotification',
        {
          message: getRepairText(locale, 'addSuccess'),
          type: 'success'
        },
        { root: true }
      );

      // Fetch updated interventions list using fetchIssuesAction
      await dispatch('fetchIssuesAction', {
        taskId: taskId,
        uuid: interventionData.uuid
      });
    } else {
      dispatch(
        'notification/addNotification',
        {
          message: res.data.message || 'Hiba történt a hozzáadás során.',
          type: 'error'
        },
        { root: true }
      );
    }
  }
};

export const getters = {
  getIssues(state) {
    return state.issues;
  },
  getInterventionList(state) {
    return state.interventionList;
  },
  getSpareParts(state) {
    return state.spareParts;
  },
  getInterventions(state) {
    return state.interventions;
  }
};
