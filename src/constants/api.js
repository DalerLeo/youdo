
export const API_HOST = process.env.API_HOST
export const API_ROOT = 'api'
export const API_VERSION = 'v1'
export const API_PROTOCOL = process.env.API_PROTOCOL ? process.env.API_PROTOCOL : 'http'

export const API_URL = `${API_PROTOCOL}://${API_HOST}/%s/${API_ROOT}/${API_VERSION}`

export const USER = 'user'
export const SIGN_IN = `/${USER}/auth/`
export const AUTH_CONFIRM = `/${USER}/auth-confirm/`
export const SIGN_OUT = `/${USER}/unauth/`
export const CONFIG = 'config'

export const CLIENT_TRANSACTION = 'sales/client_transaction'
export const CLIENT_TRANSACTION_CREATE = `/${CLIENT_TRANSACTION}/`
export const CLIENT_TRANSACTION_RETURN = 'sales/order_return/from_client/'
export const CLIENT_TRANSACTION_RETURN_UPDATE = 'sales/order_return/%d/from_client_update/'
export const CLIENT_TRANSACTION_LIST = `/${CLIENT_TRANSACTION}/`
export const CLIENT_TRANSACTION_ITEM = `/${CLIENT_TRANSACTION}/%d/`
export const CLIENT_TRANSACTION_SEND = '/transfer/'
export const CLIENT_TRANSACTION_DELETE = `/${CLIENT_TRANSACTION}/%d/cancel/`
export const CLIENT_TRANSACTION_RESEND = 'telegram/resend_client_transaction/'
export const CLIENT_TRANSACTION_TOTAL = `/${CLIENT_TRANSACTION}/total/`

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
export const MEASUREMENT_H_LIST = `/${MEASUREMENT}/hierarchy/`
export const MEASUREMENT_H_ITEM = `/${MEASUREMENT}/hierarchy/%d/`
export const MEASUREMENT_ITEM = `/${MEASUREMENT}/%d/`
export const MEASUREMENT_DELETE = `/${MEASUREMENT}/%d/`

export const EXPENSIVE_CATEGORY = 'finance/expense_category'
export const EXPENSIVE_CATEGORY_CREATE = `/${EXPENSIVE_CATEGORY}/`
export const EXPENSIVE_CATEGORY_LIST = `/${EXPENSIVE_CATEGORY}/`
export const EXPENSIVE_CATEGORY_ITEM = `/${EXPENSIVE_CATEGORY}/%d/`
export const EXPENSIVE_CATEGORY_DELETE = `/${EXPENSIVE_CATEGORY}/%d/`

export const INCOME_CATEGORY = 'finance/income_category'
export const INCOME_CATEGORY_CREATE = `/${INCOME_CATEGORY}/`
export const INCOME_CATEGORY_LIST = `/${INCOME_CATEGORY}/`
export const INCOME_CATEGORY_ITEM = `/${INCOME_CATEGORY}/%d/`
export const INCOME_CATEGORY_DELETE = `/${INCOME_CATEGORY}/%d/`

export const OPTIONS_LIST = 'main/options/'

export const POST = 'main/jobs'
export const POST_CREATE = `/${POST}/`
export const POST_LIST = `/${POST}/`
export const POST_ITEM = `/${POST}/%d/`
export const POST_DELETE = `/${POST}/%d/`

export const PROVIDER = 'stock/provider'
export const PROVIDER_CREATE = `/${PROVIDER}/`
export const PROVIDER_DELETE = `/${PROVIDER}/%d/`
export const PROVIDER_LIST = `/${PROVIDER}/`
export const PROVIDER_ITEM = `/${PROVIDER}/%d/`

export const CLIENT = 'client/client'
export const CLIENT_CREATE = `/${CLIENT}/`
export const CLIENT_DELETE = `/${CLIENT}/%d/`
export const CLIENT_LIST = `/${CLIENT}/`
export const CLIENT_LIST_REPETITION = `/${CLIENT}/repetitions/`
export const CLIENT_ITEM = `/${CLIENT}/%d/`
export const CLIENT_ITEM_REPETITION = `/${CLIENT}/%d/repetition/`

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
export const SHOP_LIST_REPETITION = `/${SHOP}/repetitions/`
export const SHOP_ITEM = `/${SHOP}/%d/`
export const SHOP_ITEM_REPETITION = `/${SHOP}/%d/repetition/`
export const SHOP_ITEM_ADD_IMAGE = `/${SHOP}/%d/images/`
export const SHOP_SET_PRIMARY_IMAGE = `/${SHOP}/%d/set_primary_image/`
export const SHOP_ITEM_SHOW_IMAGE = 'main/file/%d/'
export const SHOP_ITEM_DELETE_IMAGE = `/${SHOP}/%d/images/%d/`
export const SHOP_DELETE = `/${SHOP}/%d/`
export const SHOP_MULTI_UPDATE = `/${SHOP}/bulk_update/`

export const USERS = 'user/crud'
export const USERS_CREATE = `/${USERS}/`
export const USERS_LIST = `/${USERS}/`
export const USERS_ITEM = `/${USERS}/%d/`
export const USERS_DELETE = `/${USERS}/%d/`
export const USERS_GROUP = 'user/group/gcrud/'
export const USERS_GROUP_ITEM = `/${USERS_GROUP}/%d/`

