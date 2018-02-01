/**
 * Action Types
 */
export const SIGN_IN = 'SIGN_IN'
export const IS_ADMIN = 'IS_ADMIN'
export const USER_GROUPS = 'USER_GROUPS'
export const AUTH_CONFIRM = 'AUTH_CONFIRM'

export const SHOP_LIST = 'SHOP_LIST'
export const SHOP_LIST_REPETITION = 'SHOP_LIST_REPETITION'
export const SHOP_ITEM = 'SHOP_ITEM'
export const SHOP_ITEM_REPETITION = 'SHOP_ITEM_REPETITION'
export const SHOP_EXTRA = 'SHOP_EXTRA'
export const SHOP_UPDATE = 'SHOP_UPDATE'
export const SHOP_CREATE = 'SHOP_CREATE'
export const SHOP_DELETE = 'SHOP_DELETE'
export const SHOP_ITEM_ADD_IMAGE = 'SHOP_ITEM_ADD_IMAGE'
export const SHOP_SET_PRIMARY_IMAGE = 'SHOP_SET_PRIMARY_IMAGE'
export const SHOP_ITEM_SHOW_IMAGE = 'SHOP_ITEM_SHOW_IMAGE'
export const SHOP_ITEM_DELETE_IMAGE = 'SHOP_ITEM_DELETE_IMAGE'
export const SHOP_MULTI_UPDATE = 'SHOP_MULTI_UPDATE'

export const CONFIG = 'CONFIG'

export const USERS_LIST = 'USERS_LIST'
export const USERS_ITEM = 'USERS_ITEM'
export const USERS_UPDATE = 'USERS_UPDATE'
export const USERS_CREATE = 'USERS_CREATE'
export const USERS_DELETE = 'USERS_DELETE'
export const USERS_GROUP = 'USERS_GROUP'

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
export const TRANSACTION_INFO = 'TRANSACTION_INFO'
export const TRANSACTION_PAYMENT_DELETE = 'TRANSACTION_PAYMENT_DELETE'
export const TRANSACTION_CATEGORY_DATA_LIST = 'TRANSACTION_CATEGORY_DATA_LIST'
export const TRANSACTION_DETALIZATION_LIST = 'TRANSACTION_DETALIZATION_LIST'

export const SUPPLY_LIST = 'SUPPLY_LIST'
export const SUPPLY_ITEM = 'SUPPLY_ITEM'
export const SUPPLY_UPDATE = 'SUPPLY_UPDATE'
export const SUPPLY_CREATE = 'SUPPLY_CREATE'
export const SUPPLY_CANCEL = 'SUPPLY_CANCEL'
export const SUPPLY_DEFECT = 'SUPPLY_DEFECT'
export const SUPPLY_SYNC = 'SUPPLY_SYNC'

export const PRICES_LIST = 'PRICES_LIST'
export const PRICES_LIST_CSV = 'PRICES_LIST_CSV'
export const PRICES_ITEM = 'PRICES_ITEM'
export const PRICES_UPDATE = 'PRICES_UPDATE'
export const PRICES_CREATE = 'PRICES_CREATE'
export const PRICES_DELETE = 'PRICES_DELETE'

export const ORDER_LIST = 'ORDER_LIST'
export const ORDER_LIST_PRINT = 'ORDER_LIST_PRINT'
export const ORDER_SALES_PRINT = 'ORDER_SALES_PRINT'
export const ORDER_ITEM = 'ORDER_ITEM'
export const ORDER_TRANSACTION = 'ORDER_TRANSACTION'
export const ORDER_PAYMENTS = 'ORDER_PAYMENTS'
export const ORDER_UPDATE = 'ORDER_UPDATE'
export const ORDER_CREATE = 'ORDER_CREATE'
export const ORDER_DELETE = 'ORDER_DELETE'
export const ORDER_RETURN = 'ORDER_RETURN'
export const ORDER_RETURN_CANCEL = 'ORDER_RETURN_CANCEL'
export const ORDER_RETURN_LIST = 'ORDER_RETURN_LIST'
export const ORDER_SET_DISCOUNT = 'ORDER_SET_DISCOUNT'
export const ORDER_COUNTS = 'ORDER_COUNTS'
export const ORDER_CHANGE_PRICE = 'ORDER_CHANGE_PRICE'
export const GET_DOCUMENT = 'GET_DOCUMENT'
export const ACCEPT_CLIENT_TRANSACTION = 'ACCEPT_CLIENT_TRANSACTION'

