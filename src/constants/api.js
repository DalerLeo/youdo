export const API_HOST = process.env.API_HOST
export const API_ROOT = 'api'
export const API_VERSION = 'v1'
export const API_URL = (API_HOST === 'apistick.wienerdeming.com')
    ? `https://apistick.wienerdeming.com/${API_ROOT}/${API_VERSION}`
    : `http://${API_HOST}/${API_ROOT}/${API_VERSION}`

export const USER = 'main/user'
export const SIGN_IN = `/${USER}/auth/`
export const SIGN_OUT = `/${USER}/unauth/`
export const CONFIG = 'config/'

export const EQUIPMENT = 'manufacture/equipment'
export const EQUIPMENT_CREATE = `/${EQUIPMENT}/`
export const EQUIPMENT_LIST = `/${EQUIPMENT}/`
export const EQUIPMENT_ITEM = `/${EQUIPMENT}/%d/`
export const EQUIPMENT_DELETE = `/${EQUIPMENT}/%d/`

export const STOCK = 'stock/stock'
export const STOCK_CREATE = `/${STOCK}/`
export const STOCK_LIST = `/${STOCK}/`
export const STOCK_ITEM = `/${STOCK}/%d/`
export const STOCK_DELETE = `/${STOCK}/%d/`

export const MEASUREMENT = 'main/measurement'
export const MEASUREMENT_CREATE = `/${MEASUREMENT}/`
export const MEASUREMENT_LIST = `/${MEASUREMENT}/`
export const MEASUREMENT_ITEM = `/${MEASUREMENT}/%d/`
export const MEASUREMENT_DELETE = `/${MEASUREMENT}/%d/`

export const EXPENSIVE_CATEGORY = 'finance/expanse_category'
export const EXPENSIVE_CATEGORY_CREATE = `/${EXPENSIVE_CATEGORY}/`
export const EXPENSIVE_CATEGORY_LIST = `/${EXPENSIVE_CATEGORY}/`
export const EXPENSIVE_CATEGORY_ITEM = `/${EXPENSIVE_CATEGORY}/%d/`
export const EXPENSIVE_CATEGORY_DELETE = `/${EXPENSIVE_CATEGORY}/%d/`

export const PROVIDER = 'stock/provider'
export const PROVIDER_CREATE = `/${PROVIDER}/`
export const PROVIDER_DELETE = `/${PROVIDER}/%d/`
export const PROVIDER_LIST = `/${PROVIDER}/`
export const PROVIDER_ITEM = `/${PROVIDER}/%d/`

export const CLIENT = 'sales/client'
export const CLIENT_CREATE = `/${CLIENT}/`
export const CLIENT_DELETE = `/${CLIENT}/%d/`
export const CLIENT_LIST = `/${CLIENT}/`
export const CLIENT_ITEM = `/${CLIENT}/%d/`

export const CURRENCY = 'finance/currencies'
export const CURRENCY_COURSE_CREATE = 'finance/currency_rate/'
export const CURRENCY_CREATE = `/${CURRENCY}/`
export const CURRENCY_LIST = `/${CURRENCY}/`
export const CURRENCY_DELETE = `/${CURRENCY}/%d/`
export const CURRENCY_ITEM = `/${CURRENCY}/%d/`
export const CURRENCY_PRIMARY = 'currency_primary'
export const CURRENCY_RATE = 'finance/currency_rate/'

export const SHOP = 'market/market'
export const SHOP_CREATE = `/${SHOP}/`
export const SHOP_LIST = `/${SHOP}/`
export const SHOP_ITEM = `/${SHOP}/%d/`
export const SHOP_ITEM_ADD_IMAGE = `/${SHOP}/%d/images/`
export const SHOP_SET_PRIMARY_IMAGE = `/${SHOP}/%d/set_primary_image/`
export const SHOP_ITEM_SHOW_IMAGE = 'main/file/%d/'
export const SHOP_ITEM_DELETE_IMAGE = `/${SHOP}/%d/images/%d/`
export const SHOP_DELETE = `/${SHOP}/%d/`