export const CASHBOX = 'finance/cashbox'
export const CASHBOX_CREATE = `/${CASHBOX}/`
export const CASHBOX_LIST = `/${CASHBOX}/`
export const CASHBOX_ITEM = `/${CASHBOX}/%d/`
export const CASHBOX_DELETE = `/${CASHBOX}/%d/`

export const NOTIFICATION_TEMPLATE = 'notification/notification_template'
export const NOTIFICATION_TEMPLATE_LIST = `/${NOTIFICATION_TEMPLATE}/`
export const NOTIFICATION_TEMPLATE_ITEM = `/${NOTIFICATION_TEMPLATE}/%d/`
export const NOTIFICATION_TEMPLATE_ADD_USER = `/${NOTIFICATION_TEMPLATE}/%d/add_user/`
export const NOTIFICATION_TEMPLATE_REMOVE_USER = `/${NOTIFICATION_TEMPLATE}/%d/remove_user/`

export const TRANSACTION = 'finance/transaction'
export const TRANSACTION_ACCEPT_CASH = 'finance/accept_cash_list/'
export const TRANSACTION_CREATE = `/${TRANSACTION}/`
export const TRANSACTION_LIST = `/${TRANSACTION}/`
export const TRANSACTION_ITEM = `/${TRANSACTION}/%d/`
export const TRANSACTION_SEND = 'finance/transfer/'
export const TRANSACTION_DELETE = `/${TRANSACTION}/%d/`
export const TRANSACTION_PAYMENT_DELETE = 'sales/client_transaction/%d/cancel/'
export const TRANSACTION_CATEGORY_DATA_LIST = 'sales/staff_expense/'
export const TRANSACTION_DETALIZATION_LIST = `/${TRANSACTION}/%d/children/`

export const SUPPLY = 'stock/supply'
export const SUPPLY_CREATE = `/${SUPPLY}/`
export const SUPPLY_LIST = `/${SUPPLY}/`
export const SUPPLY_ITEM = `/${SUPPLY}/%d/`
export const SUPPLY_DEFECT = `/${SUPPLY}/%d/product_detail/%d/`
export const SUPPLY_CANCEL = `/${SUPPLY}/cancel`
export const SUPPLY_SYNC = `/${SUPPLY}/%d/update_amount/`
export const SUPPLY_TRANSACTIONS = 'finance/provider_debt_separations/'

export const PRICES = 'market/promotion'
export const PRICES_CREATE = `/${PRICES}/`
export const PRICES_LIST = `/${PRICES}/`
export const PRICES_ITEM = `/${PRICES}/%d/`
export const PRICES_DELETE = `/${PRICES}/%d/`

export const ORDER = 'order'
export const ORDER_CREATE = `/${ORDER}/`
export const ORDER_RETURN = '/order_return/'
export const ORDER_RETURN_LIST = '/order_return/%d/'
export const ORDER_SET_DISCOUNT = `/${ORDER}/%d/add_discount/`
export const ORDER_TRANSACTION = '/client_transaction/'
export const ORDER_PAYMENTS = '/debt_transactions/'
export const ORDER_RETURN_CANCEL = '/sales/order_return/%d/cancel/'
export const ORDER_COUNTS = '/order/stats/'
export const ORDER_MULTI_UPDATE = '/order/bulk_update/'

export const ACCEPT_CLIENT_TRANSACTION = 'finance/accept_client_transaction'

export const ORDER_LIST = `/${ORDER}/`
export const ORDER_ITEM = `/${ORDER}/%d/`
export const ORDER_LIST_PRINT = `/${ORDER}/print/`
export const ORDER_SALES_PRINT = '/stock/delivery_products/custom_releases/'
export const ORDER_SALES_RELEASE = '/stock/delivery_products/custom_release/export'
export const ORDER_CANCEL = `/${ORDER}/%d/cancel/`
export const ORDER_EXCEL = `/${ORDER}/download_invoice/`
export const ORDER_CHECK_DELIVERY = `/${ORDER}/delivered/`
export const GET_DOCUMENT = 'order_document/%d/'

export const SUPPLY_EXPENSE = 'stock/supply_expense'
export const SUPPLY_EXPENSE_CREATE = `/${SUPPLY_EXPENSE}/`
export const SUPPLY_EXPENSE_LIST = `/${SUPPLY_EXPENSE}/`
export const SUPPLY_PAID_LIST = 'finance/transaction/'
export const SUPPLY_EXPENSE_ITEM = `/${SUPPLY_EXPENSE}/%d/`
export const SUPPLY_EXPENSE_DELETE = `/${SUPPLY_EXPENSE}/%d/`

export const PRODUCT = 'main/product'
export const PRODUCT_CREATE = `/${PRODUCT}/`
export const PRODUCT_LIST = `/${PRODUCT}/`
export const PRODUCT_ITEM = `/${PRODUCT}/%d/`
export const PRODUCT_DELETE = `/${PRODUCT}/%d/`
export const PRODUCT_INGREDIENT = 'main/product/%d/ingredient_list/'

export const PRODUCT_FOR_SELECT = 'main/product/for_select'
export const PRODUCT_FOR_SELECT_LIST = `${PRODUCT_FOR_SELECT}/`