export const SUPPLY_EXPENSE_LIST = 'SUPPLY_EXPENSE_LIST'
export const SUPPLY_EXPENSE_ITEM = 'SUPPLY_EXPENSE_ITEM'
export const SUPPLY_EXPENSE_UPDATE = 'SUPPLY_EXPENSE_UPDATE'
export const SUPPLY_EXPENSE_CREATE = 'SUPPLY_EXPENSE_CREATE'
export const SUPPLY_EXPENSE_DELETE = 'SUPPLY_EXPENSE_DELETE'

export const SUPPLY_PAID_LIST = 'SUPPLY_PAID_LIST'

export const PRODUCT_LIST = 'PRODUCT_LIST'
export const PRODUCT_UPDATE = 'PRODUCT_UPDATE'
export const PRODUCT_CREATE = 'PRODUCT_CREATE'
export const PRODUCT_ITEM = 'PRODUCT_ITEM'
export const PRODUCT_DELETE = 'PRODUCT_DELETE'
export const PRODUCT_MEASUREMENT = 'PRODUCT_MEASUREMENT'
export const PRODUCT_EXTRA = 'PRODUCT_EXTRA'

export const PRODUCT_MOBILE = 'PRODUCT_MOBILE'
export const PRODUCT_PRICE_LIST = 'PRODUCT_PRICE_LIST'
export const PRODUCT_PRICE_UPDATE = 'PRODUCT_PRICE_UPDATE'
export const PRODUCT_PRICE_CREATE = 'PRODUCT_PRICE_CREATE'
export const PRODUCT_PRICE_DELETE = 'PRODUCT_PRICE_DELETE'
export const PRODUCT_PRICE_ITEM = 'PRODUCT_PRICE_ITEM'

export const PRODUCT_TYPE_LIST = 'PRODUCT_TYPE_LIST'
export const PRODUCT_TYPE_H_LIST = 'PRODUCT_TYPE_H_LIST'
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
export const TRANSACTION_ACCEPT_CASH = 'TRANSACTION_ACCEPT_CASH'

export const MEASUREMENT_LIST = 'MEASUREMENT_LIST'
export const MEASUREMENT_H_LIST = 'MEASUREMENT_H_LIST'
export const MEASUREMENT_ITEM = 'MEASUREMENT_ITEM'
export const MEASUREMENT_UPDATE = 'MEASUREMENT_UPDATE'
export const MEASUREMENT_CREATE = 'MEASUREMENT_CREATE'
export const MEASUREMENT_DELETE = 'MEASUREMENT_DELETE'

export const EXPENSIVE_CATEGORY_LIST = 'EXPENSIVE_CATEGORY_LIST'
export const EXPENSIVE_CATEGORY_ITEM = 'EXPENSIVE_CATEGORY_ITEM'
export const EXPENSIVE_CATEGORY_UPDATE = 'EXPENSIVE_CATEGORY_UPDATE'
export const EXPENSIVE_CATEGORY_CREATE = 'EXPENSIVE_CATEGORY_CREATE'
export const EXPENSIVE_CATEGORY_DELETE = 'EXPENSIVE_CATEGORY_DELETE'

export const INCOME_CATEGORY_LIST = 'INCOME_CATEGORY_LIST'
export const INCOME_CATEGORY_ITEM = 'INCOME_CATEGORY_ITEM'
export const INCOME_CATEGORY_UPDATE = 'INCOME_CATEGORY_UPDATE'
export const INCOME_CATEGORY_CREATE = 'INCOME_CATEGORY_CREATE'
export const INCOME_CATEGORY_DELETE = 'INCOME_CATEGORY_DELETE'

export const OPTIONS_LIST = 'OPTIONS_LIST'

