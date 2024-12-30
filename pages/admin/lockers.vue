<template>
  <div>
    <LockerFiltersField :filters="filters" @update-filter="updateFilter" />
    <LockerListFromLosField :lockers="paginatedLockers" />
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
    pageSize: 20,
    requestedPageSize: 50,
    currentPage: 1,
    isActive: true,
    totalLocation: 205,
    totalLockers: 0,
    previousUrl: ''
  }),
  watch: {
    pageNumber(newPage) {
      this.currentPage = newPage;
    },
    filters: {
      handler() {
        this.pageNumber = 1;
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
            // Ha nincs szűrés, minden elem megjelenik
            return true;
          }

          //brand szűrés
          if (key === 'brand') {
            console.log(filterValue);
            //Miért nem működik a szűrés?

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
            // console.log(filterValue);
            if (filterValue) {
              return resultList.lockerList.some(
                (locker) => locker.isPassive === false
              );
            } else {
              return resultList.lockerList.some(
                (locker) => locker.isPassive === true
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
    paginatedLockers() {
      const start = (this.pageNumber - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredLockers.slice(start, end);
    }
  },
  mounted() {
    this.previousUrl = localStorage.getItem('previousUrl');
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
      console.log(totalItems);
      this.totalLockers = totalItems;
    },
    updateFilter({ key, value }) {
      console.log(key, value);
      this.$set(this.filters, key, value);
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
