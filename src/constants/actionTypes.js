/**
 * Action Types
 */
export const SIGN_IN = 'SIGN_IN'

export const SHOP_LIST = 'SHOP_LIST'
export const SHOP_ITEM = 'SHOP_ITEM'
export const SHOP_UPDATE = 'SHOP_UPDATE'
export const SHOP_CREATE = 'SHOP_CREATE'
export const SHOP_DELETE = 'SHOP_DELETE'
export const SHOP_ITEM_ADD_IMAGE = 'SHOP_ITEM_ADD_IMAGE'
export const SHOP_ITEM_SHOW_IMAGE = 'SHOP_ITEM_SHOW_IMAGE'

export const CONFIG = 'CONFIG'

export const USERS_LIST = 'USERS_LIST'
export const USERS_ITEM = 'USERS_ITEM'
export const USERS_UPDATE = 'USERS_UPDATE'
export const USERS_CREATE = 'USERS_CREATE'
export const USERS_DELETE = 'USERS_DELETE'

export const CASHBOX_LIST = 'CASHBOX_LIST'
export const CASHBOX_ITEM = 'CASHBOX_ITEM'
export const CASHBOX_UPDATE = 'CASHBOX_UPDATE'
export const CASHBOX_CREATE = 'CASHBOX_CREATE'
export const CASHBOX_DELETE = 'CASHBOX_DELETE'

export const TRANSACTION_LIST = 'TRANSACTION_LIST'
export const TRANSACTION_ITEM = 'TRANSACTION_ITEM'
export const TRANSACTION_UPDATE = 'TRANSACTION_UPDATE'
export const TRANSACTION_UPDATE_INCOME = 'TRANSACTION_UPDATE_INCOME'
export const TRANSACTION_CREATE = 'TRANSACTION_CREATE'
export const TRANSACTION_INCOME = 'TRANSACTION_INCOME'
export const TRANSACTION_EXPENSE = 'TRANSACTION_EXPENSE'
export const TRANSACTION_SEND = 'TRANSACTION_SEND'
export const TRANSACTION_DELETE = 'TRANSACTION_DELETE'

export const CLIENT_TRANSACTION_LIST = 'CLIENT_TRANSACTION_LIST'
export const CLIENT_TRANSACTION_ITEM = 'CLIENT_TRANSACTION_ITEM'
export const CLIENT_TRANSACTION_UPDATE = 'CLIENT_TRANSACTION_UPDATE'
export const CLIENT_TRANSACTION_CREATE = 'CLIENT_TRANSACTION_CREATE'
export const CLIENT_TRANSACTION_EXPENSE = 'CLIENT_TRANSACTION_EXPENSE'
export const CLIENT_TRANSACTION_INCOME = 'CLIENT_TRANSACTION_INCOME'
export const CLIENT_TRANSACTION_SEND = 'CLIENT_TRANSACTION_SEND'
export const CLIENT_TRANSACTION_DELETE = 'CLIENT_TRANSACTION_DELETE'

export const SUPPLY_LIST = 'SUPPLY_LIST'
export const SUPPLY_ITEM = 'SUPPLY_ITEM'
export const SUPPLY_UPDATE = 'SUPPLY_UPDATE'
export const SUPPLY_CREATE = 'SUPPLY_CREATE'
export const SUPPLY_DELETE = 'SUPPLY_DELETE'
export const SUPPLY_DEFECT = 'SUPPLY_DEFECT'

export const PRICES_LIST = 'PRICES_LIST'
export const PRICES_LIST_CSV = 'PRICES_LIST_CSV'
export const PRICES_ITEM = 'PRICES_ITEM'
export const PRICES_UPDATE = 'PRICES_UPDATE'
export const PRICES_CREATE = 'PRICES_CREATE'
export const PRICES_DELETE = 'PRICES_DELETE'

export const ORDER_LIST = 'ORDER_LIST'
export const ORDER_ITEM = 'ORDER_ITEM'
export const ORDER_TRANSACTION = 'ORDER_TRANSACTION'
export const ORDER_UPDATE = 'ORDER_UPDATE'
export const ORDER_CREATE = 'ORDER_CREATE'
export const ORDER_DELETE = 'ORDER_DELETE'
export const ORDER_RETURN = 'ORDER_RETURN'
export const ORDER_RETURN_LIST = 'ORDER_RETURN_LIST'
export const GET_DOCUMENT = 'GET_DOCUMENT'

export const SUPPLY_EXPENSE_LIST = 'SUPPLY_EXPENSE_LIST'
export const SUPPLY_EXPENSE_ITEM = 'SUPPLY_EXPENSE_ITEM'
export const SUPPLY_EXPENSE_UPDATE = 'SUPPLY_EXPENSE_UPDATE'
export const SUPPLY_EXPENSE_CREATE = 'SUPPLY_EXPENSE_CREATE'
export const SUPPLY_EXPENSE_DELETE = 'SUPPLY_EXPENSE_DELETE'