export const PRODUCT_MOBILE = 'main/product_mobile'
export const PRODUCT_MOBILE_URL = 'main/product_mobile/'
export const PRODUCT_MOBILE_ITEM = `${PRODUCT_MOBILE}/`
export const PRODUCT_EXTRA = `${PRODUCT_MOBILE}/%d/`
export const PRODUCT_FOR_ORDER_SELECT_LIST = `${PRODUCT_MOBILE}/`

export const PRODUCT_PRICE = 'main/product'
export const PRODUCT_PRICE_CREATE = `/${PRODUCT_PRICE}/`
export const PRODUCT_PRICE_LIST = `/${PRODUCT_PRICE}/`
export const PRODUCT_PRICE_ITEM = `/${PRODUCT_PRICE}/%d/`
export const PRODUCT_PRICE_SET = `/${PRODUCT_PRICE}/%d/set_price/`
export const PRODUCT_PRICE_DELETE = `/${PRODUCT_PRICE}/%d/`

export const PRODUCT_TYPE = 'main/product_type'
export const PRODUCT_TYPE_CREATE = `/${PRODUCT_TYPE}/`
export const PRODUCT_TYPE_LIST = `/${PRODUCT_TYPE}/`
export const PRODUCT_TYPE_H_LIST = `/${PRODUCT_TYPE}/hierarchy/`
export const PRODUCT_TYPE_ITEM = `/${PRODUCT_TYPE}/%d/`
export const PRODUCT_TYPE_DELETE = `/${PRODUCT_TYPE}/%d/`

export const BRAND = 'main/brand'
export const BRAND_CREATE = `/${BRAND}/`
export const BRAND_LIST = `/${BRAND}/`
export const BRAND_ITEM = `/${BRAND}/%d/`
export const BRAND_DELETE = `/${BRAND}/%d/`

export const INGREDIENT = 'manufacture/ingredients'
export const INGREDIENT_CREATE = 'manufacture/ingredients/'
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
export const NOTIFICATIONS_GET_COUNT = 'notification/notifications/get_not_viewed'

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

export const PENDING_EXPENSES = 'stock/supply_expense'
export const PENDING_EXPENSES_UPDATE = 'finance/transaction/'
export const PENDING_EXPENSES_LIST = 'finance/pending_payments/'
export const PENDING_EXPENSES_ITEM = `/${PENDING_EXPENSES}/%d/`

export const STATSTOCK = 'stock/stock'
export const STATSTOCK_CREATE = `/${STATSTOCK}/`
export const STATSTOCK_LIST = `/${STATSTOCK}/`
export const STATSTOCK_ITEM = `/${STATSTOCK}/%d/`
export const STATSTOCK_DELETE = `/${STATSTOCK}/%d/`
export const STATSTOCK_DATA = '/stock/stock_stat/'
export const STATSTOCK_GET_DOCUMENT = 'stock/stock/export_balances/'

export const REMAINDER_STOCK = 'stock'
export const REMAINDER_STOCK_CREATE = `/${REMAINDER_STOCK}/all_balances/`
export const REMAINDER_STOCK_LIST = `/${REMAINDER_STOCK}/all_balances/`
export const REMAINDER_STOCK_ITEM = `/${REMAINDER_STOCK}/all_balances/balances/%d`
export const REMAINDER_STOCK_DELETE = `/${REMAINDER_STOCK}/all_balances/%d`

export const REMAINDER_INVENTORY = 'stock/inventory'
export const REMAINDER_INVENTORY_LIST = `/${REMAINDER_INVENTORY}/`
export const REMAINDER_INVENTORY_ITEM = `/${REMAINDER_INVENTORY}/%d/`
export const REMAINDER_INVENTORY_CREATE = `/${REMAINDER_INVENTORY}/`
export const REMAINDER_INVENTORY_VERIFY = `/${REMAINDER_INVENTORY}/%d/make_writeoff/`

export const TRANSACTION_STOCK = 'stock/barcode_history'
export const TRANSACTION_STOCK_LIST = `/${TRANSACTION_STOCK}/`

export const PENDING_PAYMENTS = 'sales/order'
export const PENDING_PAYMENTS_CONVERT = 'finance/convert'
export const PENDING_PAYMENTS_CREATE = '/sales/order_payment/'
export const PENDING_PAYMENTS_LIST = `/${PENDING_PAYMENTS}/`
export const PENDING_PAYMENTS_ITEM = `/${PENDING_PAYMENTS}/%d/`

export const STAT_MANUFACTURE = 'manufacture/manufacturing'
export const STAT_MANUFACTURE_CREATE = `/${STAT_MANUFACTURE}/`
export const STAT_MANUFACTURE_LIST = `/${STAT_MANUFACTURE}/`
export const STAT_MANUFACTURE_ITEM = `/${STAT_MANUFACTURE}/%d/`
export const STAT_MANUFACTURE_DELETE = `/${STAT_MANUFACTURE}/%d/`

