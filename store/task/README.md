# Task Management Store

## Áttekintés

A task kezelés központi Vuex store modulja. Kezeli az összes task adatot, API hívásokat és állapotváltozásokat.

## Architektúra

```
┌─────────────────┐
│  tasks.vue      │  - Koordináció
│  (Parent)       │  - Státusz csoportok
└────────┬────────┘  - Accordion refresh
         │
         │ events: statusChange, bulkUpdate, download
         │
    ┌────▼─────┐
    │ Accordion│ ◄──────┐
    │  Field   │        │ computed: loadedTasks
    └────┬─────┘        │ (reaktív frissítés)
         │              │
         │ store        │
         │ actions      │
         │              │
    ┌────▼──────────────┴──┐
    │   Vuex Store          │
    │  task/tasks module    │
    │                       │
    │  State:               │
    │  - tasksByStatus      │
    │  - statusGroups       │
    │  - meta data          │
    │                       │
    │  Actions:             │
    │  - fetchTaskStatuses  │
    │  - fetchTasksByStatus │
    │  - updateTask         │
    │  - addFee, addLocker  │
    │  - deleteFee, etc.    │
    │                       │
    │  Mutations:           │
    │  - SET_TASKS_FOR_STATUS│
    │  - UPDATE_TASK        │
    │  - MOVE_TASK_TO_STATUS│
    │  - ADD_TASK_FEE, etc. │
    └───────────────────────┘
             │
             │ API calls
             ▼
        Backend PHP
```

## State Struktúra

```javascript
{
  // Státusz csoportok (accordion fejlécek)
  statusGroups: {
    '1': { title: 'Új', color: '#blue', count: 5 },
    '2': { title: 'Folyamatban', color: '#orange', count: 12 }
  },
  
  // Task-ek státusz szerint
  tasksByStatus: {
    '1': [task1, task2, task3...],
    '2': [task4, task5...]
  },
  
  // Meta adatok (közös minden status-hoz)
  headers: [...],
  statuses: [...],
  fees: [...],
  allowedStatuses: [...],
  locationTypes: [...],
  taskTypes: [...],
  lockerSerials: [...],
  companies: [...],
  priorities: [...]
}
```

## Használat

### 1. AccordionField - Adatok olvasása

```vue
<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('task/tasks', ['getTasksForStatus', 'isStatusLoading']),
    
    // Reaktív - automatikusan frissül
    loadedTasks() {
      return this.getTasksForStatus(this.statusId);
    },
    
    isLoading() {
      return this.isStatusLoading(this.statusId);
    }
  }
}
</script>
```

### 2. AccordionField - Adatok betöltése

```javascript
async loadTasksForStatus() {
  const result = await this.$store.dispatch(
    'task/tasks/fetchTasksByStatus', 
    this.statusId
  );
  
  if (result.success) {
    this.hasLoadedOnce = true;
  }
}
```

### 3. AccordionField - Műveletek végrehajtása

```javascript
// Locker hozzáadása
async addLocker(payload) {
  const result = await this.$store.dispatch('task/tasks/addLocker', {
    ...payload,
    statusId: this.statusId
  });
  
  if (!result.success) {
    this.showNotification('error', result.message);
  }
  // Az adatok automatikusan frissülnek a store-ban!
}

// Fee törlése
async deleteFee(payload) {
  const result = await this.$store.dispatch('task/tasks/deleteFee', {
    ...payload,
    statusId: this.statusId
  });
}
```

### 4. tasks.vue - Koordináció

```javascript
// Státusz változás kezelése
async handleStatusChange(payload) {
  const { taskId, oldStatusId, newStatusId, color, status_exohu } = payload;
  
  const tasks = this.$store.state.task.tasks.tasksByStatus[oldStatusId] || [];
  const task = tasks.find(t => t.id === taskId);
  
  if (task) {
    const updatedTask = {
      ...task,
      status_exohu_id: newStatusId,
      status_color: color,
      status_exohu: status_exohu
    };
    
    // Store mutation - task mozgatása
    this.$store.commit('task/tasks/MOVE_TASK_TO_STATUS', {
      taskId,
      fromStatusId: oldStatusId,
      toStatusId: newStatusId,
      updatedTask
    });
    
    // Státusz csoportok frissítése
    await this.$store.dispatch('task/tasks/fetchTaskStatuses');
  }
}
```

## Előnyök

1. **Központi adatkezelés**: Minden task adat egy helyen
2. **Reaktivitás**: Vue reactivity - automatikus UI frissítés
3. **Egyszerűbb komponensek**: Kevesebb logika a komponensekben
4. **Könnyebb tesztelés**: Store izoláltan tesztelhető
5. **Kevesebb prop drilling**: Nem kell prop-okat végigadni
6. **Konzisztens állapot**: Egy source of truth

## Store Actions

### Adatok betöltése
- `fetchTaskStatuses()` - Státusz csoportok és meta adatok
- `fetchTasksByStatus(statusId)` - Egy státusz task-jei

### Task műveletek
- `updateTask(payload)` - Task frissítése
- `updateTaskLocker(payload)` - Locker adatok frissítése

### Fee műveletek
- `addFee(payload)` - Fee hozzáadása
- `deleteFee(payload)` - Fee törlése

### Locker műveletek
- `addLocker(payload)` - Locker hozzáadása
- `removeLocker(payload)` - Locker eltávolítása
- `verifyLocker(payload)` - Locker ellenőrzése

### Egyéb
- `deletePhoto(payload)` - Fotó törlése

## Store Mutations

- `SET_STATUS_GROUPS` - Státusz csoportok beállítása
- `SET_META_DATA` - Meta adatok beállítása
- `SET_TASKS_FOR_STATUS` - Task-ek beállítása egy státuszhoz
- `UPDATE_TASK_IN_STATUS` - Task frissítése
- `UPDATE_TASK_LOCKER` - Locker frissítése
- `ADD_TASK_FEE` - Fee hozzáadása
- `REMOVE_TASK_FEE` - Fee eltávolítása
- `SET_TASK_LOCKERS` - Task locker-ek beállítása
- `REMOVE_TASK_LOCKER` - Locker eltávolítása
- `ADD_TASK_PHOTO` - Fotó hozzáadása
- `REMOVE_TASK_PHOTO` - Fotó eltávolítása
- `MOVE_TASK_TO_STATUS` - Task mozgatása státuszok között
- `REMOVE_TASKS_FROM_STATUS` - Több task eltávolítása
- `UPDATE_STATUS_COUNT` - Státusz számláló frissítése

## Eseménykezelés

### AccordionField → tasks.vue

Csak koordinációt igénylő események:
- `@statusChange` - Státusz változás (több accordion érintett)
- `@bulkUpdateLockerData` - Tömeges frissítés
- `@downloadTig` - TIG letöltés
- `@downloadTasks` - Task-ek letöltése
- `@tasksLoaded` - Info
- `@countChanged` - Számláló frissítés

Minden más műveletet az AccordionField közvetlenül a store-on keresztül kezel!