export const USERS = 'main/crud'
export const USERS_CREATE = `/${USERS}/`
export const USERS_LIST = `/${USERS}/`
export const USERS_ITEM = `/${USERS}/%d/`
export const USERS_DELETE = `/${USERS}/%d/`
export const USERS_GROUP = 'main/group/gcrud/'
export const USERS_GROUP_ITEM = `/${USERS_GROUP}/%d/`

export const CASHBOX = 'finance/cashbox'
export const CASHBOX_CREATE = `/${CASHBOX}/`
export const CASHBOX_LIST = `/${CASHBOX}/`
export const CASHBOX_ITEM = `/${CASHBOX}/%d/`
export const CASHBOX_DELETE = `/${CASHBOX}/%d/`

export const TRANSACTION = 'finance/transaction'
export const TRANSACTION_CREATE = `/${TRANSACTION}/`
export const TRANSACTION_LIST = `/${TRANSACTION}/`
export const TRANSACTION_ITEM = `/${TRANSACTION}/%d/`
export const TRANSACTION_SEND = '/transfer/'
export const TRANSACTION_DELETE = `/${TRANSACTION}/%d/`

export const CLIENT_TRANSACTION = 'sales/client_transaction'
export const CLIENT_TRANSACTION_CREATE = `/${CLIENT_TRANSACTION}/`
export const CLIENT_TRANSACTION_LIST = `/${CLIENT_TRANSACTION}/`
export const CLIENT_TRANSACTION_ITEM = `/${CLIENT_TRANSACTION}/%d/`
export const CLIENT_TRANSACTION_SEND = '/transfer/'
export const CLIENT_TRANSACTION_DELETE = `/${CLIENT_TRANSACTION}/%d/`

export const SUPPLY = 'stock/supply'
export const SUPPLY_CREATE = `/${SUPPLY}/`
export const SUPPLY_LIST = `/${SUPPLY}/`
export const SUPPLY_ITEM = `/${SUPPLY}/%d/`
export const SUPPLY_DEFECT = `/${SUPPLY}/%d/product_detail/%d/`
export const SUPPLY_CANCEL = `/${SUPPLY}/cancel`

export const PRICES = 'market/discount'
export const PRICES_CREATE = `/${PRICES}/`
export const PRICES_LIST = `/${PRICES}/`
export const PRICES_ITEM = `/${PRICES}/%d/`
export const PRICES_DELETE = `/${PRICES}/%d/`

export const ORDER = 'sales/order'
export const ORDER_CREATE = `/${ORDER}/`
export const ORDER_RETURN = '/sales/order_return/'
export const ORDER_RETURN_LIST = '/sales/order_return/%d/'
export const ORDER_TRANSACTION = '/sales/client_transaction/'

export const ORDER_LIST = `/${ORDER}/`
export const ORDER_ITEM = `/${ORDER}/%d/`
export const ORDER_LIST_PRINT = `/${ORDER}/print/`
export const ORDER_CANCEL = `/${ORDER}/%d/cancel`
export const GET_DOCUMENT = 'order_document/%d/'

export const SUPPLY_EXPENSE = 'stock/supply_expanse'
export const SUPPLY_EXPENSE_CREATE = `/${SUPPLY_EXPENSE}/`
export const SUPPLY_EXPENSE_LIST = `/${SUPPLY_EXPENSE}/`
export const SUPPLY_EXPENSE_ITEM = `/${SUPPLY_EXPENSE}/%d/`
export const SUPPLY_EXPENSE_DELETE = `/${SUPPLY_EXPENSE}/%d/`

export const PRODUCT = 'main/product'
export const PRODUCT_CREATE = `/${PRODUCT}/`
export const PRODUCT_LIST = `/${PRODUCT}/`
export const PRODUCT_ITEM = `/${PRODUCT}/%d/`
export const PRODUCT_DELETE = `/${PRODUCT}/%d/`
export const PRODUCT_EXTRA = 'sales/products_extra_list/'
export const PRODUCT_INGREDIENT = 'main/product/%d/ingredient_list/'

export const PRODUCT_PRICE = 'main/product'
export const PRODUCT_PRICE_CREATE = `/${PRODUCT_PRICE}/`
export const PRODUCT_PRICE_LIST = `/${PRODUCT_PRICE}/`
export const PRODUCT_PRICE_ITEM = `/${PRODUCT_PRICE}/%d/`
export const PRODUCT_PRICE_SET = `/${PRODUCT_PRICE}/%d/set_price/`
export const PRODUCT_PRICE_DELETE = `/${PRODUCT_PRICE}/%d/`