export const STAT_CASHBOX_SUM = '/stats/cashboxes_sum/'
export const STAT_CASHBOX_ITEM_SUM = '/stats/cashboxes_sum/'
export const STAT_CASHBOX_SUM_LIST = '/stats/cashboxes_sum_list/'
export const STAT_CASHBOX = 'finance/cashbox'
export const STAT_CASHBOX_CREATE = `/${STAT_CASHBOX}/`
export const STAT_CASHBOX_LIST = `/${STAT_CASHBOX}/`
export const STAT_CASHBOX_ITEM = `/${STAT_CASHBOX}/%d/`
export const STAT_CASHBOX_DELETE = `/${STAT_CASHBOX}/%d/`
export const STAT_CASHBOX_DATA_ITEM = 'stats/cashbox/%d/'
export const STAT_CASHBOX_GET_DOCUMENT = '/stats/cashboxes_export/'

export const STAT_CLIENT_INCOME = 'stats/client_transactions'
export const STAT_CLIENT_INCOME_LIST = `/${STAT_CLIENT_INCOME}/`
export const STAT_CLIENT_INCOME_GET_DOCUMENT = '/sales/client_transaction/export/'

export const REMAINDER = 'stock'
export const REMAINDER_LIST = `/${REMAINDER}/all_balances/`
export const REMAINDER_ITEM = 'stock/stock/balances_by_product/%d/'
export const REMAINDER_TRANSFER = '/stock/stock_transfer/wb_create/'
export const REMAINDER_DISCARD = '/stock/writeoff/'
export const REMAINDER_RESERVED = '/stock/reserved_product/'

export const MANUFACTURE_PRODUCT = 'manufacture/create_ingredient'
export const MANUFACTURE_PRODUCT_CREATE = `/${MANUFACTURE_PRODUCT}/`
export const MANUFACTURE_PRODUCT_LIST = `/${MANUFACTURE_PRODUCT}/`
export const MANUFACTURE_PRODUCT_DELETE = 'manufacture/delete_ingredient/%d/'
export const MANUFACTURE_PRODUCT_CHANGE = '/main/product/%d/change_manufacture/'

export const SHIPMENT_PRODUCTS = 'manufacture/manufacture_return'
export const SHIPMENT_MATERIALS = 'manufacture/manufacture_writeoff'
export const SHIPMENT = 'staff/personal_rotation'
export const SHIPMENT_LIST = `/${SHIPMENT}/`
export const SHIPMENT_ITEM = `/${SHIPMENT}/%d/`
export const SHIPMENT_LOGS = '/manufacture/logs/'
export const SHIPMENT_PRODUCTS_LIST = `/${SHIPMENT_PRODUCTS}/review/`
export const SHIPMENT_MATERIALS_LIST = `/${SHIPMENT_MATERIALS}/review/`
export const SHIPMENT_ADD_PRODUCTS_LIST = `/${PRODUCT}/`
export const SHIPMENT_ADD_RAW_LIST = `${REMAINDER_LIST}`
export const SHIPMENT_ADD_PRODUCTS_CREATE = `/${SHIPMENT_PRODUCTS}/wb_create/`
export const SHIPMENT_ADD_RAW_CREATE = `/${SHIPMENT_MATERIALS}/wb_create/`
export const SHIPMENT_EDIT_PRODUCT_AMOUNT = `/${SHIPMENT_PRODUCTS}/%d/update_amount/`
export const SHIPMENT_EDIT_MATERIAL_AMOUNT = `/${SHIPMENT_MATERIALS}/%d/update_amount/`
export const SHIPMENT_DELETE_PRODUCT = `/${SHIPMENT_PRODUCTS}/%d/`
export const SHIPMENT_DELETE_MATERIAL = `/${SHIPMENT_MATERIALS}/%d/`
export const SHIPMENT_SEND_TO_STOCK = 'staff/personal_rotation/%d/give/'

export const MARKET_TYPE = 'market/market_type'
export const MARKET_TYPE_CREATE = `/${MARKET_TYPE}/`
export const MARKET_TYPE_LIST = `/${MARKET_TYPE}/`
export const MARKET_TYPE_ITEM = `/${MARKET_TYPE}/%d/`
export const MARKET_TYPE_DELETE = `/${MARKET_TYPE}/%d/`
export const MARKET_TYPE_HIERARCHY = `/${MARKET_TYPE}/hierarchy`

export const PRICE_LIST_SETTING = 'sales/price_list'
export const PRICE_LIST_SETTING_CREATE = `/${PRICE_LIST_SETTING}/`
export const PRICE_LIST_SETTING_LIST = `/${PRICE_LIST_SETTING}/`
export const PRICE_LIST_SETTING_ITEM = `/${PRICE_LIST_SETTING}/%d/`
export const PRICE_LIST_SETTING_DELETE = `/${PRICE_LIST_SETTING}/%d/`

export const ZONE = 'market/border'
export const ZONE_CREATE = `/${ZONE}/`
export const ZONE_UPDATE = `/${ZONE}/%d/`
export const ZONE_LIST = `/${ZONE}/`
export const ZONE_ITEM = `/${ZONE}/%d/`
export const ZONE_DELETE = `/${ZONE}/%d/`
export const ZONE_STAT = `/${ZONE}/statistics/`
export const ZONE_BIND_AGENT = `${ZONE}/%d/bind_agent/`
export const ZONE_UNBIND_AGENT = `${ZONE}/%d/unbind_agent/`

