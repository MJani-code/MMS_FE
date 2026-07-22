export default {
  common: {
    cancel: 'Cancel',
    save: 'Save',
    yes: 'Yes',
    genericError: 'An error occurred during the operation.'
  },
  nav: {
    greeting: 'Hi, {name}',
    logout: 'Log out',
    logoutConfirm: 'Are you sure you want to log out?',
    routers: {
      lockers: 'Lockers',
      tasks: 'Tasks',
      parts: 'Parts',
      profile: 'Profile'
    }
  },
  login: {
    title: 'Sign in',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    submit: 'Sign in'
  },
  profile: {
    title: 'User profile',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    currentPassword: 'Current password',
    newPassword: 'New password',
    newPasswordConfirm: 'Confirm new password',
    edit: 'Edit',
    saveProfile: 'Save profile',
    validation: {
      currentPasswordRequired:
        'Your current password is required to save changes',
      passwordUppercase: 'Password must contain at least one uppercase letter',
      passwordNumber: 'Password must contain at least one number',
      passwordMinLength: 'Password must be at least 8 characters long',
      passwordsDoNotMatch: 'Passwords do not match'
    }
  },
  validation: {
    required: 'This field is required',
    invalidEmail: 'Invalid email format'
  },
  tasks: {
    searchLabel: 'Search',
    noData: 'No data to display',
    unknownStatus: 'Unknown status',
    deleteConfirm: 'Are you sure you want to delete it?',
    filterPanel: 'Filters',
    downloadTig: 'Download TIG',
    downloadTasks: 'Download Tasks',
    download: {
      menu: 'Download',
      newPoints: 'Download new points'
    },
    addTask: {
      menu: 'Add new',
      loadLocations: 'Load locations',
      addTask: 'Add task'
    },
    createTaskBatch: {
      title: 'Add locations',
      fileLabel: 'Add file',
      filePlaceholder: 'Select a file',
      filesSuffix: 'files',
      upload: 'Upload',
      fileTooLarge: 'File size must not exceed 10MB'
    },
    createTask: {
      title: 'Create task',
      location: 'Location',
      taskType: 'Task type',
      locker: 'Locker',
      fixingMethod: 'Fixing method',
      requiredSitePreparation: 'Required site preparation',
      note: 'Note',
      issueType: 'Issue type',
      compartmentNumber: 'Compartment number',
      addIssue: 'Add new issue',
      description: 'Description',
      deadline: 'Deadline',
      responsible: 'Responsible',
      upload: 'Upload'
    },
    lockerFilters: {
      brandLabel: 'Brand',
      batteryLevel: 'Battery level',
      lockerActivationOn: 'Enable locker activation check',
      lockerActivationOff: 'Disable locker activation check',
      pkCheckOn: 'Enable PK check',
      pkCheckOff: 'Disable PK check',
      connectionCheckOn: 'Enable connection check',
      connectionCheckOff: 'Disable connection check'
    },
    notifications: {
      taskAssignedAt: 'You received a {type} task at {location}',
      noNew: 'You have no new notifications'
    },
    table: {
      copiedToClipboard: 'Text copied to clipboard',
      bulkUpdateSuccess: '{count} selected items were updated successfully',
      itemAlreadyInList: 'This item is already in the list'
    },
    filters: {
      allItems: 'All items',
      adminActive: 'Active in admin',
      adminInactive: 'Inactive in admin',
      all: 'All',
      hasSerial: 'Has serial',
      noSerial: 'No serial',
      type: 'Type',
      zip: 'Zip',
      city: 'City',
      tofShopId: 'Tof ShopId',
      boxId: 'Box Id',
      serial: 'Serial',
      createdBy: 'Created by',
      fromCreatedAt: 'From',
      toCreatedAt: 'To',
      fromPlanned: 'From',
      toPlanned: 'To',
      fromActual: 'From',
      toActual: 'To'
    },
    taskFilter: {
      active: 'Active'
    },
    expanded: {
      locationPhotosTab: 'Location photos',
      taskDetailsTab: 'Task details',
      feesTab: 'Fees',
      uploadImageLabel: 'Upload image',
      uploadButton: 'Upload',
      fixingMethod: 'Fixing method',
      sitePreparation: 'Site preparation task',
      taskDescription: 'Task description',
      approach: 'Approach',
      approachPlaceholder: 'Enter how the recipient can find the location..',
      report: 'Report'
    },
    fees: {
      addItems: 'Add items',
      lockerPlaceholder: 'Locker',
      itemsPlaceholder: 'Items',
      quantityPlaceholder: 'Quantity',
      noteLabel: 'Note',
      addButton: 'Add',
      addedItems: 'Added items',
      nameColumn: 'Name',
      quantityColumn: 'Quantity',
      valueColumn: 'Value',
      total: 'Total',
      validation: {
        lockerRequired: 'Locker identifier is required',
        feeRequired: 'Fee is required',
        quantityRequired: 'Quantity is required'
      },
      units: {
        km: 'Distance (km)',
        piece: 'Piece',
        workHour: 'Work hour',
        amount: 'Amount'
      }
    },
    lockerTabs: {
      check: 'Check',
      repair: 'Repair',
      general: 'General',
      statusCheckButton: 'Status check',
      lastConnection: 'Last connection time',
      lastDelivery: 'Last delivery time',
      fault: 'Fault',
      selectIssue: 'Select issue',
      selectIntervention: 'Select intervention',
      addSparePart: 'Add spare part',
      issueFixed: 'Issue fixed',
      description: 'Description',
      addButton: 'Add',
      brand: 'Brand',
      type: 'Type',
      controllerId: 'Controller Id',
      registered: 'Registered',
      active: 'Active'
    },
    repairReports: {
      issues: 'Issues',
      usedParts: 'Used parts',
      description: 'Description',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete the intervention?'
    }
  },
  lockers: {
    filters: 'Filters',
    lockers: 'Lockers',
    total: 'Total',
    totalUnits: 'Units',
    order: 'Order',
    utilization: {
      title: 'Locker utilization',
      panelTitle: 'Utilization',
      weekly: 'Weekly utilization',
      monthly: 'Monthly utilization',
      yearly: 'Yearly utilization'
    },
    sortOptions: [
      { text: 'Locker Station ID', value: 'lockerStationId' },
      { text: 'Faulty Compartments', value: 'faultyCompartments' },
      { text: 'Compartment Occupation', value: 'compartmentOccupation' },
      { text: 'Connection Time', value: 'lastConnectionTimestamp' }
    ],
    list: {
      lockerStationId: 'LockerStationId',
      lastConnection: 'Last connection',
      lastDelivery: 'Last delivery',
      version: 'Version',
      uuid: 'UUID',
      lockerStatus: 'Locker status',
      technicalStatus: 'Technical status'
    },
    details: {
      title: 'Locker details',
      id: 'ID',
      name: 'Name',
      address: 'Address',
      status: 'Status',
      lastConnection: 'Last connection',
      version: 'Version'
    }
  },
  parts: {
    stock: {
      title: 'Stock',
      addButton: 'Add',
      fields: {
        name: 'Name',
        partNumber: 'Part number',
        owner: 'Owner',
        category: 'Category',
        supplier: 'Supplier',
        manufacturer: 'Manufacturer',
        warehouse: 'Warehouse',
        unitPrice: 'Unit price',
        currency: 'Currency',
        quantity: 'Quantity',
        reference: 'Supplier reference',
        note: 'Note'
      },
      headers: {
        partName: 'Part name',
        partNumber: 'Part number',
        category: 'Category',
        manufacturer: 'Manufacturer',
        owner: 'Owner',
        supplier: 'Supplier',
        warehouse: 'Warehouse',
        goodStockQuantity: 'Quantity (good stock)',
        badStockQuantity: 'Quantity (bad stock)',
        actions: 'Actions',
        history: 'History'
      },
      formTitle: {
        addQuantity: 'Add quantity to an existing part',
        newItem: 'Create new item',
        edit: 'Edit'
      }
    },
    history: {
      loadingText: 'Loading... Please wait',
      headers: {
        id: 'ID',
        taskId: 'Task ID',
        taskTypes: 'Task type',
        tofShopId: 'TofShopId',
        boxId: 'BoxId',
        serial: 'Serial',
        changeAmount: 'Quantity',
        reason: 'Operation',
        reference: 'Reference',
        note: 'Note',
        createdBy: 'User',
        createdAt: 'Date'
      }
    }
  }
};
