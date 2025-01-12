<template>
  <div>
    <v-sheet elevation="1" outlined rounded class="mb-10 mt-8">
      <v-card-title class="text-h5"> Szűrők </v-card-title>
      <LockerFiltersField :filters="filters" @update-filter="updateFilter" />
    </v-sheet>
    <v-sheet elevation="1" outlined rounded class="mb-4">
      <v-card-title class="text-h5"> Automaták </v-card-title>
      <v-card-subtitle class="text-body-2">
        Összesen: {{ filteredLockers.length }} db
      </v-card-subtitle>
      <v-col cols="12" sm="12" md="3" lg="2">
        <v-select v-model="sortKey" :items="sortOptions" label="Rendezés" />
      </v-col>
      <template v-if="isLoading">
        <v-sheet class="pa-3">
          <v-row>
            <v-col cols="12" sm="12" md="3" lg="4" v-for="i in 18" :key="i">
              <v-skeleton-loader
                class="mx-auto"
                max-width="300"
                type="card"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </v-sheet>
      </template>
      <LockerListFromLosField :lockers="paginatedLockers" />
    </v-sheet>
    <div class="text-center">
      <v-pagination
        v-model="pageNumber"
        :length="Math.ceil(filteredLockers.length / pageSize)"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { taskMixin } from '@/mixins/taskMixin.js';
import LockerListFromLosField from '../../components/Fields/LockerListFromLosField.vue';
import LockerFiltersField from '../../components/Fields/LockerFiltersField.vue';

