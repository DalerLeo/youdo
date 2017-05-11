export const DASHBOARD_URL = '/'

export const SIGN_IN = 'sign-in'
export const SIGN_IN_URL = '/sign-in'

export const SHOP = 'shop'
export const SHOP_LIST_URL = `/${SHOP}`
export const SHOP_ITEM_URL = `${SHOP_LIST_URL}/:shopId`
export const SHOP_ITEM_TAB_URL = `${SHOP_ITEM_URL}/:tab`
export const SHOP_ITEM_PATH = `/${SHOP}/%d`
export const SHOP_ITEM_TAB_PATH = `/${SHOP}/%d/%s`

export const USERS = 'users'
export const USERS_LIST_URL = `/${USERS}`
export const USERS_ITEM_URL = `${USERS_LIST_URL}/:usersId`
export const USERS_ITEM_PATH = `/${USERS}/%d`

export const CASHBOX = 'cashbox'
export const CASHBOX_LIST_URL = `/${CASHBOX}`
export const CASHBOX_ITEM_URL = `${CASHBOX_LIST_URL}/:cashboxId`
export const CASHBOX_ITEM_PATH = `/${CASHBOX}/%d`

export const TRANSACTION = 'transaction'
export const TRANSACTION_LIST_URL = `/${TRANSACTION}`
export const TRANSACTION_ITEM_URL = `${TRANSACTION_LIST_URL}/:transactionId`
export const TRANSACTION_ITEM_PATH = `/${TRANSACTION}/%d`

export const SUPPLY = 'supply'
export const SUPPLY_LIST_URL = `/${SUPPLY}`
export const SUPPLY_ITEM_URL = `${SUPPLY_LIST_URL}/:supplyId`
export const SUPPLY_ITEM_PATH = `/${SUPPLY}/%d`

export const ORDER = 'order'
export const ORDER_LIST_URL = `/${ORDER}`
export const ORDER_ITEM_URL = `${ORDER_LIST_URL}/:orderId`
export const ORDER_ITEM_PATH = `/${ORDER}/%d`
export const ORDER_ITEM_TAB_PATH = `/${ORDER}/%d/%s`

export const PRODUCT = 'product'
export const PRODUCT_LIST_URL = `/${PRODUCT}`
export const PRODUCT_ITEM_PATH = `/${PRODUCT}/%d`

export const CATEGORY = 'category'
export const CATEGORY_LIST_URL = `/${CATEGORY}`
export const CATEGORY_ITEM_URL = `${CATEGORY_LIST_URL}/:categoryId`
export const CATEGORY_ITEM_PATH = `/${CATEGORY}/%d`

export const STOCK = 'stock'
export const STOCK_LIST_URL = `/${STOCK}`
export const STOCK_ITEM_URL = `${STOCK_LIST_URL}/:stockId`
export const STOCK_ITEM_PATH = `/${STOCK}/%d`

export const BRAND = 'brand'
export const BRAND_LIST_URL = `/${BRAND}`
export const BRAND_ITEM_URL = `${BRAND_LIST_URL}/:brandId`
export const BRAND_ITEM_PATH = `/${BRAND}/%d`

export const CURRENCY = 'currency'
export const CURRENCY_LIST_URL = `/${CURRENCY}`
export const CURRENCY_ITEM_URL = `${CURRENCY_LIST_URL}/:currencyId`
export const CURRENCY_ITEM_PATH = `${CURRENCY}/%d`

export const MEASUREMENT = 'measurement'
export const MEASUREMENT_LIST_URL = `/${MEASUREMENT}`
export const MEASUREMENT_ITEM_URL = `${MEASUREMENT_LIST_URL}/:measurementId`
export const MEASUREMENT_ITEM_PATH = `${MEASUREMENT}/%d`

export const EXPENSIVE_CATEGORY = 'expensiveCategory'
export const EXPENSIVE_CATEGORY_LIST_URL = `/${EXPENSIVE_CATEGORY}`
export const EXPENSIVE_CATEGORY_ITEM_URL = `${EXPENSIVE_CATEGORY_LIST_URL}/:expensiveCategoryId`
export const EXPENSIVE_CATEGORY_ITEM_PATH = `${EXPENSIVE_CATEGORY}/%d`

export const PROVIDER = 'provider'
export const PROVIDER_LIST_URL = `/${PROVIDER}`
export const PROVIDER_ITEM_URL = `${PROVIDER_LIST_URL}/:providerId`
export const PROVIDER_ITEM_PATH = `${PROVIDER}/%d`

export const CLIENT = 'client'
export const CLIENT_LIST_URL = `/${CLIENT}`
export const CLIENT_ITEM_URL = `${CLIENT_LIST_URL}/:clientId`
export const CLIENT_ITEM_PATH = `${CLIENT}/%d`

export const MANUFACTURE = 'manufacture'
export const MANUFACTURE_LIST_URL = `/${MANUFACTURE}`
export const MANUFACTURE_ITEM_URL = `${PROVIDER_LIST_URL}/:manufactureId`
export const MANUFACTURE_ITEM_PATH = `${PROVIDER}/%d`

export const PENDING_EXPENSES = 'pendingExpenses'
export const PENDING_EXPENSES_LIST_URL = `/${PENDING_EXPENSES}`
export const PENDING_EXPENSES_ITEM_URL = `${PENDING_EXPENSES_LIST_URL}/:pendingExpensesId`
export const PENDING_EXPENSES_ITEM_PATH = `${PENDING_EXPENSES}/%d`

export const PENDING_PAYMENTS = 'pendingPayments'
export const PENDING_PAYMENTS_LIST_URL = `/${PENDING_PAYMENTS}`
export const PENDING_PAYMENTS_ITEM_URL = `${PENDING_PAYMENTS_LIST_URL}/:pendingPaymentsId`
export const PENDING_PAYMENTS_ITEM_PATH = `${PENDING_PAYMENTS}/%d`
