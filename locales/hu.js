export default {
  common: {
    cancel: 'Mégse',
    save: 'Mentés',
    yes: 'Igen',
    genericError: 'Hiba történt a művelet során.'
  },
  nav: {
    greeting: 'Szia, {name}',
    logout: 'Kijelentkezés',
    logoutConfirm: 'Biztosan kijelentkezel?',
    routers: {
      lockers: 'Automaták',
      tasks: 'Megbízások',
      parts: 'Alkatrészek',
      profile: 'Profil'
    }
  },
  login: {
    title: 'Bejelentkezés',
    emailLabel: 'Email',
    passwordLabel: 'Jelszó',
    submit: 'Bejelentkezés'
  },
  profile: {
    title: 'Felhasználói profil',
    firstName: 'Keresztnév',
    lastName: 'Vezetéknév',
    email: 'E-mail',
    currentPassword: 'Jelszó',
    newPassword: 'Új jelszó',
    newPasswordConfirm: 'Új jelszó ismét',
    edit: 'Szerkesztés',
    saveProfile: 'Profil mentése',
    validation: {
      currentPasswordRequired:
        'A módosításhoz szükséges a jelenlegi jelszavad!',
      passwordUppercase: 'A jelszónak legalább egy nagybetűt kell tartalmaznia',
      passwordNumber: 'A jelszónak legalább egy számot kell tartalmaznia',
      passwordMinLength:
        'A jelszónak legalább 8 karakter hosszúnak kell lennie',
      passwordsDoNotMatch: 'A jelszavak nem egyeznek meg'
    }
  },
  validation: {
    required: 'Kötelező kitölteni',
    invalidEmail: 'Érvénytelen email formátum'
  },
  tasks: {
    searchLabel: 'Keresés',
    noData: 'Nincs megjeleníthető adat',
    unknownStatus: 'Ismeretlen státusz',
    deleteConfirm: 'Biztosan törölni szeretnéd?',
    filterPanel: 'Szűrők',
    downloadTig: 'TIG letöltés',
    downloadTasks: 'Megbízások letöltése',
    download: {
      menu: 'Letöltés',
      newPoints: 'Új pontok letöltése'
    },
    addTask: {
      menu: 'Új hozzáadása',
      loadLocations: 'Helyszínek betöltése',
      addTask: 'Megbízás hozzáadása'
    },
    createTaskBatch: {
      title: 'Helyszínek hozzáadása',
      fileLabel: 'File hozzáadása',
      filePlaceholder: 'Válaszd ki a file-t',
      filesSuffix: 'file',
      upload: 'Feltöltés',
      fileTooLarge: 'A file mérete nem lehet nagyobb 10MB-nál'
    },
    createTask: {
      title: 'Megbízás létrehozása',
      location: 'Helyszín',
      taskType: 'Megbízás típusa',
      locker: 'Locker',
      fixingMethod: 'Rögzítés módja',
      requiredSitePreparation: 'Szükséges helyszín előkészítés',
      note: 'Megjegyzés',
      issueType: 'Hibatípus',
      compartmentNumber: 'Rekesz szám',
      addIssue: 'Új hiba hozzáadása',
      description: 'Leírás',
      deadline: 'Határidő',
      responsible: 'Megbízott',
      upload: 'Feltöltés'
    },
    lockerFilters: {
      brandLabel: 'Gyártó',
      batteryLevel: 'Akkumulátor szint',
      lockerActivationOn: 'Locker aktiválás ellenőrző bekapcsolása',
      lockerActivationOff: 'Locker aktiválás ellenőrző kikapcsolása',
      pkCheckOn: 'PK ellenőrző bekapcsolása',
      pkCheckOff: 'PK ellenőrző kikapcsolása',
      connectionCheckOn: 'Kapcsolódás ellenőrző bekapcsolása',
      connectionCheckOff: 'Kapcsolódás ellenőrző kikapcsolása'
    },
    notifications: {
      taskAssignedAt: '{type} megbízást kaptál {location} helyszínen',
      noNew: 'Nincsenek új értesítéseid'
    },
    table: {
      copiedToClipboard: 'Szöveg másolva a vágólapra',
      bulkUpdateSuccess: '{count} db kiválasztott elem frissítése sikeres volt',
      itemAlreadyInList: 'Ez az elem már szerepel a listában'
    },
    filters: {
      allItems: 'Összes tétel',
      adminActive: 'Adminban aktív',
      adminInactive: 'Adminban nem aktív',
      all: 'Összes',
      hasSerial: 'Van serial',
      noSerial: 'Nincs serial',
      type: 'Típus',
      zip: 'Zip',
      city: 'Település',
      tofShopId: 'Tof ShopId',
      boxId: 'Box Id',
      serial: 'Serial',
      createdBy: 'Létrehozta',
      fromCreatedAt: 'Tól',
      toCreatedAt: 'Ig',
      fromPlanned: 'Tól',
      toPlanned: 'Ig',
      fromActual: 'Tól',
      toActual: 'Ig'
    },
    taskFilter: {
      active: 'Aktív'
    },
    expanded: {
      locationPhotosTab: 'Helyszín fotók',
      taskDetailsTab: 'Megbízás részletei',
      feesTab: 'Díjak',
      uploadImageLabel: 'Kép feltöltés',
      uploadButton: 'Feltöltés',
      fixingMethod: 'Rögzítési mód',
      sitePreparation: 'Helyszín kialakítási feladat',
      taskDescription: 'Megbízás leírása',
      approach: 'Megközelítés',
      approachPlaceholder: 'Add meg, hogyan találja meg a címzett..',
      report: 'Report'
    },
    fees: {
      addItems: 'Tételek hozzáadása',
      lockerPlaceholder: 'Locker',
      itemsPlaceholder: 'Tételek',
      quantityPlaceholder: 'Mennyiség',
      noteLabel: 'Megjegyzés',
      addButton: 'Hozzáad',
      addedItems: 'Hozzáadott tételek',
      nameColumn: 'Megnevezés',
      quantityColumn: 'Mennyiség',
      valueColumn: 'Érték',
      total: 'Összesen',
      validation: {
        lockerRequired: 'Kötelező megadni locker azonosítót',
        feeRequired: 'Kötelező megadni díjat',
        quantityRequired: 'Kötelező megadni mennyiséget'
      },
      units: {
        km: 'Megtett km',
        piece: 'Db',
        workHour: 'Munkaóra',
        amount: 'Összeg'
      }
    },
    lockerTabs: {
      check: 'Ellenőrző',
      repair: 'Javítás',
      general: 'Általános',
      statusCheckButton: 'Állapot ellenőrző',
      lastConnection: 'Utolsó csatlakozási idő',
      lastDelivery: 'Utolsó kézbesítési idő',
      fault: 'Hiba',
      selectIssue: 'Hiba kiválasztása',
      selectIntervention: 'Beavatkozás kiválasztása',
      addSparePart: 'Alkatrész hozzáadása',
      issueFixed: 'Hiba kijavítva',
      description: 'Leírás',
      addButton: 'Hozzáad',
      brand: 'Brand',
      type: 'Típus',
      controllerId: 'Controller Id',
      registered: 'Regisztrált',
      active: 'Aktív'
    },
    repairReports: {
      issues: 'Hibák',
      usedParts: 'Felhasznált alkatrészek',
      description: 'Leírás',
      delete: 'Törlés',
      deleteConfirm: 'Biztosan törlöd a beavatkozást?'
    }
  },
  lockers: {
    filters: 'Szűrők',
    lockers: 'Automaták',
    total: 'Összesen',
    order: 'Rendezés',
    totalUnits: 'db',
    utilization: {
      title: 'Locker kihasználtság',
      panelTitle: 'Kihasználtság',
      weekly: 'Heti telítettség',
      monthly: 'Havi telítettség',
      yearly: 'Éves telítettség'
    },
    sortOptions: [
      { text: 'Locker Station ID', value: 'lockerStationId' },
      { text: 'Hibás rekeszek', value: 'faultyCompartments' },
      { text: 'Rekesztelítettség', value: 'compartmentOccupation' },
      { text: 'Csatlakozási idő', value: 'lastConnectionTimestamp' }
    ],
    list: {
      lockerStationId: 'LockerStationId',
      lastConnection: 'Utolsó csatlakozás',
      lastDelivery: 'Utolsó kézbesítés',
      version: 'Verzió',
      uuid: 'UUID',
      lockerStatus: 'Locker állapot',
      technicalStatus: 'Műszaki állapot'
    },
    details: {
      title: 'Locker részletek',
      id: 'ID',
      name: 'Név',
      address: 'Cím',
      status: 'Státusz',
      lastConnection: 'Utolsó csatlakozás',
      version: 'Verzió'
    }
  },
  parts: {
    stock: {
      title: 'Készlet',
      addButton: 'Hozzáadás',
      fields: {
        name: 'Név',
        partNumber: 'Cikkszám',
        owner: 'Tulajdonos',
        category: 'Kategória',
        supplier: 'Beszállító',
        manufacturer: 'Gyártó',
        warehouse: 'Raktár',
        unitPrice: 'Egységár',
        currency: 'Valuta',
        quantity: 'Mennyiség',
        reference: 'Szállítói azonosító',
        note: 'Megjegyzés'
      },
      headers: {
        partName: 'Alkatrész név',
        partNumber: 'Cikkszám',
        category: 'Kategória',
        manufacturer: 'Gyártó',
        owner: 'Tulajdonos',
        supplier: 'Beszállító',
        warehouse: 'Raktár',
        goodStockQuantity: 'Mennyiség (jó készlet)',
        badStockQuantity: 'Mennyiség (rossz készlet)',
        actions: 'Műveletek',
        history: 'Előzmények'
      },
      formTitle: {
        addQuantity: 'Mennyiség hozzáadása egy meglévő alkatrészhez',
        newItem: 'Új cikk felvitele',
        edit: 'Szerkesztés'
      }
    },
    history: {
      loadingText: 'Betöltés folyamatban, kérlek várj',
      headers: {
        id: 'ID',
        taskId: 'Task ID',
        taskTypes: 'Feladat típus',
        tofShopId: 'TofShopId',
        boxId: 'BoxId',
        serial: 'Serial',
        changeAmount: 'Mennyiség',
        reason: 'Művelet',
        reference: 'Referencia',
        note: 'Megjegyzés',
        createdBy: 'Felhasználó',
        createdAt: 'Dátum'
      }
    }
  }
};
