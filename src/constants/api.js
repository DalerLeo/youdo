export const API_HOST = process.env.API_HOST
export const API_ROOT = 'api'
export const API_VERSION = 'v1'
export const API_URL = `http://${API_HOST}/${API_ROOT}/${API_VERSION}`

export const USER = 'user'
export const SIGN_IN = `/${USER}/auth/`
export const SIGN_OUT = `/${USER}/unauth/`

export const CATEGORY = 'dist/category'
export const CATEGORY_CREATE = `/${CATEGORY}/`
export const CATEGORY_LIST = `/${CATEGORY}/`
export const CATEGORY_ITEM = `/${CATEGORY}/%d/`
export const CATEGORY_DELETE = `/${CATEGORY}/%d/`

export const EQUIPMENT = 'equipment'
export const EQUIPMENT_CREATE = `/${EQUIPMENT}/`
export const EQUIPMENT_LIST = `/${EQUIPMENT}/`
export const EQUIPMENT_ITEM = `/${EQUIPMENT}/%d/`
export const EQUIPMENT_DELETE = `/${EQUIPMENT}/%d/`

export const STOCK = 'dist/stock'
export const STOCK_CREATE = `/${STOCK}/`
export const STOCK_LIST = `/${STOCK}/`
export const STOCK_ITEM = `/${STOCK}/%d/`
export const STOCK_DELETE = `/${STOCK}/%d/`

export const MEASUREMENT = 'dist/measurement'
export const MEASUREMENT_CREATE = `/${MEASUREMENT}/`
export const MEASUREMENT_LIST = `/${MEASUREMENT}/`
export const MEASUREMENT_ITEM = `/${MEASUREMENT}/%d/`
export const MEASUREMENT_DELETE = `/${MEASUREMENT}/%d/`

export const EXPENSIVE_CATEGORY = 'expanse_categories/expanse_category'
export const EXPENSIVE_CATEGORY_CREATE = `/${EXPENSIVE_CATEGORY}/`
export const EXPENSIVE_CATEGORY_LIST = `/${EXPENSIVE_CATEGORY}/`
export const EXPENSIVE_CATEGORY_ITEM = `/${EXPENSIVE_CATEGORY}/%d/`
export const EXPENSIVE_CATEGORY_DELETE = `/${EXPENSIVE_CATEGORY}/%d/`

export const PROVIDER = 'dist/provider'
export const PROVIDER_CREATE = `/${PROVIDER}/`
export const PROVIDER_DELETE = `/${PROVIDER}/`
export const PROVIDER_LIST = `/${PROVIDER}/`
export const PROVIDER_ITEM = `/${PROVIDER}/%d/`

export const CLIENT = 'client/client'
export const CLIENT_CREATE = `/${CLIENT}/`
export const CLIENT_DELETE = `/${CLIENT}/`
export const CLIENT_LIST = `/${CLIENT}/`
export const CLIENT_ITEM = `/${CLIENT}/%d/`

export const CURRENCY = 'currency/currencies'
export const CURRENCY_CREATE = `/${CURRENCY}/`
export const CURRENCY_LIST = `/${CURRENCY}/`
export const CURRENCY_ITEM = `/${CURRENCY}/%d/`
export const CURRENCY_DELETE = `/${CURRENCY}/%d/`
export const CURRENCY_PRIMARY = 'currency_primary'
export const CURRENCY_PRIMARY_CREATE = `/${CURRENCY_PRIMARY}/`
export const SET_CURRENCY = 'currencies/currency_rate'
export const SET_CURRENCY_CREATE = `/${SET_CURRENCY}/`

export const SHOP = 'dist/market'
export const SHOP_CREATE = `/${SHOP}/`
export const SHOP_LIST = `/${SHOP}/`
export const SHOP_ITEM = `/${SHOP}/%d/`
export const SHOP_DELETE = `/${SHOP}/%d/`

export const USERS = 'user/crud'
export const USERS_CREATE = `/${USERS}/`
export const USERS_LIST = `/${USERS}/`
export const USERS_ITEM = `/${USERS}/%d/`
export const USERS_DELETE = `/${USERS}/%d/`

export const CASHBOX = 'cashbox'
export const CASHBOX_CREATE = `/${CASHBOX}/`
export const CASHBOX_LIST = `/${CASHBOX}/`
export const CASHBOX_ITEM = `/${CASHBOX}/%d/`
export const CASHBOX_DELETE = `/${CASHBOX}/%d/`

export const TRANSACTION = 'transactions/transaction'
export const TRANSACTION_CREATE = `/${TRANSACTION}/`
export const TRANSACTION_INCOME = `/${TRANSACTION}/`
export const TRANSACTION_SEND = `/${TRANSACTION}/`
export const TRANSACTION_LIST = `/${TRANSACTION}/`
export const TRANSACTION_ITEM = `/${TRANSACTION}/%d/`
export const TRANSACTION_DELETE = `/${TRANSACTION}/%d/`