export const PRICE = 'stock/products_net_costs'
export const PRICE_CREATE = `/${PRICE}/`
export const PRICE_LIST = `/${PRICE}/`
export const PRICE_ITEM = 'main/product_mobile/%d/get_custom_price/'
export const PRICE_ITEM_SET_DEFAULT = 'stock/default_net_cost/'
export const PRICE_DELETE = `/${PRICE}/%d/`
export const PRICE_GET_DOCUMENT = '/sales/product_price_list/export/'

export const PRICE_LIST_ITEM = 'sales/price_list_item'
export const PRICE_LIST_ITEM_HISTORY = 'stock/supply_product_history/%d/'
export const PRICE_LIST_ITEM_EXPENSES = 'stock/supply_product_expenses/%d/'
export const PRICE_LIST_ITEM_LIST = `/${PRICE_LIST_ITEM}/`
export const PRICE_LIST_ITEM_ADD = `/${PRICE_LIST_ITEM}/add_items/`
export const SET_PRICE_LIST = 'sales/price_list_item/add_items_separately/'

export const TRACKING = 'market/agents_location/'
export const TRACKING_LIST = `${TRACKING}`
export const TRACKING_ITEM = `${TRACKING}/%d/`
export const MARKETS_LOCATION = `${SHOP}/locations/`
export const LOCATION_LIST = 'market/location/'

export const STAT_AGENT_LIST = 'stats/agents/statistics/all/'
export const STAT_AGENT_SUM = 'stats/agents/statistics/all/sum/'
export const STAT_AGENT_ITEM = 'sales/order/'
export const STAT_AGENT_GET_DOCUMENT = '/stats/agents/export/'

export const STAT_PROVIDER_LIST = 'stock/provider_balances/'
export const STAT_PROVIDER_ITEM = 'finance/provider_transactions/'
export const STAT_PROVIDER_SUM = 'stats/provider/balances/'
export const STAT_PROVIDER_DETAIL = 'stock/provider_balances/%d/detail/'
export const STAT_PROVIDER_GET_DOCUMENT = '/stock/provider_balances/export/'

export const STAT_PROVIDER_TRANSACTIONS_LIST = 'finance/provider_transactions/'
export const STAT_PROVIDER_TRANSACTIONS_SUM = 'stats/provider_transactions/'
export const STAT_PROVIDER_TRANSACTIONS_GET_DOCUMENT = '/finance/provider_transactions/export/'

export const STAT_MARKET = 'stats/markets'
export const STAT_MARKET_LIST = `${STAT_MARKET}/`
export const STAT_MARKET_SUM = `${STAT_MARKET}/sum/`
export const STAT_MARKET_TYPE = 'stats/market_types'
export const STAT_MARKET_TYPE_LIST = `${STAT_MARKET_TYPE}/`
export const STAT_MARKET_TYPE_GET_DOCUMENT = '/stats/market_types/export'
export const STAT_MARKET_ITEM = 'sales/order/'
export const STAT_MARKET_GET_DOCUMENT = '/stats/markets/export'
export const STAT_MARKET_DATA = '/stats/orders/'

export const STAT_FINANCE_LIST = 'finance/transaction/'
export const STAT_FINANCE_DATA = 'stats/transactions/'
export const STAT_FINANCE_GET_DOCUMENT = '/finance/transaction/export/'

export const STAT_INCOME_DATA = 'stats/transactions/'
export const STAT_INCOME_LIST = 'finance/transaction/'

export const STAT_OUTCOME_DATA = 'stats/transactions/'
export const STAT_OUTCOME_LIST = 'finance/transaction/'
export const STAT_OUTCOME_GET_DOCUMENT = '/stats/expenses/export/'

export const STAT_SALES_DATA = '/stats/orders/'
export const STAT_SALES_STATS = '/stats/orders/statistics'
export const STAT_SALES_GET_DOCUMENT = '/sales/order/export/'

export const STAT_PRODUCT_LIST = 'stats/products/'
export const STAT_PRODUCT_SUM_DATA = 'stats/products/total/'
export const STAT_PRODUCT_TYPE_LIST = 'stats/product_types/'
export const STAT_PRODUCT_TYPE_GET_DOCUMENT = '/stats/product_types/export/'
export const STAT_PRODUCT_GET_DOCUMENT = '/stats/products/export'

export const STAT_RETURN_LIST = '/stats/order_returns/'
export const STAT_RETURN_GET_DOCUMENT = '/sales/order_return/excel/'
export const STAT_RETURN_SUM_DETAILS = `${STAT_RETURN_LIST}statistics`

export const STAT_OUTCOME_CATEGORY_LIST = 'stats/expenses/'
export const STAT_OUTCOME_CATEGORY_DETAIL = 'stats/expenses/currencies/%d/'
export const STAT_OUTCOME_CATEGORY_ITEM = 'sales/order/'
export const STAT_OUTCOME_CATEGORY_GET_DOCUMENT = 'stats/agents/export/'
export const STAT_REMAINDER_LIST = `/${REMAINDER_STOCK}/all_balances/`
export const STAT_REMAINDER_ITEM = `/${REMAINDER}/balances_by_product/%d/`
export const STAT_REMAINDER_SUM = '/stats/stock/balances_sum/'
export const STAT_REMAINDER_GET_DOCUMENT = `/${REMAINDER_STOCK}/all_balances_export/`
export const STATISTICS_CASHBOX_LIST = `/${CASHBOX}/`
export const STATISTICS_CASHBOX_ITEM = `/${CASHBOX}/%d/`