export const POST_LIST = 'POST_LIST'
export const POST_ITEM = 'POST_ITEM'
export const POST_UPDATE = 'POST_UPDATE'
export const POST_CREATE = 'POST_CREATE'
export const POST_DELETE = 'POST_DELETE'

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
export const CLIENT_LIST_REPETITION = 'CLIENT_LIST_REPETITION'
export const CLIENT_ITEM = 'CLIENT_ITEM'
export const CLIENT_ITEM_REPETITION = 'CLIENT_ITEM_REPETITION'
export const CLIENT_CONTACTS = 'CLIENT_CONTACTS'
export const CLIENT_UPDATE = 'CLIENT_UPDATE'
export const CLIENT_CREATE = 'CLIENT_CREATE'
export const CLIENT_DELETE = 'CLIENT_DELETE'

export const CLIENT_TRANSACTION_LIST = 'CLIENT_TRANSACTION_LIST'
export const CLIENT_TRANSACTION_ITEM = 'CLIENT_TRANSACTION_ITEM'
export const CLIENT_TRANSACTION_UPDATE = 'CLIENT_TRANSACTION_UPDATE'
export const CLIENT_TRANSACTION_CREATE = 'CLIENT_TRANSACTION_CREATE'
export const CLIENT_TRANSACTION_EXPENSE = 'CLIENT_TRANSACTION_EXPENSE'
export const CLIENT_TRANSACTION_INCOME = 'CLIENT_TRANSACTION_INCOME'
export const CLIENT_TRANSACTION_SEND = 'CLIENT_TRANSACTION_SEND'
export const CLIENT_TRANSACTION_DELETE = 'CLIENT_TRANSACTION_DELETE'
export const CLIENT_TRANSACTION_RESEND = 'CLIENT_TRANSACTION_RESEND'
export const CLIENT_TRANSACTION_RETURN = 'CLIENT_TRANSACTION_RETURN'
export const CLIENT_TRANSACTION_TOTAL = 'CLIENT_TRANSACTION_TOTAL'

export const CURRENCY_LIST = 'CURRENCY_LIST'
export const CURRENCY_ITEM = 'CURRENCY_ITEM'
export const CURRENCY_UPDATE = 'CURRENCY_UPDATE'
export const CURRENCY_COURSE_CREATE = 'CURRENCY_COURSE_CREATE'
export const CURRENCY_CREATE = 'CURRENCY_CREATE'
export const CURRENCY_DELETE = 'CURRENCY_DELETE'
export const CURRENCY_PRIMARY = 'CURRENCY_PRIMARY'
export const CURRENCY_PRIMARY_UPDATE = 'CURRENCY_PRIMARY_UPDATE'

export const SNACKBAR = 'SNACKBAR'
export const SNACKBAR_OPEN = `${SNACKBAR}_OPEN`
export const SNACKBAR_CLOSE = `${SNACKBAR}_CLOSE`

export const ERROR = 'ERROR'
export const ERROR_OPEN = `${ERROR}_OPEN`
export const ERROR_CLOSE = `${ERROR}_CLOSE`

export const MANUFACTURE_LIST = 'MANUFACTURE_LIST'
export const MANUFACTURE_ITEM = 'MANUFACTURE_ITEM'
export const MANUFACTURE_UPDATE = 'MANUFACTURE_UPDATE'
export const MANUFACTURE_CREATE = 'MANUFACTURE_CREATE'

export const NOTIFICATIONS_LIST = 'NOTIFICATIONS_LIST'
export const NOTIFICATIONS_ITEM = 'NOTIFICATIONS_ITEM'
export const NOTIFICATIONS_TIME_INTERVAL = 'NOTIFICATIONS_TIME_INTERVAL'
export const NOTIFICATIONS_DELETE = 'NOTIFICATIONS_DELETE'
export const NOTIFICATIONS_UPDATE = 'NOTIFICATIONS_UPDATE'
export const NOTIFICATIONS_GET_COUNT = 'NOTIFICATIONS_GET_COUNT'