export const SUPPLY = 'dist/supply'
export const SUPPLY_CREATE = `/${SUPPLY}/`
export const SUPPLY_LIST = `/${SUPPLY}/`
export const SUPPLY_ITEM = `/${SUPPLY}/%d/`
export const SUPPLY_DELETE = `/${SUPPLY}/%d/`

export const ORDER = 'order'
export const ORDER_CREATE = `/${ORDER}/`
export const ORDER_RETURN = `/${ORDER}/`
export const ORDER_LIST = `/${ORDER}/`
export const ORDER_ITEM = `/${ORDER}/%d/`
export const ORDER_DELETE = `/${ORDER}/%d/`

export const SUPPLY_EXPENSE = 'supply_expanse'
export const SUPPLY_EXPENSE_CREATE = `/${SUPPLY_EXPENSE}/`
export const SUPPLY_EXPENSE_LIST = `/${SUPPLY_EXPENSE}/`
export const SUPPLY_EXPENSE_ITEM = `/${SUPPLY_EXPENSE}/%d/`
export const SUPPLY_EXPENSE_DELETE = `/${SUPPLY_EXPENSE}/%d/`

export const PRODUCT = 'dist/product'
export const PRODUCT_CREATE = `/${PRODUCT}/`
export const PRODUCT_LIST = `/${PRODUCT}/`
export const PRODUCT_ITEM = `/${PRODUCT}/%d/`
export const PRODUCT_DELETE = `/${PRODUCT}/%d/`

export const PRODUCT_PRICE = 'dist/product'
export const PRODUCT_PRICE_CREATE = `/${PRODUCT_PRICE}/`
export const PRODUCT_PRICE_LIST = `/${PRODUCT_PRICE}/`
export const PRODUCT_PRICE_ITEM = `/${PRODUCT_PRICE}/%d/`
export const PRODUCT_PRICE_SET = `/${PRODUCT_PRICE}/%d/set_price/`
export const PRODUCT_PRICE_DELETE = `/${PRODUCT_PRICE}/%d/`

export const PRODUCT_TYPE = 'dist/product_type'
export const PRODUCT_TYPE_CREATE = `/${PRODUCT_TYPE}/`
export const PRODUCT_TYPE_LIST = `/${PRODUCT_TYPE}/`
export const PRODUCT_TYPE_ITEM = `/${PRODUCT_TYPE}/%d/`

export const BRAND = 'dist/brand'
export const BRAND_CREATE = `/${BRAND}/`
export const BRAND_LIST = `/${BRAND}/`
export const BRAND_ITEM = `/${BRAND}/%d/`
export const BRAND_DELETE = `/${BRAND}/%d/`

export const PAYMNET_TYPE = 'dist/payment'
export const PAYMNET_TYPE_CREATE = `/${PAYMNET_TYPE}/add/`
export const PAYMNET_TYPE_LIST = `/${PAYMNET_TYPE}/`
export const PAYMNET_TYPE_ITEM = `/${PAYMNET_TYPE}/%d/`

export const FILE_UPLOAD = '/file/file/'

export const MANUFACTURE = 'dist/manufacturing'
export const MANUFACTURE_CREATE = `/${MANUFACTURE}/`
export const MANUFACTURE_LIST = `/${MANUFACTURE}/`
export const MANUFACTURE_ITEM = `/${MANUFACTURE}/%d/`

export const SHIFT = 'dist/shift'
export const SHIFT_CREATE = `/${SHIFT}/`
export const SHIFT_LIST = `/${SHIFT}/`
export const SHIFT_ITEM = `/${SHIFT}/%d/`
export const SHIFT_DELETE = `/${SHIFT}/%d/`

export const PENDING_EXPENSES = 'supply_expanse'
export const PENDING_EXPENSES_CREATE = `/${PENDING_EXPENSES}/`
export const PENDING_EXPENSES_LIST = `/${PENDING_EXPENSES}/`
export const PENDING_EXPENSES_ITEM = `/${PENDING_EXPENSES}/%d/`

export const STATSTOCK = 'dist/stock'
export const STATSTOCK_CREATE = `/${STATSTOCK}/`
export const STATSTOCK_LIST = `/${STATSTOCK}/`
export const STATSTOCK_ITEM = `/${STATSTOCK}/%d/`
export const STATSTOCK_DELETE = `/${STATSTOCK}/%d/`

export const STATDEBTORS = 'dist/stock'
export const STATDEBTORS_CREATE = `/${STATDEBTORS}/`
export const STATDEBTORS_LIST = `/${STATDEBTORS}/`
export const STATDEBTORS_ITEM = `/${STATDEBTORS}/%d/`
export const STATDEBTORS_DELETE = `/${STATDEBTORS}/%d/`

export const PENDING_PAYMENTS = 'order'
export const PENDING_PAYMENTS_CREATE = `/${PENDING_PAYMENTS}/`
export const PENDING_PAYMENTS_LIST = `/${PENDING_PAYMENTS}/`
export const PENDING_PAYMENTS_ITEM = `/${PENDING_PAYMENTS}/%d/`