export const STAT_EXPENDITURE_ON_STAFF_LIST = '/stats/staff_expenses/'
export const STAT_EXPENDITURE_ON_STAFF_DETAIL = '/stats/staff_expenses/currencies/%d/'
export const STAT_EXPENDITURE_ON_STAFF_ITEM = '/sales/order/'
export const STAT_EXPENDITURE_ON_STAFFGET_DOCUMENT = '/stats/staff_expenses/export'

export const CONTENT_TYPE_SEARCH = 'stock/barcode_history/types/'
export const STOCK_RECEIVE = 'stock/supply'
export const STOCK_HISTORY = 'stock/barcode_history'
export const STOCK_HISTORY_LIST = `/${STOCK_HISTORY}/`
export const STOCK_TRANSFER = 'stock/outcome_tasks'
export const STOCK_TRANSFER_LIST = `/${STOCK_TRANSFER}/`
export const STOCK_TRANSFER_ITEM = '/sales/order/%d/'
export const STOCK_TRANSFER_HISTORY_REPEAL_URL = '/sales/order/%d/cancel_accepts/'
export const STOCK_TRANSFER_HISTORY_RETURN_URL = '/sales/order_return/%d/cancel_accepts/'
export const STOCK_TRANSFER_ROUTE = '/sales/route/export/'
export const STOCK_TRANSFER_RELEASE = '/stock/delivery_products/export/'

export const STOCK_TRANSFER_ACCEPT = '/stock/accept_outcome/'
export const STOCK_RECEIVE_LIST = '/stock/income_tasks/'
export const STOCK_RECEIVE_ITEM = `/${STOCK_RECEIVE}/%d/`
export const STOCK_TRANSFER_DELIVERY_LIST = '/stock/delivery_mans/'
export const STOCK_TRANSFER_DELIVERY_ITEM = '/stock/delivery_products/'
export const STOCK_RECEIVE_TRANSFER_CHANGE_STATUS = 'stock/stock_transfer/%d/change_status/'
export const STOCK_RECEIVE_DELIVERY_RETURN = 'stock/delivery_return_status/'
export const STOCK_RECEIVE_ACCEPT_ORDER_RETURN = 'stock/accept_order_return/'
export const STOCK_RECEIVE_ORDER_ITEM = '/stock/stock_transfer/%d/'
export const STOCK_RECEIVE_HISTORY_SUPPLY_URL = 'stock/supply/%d/cancel_accepts/'

export const STOCK_RECEIVE_CREATE = '/stock/supply/%d/accept_products/'
export const STOCK_RECEIVE_UPDATE = '/stock/supply/%d/update_accept/'

export const STOCK_BARCODE_LIST = STOCK_RECEIVE_CREATE

export const CLIENT_BALANCE = 'sales/client_balances'
export const CLIENT_BALANCE_LIST = `/${CLIENT_BALANCE}/`
export const CLIENT_BALANCE_ITEM = 'sales/client_transaction/'
export const CLIENT_BALANCE_UPDATE = `/${CLIENT_BALANCE}/%d/`
export const CLIENT_BALANCE_SUPER_USER = '/sales/client_transaction/%d/'
export const CLIENT_BALANCE_GET_DOCUMENT = '/sales/client_balances/export/'
export const CLIENT_BALANCE_SUM = '/stats/client/balances/'
export const CLIENT_BALANCE_DETAIL = '/sales/client_balances/%d/detail/'

export const ACTIVITY = 'market/plan_tasks'
export const ACTIVITY_SUMMARY = `${ACTIVITY}/sum/`
export const ACTIVITY_ORDER_LIST = `${ACTIVITY}/`
export const ACTIVITY_ORDER_ITEM = `${ORDER}/%d`
export const ACTIVITY_VISIT_LIST = `/${ACTIVITY}/`
export const ACTIVITY_REPORT_LIST = `/${ACTIVITY}/`
export const ACTIVITY_REPORT_SHOW_IMAGE = 'main/file/%d/'
export const ACTIVITY_ORDER_RETURN_LIST = `/${ACTIVITY}/`
export const ACTIVITY_PAYMENT_LIST = `/${ACTIVITY}/`
export const ACTIVITY_DELIVERY_LIST = `/${ACTIVITY}/`

export const PLAN = 'market/plan'
export const PLAN_CREATE = `${PLAN}/`
export const PLAN_UPDATE = `${PLAN}/%d/`
export const PLAN_DELETE = `${PLAN}/%d/`
export const PLAN_AGENT_ITEM = `${STAT_AGENT_LIST}/%d/`
export const PLAN_MONTHLY = 'sales/monthly_plan'
export const PLAN_MONTHLY_CREATE = `${PLAN_MONTHLY}/`
export const PLAN_MONTHLY_LIST = `${PLAN_MONTHLY}/`
export const PLAN_MONTHLY_ITEM = `${PLAN_MONTHLY}/%d/`
export const PLAN_AGENT_MONTHLY = 'stats/agents/statistics/'
export const PLAN_AGENT_LIST = 'market/agents_plans/'
export const PLAN_AGENTS = 'market/agent_plans/'
export const PLAN_AGENTS_ITEM = 'market/agent_plans/%d/'
export const PLAN_AGENTS_ITEM_STATS = `${ACTIVITY}/sum/`
export const PLAN_COMBINATION = `${PLAN}/combination/`
export const PLAN_MONTHLY_PRODUCT_TYPE = 'sales/monthly_plan/crete_plan'
export const PLAN_MONTHLY_PRODUCT_TYPE_CREATE = `${PLAN_MONTHLY_PRODUCT_TYPE}/`