export const NOTIFICATION_TEMPLATE_LIST = 'NOTIFICATION_TEMPLATE'
export const NOTIFICATION_TEMPLATE_ITEM = 'NOTIFICATION_TEMPLATE_ITEM'
export const NOTIFICATION_TEMPLATE_UPDATE = 'NOTIFICATION_TEMPLATE_UPDATE'
export const NOTIFICATION_TEMPLATE_TIME_INTERVAL = 'NOTIFICATION_TEMPLATE_TIME_INTERVAL'
export const NOTIFICATION_TEMPLATE_REMOVE_USER = 'NOTIFICATION_TEMPLATE_REMOVE_USER'
export const NOTIFICATION_TEMPLATE_ADD_USER = 'NOTIFICATION_TEMPLATE_ADD_USER'

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
export const PENDING_PAYMENTS_CONVERT = 'PENDING_PAYMENTS_CONVERT'
export const PENDING_PAYMENTS_ITEM = 'PENDING_PAYMENTS_ITEM'
export const PENDING_PAYMENTS_UPDATE = 'PENDING_PAYMENTS_UPDATE'
export const PENDING_PAYMENTS_CREATE = 'PENDING_PAYMENTS_CREATE'
export const PENDING_PAYMENTS_DELETE = 'PENDING_PAYMENTS_DELETE'

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
export const STAT_CASHBOX_SUM = 'STAT_CASHBOX_SUM'
export const STAT_CASHBOX_ITEM_SUM = 'STAT_CASHBOX_ITEM_SUM'
export const STAT_CASHBOX_DATA_ITEM = 'STAT_CASHBOX_DATA_ITEM'

export const STAT_CLIENT_INCOME_LIST = 'STAT_CLIENT_INCOME_LIST'
export const STAT_CLIENT_INCOME_IN = 'STAT_CLIENT_INCOME_IN'
export const STAT_CLIENT_INCOME_OUT = 'STAT_CLIENT_INCOME_OUT'

export const STAT_DEBTORS_DATA = 'STAT_DEBTORS_DATA'
export const STAT_DEBTORS_LIST = 'STAT_DEBTORS_LIST'
export const STAT_DEBTORS_ITEM = 'STAT_DEBTORS_ITEM'
export const STAT_DEBTORS_GET_DOCUMENT = 'STAT_DEBTORS_GET_DOCUMENT'

export const MANUFACTURE_PRODUCT_CREATE = 'MANUFACTURE_PRODUCT_CREATE'
export const MANUFACTURE_PRODUCT_DELETE = 'MANUFACTURE_PRODUCT_DELETE'
export const MANUFACTURE_PRODUCT_CHANGE = 'MANUFACTURE_PRODUCT_CHANGE'

export const SHIPMENT_LIST = 'SHIPMENT_LIST'
export const SHIPMENT_ITEM = 'SHIPMENT_ITEM'
export const SHIPMENT_LOGS = 'SHIPMENT_LOGS'
export const SHIPMENT_PRODUCTS_LIST = 'SHIPMENT_PRODUCTS_LIST'
export const SHIPMENT_MATERIALS_LIST = 'SHIPMENT_MATERIALS_LIST'

export const MARKET_TYPE_LIST = 'MARKET_TYPE_LIST'
export const MARKET_TYPE_ITEM = 'MARKET_TYPE_ITEM'
export const MARKET_TYPE_UPDATE = 'MARKET_TYPE_UPDATE'
export const MARKET_TYPE_CREATE = 'MARKET_TYPE_CREATE'
export const MARKET_TYPE_DELETE = 'MARKET_TYPE_DELETE'

export const PRICE_LIST_SETTING_LIST = 'PRICE_LIST_SETTING_LIST'
export const PRICE_LIST_SETTING_ITEM = 'PRICE_LIST_SETTING_ITEM'
export const PRICE_LIST_SETTING_UPDATE = 'PRICE_LIST_SETTING_UPDATE'
export const PRICE_LIST_SETTING_CREATE = 'PRICE_LIST_SETTING_CREATE'
export const PRICE_LIST_SETTING_DELETE = 'PRICE_LIST_SETTING_DELETE'

