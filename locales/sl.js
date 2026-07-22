export default {
  common: {
    cancel: 'Preklici',
    save: 'Shrani',
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
  profile: {
    title: 'Uporabniski profil',
    firstName: 'Ime',
    lastName: 'Priimek',
    email: 'E-posta',
    currentPassword: 'Trenutno geslo',
    newPassword: 'Novo geslo',
    newPasswordConfirm: 'Ponovi novo geslo',
    edit: 'Uredi',
    saveProfile: 'Shrani profil',
    validation: {
      currentPasswordRequired: 'Za spremembo je potrebno trenutno geslo',
      passwordUppercase: 'Geslo mora vsebovati vsaj eno veliko crko',
      passwordNumber: 'Geslo mora vsebovati vsaj eno stevilko',
      passwordMinLength: 'Geslo mora imeti vsaj 8 znakov',
      passwordsDoNotMatch: 'Gesli se ne ujemata'
    }
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
    downloadTig: 'Preuzmi TIG',
    downloadTasks: 'Preuzmi naloge',
    download: {
      menu: 'Prenos',
      newPoints: 'Prenos novih tock'
    },
    addTask: {
      menu: 'Dodaj novo',
      loadLocations: 'Nalozi lokacije',
      addTask: 'Dodaj nalogo'
    },
    createTaskBatch: {
      title: 'Dodaj lokacije',
      fileLabel: 'Dodaj datoteko',
      filePlaceholder: 'Izberi datoteko',
      filesSuffix: 'datoteke',
      upload: 'Nalozi',
      fileTooLarge: 'Velikost datoteke ne sme presegati 10MB'
    },
    createTask: {
      title: 'Ustvari nalogo',
      location: 'Lokacija',
      taskType: 'Vrsta naloge',
      locker: 'Omarica',
      fixingMethod: 'Nacin pritrditve',
      requiredSitePreparation: 'Potrebna priprava lokacije',
      note: 'Opomba',
      issueType: 'Vrsta napake',
      compartmentNumber: 'Stevilka predala',
      addIssue: 'Dodaj novo napako',
      description: 'Opis',
      deadline: 'Rok',
      responsible: 'Odgovorna oseba',
      upload: 'Nalozi'
    },
    lockerFilters: {
      brandLabel: 'Znamka',
      batteryLevel: 'Raven baterije',
      lockerActivationOn: 'Vklopi preverjanje aktivacije omarice',
      lockerActivationOff: 'Izklopi preverjanje aktivacije omarice',
      pkCheckOn: 'Vklopi PK preverjanje',
      pkCheckOff: 'Izklopi PK preverjanje',
      connectionCheckOn: 'Vklopi preverjanje povezave',
      connectionCheckOff: 'Izklopi preverjanje povezave'
    },
    notifications: {
      taskAssignedAt: 'Prejeli ste nalogo {type} na lokaciji {location}',
      noNew: 'Nimate novih obvestil'
    },
    table: {
      copiedToClipboard: 'Besedilo kopirano v odlozisce',
      bulkUpdateSuccess: 'Uspesno posodobljenih izbranih elementov: {count}',
      itemAlreadyInList: 'Ta element je ze na seznamu'
    },
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
    taskFilter: {
      active: 'Aktivno'
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
      lastDelivery: 'Zadnja kèzbesitev',
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
      delete: 'Izbrisi',
      deleteConfirm: 'Ali res zelite izbrisati poseg?'
    }
  },
  lockers: {
    filters: 'Filtri',
    lockers: 'Omarice',
    total: 'Skupaj',
    totalUnits: 'Enote',
    order: 'Razvrstitev',
    utilization: {
      title: 'Izkoriscenost omaric',
      panelTitle: 'Izkoriscenost',
      weekly: 'Tedenska izkoriscenost',
      monthly: 'Mesecna izkoriscenost',
      yearly: 'Letna izkoriscenost'
    },
    sortOptions: [
      { text: 'Locker Station ID', value: 'lockerStationId' },
      { text: 'Okvarjeni predali', value: 'faultyCompartments' },
      { text: 'Zasedenost predalov', value: 'compartmentOccupation' },
      { text: 'Cas povezave', value: 'lastConnectionTimestamp' }
    ],
    list: {
      lockerStationId: 'LockerStationId',
      lastConnection: 'Zadnja povezava',
      lastDelivery: 'Zadnja kèzbesitev',
      version: 'Verzija',
      uuid: 'UUID',
      lockerStatus: 'Stanje omarice',
      technicalStatus: 'Tehnicno stanje'
    },
    details: {
      title: 'Podrobnosti omarice',
      id: 'ID',
      name: 'Naziv',
      address: 'Naslov',
      status: 'Status',
      lastConnection: 'Zadnja povezava',
      version: 'Verzija'
    }
  },
  parts: {
    stock: {
      title: 'Zaloga',
      addButton: 'Dodaj',
      fields: {
        name: 'Naziv',
        partNumber: 'Stevilka dela',
        owner: 'Lastnik',
        category: 'Kategorija',
        supplier: 'Dobavitelj',
        manufacturer: 'Proizvajalec',
        warehouse: 'Skladisce',
        unitPrice: 'Cena na enoto',
        currency: 'Valuta',
        quantity: 'Kolicina',
        reference: 'Dobaviteljeva referenca',
        note: 'Opomba'
      },
      headers: {
        partName: 'Naziv dela',
        partNumber: 'Stevilka dela',
        category: 'Kategorija',
        manufacturer: 'Proizvajalec',
        owner: 'Lastnik',
        supplier: 'Dobavitelj',
        warehouse: 'Skladisce',
        goodStockQuantity: 'Kolicina (dobra zaloga)',
        badStockQuantity: 'Kolicina (slaba zaloga)',
        actions: 'Dejanja',
        history: 'Zgodovina'
      },
      formTitle: {
        addQuantity: 'Dodaj kolicino k obstojecemu delu',
        newItem: 'Dodaj nov artikel',
        edit: 'Uredi'
      }
    },
    history: {
      loadingText: 'Nalaganje... pocakajte',
      headers: {
        id: 'ID',
        taskId: 'Task ID',
        taskTypes: 'Vrsta naloge',
        tofShopId: 'TofShopId',
        boxId: 'BoxId',
        serial: 'Serial',
        changeAmount: 'Kolicina',
        reason: 'Operacija',
        reference: 'Referenca',
        note: 'Opomba',
        createdBy: 'Uporabnik',
        createdAt: 'Datum'
      }
    }
  }
};
