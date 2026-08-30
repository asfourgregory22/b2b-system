// permissions.js

export const ROLE_CAPABILITIES = {
  admin: [
    'ITEM_VIEW',
    'ITEM_CREATE',
    'ITEM_EDIT',
    'ITEM_ACTIVATE',
    'ITEM_DEACTIVATE',

    'ORDER_VIEW_ALL',
    'ORDER_VIEW_DETAIL',
    'ORDER_APPROVE',
    'ORDER_REJECT',

    'PAYMENT_VIEW_ALL',

    'USER_VIEW_ALL',
    'USER_EDIT',
    'USER_CREATE',
    'USER_ACTIVATE',
    'USER_DEACTIVATE',

    'LOGIN',
  ],

  general_manager: [
    'ITEM_VIEW',
    'ITEM_CREATE',
    'ITEM_EDIT',
    'ITEM_ACTIVATE',
    'ITEM_DEACTIVATE',

    'ORDER_VIEW_ALL',
    'ORDER_VIEW_DETAIL',
    'ORDER_CREATE_FOR_OTHERS',
    'ORDER_APPROVE',
    'ORDER_REJECT',

    'PAYMENT_VIEW_ALL',

    'LOGIN',
  ],

  stock_manager: [
    'ITEM_VIEW',
    'ITEM_CREATE',
    'ITEM_EDIT',
    'ITEM_ACTIVATE',
    'ITEM_DEACTIVATE',

    'ORDER_VIEW_ALL',
    'ORDER_VIEW_DETAIL',
    'ORDER_APPROVE',
    'ORDER_REJECT',

    'USER_VIEW_ALL',

    'LOGIN',
  ],

  accountant: [
    'ITEM_VIEW',

    'ORDER_VIEW_ALL',
    'ORDER_VIEW_DETAIL',

    'PAYMENT_VIEW_ALL',
    'PAYMENT_SUBMIT',

    'USER_VIEW_ALL',

    'LOGIN',
  ],

  salesman: [
    'ITEM_VIEW',

    'ORDER_VIEW_OWN_CUSTOMERS',
    'ORDER_VIEW_DETAIL',
    'ORDER_CREATE_FOR_OTHERS',

    'PAYMENT_VIEW_OWN_CUSTOMERS',

    'USER_VIEW_OWN_CUSTOMERS',

    'LOGIN',
  ],

  customer: [
    'ITEM_VIEW',

    'ORDER_VIEW_SELF',
    'ORDER_VIEW_DETAIL',
    'ORDER_CREATE_SELF',

    'PAYMENT_VIEW_SELF',

    'LOGIN',
  ],
};

export function can(role, capability) {
  const capabilities = ROLE_CAPABILITIES[role];
  if (!capabilities) return false;
  return capabilities.includes(capability);
}