export const PRICE_LIST = 'PRICE_LIST'
export const PRICE_UPDATE = 'PRICE_UPDATE'
export const PRICE_CREATE = 'PRICE_CREATE'
export const PRICE_SET_DEFAULT = 'PRICE_SET_DEFAULT'
export const PRICE_ITEM = 'PRICE_ITEM'
export const PRICE_DELETE = 'PRICE_DELETE'
export const PRICE_LIST_CSV = 'PRICE_LIST_CSV'
export const PRICE_LIST_ITEM_LIST = 'PRICE_LIST_ITEM_LIST'
export const PRICE_LIST_ITEM_HISTORY = 'PRICE_LIST_ITEM_HISTORY'
export const PRICE_LIST_ITEM_EXPENSES = 'PRICE_LIST_ITEM_EXPENSES'

export const ZONE_LIST = 'ZONE_LIST'
export const ZONE_ITEM = 'ZONE_ITEM'
export const ZONE_UPDATE = 'ZONE_UPDATE'
export const ZONE_CREATE = 'ZONE_CREATE'
export const ZONE_DELETE = 'ZONE_DELETE'
export const ZONE_STAT = 'ZONE_STAT'
export const ZONE_BIND_AGENT = 'ZONE_BIND_AGENT'

export const TRACKING_LIST = 'TRACKING_LIST'
export const TRACKING_ITEM = 'TRACKING_ITEM'
export const LOCATION_LIST = 'LOCATION_LIST'
export const MARKETS_LOCATION = 'MARKETS_LOCATION'

export const REMAINDER_LIST = 'REMAINDER_LIST'
export const REMAINDER_ITEM = 'REMAINDER_ITEM'
export const REMAINDER_TRANSFER = 'REMAINDER_TRANSFER'
export const REMAINDER_DISCARD = 'REMAINDER_DISCARD'
export const REMAINDER_RESERVED = 'REMAINDER_RESERVED'
export const REMAINDER_ADD_PRODUCTS = 'REMAINDER_ADD_PRODUCTS'

export const REMAINDER_INVENTORY = 'REMAINDER_INVENTORY'
export const REMAINDER_INVENTORY_CREATE = 'REMAINDER_INVENTORY_CREATE'
export const REMAINDER_INVENTORY_LIST = 'REMAINDER_INVENTORY_LIST'
export const REMAINDER_INVENTORY_ITEM = 'REMAINDER_INVENTORY_ITEM'

export const STAT_AGENT_LIST = 'STAT_AGENT_LIST'
export const STAT_AGENT_ITEM = 'STAT_AGENT_ITEM'
export const STAT_AGENT_GET_DOCUMENT = 'STAT_AGENT_GET_DOCUMENT'

export const STAT_PROVIDER_LIST = 'STAT_PROVIDER_LIST'
export const STAT_PROVIDER_ITEM = 'STAT_PROVIDER_ITEM'
export const STAT_PROVIDER_SUM = 'STAT_PROVIDER_SUM'
export const STAT_PROVIDER_DETAIL = 'STAT_PROVIDER_DETAIL'

export const STAT_PROVIDER_TRANSACTIONS_LIST = 'STAT_PROVIDER_TRANSACTIONS_LIST'
export const STAT_PROVIDER_TRANSACTIONS_OUT = 'STAT_PROVIDER_TRANSACTIONS_OUT'
export const STAT_PROVIDER_TRANSACTIONS_IN = 'STAT_PROVIDER_TRANSACTIONS_IN'

export const STAT_PRODUCT_LIST = 'STAT_PRODUCT_LIST'
export const STAT_PRODUCT_GET_DOCUMENT = 'STAT_PRODUCT_GET_DOCUMENT'
export const STAT_PRODUCT_SUM_DATA = 'STAT_PRODUCT_SUM_DATA'
export const STAT_PRODUCT_TYPE_LIST = 'STAT_PRODUCT_TYPE_LIST'

export const STAT_MARKET_LIST = 'STAT_MARKET_LIST'
export const STAT_MARKET_ITEM = 'STAT_MARKET_ITEM'
export const STAT_MARKET_GET_DOCUMENT = 'STAT_MARKET_GET_DOCUMENT'
export const STAT_MARKET_DATA = 'STAT_MARKET_DATA'
export const STAT_MARKET_SUM = 'STAT_MARKET_SUM'
export const STAT_MARKET_TYPE_LIST = 'STAT_MARKET_TYPE_LIST'
export const STAT_MARKET_TYPE_SUM = 'STAT_MARKET_TYPE_SUM'