export const PRODUCT_LIST = 'PRODUCT_LIST'
export const PRODUCT_UPDATE = 'PRODUCT_UPDATE'
export const PRODUCT_CREATE = 'PRODUCT_CREATE'
export const PRODUCT_ITEM = 'PRODUCT_ITEM'
export const PRODUCT_DELETE = 'PRODUCT_DELETE'
export const PRODUCT_MEASUREMENT = 'PRODUCT_MEASUREMENT'
export const PRODUCT_EXTRA = 'PRODUCT_EXTRA'

export const PRODUCT_PRICE_LIST = 'PRODUCT_PRICE_LIST'
export const PRODUCT_PRICE_UPDATE = 'PRODUCT_PRICE_UPDATE'
export const PRODUCT_PRICE_CREATE = 'PRODUCT_PRICE_CREATE'
export const PRODUCT_PRICE_DELETE = 'PRODUCT_PRICE_DELETE'
export const PRODUCT_PRICE_ITEM = 'PRODUCT_PRICE_ITEM'

export const PRODUCT_TYPE_LIST = 'PRODUCT_TYPE_LIST'
export const PRODUCT_TYPE_ITEM = 'PRODUCT_TYPE_ITEM'
export const PRODUCT_TYPE_UPDATE = 'PRODUCT_TYPE_UPDATE'
export const PRODUCT_TYPE_CREATE = 'PRODUCT_TYPE_CREATE'
export const PRODUCT_TYPE_DELETE = 'PRODUCT_TYPE_DELETE'

export const INGREDIENT_LIST = 'INGREDIENT_LIST'
export const INGREDIENT_ITEM = 'INGREDIENT_ITEM'
export const INGREDIENT_UPDATE = 'INGREDIENT_UPDATE'
export const INGREDIENT_CREATE = 'INGREDIENT_CREATE'
export const INGREDIENT_DELETE = 'INGREDIENT_DELETE'

export const CATEGORY_LIST = 'CATEGORY_LIST'
export const CATEGORY_ITEM = 'CATEGORY_ITEM'
export const CATEGORY_UPDATE = 'CATEGORY_UPDATE'
export const CATEGORY_CREATE = 'CATEGORY_CREATE'
export const CATEGORY_DELETE = 'CATEGORY_DELETE'

export const EQUIPMENT_LIST = 'EQUIPMENT_LIST'
export const EQUIPMENT_ITEM = 'EQUIPMENT_ITEM'
export const EQUIPMENT_UPDATE = 'EQUIPMENT_UPDATE'
export const EQUIPMENT_CREATE = 'EQUIPMENT_CREATE'
export const EQUIPMENT_DELETE = 'EQUIPMENT_DELETE'

export const STOCK_LIST = 'STOCK_LIST'
export const STOCK_ITEM = 'STOCK_ITEM'
export const STOCK_UPDATE = 'STOCK_UPDATE'
export const STOCK_CREATE = 'STOCK_CREATE'
export const STOCK_DELETE = 'STOCK_DELETE'

export const STATSTOCK_LIST = 'STATSTOCK_LIST'
export const STATSTOCK_ITEM = 'STATSTOCK_ITEM'
export const STATSTOCK_UPDATE = 'STATSTOCK_UPDATE'
export const STATSTOCK_CREATE = 'STATSTOCK_CREATE'
export const STATSTOCK_DELETE = 'STATSTOCK_DELETE'
export const STATSTOCK_DATA = 'STATSTOCK_DATA'
export const STATSTOCK_GET_DOCUMENT = 'STATSTOCK_GET_DOCUMENT'

export const REMAINDER_STOCK_LIST = 'REMAINDER_STOCK_LIST'
export const REMAINDER_STOCK_ITEM = 'REMAINDER_STOCK_ITEM'
export const REMAINDER_STOCK_UPDATE = 'REMAINDER_STOCK_UPDATE'
export const REMAINDER_STOCK_CREATE = 'REMAINDER_STOCK_CREATE'
export const REMAINDER_STOCK_DELETE = 'REMAINDER_STOCK_DELETE'

export const TRANSACTION_STOCK_LIST = 'TRANSACTION_STOCK_LIST'
export const TRANSACTION_STOCK_UPDATE = 'TRANSACTION_STOCK_UPDATE'
export const TRANSACTION_STOCK_CREATE = 'TRANSACTION_STOCK_CREATE'