export default {
  components: {
    LockerListFromLosField,
    LockerFiltersField
  },
  mixins: [taskMixin],
  data: () => ({
    lockers: [],
    filters: {
      brand: null,
      range: [0, 100],
      isPassive: false
    },
    min: 0,
    max: 100,
    brands: [
      {
        id: 1,
        name: 'Arka'
      },
      {
        id: 2,
        name: 'DC'
      }
    ],
    selectedBrand: null,
    pageNumber: 1,
    pageSize: 18,
    currentPage: 1,
    isActive: true,
    totalLocation: 210,
    totalLockers: 0,
    previousUrl: '',
    sortKey: 'lockerStationId',
    sortOptions: [
      { text: 'Locker Station ID', value: 'lockerStationId' },
      { text: 'Hibás rekeszek', value: 'faultyCompartments' },
      { text: 'Rekesztelítettség', value: 'compartmentOccupation' },
      { text: 'Csatlakozási idő', value: 'lastConnectionTimestamp' }
    ]
  }),
  watch: {
    pageNumber(newPage) {
      this.currentPage = newPage;
      this.updateUrl();
    },
    filters: {
      handler() {
        this.pageNumber = 1;
        this.updateUrl();
      },
      deep: true
    }
  },
  //csak azokat a lockereket listázzuk, amelyekre a szűrőfeltétel igaz. Ha nincsen kiválasztva brand, akkor az összes lockert listázzuk
  computed: {
    filteredLockers() {
      return this.lockers.filter((resultList) => {
        return Object.keys(this.filters).every((key) => {
          const filterValue = this.filters[key];
          if (!filterValue || filterValue.length === 0) {
            return true;
          }

          //brand szűrés
          if (key === 'brand') {
            if (filterValue) {
              return resultList.lockerList.some(
                (locker) => locker.brand == filterValue
              );
            }
            return true;
          }

          if (key === 'range') {
            return resultList.lockerList.some(
              (locker) =>
                locker.batteryLevel >= filterValue[0] &&
                locker.batteryLevel <= filterValue[1]
            );
          }

          if (key === 'isPassive') {
            if (filterValue) {
              console.log(filterValue);
              return resultList.lockerList.some(
                (locker) => locker.isPassive === true
              );
            } else {
              return resultList.lockerList.some(
                (locker) => locker.isPassive === false
              );
            }
          }

          //privateKey1Error szűrés
          if (key === 'privateKey1Error') {
            if (filterValue) {
              return resultList.lockerList.some(
                (locker) => locker.privateKey1Error === true
              );
            } else {
              return resultList.lockerList.some(
                (locker) => locker.privateKey1Error === false
              );
            }
          }

          //isConnectionError szűrés
          if (key === 'isConnectionError') {
            if (filterValue) {
              console.log('isConnectionError:', filterValue);
              //Azon lockerek listája, amelyeknél a lastConnectionTimestamp értéke 12 órával korábbi
              return resultList.lockerList.some((locker) => {
                const timestamp = locker.lastConnectionTimestamp;
                return timestamp < Date.now() / 1000 - 43200;
              });
            } else {
              return true;
            }
          }

          //Szabadszöveges mezőbe bevitt érték keresése az összes kulcsban
          if (key === 'search') {
            const searchText = filterValue.toLowerCase();
            return (
              Object.values(resultList).some((value) =>
                String(value).toLowerCase().includes(searchText)
              ) ||
              resultList.lockerList.some((locker) => {
                return Object.values(locker).some((value) =>
                  String(value).toLowerCase().includes(searchText)
                );
              })
            );
          }
          if (key === 'search') {
            const searchText = filterValue.toLowerCase();
            return resultList.lockerList.some((locker) => {
              return Object.values(locker).some((value) =>
                String(value).toLowerCase().includes(searchText)
              );
            });
          }

          // Más mezők egyszerű összehasonlítása
          return String(resultList[key])
            .toLowerCase()
            .includes(String(filterValue).toLowerCase());
        });
      });
    },
    isLoading() {
      //store-ból jön
      return this.$store.state.loading;
    },
    paginatedLockers() {
      //Rendezés
      const sortedLockers = [...this.filteredLockers].sort((a, b) => {
        if (this.sortKey === 'faultyCompartments') {
          const aFaultyCount = a.lockerList[0].compartmentList.filter(
            (locker) => locker.status == 4
          ).length;
          const bFaultyCount = b.lockerList[0].compartmentList.filter(
            (locker) => locker.status == 4
          ).length;
          return bFaultyCount - aFaultyCount;
        } else if (this.sortKey === 'lastConnectionTimestamp') {
          return (
            a.lockerList[0].lastConnectionTimestamp -
            b.lockerList[0].lastConnectionTimestamp
          );
        } else if (this.sortKey === 'compartmentOccupation') {
          const aOccupiedCount = a.lockerList[0].compartmentList.filter(
            (locker) => locker.status !== 1
          ).length;
          const bOccupiedCount = b.lockerList[0].compartmentList.filter(
            (locker) => locker.status !== 1
          ).length;
          return bOccupiedCount - aOccupiedCount;
        } else {
          return a[this.sortKey] - b[this.sortKey];
        }
      });
      const start = (this.pageNumber - 1) * this.pageSize;
      const end = start + this.pageSize;
      return sortedLockers.slice(start, end);
    }
  },
  mounted() {
    this.previousUrl = localStorage.getItem('previousUrl');
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    if (page) {
      this.pageNumber = parseInt(page);
    }
    if (
      !this.previousUrl.includes('/admin/locker/') ||
      !localStorage.getItem('lockers')
    ) {
      this.getLockerData();
    } else {
      this.lockers = JSON.parse(localStorage.getItem('lockers'));
    }
  },
  methods: {
    async getLockerData() {
      this.$store.commit('turnOnLoading');
      try {
        const response = await this.getLockerDataFromLos({
          Filter: null,
          IsActive: true,
          pageNumber: this.currentPage,
          pageSize: this.totalLocation,
          Countrycode: 'HU'
        });
        if (response.data.resultCode === 200) {
          this.lockers = response.data.payload.resultList;
          localStorage.setItem('lockers', JSON.stringify(this.lockers));
        } else {
          const error = response.resultMessage;
          this.showNotification('error', error);
        }
      } catch (error) {
        console.error(error);
      }
      this.$store.commit('turnOffLoading');
      const totalItems = this.lockers.reduce(
        (acc, resultList) => acc + resultList.lockerList.length,
        0
      );
      this.totalLockers = totalItems;
    },
    updateFilter({ key, value }) {
      this.$set(this.filters, key, value);
    },
    updateUrl() {
      const url = new URL(window.location);
      url.searchParams.set('page', this.pageNumber);
      window.history.pushState({}, '', url);
    },
    onPageChange(pageNumber) {
      //Api call to get the data
    },
    showNotification($type, $message) {
      this.$store.dispatch('notification/addNotification', {
        type: $type,
        message: $message,
        timeout: 5000
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.previousUrl = from.fullPath;
      //vm.previousUrl értékének mentése a localstorage-ba
      localStorage.setItem('previousUrl', vm.previousUrl);
      // console.log('Előző URL:', vm.previousUrl);
    });
  }
};
</script>