export const PRODUCT_TYPE = 'main/product_type'
export const PRODUCT_TYPE_CREATE = `/${PRODUCT_TYPE}/`
export const PRODUCT_TYPE_LIST = `/${PRODUCT_TYPE}/`
export const PRODUCT_TYPE_ITEM = `/${PRODUCT_TYPE}/%d/`
export const PRODUCT_TYPE_DELETE = `/${PRODUCT_TYPE}/%d/`

export const BRAND = 'main/brand'
export const BRAND_CREATE = `/${BRAND}/`
export const BRAND_LIST = `/${BRAND}/`
export const BRAND_ITEM = `/${BRAND}/%d/`
export const BRAND_DELETE = `/${BRAND}/%d/`

export const INGREDIENT = 'ingredients'
export const INGREDIENT_CREATE = `/${INGREDIENT}/`
export const INGREDIENT_LIST = 'main/product/%d/ingredient_list/'
export const INGREDIENT_ITEM = `/${INGREDIENT}/%d/`
export const INGREDIENT_DELETE = `/${INGREDIENT}/%d/`

export const FILE_UPLOAD = '/main/file/'

export const MANUFACTURE = 'manufacture/manufacturing'
export const MANUFACTURE_CREATE = `/${MANUFACTURE}/`
export const MANUFACTURE_LIST = `/${MANUFACTURE}/`
export const MANUFACTURE_ITEM = `/${MANUFACTURE}/%d/`

export const NOTIFICATIONS = 'notification/notifications'
export const NOTIFICATIONS_LIST = `/${NOTIFICATIONS}/`
export const NOTIFICATIONS_ITEM = `/${NOTIFICATIONS}/%d/`
export const NOTIFICATIONS_DELETE = `/${NOTIFICATIONS}/%d/`
export const NOTIFICATIONS_GET_NOT_VIEWED = 'notification/notifications/get_not_viewed'

export const SHIFT = 'staff/shift'
export const SHIFT_CREATE = `/${SHIFT}/`
export const SHIFT_LIST = `/${SHIFT}/`
export const SHIFT_ITEM = `/${SHIFT}/%d/`
export const SHIFT_DELETE = `/${SHIFT}/%d/`

export const USER_SHIFT = 'staff/user_shift'
export const USER_SHIFT_CREATE = `/${USER_SHIFT}/`
export const USER_SHIFT_LIST = `/${USER_SHIFT}/`
export const USER_SHIFT_ITEM = `/${USER_SHIFT}/%d/`
export const USER_SHIFT_DELETE = `/${USER_SHIFT}/%d/`

export const PENDING_EXPENSES = 'stock/supply_expanse'
export const PENDING_EXPENSES_UPDATE = '/transactions/expanse_cashbox/'
export const PENDING_EXPENSES_LIST = `/${PENDING_EXPENSES}/`
export const PENDING_EXPENSES_ITEM = `/${PENDING_EXPENSES}/%d/`

export const STATSTOCK = 'stock/stock'
export const STATSTOCK_CREATE = `/${STATSTOCK}/`
export const STATSTOCK_LIST = `/${STATSTOCK}/`
export const STATSTOCK_ITEM = `/${STATSTOCK}/%d/`
export const STATSTOCK_DELETE = `/${STATSTOCK}/%d/`
export const STATSTOCK_DATA = '/stock/stock_stat/'
export const STATSTOCK_GET_DOCUMENT = 'stock/stock/export_balances/'

export const REMAINDER_STOCK = 'stock/stock'
export const REMAINDER_STOCK_CREATE = `/${REMAINDER_STOCK}/all_balances/`
export const REMAINDER_STOCK_LIST = `/${REMAINDER_STOCK}/all_balances/`
export const REMAINDER_STOCK_ITEM = `/${REMAINDER_STOCK}/all_balances/balances/%d`
export const REMAINDER_STOCK_DELETE = `/${REMAINDER_STOCK}/all_balances/%d`

