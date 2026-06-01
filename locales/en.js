export default {
  common: {
    cancel: 'Cancel',
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
      delete: 'Delete'
    }
  }
};