export const STAT_FINANCE_LIST = 'STAT_FINANCE_LIST'
export const STAT_FINANCE_DATA_IN = 'STAT_FINANCE_DATA_IN'
export const STAT_FINANCE_DATA_OUT = 'STAT_FINANCE_DATA_OUT'

export const STAT_INCOME_DATA = 'STAT_INCOME_DATA'
export const STAT_INCOME_LIST = 'STAT_INCOME_LIST'
export const STAT_AGENT_SUM = 'STAT_AGENT_SUM'

export const STAT_REPORT_LIST = 'STAT_REPORT_LIST'
export const STAT_OUTCOME_DATA = 'STAT_OUTCOME_DATA'
export const STAT_OUTCOME_LIST = 'STAT_OUTCOME_LIST'
export const STAT_OUTCOME_GET_DOCUMENT = 'STAT_OUTCOME_GET_DOCUMENT'

export const STAT_SALES_DATA = 'STAT_SALES_DATA'
export const STAT_SALES_STATS = 'STAT_SALES_STATS'

export const STAT_RETURN_DATA = 'STAT_RETURN_DATA'
export const STAT_RETURN_LIST = 'STAT_RETURN_LIST'
export const STAT_RETURN_SUM_DETAILS = 'STAT_RETURN_SUM_DETAILS'
export const STAT_RETURN_GET_DOCUMENT = 'STAT_RETURN_GET_DOCUMENT'

export const STAT_OUTCOME_CATEGORY_LIST = 'STAT_OUTCOME_CATEGORY_LIST'
export const STAT_OUTCOME_CATEGORY_ITEM = 'STAT_OUTCOME_CATEGORY_ITEM'
export const STAT_OUTCOME_CATEGORY_TRANSACTION_DATA = 'STAT_OUTCOME_CATEGORY_TRANSACTION_DATA'
export const STAT_OUTCOME_CATEGORY_GET_DOCUMENT = 'STAT_OUTCOME_CATEGORY_GET_DOCUMENT'

export const STAT_EXPENDITURE_ON_STAFF_LIST = 'STAT_EXPENDITURE_ON_STAFF'
export const STAT_EXPENDITURE_ON_STAFF_ITEM = 'STAT_EXPENDITURE_ON_STAFF'
export const STAT_EXPENDITURE_ON_STAFF_TRANSACTION_DATA = 'STAT_EXPENDITURE_ON_STAFF_TRANSACTION_DATA'

export const STAT_REMAINDER_ITEM = 'STAT_REMAINDER_ITEM'
export const STAT_REMAINDER_LIST = 'STAT_REMAINDER_LIST'
export const STAT_REMAINDER_SUM = 'STAT_REMAINDER_SUM'

export const REMAINDER_UPDATE = 'REMAINDER_UPDATE'
export const REMAINDER_CREATE = 'REMAINDER_CREATE'

export const STOCK_RECEIVE_LIST = 'STOCK_RECEIVE_LIST'
export const STOCK_RECEIVE_ITEM = 'STOCK_RECEIVE_ITEM'

export const STOCK_RECEIVE_HISTORY_ITEM = 'STOCK_RECEIVE_HISTORY_ITEM'