export const POSITION = 'main/position'
export const POSITION_COURSE_CREATE = 'finance/currency_rate/'
export const POSITION_CREATE = `/${POSITION}/`
export const POSITION_LIST = `/${POSITION}/`
export const POSITION_DELETE = `/${POSITION}/%d/`
export const POSITION_ITEM = `/${POSITION}/%d/`
export const POSITION_PRIMARY = 'currency_primary'
export const POSITION_RATE = `/${POSITION}/%d/permissions/`
export const POSITION_PERMISSION = 'main/group/gcrud'

export const STAT_PRODUCT_MOVE_LIST = 'stats/stock/products/'
export const STAT_PRODUCT_MOVE_SUM = 'stats/stock/sum/'
export const STAT_PRODUCT_MOVE_GET_DOCUMENT = '/stats/stock/products/export/'

export const STAT_DEBTORS_DATA = 'stats/debtors_stats/'
export const STAT_DEBTORS_LIST = 'stats/debtors/'
export const STAT_DEBTORS_ITEM = 'sales/order/'
export const STAT_DEBTORS_GET_DOCUMENT = '/stats/debtors/export'

export const STAT_REPORT_LIST = 'stats/general/'
export const STAT_REPORT_ITEM = 'sales/order/'
export const STAT_REPORT_GET_DOCUMENT = '/stats/general/excel/'

export const DIVISION = 'main/division'
export const DIVISION_LIST = `${DIVISION}/`
export const DIVISION_ITEM = `${DIVISION}/%d/`
export const DIVISION_CREATE = `/${DIVISION}/`
export const DIVISION_DELETE = `/${DIVISION}/%d`

export const RETURN = 'sales/order_return'
export const RETURN_PRINT = `${RETURN}/print/`
export const RETURN_LIST = `${RETURN}/`
export const RETURN_ITEM = `${RETURN}/%d/`
export const RETURN_UPDATE = `${RETURN}/%d/`
export const RETURN_DELETE = `${RETURN}/%d/`
export const RETURN_CANCEL = `${RETURN}/%d/cancel/`
export const RETURN_CREATE_PRODUCTS = 'sales/product_sales'
export const RETURN_CREATE_PRODUCTS_LIST = `${RETURN_CREATE_PRODUCTS}/`
export const RETURN_CREATE_PRODUCTS_ITEM = `${RETURN_CREATE_PRODUCTS}/%d/`
export const RETURN_PREVIEW = `${RETURN}/client_return_preview/`

export const JOIN_MARKETS = 'market/merge/'
export const JOIN_CLIENTS = 'sales/merge_clients/'

export const ACCESS = 'main/access'
export const ACCESS_LIST = `${ACCESS}/`
export const ACCESS_ITEM = `${ACCESS}/%d/`
export const ACCESS_UPDATE = `${ACCESS}/%d/`

export const TELEGRAM = 'telegram'
export const TELEGRAM_CREATE = `/${TELEGRAM}/market_worker/`
export const TELEGRAM_DELETE = `/${TELEGRAM}/market_worker/%d/`
export const TELEGRAM_LIST = `/${TELEGRAM}/market_worker/`
export const TELEGRAM_ITEM = `/${TELEGRAM}/market_worker/%d/`
export const TELEGRAM_LOGS = `/${TELEGRAM}/client_transaction_log/`

export const TELEGRAM_NEWS = 'telegram/news'
export const TELEGRAM_NEWS_CREATE = `/${TELEGRAM_NEWS}/`
export const TELEGRAM_NEWS_DELETE = `/${TELEGRAM_NEWS}/%d/`
export const TELEGRAM_NEWS_LIST = `/${TELEGRAM_NEWS}/`
export const TELEGRAM_NEWS_ITEM = `/${TELEGRAM_NEWS}/%d/`

export const SYSTEM_PAGES = 'main/system-pages'
export const SYSTEM_PAGES_CREATE = `/${SYSTEM_PAGES}/`
export const SYSTEM_PAGES_DELETE = `/${SYSTEM_PAGES}/%d/`
export const SYSTEM_PAGES_LIST = `/${SYSTEM_PAGES}/`
export const SYSTEM_PAGES_ITEM = `/${SYSTEM_PAGES}/%d/`

export const WIDGETS = 'main/widget'
export const WIDGETS_LIST = `/${WIDGETS}/`
export const WIDGETS_ACTIVATE = `/${WIDGETS}/%d/activate/`
export const WIDGETS_DEACTIVATE = `/${WIDGETS}/%d/deactivate/`