export const TRANSACTION_STOCK = 'stock/barcode_history'
export const TRANSACTION_STOCK_LIST = `/${TRANSACTION_STOCK}/`

export const STATDEBTORS = 'sales/debtors'
export const STATDEBTORS_CREATE = `/${STATDEBTORS}/`
export const STATDEBTORS_LIST = `/${STATDEBTORS}/`
export const STATDEBTORS_ORDER_LIST = 'sales/order/'
export const STATDEBTORS_SUM = '/sales/debtors_statistics/'
export const STATDEBTORS_ITEM = `/${STATDEBTORS}/%d/`
export const STATDEBTORS_DELETE = `/${STATDEBTORS}/%d/`
export const STATDEBTORS_GET_DOCUMENT = 'sales/debtors_statistics/'

export const PENDING_PAYMENTS = 'sales/order'
export const PENDING_PAYMENTS_CREATE = '/sales/order_payment/'
export const PENDING_PAYMENTS_LIST = `/${PENDING_PAYMENTS}/`
export const PENDING_PAYMENTS_ITEM = `/${PENDING_PAYMENTS}/%d/`

export const STAT_MANUFACTURE = 'manufacture/manufacturing'
export const STAT_MANUFACTURE_CREATE = `/${STAT_MANUFACTURE}/`
export const STAT_MANUFACTURE_LIST = `/${STAT_MANUFACTURE}/`
export const STAT_MANUFACTURE_ITEM = `/${STAT_MANUFACTURE}/%d/`
export const STAT_MANUFACTURE_DELETE = `/${STAT_MANUFACTURE}/%d/`

export const STAT_CASHBOX = 'finance/cashbox'
export const STAT_CASHBOX_CREATE = `/${STAT_CASHBOX}/`
export const STAT_CASHBOX_LIST = `/${STAT_CASHBOX}/`
export const STAT_CASHBOX_ITEM = `/${STAT_CASHBOX}/%d/`
export const STAT_CASHBOX_DELETE = `/${STAT_CASHBOX}/%d/`

export const MANUFACTURE_PRODUCT = 'manufacture/create_ingredient'
export const MANUFACTURE_PRODUCT_CREATE = `/${MANUFACTURE_PRODUCT}/`
export const MANUFACTURE_PRODUCT_LIST = `/${MANUFACTURE_PRODUCT}/`
export const MANUFACTURE_PRODUCT_DELETE = '/delete_ingredient/%d/'
export const MANUFACTURE_PRODUCT_CHANGE = '/main/product/%d/change_manufacture/'

export const SHIPMENT = 'manufacture/shipment_statistics/'
export const SHIPMENT_LIST = `/${SHIPMENT}/`
export const SHIPMENT_ITEM = 'manufacture/shipment_details/%d/'

export const MARKET_TYPE = 'market/market_type'
export const MARKET_TYPE_CREATE = `/${MARKET_TYPE}/`
export const MARKET_TYPE_LIST = `/${MARKET_TYPE}/`
export const MARKET_TYPE_ITEM = `/${MARKET_TYPE}/%d/`
export const MARKET_TYPE_DELETE = `/${MARKET_TYPE}/%d/`

export const ZONE = 'market/border'
export const ZONE_CREATE = `/${ZONE}/`
export const ZONE_LIST = `/${ZONE}/`
export const ZONE_ITEM = `/${ZONE}/%d/`
export const ZONE_DELETE = `/${ZONE}/%d/`
export const ZONE_STAT = `/${ZONE}/statistics/`

export const PRICE = 'stock/products_net_costs'
export const PRICE_CREATE = `/${PRICE}/`
export const PRICE_LIST = `/${PRICE}/`
export const PRICE_ITEM = `/${PRODUCT}/%d/`
export const PRICE_DELETE = `/${PRICE}/%d/`

export const PRICE_LIST_ITEM = 'sales/price_list_item'
export const PRICE_LIST_ITEM_HISTORY = 'stock/supply_product_history/%d/'
export const PRICE_LIST_ITEM_EXPENSES = 'stock/supply_product_expenses/%d/'
export const PRICE_LIST_ITEM_LIST = `/${PRICE_LIST_ITEM}/`
export const PRICE_LIST_ITEM_ADD = `/${PRICE_LIST_ITEM}/add_items/`