export const STOCK_TRANSFER_LIST = 'STOCK_TRANSFER_LIST'
export const STOCK_TRANSFER_ITEM = 'STOCK_TRANSFER_ITEM'
export const STOCK_TRANSFER_ACCEPT = 'STOCK_TRANSFER_ACCEPT'
export const STOCK_HISTORY_LIST = 'STOCK_HISTORY_LIST'
export const STOCK_RECEIVE_CREATE = 'STOCK_RECEIVE_CREATE'
export const STOCK_RECEIVE_UPDATE = 'STOCK_RECEIVE_UPDATE'
export const STOCK_RECEIVE_TRANSFER_CHANGE_STATUS = 'STOCK_RECEIVE_TRANSFER_CHANGE_STATUS'
export const STOCK_BARCODE_LIST = 'STOCK_BARCODE_LIST'
export const STOCK_RECEIVE_ACCEPT_ORDER_RETURN = 'STOCK_RECEIVE_ACCEPT_ORDER_RETURN'
export const STOCK_RECEIVE_DELIVERY_RETURN = 'STOCK_RECEIVE_DELIVERY_RETURN'
export const STOCK_RECEIVE_ORDER_ITEM = 'STOCK_RECEIVE_ORDER_ITEM'
export const STOCK_TRANSFER_DELIVERY_LIST = 'STOCK_TRANSFER_DELIVERY_LIST'
export const STOCK_TRANSFER_DELIVERY_ITEM = 'STOCK_TRANSFER_DELIVERY_ITEM'
export const STOCK_TRANSFER_ROUTE_PRINT = 'STOCK_TRANSFER_ROUTE_PRINT'

export const CLIENT_BALANCE_LIST = 'CLIENT_BALANCE_LIST'
export const CLIENT_BALANCE_ITEM = 'CLIENT_BALANCE_ITEM'
export const CLIENT_BALANCE_UPDATE = 'CLIENT_BALANCE_UPDATE'
export const CLIENT_BALANCE_CREATE = 'CLIENT_BALANCE_CREATE'
export const CLIENT_BALANCE_DELETE = 'CLIENT_BALANCE_DELETE'
export const CLIENT_BALANCE_SUPER_USER = 'CLIENT_BALANCE_SUPER_USER'
export const CLIENT_BALANCE_GET_DOCUMENT = 'CLIENT_BALANCE_GET_DOCUMENT'
export const CLIENT_BALANCE_SUM = 'CLIENT_BALANCE_SUM'
export const CLIENT_BALANCE_DETAIL = 'CLIENT_BALANCE_DETAIL'

export const POSITION_LIST = 'POSITION_LIST'
export const POSITION_ITEM = 'POSITION_ITEM'
export const POSITION_UPDATE = 'POSITION_UPDATE'
export const POSITION_COURSE_CREATE = 'POSITION_COURSE_CREATE'
export const POSITION_CREATE = 'POSITION_CREATE'
export const POSITION_DELETE = 'POSITION_DELETE'
export const POSITION_PRIMARY = 'POSITION_PRIMARY'
export const POSITION_PRIMARY_UPDATE = 'POSITION_PRIMARY_UPDATE'
export const POSITION_PERMISSION = 'POSITION_PERMISSION'

export const ACTIVITY_ORDER_LIST = 'ACTIVITY_ORDER_LIST'
export const ACTIVITY_ORDER_ITEM = 'ACTIVITY_ORDER_ITEM'
export const ACTIVITY_VISIT_LIST = 'ACTIVITY_VISIT_LIST'
export const ACTIVITY_REPORT_LIST = 'ACTIVITY_REPORT_LIST'
export const ACTIVITY_REPORT_SHOW_IMAGE = 'ACTIVITY_REPORT_SHOW_IMAGE'
export const ACTIVITY_ORDER_RETURN_LIST = 'ACTIVITY_ORDER_RETURN_LIST'
export const ACTIVITY_PAYMENT_LIST = 'ACTIVITY_PAYMENT_LIST'
export const ACTIVITY_DELIVERY_LIST = 'ACTIVITY_DELIVERY_LIST'
export const ACTIVITY_SUMMARY = 'ACTIVITY_SUMMARY'

export const STAT_PRODUCT_MOVE_LIST = 'STAT_PRODUCT_MOVE_LIST'
export const STAT_PRODUCT_MOVE_SUM = 'STAT_PRODUCT_MOVE_SUM'

export const DIVISION_LIST = 'DIVISION_LIST'
export const DIVISION_ITEM = 'DIVISION_ITEM'
export const DIVISION_UPDATE = 'DIVISION_UPDATE'
export const DIVISION_CREATE = 'DIVISION_CREATE'
export const DIVISION_DELETE = 'DIVISION_DELETE'