export const DASHBOARD_CHANGE_PASSWORD = `${USERS}/update_password/`

export const CELL_TYPE = 'stock/cell_type'
export const CELL_TYPE_CREATE = `/${CELL_TYPE}/`
export const CELL_TYPE_LIST = `/${CELL_TYPE}/`
export const CELL_TYPE_H_LIST = `/${CELL_TYPE}/hierarchy/`
export const CELL_TYPE_ITEM = `/${CELL_TYPE}/%d/`
export const CELL_TYPE_DELETE = `/${CELL_TYPE}/%d/`

export const CELL = 'stock/cell'
export const CELL_CREATE = `/${CELL}/`
export const CELL_LIST = `/${CELL}/`
export const CELL_ITEM = `/${CELL}/%d/`
export const CELL_DELETE = `/${CELL}/%d/`

export const HR_APPLICATION = 'hr/application'
export const HR_APPLICATION_CREATE = `/${HR_APPLICATION}/`
export const HR_APPLICATION_DELETE = `/${HR_APPLICATION}/%d/`
export const HR_APPLICATION_LIST = `/${HR_APPLICATION}/`
export const HR_APPLICATION_ITEM = `/${HR_APPLICATION}/%d/`
export const HR_APPLICATION_ITEM_STAT = `/${HR_APPLICATION}/%d/statistics/`

export const HR_POSITION = 'hr/position'
export const HR_POSITION_LIST = `/${HR_POSITION}/`
export const HR_POSITION_ITEM = `/${HR_POSITION}/%d/`

export const HR_SKILLS = 'hr/skill'
export const HR_SKILLS_LIST = `/${HR_SKILLS}/`

export const HR_PRIVILEGE = 'hr/privilege'
export const HR_PRIVILEGE_LIST = `/${HR_PRIVILEGE}`

export const HR_LANGUAGE = 'hr/language'
export const HR_LANGUAGE_LIST = `/${HR_LANGUAGE}/`
export const HR_LANGUAGE_ITEM = `/${HR_LANGUAGE}/%d/`

export const HR_RESUME = 'hr/resume'
export const HR_RESUME_CREATE = `/${HR_RESUME}/`
export const HR_RESUME_DELETE = `/${HR_RESUME}/%d/`
export const HR_RESUME_LIST = `/${HR_RESUME}/`
export const HR_RESUME_ITEM = `/${HR_RESUME}/%d/`
export const HR_RESUME_ITEM_LOGS = `/${HR_RESUME}/%d/logs/`

export const HR_COUNTRY = 'hr/country'
export const HR_COUNTRY_LIST = `/${HR_COUNTRY}/`
export const HR_COUNTRY_ITEM = `/${HR_COUNTRY}/%d/`

export const HR_CITY = 'hr/city'
export const HR_CITY_LIST = `/${HR_CITY}/`
export const HR_CITY_ITEM = `/${HR_CITY}/%d/`

export const HR_RESUME_CHANGE_STATUS = 'hr/application_resume'
export const HR_UPDATE_REPORT_LIST = `/${HR_RESUME_CHANGE_STATUS}/`
export const HR_LONG_LIST_CREATE = `/${HR_RESUME_CHANGE_STATUS}/moving/`
export const HR_REPORT_LIST_CREATE = `/${HR_RESUME_CHANGE_STATUS}/moving/`
export const HR_SHORT_LIST_CREATE = `/${HR_RESUME_CHANGE_STATUS}/moving/`
export const HR_RESUME_MOVE = `/${HR_RESUME_CHANGE_STATUS}/`
export const HR_RESUME_REMOVE = `/${HR_RESUME_CHANGE_STATUS}/%d/`
export const HR_FORM_SHORT_LIST = `/${HR_APPLICATION}/%d/close/`

export const HR_RESUME_COMMENT = 'hr/comment'
export const HR_RESUME_COMMENT_CREATE = `/${HR_RESUME_COMMENT}/`
export const HR_RESUME_COMMENT_LIST = `/${HR_RESUME_COMMENT}/`
export const HR_RESUME_NOTE_CREATE = HR_RESUME_MOVE

export const HR_APPLICATION_QUESTIONS = 'hr/application_question'
export const HR_APPLICATION_QUESTIONS_CREATE = `/${HR_APPLICATION_QUESTIONS}/multi_create/`
export const HR_APPLICATION_QUESTIONS_LIST = `/${HR_APPLICATION_QUESTIONS}/`

export const HR_RESUME_ANSWERS = 'hr/application_answer'
export const HR_RESUME_ANSWERS_CREATE = `/${HR_RESUME_ANSWERS}/multi_answer/`
export const HR_RESUME_ANSWERS_LIST = `/${HR_RESUME_ANSWERS}/`

export const HR_APP_LOGS = 'hr/application_status_log'
export const HR_APP_LOGS_LIST = `/${HR_APP_LOGS}`

export const HR_FEEDBACK = 'hr/feedback'
export const HR_FEEDBACK_CREATE = `/${HR_FEEDBACK}/`

export const HR_CALENDAR_LIST = `/${HR_APPLICATION}/calendar`

export const HR_ORDER_SERVICE = `${ORDER}/service`
export const HR_ORDER_SERVICE_LIST = `/${HR_ORDER_SERVICE}/`

