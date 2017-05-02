export const DASHBOARD_URL = '/'

export const SIGN_IN = 'sign-in'
export const SIGN_IN_URL = '/sign-in'

export const SHOP = 'shop'
export const SHOP_LIST_URL = `/${SHOP}`
export const SHOP_ITEM_URL = `${SHOP_LIST_URL}/:shopId`
export const SHOP_ITEM_TAB_URL = `${SHOP_ITEM_URL}/:tab`
export const SHOP_ITEM_PATH = `/${SHOP}/%d`
export const SHOP_ITEM_TAB_PATH = `/${SHOP}/%d/%s`

export const CASHBOX = 'cashbox'
export const CASHBOX_LIST_URL = `/${CASHBOX}`
export const CASHBOX_ITEM_URL = `${CASHBOX_LIST_URL}/:shopId`
export const CASHBOX_ITEM_TAB_URL = `${CASHBOX_ITEM_URL}/:tab`
export const CASHBOX_ITEM_PATH = `/${CASHBOX}/%d`
export const CASHBOX_ITEM_TAB_PATH = `/${CASHBOX}/%d/%s`

export const TRANSACTION = 'transaction'
export const TRANSACTION_LIST_URL = `/${TRANSACTION}`
export const TRANSACTION_ITEM_URL = `${TRANSACTION_LIST_URL}/:shopId`
export const TRANSACTION_ITEM_TAB_URL = `${TRANSACTION_ITEM_URL}/:tab`
export const TRANSACTION_ITEM_PATH = `/${TRANSACTION}/%d`
export const TRANSACTION_ITEM_TAB_PATH = `/${TRANSACTION}/%d/%s`

export const SUPPLY = 'supply'
export const SUPPLY_LIST_URL = `/${SUPPLY}`
export const SUPPLY_ITEM_URL = `${SUPPLY_LIST_URL}/:supplyId`
export const SUPPLY_ITEM_TAB_URL = `${SUPPLY_ITEM_URL}/:tab`
export const SUPPLY_ITEM_PATH = `/${SUPPLY}/%d`
export const SUPPLY_ITEM_TAB_PATH = `/${SUPPLY}/%d/%s`

export const ORDER = 'order'
export const ORDER_HISTORY_LIST_URL = `/${ORDER}/history`

export const PRODUCT = 'product'
export const PRODUCT_LIST_URL = `/${PRODUCT}`
export const PRODUCT_ITEM_PATH = `/${PRODUCT}/%d`

export const CATEGORY = 'category'
export const CATEGORY_LIST_URL = `/${CATEGORY}`
export const CATEGORY_ITEM_URL = `${CATEGORY_LIST_URL}/:categoryId`
export const CATEGORY_ITEM_PATH = `${CATEGORY}/%d`

export const EXPENSIVE_CATEGORY = 'expensiveCategory'
export const EXPENSIVE_CATEGORY_LIST_URL = `/${EXPENSIVE_CATEGORY}`
export const EXPENSIVE_CATEGORY_ITEM_URL = `${EXPENSIVE_CATEGORY_LIST_URL}/:expensiveCategoryId`
export const EXPENSIVE_CATEGORY_ITEM_PATH = `${EXPENSIVE_CATEGORY}/%d`