export const MEASUREMENT_LIST = 'MEASUREMENT_LIST'
export const MEASUREMENT_ITEM = 'MEASUREMENT_ITEM'
export const MEASUREMENT_UPDATE = 'MEASUREMENT_UPDATE'
export const MEASUREMENT_CREATE = 'MEASUREMENT_CREATE'
export const MEASUREMENT_DELETE = 'MEASUREMENT_DELETE'

export const EXPENSIVE_CATEGORY_LIST = 'EXPENSIVE_CATEGORY_LIST'
export const EXPENSIVE_CATEGORY_ITEM = 'EXPENSIVE_CATEGORY_ITEM'
export const EXPENSIVE_CATEGORY_UPDATE = 'EXPENSIVE_CATEGORY_UPDATE'
export const EXPENSIVE_CATEGORY_CREATE = 'EXPENSIVE_CATEGORY_CREATE'
export const EXPENSIVE_CATEGORY_DELETE = 'EXPENSIVE_CATEGORY_DELETE'

export const BRAND_LIST = 'BRAND_LIST'
export const BRAND_ITEM = 'BRAND_ITEM'
export const BRAND_UPDATE = 'BRAND_UPDATE'
export const BRAND_CREATE = 'BRAND_CREATE'
export const BRAND_DELETE = 'BRAND_DELETE'

export const PROVIDER_LIST = 'PROVIDER_LIST'
export const PROVIDER_ITEM = 'PROVIDER_ITEM'
export const PROVIDER_CONTACTS = 'PROVIDER_CONTACTS'
export const PROVIDER_UPDATE = 'PROVIDER_UPDATE'
export const PROVIDER_CREATE = 'PROVIDER_CREATE'
export const PROVIDER_DELETE = 'PROVIDER_DELETE'

export const CLIENT_LIST = 'CLIENT_LIST'
export const CLIENT_ITEM = 'CLIENT_ITEM'
export const CLIENT_CONTACTS = 'CLIENT_CONTACTS'
export const CLIENT_UPDATE = 'CLIENT_UPDATE'
export const CLIENT_CREATE = 'CLIENT_CREATE'
export const CLIENT_DELETE = 'CLIENT_DELETE'

export const CURRENCY_LIST = 'CURRENCY_LIST'
export const CURRENCY_ITEM = 'CURRENCY_ITEM'
export const CURRENCY_UPDATE = 'CURRENCY_UPDATE'
export const CURRENCY_CREATE = 'CURRENCY_CREATE'
export const CURRENCY_DELETE = 'CURRENCY_DELETE'
export const CURRENCY_PRIMARY = 'CURRENCY_PRIMARY'
export const CURRENCY_PRIMARY_UPDATE = 'CURRENCY_PRIMARY_UPDATE'
export const SET_CURRENCY_UPDATE = 'SET_CURRENCY_UPDATE'

export const SNACKBAR = 'SNACKBAR'
export const SNACKBAR_OPEN = `${SNACKBAR}_OPEN`
export const SNACKBAR_CLOSE = `${SNACKBAR}_CLOSE`

export const MANUFACTURE_LIST = 'MANUFACTURE_LIST'
export const MANUFACTURE_ITEM = 'MANUFACTURE_ITEM'
export const MANUFACTURE_UPDATE = 'MANUFACTURE_UPDATE'
export const MANUFACTURE_CREATE = 'MANUFACTURE_CREATE'

export const NOTIFICATIONS_LIST = 'NOTIFICATIONS_LIST'
export const NOTIFICATIONS_ITEM = 'NOTIFICATIONS_ITEM'
export const NOTIFICATIONS_DELETE = 'NOTIFICATIONS_DELETE'
export const NOTIFICATIONS_TIME_INTERVAL = 'NOTIFICATIONS_TIME_INTERVAL'

export const SHIFT_LIST = 'SHIFT_LIST'
export const SHIFT_ITEM = 'SHIFT_ITEM'
export const SHIFT_UPDATE = 'SHIFT_UPDATE'
export const SHIFT_CREATE = 'SHIFT_CREATE'
export const SHIFT_DELETE = 'SHIFT_DELETE'

export const USER_SHIFT_LIST = 'USER_SHIFT_LIST'
export const USER_SHIFT_ITEM = 'USER_SHIFT_ITEM'
export const USER_SHIFT_UPDATE = 'USER_SHIFT_UPDATE'
export const USER_SHIFT_CREATE = 'USER_SHIFT_CREATE'
export const USER_SHIFT_DELETE = 'USER_SHIFT_DELETE'

export const PENDING_EXPENSES_LIST = 'PENDING_EXPENSES_LIST'
export const PENDING_EXPENSES_ITEM = 'PENDING_EXPENSES_ITEM'
export const PENDING_EXPENSES_UPDATE = 'PENDING_EXPENSES_UPDATE'
export const PENDING_EXPENSES_CREATE = 'PENDING_EXPENSES_CREATE'
export const PENDING_EXPENSES_DELETE = 'PENDING_EXPENSES_DELETE'