export const RETURN = 'RETURN'
export const RETURN_LIST = 'RETURN_LIST'
export const RETURN_PRINT = 'RETURN_PRINT'
export const RETURN_ITEM = 'RETURN_ITEM'
export const RETURN_UPDATE = 'RETURN_UPDATE'
export const RETURN_UPDATE_CLIENT = 'RETURN_UPDATE_CLIENT'
export const RETURN_DELETE = 'RETURN_DELETE'
export const RETURN_CANCEL = 'RETURN_CANCEL'
export const RETURN_PRODUCT_ADD = 'RETURN_PRODUCT_ADD'

export const PLAN_MONTHLY_CREATE = 'PLAN_MONTHLY_CREATE'
export const PLAN_MONTHLY_ITEM = 'PLAN_MONTHLY_ITEM'
export const PLAN_AGENT_MONTHLY = 'PLAN_AGENT_MONTHLY'
export const PLAN_AGENT_LIST = 'PLAN_AGENT_LIST'
export const PLAN_AGENTS = 'PLAN_AGENTS'
export const PLAN_UPDATE = 'PLAN_UPDATE'
export const PLAN_CREATE_SUBMIT = 'PLAN_CREATE_SUBMIT'
export const PLAN_UPDATE_SUBMIT = 'PLAN_UPDATE_SUBMIT'
export const PLAN_AGENTS_ITEM = 'PLAN_AGENTS_ITEM'
export const PLAN_COMBINATION = 'PLAN_COMBINATION'
export const PLAN_AGENTS_ITEM_STATS = 'PLAN_AGENTS_ITEM_STATS'

export const JOIN_MARKETS = 'JOIN_MARKETS'
export const JOIN_CLIENTS = 'JOIN_CLIENTS'

export const ACCESS_LIST = 'ACCESS_LIST'
export const ACCESS_ITEM = 'ACCESS_ITEM'
export const ACCESS_UPDATE = 'ACCESS_UPDATE'

export const TELEGRAM_LIST = 'TELEGRAM_LIST'
export const TELEGRAM_ITEM = 'TELEGRAM_ITEM'
export const TELEGRAM_UPDATE = 'TELEGRAM_UPDATE'
export const TELEGRAM_CREATE = 'TELEGRAM_CREATE'
export const TELEGRAM_DELETE = 'TELEGRAM_DELETE'
export const TELEGRAM_LOGS = 'TELEGRAM_LOGS'

export const TELEGRAM_NEWS_CREATE = 'TELEGRAM_NEWS_CREATE'
export const TELEGRAM_NEWS_LIST = 'TELEGRAM_NEWS_LIST'
export const TELEGRAM_NEWS_UPDATE = 'TELEGRAM_NEWS_UPDATE'
export const TELEGRAM_NEWS_ITEM = 'TELEGRAM_NEWS_ITEM'

export const SYSTEM_PAGES_CREATE = 'SYSTEM_PAGES_CREATE'
export const SYSTEM_PAGES_LIST = 'SYSTEM_PAGES_LIST'
export const SYSTEM_PAGES_UPDATE = 'SYSTEM_PAGES_UPDATE'
export const SYSTEM_PAGES_ITEM = 'SYSTEM_PAGES_ITEM'

export const WIDGETS_LIST = 'WIDGETS_LIST'

export const DASHBOARD_CHANGE_PASSWORD = 'DASHBOARD_CHANGE_PASSWORD'

export const CELL_TYPE_LIST = 'CELL_TYPE_LIST'
export const CELL_TYPE_H_LIST = 'CELL_TYPE_H_LIST'
export const CELL_TYPE_ITEM = 'CELL_TYPE_ITEM'
export const CELL_TYPE_UPDATE = 'CELL_TYPE_UPDATE'
export const CELL_TYPE_CREATE = 'CELL_TYPE_CREATE'
export const CELL_TYPE_DELETE = 'CELL_TYPE_DELETE'

export const CELL_LIST = 'CELL_LIST'
export const CELL_ITEM = 'CELL_ITEM'
export const CELL_UPDATE = 'CELL_UPDATE'
export const CELL_CREATE = 'CELL_CREATE'
export const CELL_DELETE = 'CELL_DELETE'
