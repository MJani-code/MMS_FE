export default {
  common: {
    cancel: 'Preklici',
    yes: 'Da',
    genericError: 'Med postopkom je prislo do napake.'
  },
  nav: {
    greeting: 'Pozdravljeni, {name}',
    logout: 'Odjava',
    logoutConfirm: 'Ali se res zelite odjaviti?',
    routers: {
      lockers: 'Omarice',
      tasks: 'Naloge',
      parts: 'Rezervni deli',
      profile: 'Profil'
    }
  },
  login: {
    title: 'Prijava',
    emailLabel: 'E-posta',
    passwordLabel: 'Geslo',
    submit: 'Prijava'
  },
  validation: {
    required: 'To polje je obvezno',
    invalidEmail: 'Neveljavna oblika e-poste'
  },
  tasks: {
    searchLabel: 'Iskanje',
    noData: 'Ni podatkov za prikaz',
    unknownStatus: 'Neznan status',
    deleteConfirm: 'Ali res zelite izbrisati?',
    filterPanel: 'Filtri',
    filters: {
      allItems: 'Vsi elementi',
      adminActive: 'Aktivno v adminu',
      adminInactive: 'Nedejavno v adminu',
      all: 'Vse',
      hasSerial: 'Ima serial',
      noSerial: 'Brez seriala',
      type: 'Vrsta',
      zip: 'Postna stevilka',
      city: 'Mesto',
      tofShopId: 'Tof ShopId',
      boxId: 'Box Id',
      serial: 'Serial',
      createdBy: 'Ustvaril',
      fromCreatedAt: 'Od',
      toCreatedAt: 'Do',
      fromPlanned: 'Od',
      toPlanned: 'Do',
      fromActual: 'Od',
      toActual: 'Do'
    },
    expanded: {
      locationPhotosTab: 'Fotografije lokacije',
      taskDetailsTab: 'Podrobnosti naloge',
      feesTab: 'Stroski',
      uploadImageLabel: 'Nalozi sliko',
      uploadButton: 'Nalozi',
      fixingMethod: 'Nacin pritrditve',
      sitePreparation: 'Naloga priprave lokacije',
      taskDescription: 'Opis naloge',
      approach: 'Dostop',
      approachPlaceholder: 'Vpisi, kako prejemnik najde lokacijo..',
      report: 'Porocilo'
    },
    fees: {
      addItems: 'Dodaj postavke',
      lockerPlaceholder: 'Omarica',
      itemsPlaceholder: 'Postavke',
      quantityPlaceholder: 'Kolicina',
      noteLabel: 'Opomba',
      addButton: 'Dodaj',
      addedItems: 'Dodane postavke',
      nameColumn: 'Naziv',
      quantityColumn: 'Kolicina',
      valueColumn: 'Vrednost',
      total: 'Skupaj',
      validation: {
        lockerRequired: 'ID omarice je obvezen',
        feeRequired: 'Strosek je obvezen',
        quantityRequired: 'Kolicina je obvezna'
      },
      units: {
        km: 'Prevozeni km',
        piece: 'Kos',
        workHour: 'Delovna ura',
        amount: 'Znesek'
      }
    },
    lockerTabs: {
      check: 'Preverjanje',
      repair: 'Popravilo',
      general: 'Splošno',
      statusCheckButton: 'Preveri stanje',
      lastConnection: 'Zadnji cas povezave',
      fault: 'Napaka',
      selectIssue: 'Izberi napako',
      selectIntervention: 'Izberi poseg',
      addSparePart: 'Dodaj rezervni del',
      issueFixed: 'Napaka odpravljena',
      description: 'Opis',
      addButton: 'Dodaj',
      brand: 'Znamka',
      type: 'Tip',
      controllerId: 'Controller Id',
      registered: 'Registriran',
      active: 'Aktiven'
    },
    repairReports: {
      issues: 'Napake',
      usedParts: 'Uporabljeni deli',
      description: 'Opis',
      delete: 'Izbrisi'
    }
  }
};