export const PENDING_PAYMENTS_LIST = 'PENDING_PAYMENTS_LIST'
export const PENDING_PAYMENTS_ITEM = 'PENDING_PAYMENTS_ITEM'
export const PENDING_PAYMENTS_UPDATE = 'PENDING_PAYMENTS_UPDATE'
export const PENDING_PAYMENTS_CREATE = 'PENDING_PAYMENTS_CREATE'
export const PENDING_PAYMENTS_DELETE = 'PENDING_PAYMENTS_DELETE'

export const STATDEBTORS_LIST = 'STATDEBTORS_LIST'
export const STATDEBTORS_ORDER_LIST = 'STATDEBTORS_ORDER_LIST'
export const STATDEBTORS_SUM = 'STATDEBTORS_SUM'
export const STATDEBTORS_ITEM = 'STATDEBTORS_ITEM'
export const STATDEBTORS_UPDATE = 'STATDEBTORS_UPDATE'
export const STATDEBTORS_CREATE = 'STATDEBTORS_CREATE'
export const STATDEBTORS_DELETE = 'STATDEBTORS_DELETE'
export const STATDEBTORS_GET_DOCUMENT = 'STATDEBTORS_GET_DOCUMENT'

export const STAT_MANUFACTURE_LIST = 'STAT_MANUFACTURE_LIST'
export const STAT_MANUFACTURE_ITEM = 'STAT_MANUFACTURE_ITEM'
export const STAT_MANUFACTURE_UPDATE = 'STAT_MANUFACTURE_UPDATE'
export const STAT_MANUFACTURE_CREATE = 'STAT_MANUFACTURE_CREATE'
export const STAT_MANUFACTURE_DELETE = 'STAT_MANUFACTURE_DELETE'

export const STAT_CASHBOX_LIST = 'STAT_CASHBOX_LIST'
export const STAT_CASHBOX_ITEM = 'STAT_CASHBOX_ITEM'
export const STAT_CASHBOX_UPDATE = 'STAT_CASHBOX_UPDATE'
export const STAT_CASHBOX_CREATE = 'STAT_CASHBOX_CREATE'
export const STAT_CASHBOX_DELETE = 'STAT_CASHBOX_DELETE'

export const MANUFACTURE_PRODUCT_CREATE = 'MANUFACTURE_PRODUCT_CREATE'
export const MANUFACTURE_PRODUCT_DELETE = 'MANUFACTURE_PRODUCT_DELETE'
export const MANUFACTURE_PRODUCT_CHANGE = 'MANUFACTURE_PRODUCT_CHANGE'

export const SHIPMENT_LIST = 'SHIPMENT_LIST'
export const SHIPMENT_ITEM = 'SHIPMENT_ITEM'

export const MARKET_TYPE_LIST = 'MARKET_TYPE_LIST'
export const MARKET_TYPE_ITEM = 'MARKET_TYPE_ITEM'
export const MARKET_TYPE_UPDATE = 'MARKET_TYPE_UPDATE'
export const MARKET_TYPE_CREATE = 'MARKET_TYPE_CREATE'
export const MARKET_TYPE_DELETE = 'MARKET_TYPE_DELETE'

export const PRICE_LIST = 'PRICE_LIST'
export const PRICE_UPDATE = 'PRICE_UPDATE'
export const PRICE_CREATE = 'PRICE_CREATE'
export const PRICE_ITEM = 'PRICE_ITEM'
export const PRICE_DELETE = 'PRICE_DELETE'
export const PRICE_LIST_CSV = 'PRICE_LIST_CSV'
export const PRICE_LIST_ITEM_LIST = 'PRICE_LIST_ITEM_LIST'

export const ZONE_LIST = 'ZONE_LIST'
export const ZONE_ITEM = 'ZONE_ITEM'
export const ZONE_UPDATE = 'ZONE_UPDATE'
export const ZONE_CREATE = 'ZONE_CREATE'
export const ZONE_DELETE = 'ZONE_DELETE'
export const ZONE_STAT = 'ZONE_STAT'

export const TRACKING_LIST = 'TRACKING_LIST'
export const TRACKING_ITEM = 'TRACKING_ITEM'

export const REMAINDER_LIST = 'REMAINDER_LIST'
export const REMAINDER_ITEM = 'REMAINDER_ITEM'
export const REMAINDER_UPDATE = 'REMAINDER_UPDATE'
export const REMAINDER_CREATE = 'REMAINDER_CREATE'
export const REMAINDER_DELETE = 'REMAINDER_DELETE'
