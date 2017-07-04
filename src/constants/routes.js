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

export const CLIENT_TRANSACTION = 'clientTransaction'
export const CLIENT_TRANSACTION_LIST_URL = `/${CLIENT_TRANSACTION}`
export const CLIENT_TRANSACTION_ITEM_URL = `${CLIENT_TRANSACTION_LIST_URL}/:clientTransactionId`
export const CLIENT_TRANSACTION_ITEM_PATH = `/${CLIENT_TRANSACTION}/%d`

export const SUPPLY = 'supply'
export const SUPPLY_LIST_URL = `/${SUPPLY}`
export const SUPPLY_ITEM_URL = `${SUPPLY_LIST_URL}/:supplyId`
export const SUPPLY_ITEM_PATH = `/${SUPPLY}/%d`

export const ORDER = 'order'
export const ORDER_LIST_URL = `/${ORDER}`
export const ORDER_ITEM_URL = `${ORDER_LIST_URL}/:orderId`
export const ORDER_ITEM_PATH = `/${ORDER}/%d`

export const PRODUCT = 'product'
export const PRODUCT_LIST_URL = `/${PRODUCT}`
export const PRODUCT_ITEM_URL = `${PRODUCT_LIST_URL}/:productId`
export const PRODUCT_ITEM_PATH = `/${PRODUCT}/%d`

export const PRODUCT_TYPE = 'productType'
export const PRODUCT_TYPE_LIST_URL = `/${PRODUCT_TYPE}`
export const PRODUCT_TYPE_ITEM_URL = `${PRODUCT_TYPE_LIST_URL}/:productTypeId`
export const PRODUCT_TYPE_ITEM_PATH = `/${PRODUCT_TYPE}/%d`

export const PRODUCT_PRICE = 'productPrice'
export const PRODUCT_PRICE_LIST_URL = `/${PRODUCT_PRICE}`
export const PRODUCT_PRICE_ITEM_URL = `${PRODUCT_PRICE_LIST_URL}/:productPriceId`
export const PRODUCT_PRICE_ITEM_PATH = `/${PRODUCT_PRICE}/%d`

export const CATEGORY = 'category'
export const CATEGORY_LIST_URL = `/${CATEGORY}`
export const CATEGORY_ITEM_URL = `${CATEGORY_LIST_URL}/:categoryId`
export const CATEGORY_ITEM_PATH = `/${CATEGORY}/%d`

export const EQUIPMENT = 'equipment'
export const EQUIPMENT_LIST_URL = `/${EQUIPMENT}`
export const EQUIPMENT_ITEM_URL = `${EQUIPMENT_LIST_URL}/:equipmentId`
export const EQUIPMENT_ITEM_PATH = `/${EQUIPMENT}/%d`

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
export const MANUFACTURE_CUSTOM_URL = `/${MANUFACTURE}/3`
export const MANUFACTURE_ITEM_URL = `${MANUFACTURE_LIST_URL}/:manufactureId`
export const MANUFACTURE_ITEM_PATH = `${MANUFACTURE}/%d`

export const SHIFT = 'shift'
export const SHIFT_LIST_URL = `/${SHIFT}`
export const SHIFT_ITEM_URL = `${SHIFT_LIST_URL}/:shiftId`
export const SHIFT_ITEM_PATH = `${SHIFT}/%d`

export const PENDING_EXPENSES = 'pendingExpenses'
export const PENDING_EXPENSES_LIST_URL = `/${PENDING_EXPENSES}`
export const PENDING_EXPENSES_ITEM_URL = `${PENDING_EXPENSES_LIST_URL}/:pendingExpensesId`
export const PENDING_EXPENSES_ITEM_PATH = `${PENDING_EXPENSES}/%d`

export const STATSTOCK = 'stockStat'
export const STATSTOCK_LIST_URL = `/${STATSTOCK}`
export const STATSTOCK_ITEM_URL = `${STATSTOCK_LIST_URL}/:statStockId`
export const STATSTOCK_ITEM_PATH = `/${STATSTOCK}/%d`

export const REMAINDER_STOCK = 'stockRemainder'
export const REMAINDER_STOCK_LIST_URL = `/${REMAINDER_STOCK}/%d/balances/`
export const REMAINDER_STOCK_ITEM_URL = `${REMAINDER_STOCK_LIST_URL}/%d/balances/:remainderStockId`
export const REMAINDER_STOCK_ITEM_PATH = `/${REMAINDER_STOCK}/%d/balances/%d`

export const STATDEBTORS = 'statDebtors'
export const STATDEBTORS_LIST_URL = `/${STATDEBTORS}`
export const STATDEBTORS_ITEM_URL = `${STATDEBTORS_LIST_URL}/:statDebtorsId`
export const STATDEBTORS_ITEM_PATH = `/${STATDEBTORS}/%d`

export const STAT_MANUFACTURE = 'statManufacture'
export const STAT_MANUFACTURE_LIST_URL = `/${STAT_MANUFACTURE}`
export const STAT_MANUFACTURE_ITEM_URL = `${STAT_MANUFACTURE_LIST_URL}/:statManufactureId`
export const STAT_MANUFACTURE_ITEM_PATH = `/${STAT_MANUFACTURE}/%d`

export const STAT_CASHBOX = 'statCashbox'
export const STAT_CASHBOX_LIST_URL = `/${STAT_CASHBOX}`
export const STAT_CASHBOX_ITEM_URL = `${STAT_CASHBOX_LIST_URL}/:statCashboxId`
export const STAT_CASHBOX_ITEM_PATH = `/${STAT_CASHBOX}/%d`

export const PENDING_PAYMENTS = 'pendingPayments'
export const PENDING_PAYMENTS_LIST_URL = `/${PENDING_PAYMENTS}`
export const PENDING_PAYMENTS_ITEM_URL = `${PENDING_PAYMENTS_LIST_URL}/:pendingPaymentsId`
export const PENDING_PAYMENTS_ITEM_PATH = `${PENDING_PAYMENTS}/%d`

export const ZONES = 'zones'
export const ZONES_LIST_URL = `/${ZONES}`

export const TRACKING = 'tracking'
export const TRACKING_LIST_URL = `/${TRACKING}`

export const MARKET_TYPE = 'marketType'
export const MARKET_TYPE_LIST_URL = `/${MARKET_TYPE}`
export const MARKET_TYPE_ITEM_URL = `${MARKET_TYPE_LIST_URL}/:marketTypeId`
export const MARKET_TYPE_ITEM_PATH = `/${MARKET_TYPE}/%d`

export const PRICE = 'price'
export const PRICE_LIST_URL = `/${PRICE}`
export const PRICE_ITEM_URL = `${PRICE_LIST_URL}/:priceId`
export const PRICE_ITEM_PATH = `/${PRICE}/%d`

export const REMAINDER = 'remainder'
export const REMAINDER_LIST_URL = `/${REMAINDER}`
export const REMAINDER_ITEM_URL = `${REMAINDER_LIST_URL}/:remainderId`
export const REMAINDER_ITEM_PATH = `/${REMAINDER}/%d`

export const STATISTICS = 'statistics'
export const STATISTICS_LIST_URL = `/${STATISTICS}`
export const STATISTICS_ITEM_URL = `${STATISTICS_LIST_URL}/:statisticsId`
export const STATISTICS_ITEM_PATH = `/${STATISTICS}/%d`