export const TRACKING = 'market/agents_location/'
export const TRACKING_LIST = `${TRACKING}`
export const TRACKING_ITEM = `${TRACKING}/%d/`
export const MARKETS_LOCATION = `${SHOP}/locations/`
export const LOCATION_LIST = 'market/location/'

export const REMAINDER = 'stock/stock'
export const REMAINDER_LIST = `/${REMAINDER}/all_balances/`
export const REMAINDER_ITEM = `/${REMAINDER}/balances_by_product/%d/`
export const REMAINDER_TRANSFER = '/stock/stock_transfer/wb_create/'
export const REMAINDER_DISCARD = '/stock/stock_transfer/wb_create/'

export const STAT_AGENT_LIST = 'stats/agents/'
export const STAT_AGENT_ITEM = 'sales/order/'
export const STAT_AGENT_GET_DOCUMENT = '/stats/agents/export/'

export const STAT_MARKET_LIST = 'stats/markets/'
export const STAT_MARKET_ITEM = 'sales/order/'
export const STAT_MARKET_GET_DOCUMENT = '/stats/markets/export'

export const STAT_INCOME_DATA = 'stats/transactions/'
export const STAT_INCOME_LIST = 'finance/transaction/'

export const STAT_OUTCOME_DATA = 'stats/transactions/'
export const STAT_OUTCOME_LIST = 'finance/transaction/'
export const STAT_OUTCOME_GET_DOCUMENT = 'stats/transactions/export'

export const STAT_DEBTORS_DATA = 'stats/debtors_stats/'
export const STAT_DEBTORS_LIST = 'stats/debtors/'
export const STAT_DEBTORS_ITEM = 'sales/order/'
export const STAT_DEBTORS_GET_DOCUMENT = 'stats/debtors/export'

export const STAT_PRODUCT_LIST = 'stats/products/'
export const STAT_PRODUCT_GET_DOCUMENT = '/stats/products/export'

export const STAT_OUTCOME_CATEGORY_LIST = 'stats/agents/'
export const STAT_OUTCOME_CATEGORY_ITEM = 'sales/order/'
export const STAT_OUTCOME_CATEGORY_GET_DOCUMENT = 'stats/agents/export/'
export const STAT_REMAINDER_LIST = `/${REMAINDER}/all_balances/`
export const STAT_REMAINDER_ITEM = `/${REMAINDER}/balances_by_product/%d/`

export const STOCK_RECEIVE = 'stock/supply'
export const STOCK_HISTORY = 'stock/barcode_history'
export const STOCK_HISTORY_LIST = `/${STOCK_HISTORY}/`
export const STOCK_TRANSFER = 'stock/outcome_tasks'
export const STOCK_TRANSFER_LIST = `/${STOCK_TRANSFER}/`
export const STOCK_TRANSFER_ITEM = '/sales/order/%d/'
export const STOCK_TRANSFER_ACCEPT = '/stock/accept_outcome/'
export const STOCK_RECEIVE_LIST = '/stock/income_tasks/'
export const STOCK_RECEIVE_ITEM = `/${STOCK_RECEIVE}/%d/`
export const STOCK_RECEIVE_TRANSFER_CHANGE_STATUS = 'stock/stock_transfer/%d/change_status/'
export const STOCK_RECEIVE_ACCEPT_ORDER_RETURN = 'stock/accept_order_return/'

export const STOCK_RECEIVE_CREATE = '/stock/supply/%d/accept_products/'
export const STOCK_BARCODE_LIST = STOCK_RECEIVE_CREATE

export const CLIENT_BALANCE = 'sales/client_balances'
export const CLIENT_BALANCE_LIST = `/${CLIENT_BALANCE}/`
export const CLIENT_BALANCE_ITEM = 'sales/client_transaction/'
export const CLIENT_BALANCE_UPDATE = `/${CLIENT_BALANCE}/%d/`

export const PLAN = 'market/border'
export const PLAN_CREATE = `/${PLAN}/`
export const PLAN_LIST = `/${PLAN}/`
export const PLAN_ITEM = `/${PLAN}/%d/`
