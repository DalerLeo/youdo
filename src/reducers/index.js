import {reducer as formReducer} from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'
import {routerReducer} from 'react-router-redux'
import {combineReducers} from 'redux'
import createThunkReducer from '../helpers/createThunkReducer'
import createStandardReducer from '../helpers/createStandardReducer'
import * as actionTypes from '../constants/actionTypes'
import snackbarReducer from './snackbarReducer'
import errorReducer from './errorReducer'

const rootReducer = combineReducers({
    signIn: createThunkReducer(actionTypes.SIGN_IN),
    config: combineReducers({
        primaryCurrency: createThunkReducer(actionTypes.CONFIG)
    }),
    shop: combineReducers({
        create: createThunkReducer(actionTypes.SHOP_CREATE),
        list: createThunkReducer(actionTypes.SHOP_LIST),
        item: createThunkReducer(actionTypes.SHOP_ITEM),
        update: createThunkReducer(actionTypes.SHOP_UPDATE),
        image: createThunkReducer(actionTypes.SHOP_ITEM_ADD_IMAGE),
        gallery: createThunkReducer(actionTypes.SHOP_ITEM_SHOW_IMAGE)
    }),
    cashbox: combineReducers({
        create: createThunkReducer(actionTypes.CASHBOX_CREATE),
        list: createThunkReducer(actionTypes.CASHBOX_LIST),
        item: createThunkReducer(actionTypes.CASHBOX_ITEM),
        update: createThunkReducer(actionTypes.CASHBOX_UPDATE)
    }),
    shipment: combineReducers({
        list: createThunkReducer(actionTypes.SHIPMENT_LIST),
        item: createThunkReducer(actionTypes.SHIPMENT_ITEM)
    }),
    transaction: combineReducers({
        create: createThunkReducer(actionTypes.TRANSACTION_CREATE),
        list: createThunkReducer(actionTypes.TRANSACTION_LIST),
        item: createThunkReducer(actionTypes.TRANSACTION_ITEM),
        update: createThunkReducer(actionTypes.TRANSACTION_UPDATE)
    }),
    clientTransaction: combineReducers({
        create: createThunkReducer(actionTypes.CLIENT_TRANSACTION_CREATE),
        item: createThunkReducer(actionTypes.CLIENT_TRANSACTION_ITEM),
        update: createThunkReducer(actionTypes.CLIENT_TRANSACTION_UPDATE),
        list: createThunkReducer(actionTypes.CLIENT_TRANSACTION_LIST)
    }),
    supply: combineReducers({
        create: createThunkReducer(actionTypes.SUPPLY_CREATE),
        list: createThunkReducer(actionTypes.SUPPLY_LIST),
        item: createThunkReducer(actionTypes.SUPPLY_ITEM),
        update: createThunkReducer(actionTypes.SUPPLY_UPDATE),
        defect: createThunkReducer(actionTypes.SUPPLY_DEFECT)
    }),
    prices: combineReducers({
        create: createThunkReducer(actionTypes.PRICES_CREATE),
        list: createThunkReducer(actionTypes.PRICES_LIST),
        item: createThunkReducer(actionTypes.PRICES_ITEM),
        update: createThunkReducer(actionTypes.PRICES_UPDATE)
    }),
    supplyExpense: combineReducers({
        create: createThunkReducer(actionTypes.SUPPLY_EXPENSE_CREATE),
        list: createThunkReducer(actionTypes.SUPPLY_EXPENSE_LIST),
        item: createThunkReducer(actionTypes.SUPPLY_EXPENSE_ITEM),
        update: createThunkReducer(actionTypes.SUPPLY_EXPENSE_UPDATE)
    }),
    order: combineReducers({
        create: createThunkReducer(actionTypes.ORDER_CREATE),
        list: createThunkReducer(actionTypes.ORDER_LIST),
        payment: createThunkReducer(actionTypes.ORDER_TRANSACTION),
        item: createThunkReducer(actionTypes.ORDER_ITEM),
        document: createThunkReducer(actionTypes.GET_DOCUMENT),
        return: createThunkReducer(actionTypes.ORDER_RETURN),
        returnList: createThunkReducer(actionTypes.ORDER_RETURN_LIST),
        update: createThunkReducer(actionTypes.ORDER_UPDATE)
    }),
    product: combineReducers({
        create: createThunkReducer(actionTypes.PRODUCT_CREATE),
        list: createThunkReducer(actionTypes.PRODUCT_LIST),
        update: createThunkReducer(actionTypes.PRODUCT_UPDATE),
        item: createThunkReducer(actionTypes.PRODUCT_ITEM),
        measurement: createStandardReducer(actionTypes.PRODUCT_MEASUREMENT),
        extra: createStandardReducer(actionTypes.PRODUCT_EXTRA)
    }),
    ingredient: combineReducers({
        create: createThunkReducer(actionTypes.INGREDIENT_CREATE),
        list: createThunkReducer(actionTypes.INGREDIENT_LIST),
        update: createThunkReducer(actionTypes.INGREDIENT_UPDATE),
        item: createThunkReducer(actionTypes.INGREDIENT_ITEM)
    }),
    productType: combineReducers({
        create: createThunkReducer(actionTypes.PRODUCT_TYPE_CREATE),
        list: createThunkReducer(actionTypes.PRODUCT_TYPE_LIST),
        update: createThunkReducer(actionTypes.PRODUCT_TYPE_UPDATE),
        item: createThunkReducer(actionTypes.PRODUCT_TYPE_ITEM)
    }),
    productPrice: combineReducers({
        create: createThunkReducer(actionTypes.PRODUCT_PRICE_CREATE),
        list: createThunkReducer(actionTypes.PRODUCT_PRICE_LIST),
        update: createThunkReducer(actionTypes.PRODUCT_PRICE_UPDATE),
        item: createThunkReducer(actionTypes.PRODUCT_PRICE_ITEM)
    }),
    category: combineReducers({
        create: createThunkReducer(actionTypes.CATEGORY_CREATE),
        list: createThunkReducer(actionTypes.CATEGORY_LIST),
        update: createThunkReducer(actionTypes.CATEGORY_UPDATE),
        item: createThunkReducer(actionTypes.CATEGORY_ITEM)
    }),
    equipment: combineReducers({
        create: createThunkReducer(actionTypes.EQUIPMENT_CREATE),
        list: createThunkReducer(actionTypes.EQUIPMENT_LIST),
        update: createThunkReducer(actionTypes.EQUIPMENT_UPDATE),
        item: createThunkReducer(actionTypes.EQUIPMENT_ITEM)
    }),
    stock: combineReducers({
        create: createThunkReducer(actionTypes.STOCK_CREATE),
        list: createThunkReducer(actionTypes.STOCK_LIST),
        update: createThunkReducer(actionTypes.STOCK_UPDATE),
        item: createThunkReducer(actionTypes.STOCK_ITEM)
    }),
    currency: combineReducers({
        create: createThunkReducer(actionTypes.CURRENCY_CREATE),
        list: createThunkReducer(actionTypes.CURRENCY_LIST),
        update: createThunkReducer(actionTypes.CURRENCY_UPDATE),
        item: createThunkReducer(actionTypes.CURRENCY_ITEM),
        primary: createThunkReducer(actionTypes.CURRENCY_PRIMARY),
        primaryUpdate: createThunkReducer(actionTypes.CURRENCY_PRIMARY_UPDATE)
    }),
    measurement: combineReducers({
        create: createThunkReducer(actionTypes.MEASUREMENT_CREATE),
        list: createThunkReducer(actionTypes.MEASUREMENT_LIST),
        update: createThunkReducer(actionTypes.MEASUREMENT_UPDATE),
        item: createThunkReducer(actionTypes.MEASUREMENT_ITEM)
    }),
    expensiveCategory: combineReducers({
        create: createThunkReducer(actionTypes.EXPENSIVE_CATEGORY_CREATE),
        list: createThunkReducer(actionTypes.EXPENSIVE_CATEGORY_LIST),
        update: createThunkReducer(actionTypes.EXPENSIVE_CATEGORY_UPDATE),
        item: createThunkReducer(actionTypes.EXPENSIVE_CATEGORY_ITEM)
    }),
    users: combineReducers({
        create: createThunkReducer(actionTypes.USERS_CREATE),
        list: createThunkReducer(actionTypes.USERS_LIST),
        update: createThunkReducer(actionTypes.USERS_UPDATE),
        item: createThunkReducer(actionTypes.USERS_ITEM)
    }),
    provider: combineReducers({
        create: createThunkReducer(actionTypes.PROVIDER_CREATE),
        list: createThunkReducer(actionTypes.PROVIDER_LIST),
        update: createThunkReducer(actionTypes.PROVIDER_UPDATE),
        item: createThunkReducer(actionTypes.PROVIDER_ITEM),
        contacts: createStandardReducer(actionTypes.PROVIDER_CONTACTS)
    }),
    client: combineReducers({
        create: createThunkReducer(actionTypes.CLIENT_CREATE),
        list: createThunkReducer(actionTypes.CLIENT_LIST),
        update: createThunkReducer(actionTypes.CLIENT_UPDATE),
        item: createThunkReducer(actionTypes.CLIENT_ITEM),
        contacts: createStandardReducer(actionTypes.CLIENT_CONTACTS)
    }),
    brand: combineReducers({
        create: createThunkReducer(actionTypes.BRAND_CREATE),
        list: createThunkReducer(actionTypes.BRAND_LIST),
        update: createThunkReducer(actionTypes.BRAND_UPDATE),
        item: createThunkReducer(actionTypes.BRAND_ITEM)
    }),
    manufacture: combineReducers({
        create: createThunkReducer(actionTypes.MANUFACTURE_CREATE),
        list: createThunkReducer(actionTypes.MANUFACTURE_LIST),
        update: createThunkReducer(actionTypes.MANUFACTURE_UPDATE),
        item: createThunkReducer(actionTypes.MANUFACTURE_ITEM)
    }),
    shift: combineReducers({
        create: createThunkReducer(actionTypes.SHIFT_CREATE),
        list: createThunkReducer(actionTypes.SHIFT_LIST),
        update: createThunkReducer(actionTypes.SHIFT_UPDATE),
        item: createThunkReducer(actionTypes.SHIFT_ITEM)
    }),
    userShift: combineReducers({
        create: createThunkReducer(actionTypes.USER_SHIFT_CREATE),
        list: createThunkReducer(actionTypes.USER_SHIFT_LIST),
        update: createThunkReducer(actionTypes.USER_SHIFT_UPDATE),
        item: createThunkReducer(actionTypes.USER_SHIFT_ITEM)
    }),
    notifications: combineReducers({
        list: createThunkReducer(actionTypes.NOTIFICATIONS_LIST),
        item: createThunkReducer(actionTypes.NOTIFICATIONS_ITEM),
        timeInterval: createThunkReducer((actionTypes.NOTIFICATIONS_TIME_INTERVAL))
    }),
    pendingExpenses: combineReducers({
        create: createThunkReducer(actionTypes.PENDING_EXPENSES_CREATE),
        list: createThunkReducer(actionTypes.PENDING_EXPENSES_LIST),
        update: createThunkReducer(actionTypes.PENDING_EXPENSES_UPDATE),
        item: createThunkReducer(actionTypes.PENDING_EXPENSES_ITEM)
    }),
    statStock: combineReducers({
        create: createThunkReducer(actionTypes.STATSTOCK_CREATE),
        list: createThunkReducer(actionTypes.STATSTOCK_LIST),
        update: createThunkReducer(actionTypes.STATSTOCK_UPDATE),
        item: createThunkReducer(actionTypes.STATSTOCK_ITEM),
        statStockData: createThunkReducer(actionTypes.STATSTOCK_DATA),
        document: createThunkReducer(actionTypes.STATSTOCK_GET_DOCUMENT)
    }),
    remainderStock: combineReducers({
        create: createThunkReducer(actionTypes.REMAINDER_STOCK_CREATE),
        list: createThunkReducer(actionTypes.REMAINDER_STOCK_LIST),
        update: createThunkReducer(actionTypes.REMAINDER_STOCK_UPDATE),
        item: createThunkReducer(actionTypes.REMAINDER_STOCK_ITEM)
    }),
    transactionStock: combineReducers({
        create: createThunkReducer(actionTypes.TRANSACTION_STOCK_CREATE),
        list: createThunkReducer(actionTypes.TRANSACTION_STOCK_LIST),
        update: createThunkReducer(actionTypes.TRANSACTION_STOCK_UPDATE)
    }),
    statDebtors: combineReducers({
        create: createThunkReducer(actionTypes.STATDEBTORS_CREATE),
        list: createThunkReducer(actionTypes.STATDEBTORS_LIST),
        update: createThunkReducer(actionTypes.STATDEBTORS_UPDATE),
        item: createThunkReducer(actionTypes.STATDEBTORS_ITEM),
        sum: createThunkReducer(actionTypes.STATDEBTORS_SUM),
        orderList: createThunkReducer(actionTypes.STATDEBTORS_ORDER_LIST),
        document: createThunkReducer(actionTypes.STATDEBTORS_GET_DOCUMENT)
    }),
    statManufacture: combineReducers({
        create: createThunkReducer(actionTypes.STAT_MANUFACTURE_CREATE),
        list: createThunkReducer(actionTypes.STAT_MANUFACTURE_LIST),
        update: createThunkReducer(actionTypes.STAT_MANUFACTURE_UPDATE),
        item: createThunkReducer(actionTypes.STAT_MANUFACTURE_ITEM)
    }),
    statCashbox: combineReducers({
        create: createThunkReducer(actionTypes.STAT_CASHBOX_CREATE),
        list: createThunkReducer(actionTypes.STAT_CASHBOX_LIST),
        update: createThunkReducer(actionTypes.STAT_CASHBOX_UPDATE),
        item: createThunkReducer(actionTypes.STAT_CASHBOX_ITEM)
    }),
    pendingPayments: combineReducers({
        create: createThunkReducer(actionTypes.PENDING_PAYMENTS_CREATE),
        list: createThunkReducer(actionTypes.PENDING_PAYMENTS_LIST),
        update: createThunkReducer(actionTypes.PENDING_PAYMENTS_UPDATE),
        item: createThunkReducer(actionTypes.PENDING_PAYMENTS_ITEM)
    }),
    marketType: combineReducers({
        create: createThunkReducer(actionTypes.MARKET_TYPE_CREATE),
        list: createThunkReducer(actionTypes.MARKET_TYPE_LIST),
        update: createThunkReducer(actionTypes.MARKET_TYPE_UPDATE),
        item: createThunkReducer(actionTypes.MARKET_TYPE_ITEM)
    }),
    price: combineReducers({
        list: createThunkReducer(actionTypes.PRICE_LIST),
        item: createThunkReducer(actionTypes.PRICE_ITEM),
        price: createThunkReducer(actionTypes.PRICE_LIST_ITEM_LIST),
        history: createThunkReducer(actionTypes.PRICE_LIST_ITEM_HISTORY),
        expense: createThunkReducer(actionTypes.PRICE_LIST_ITEM_EXPENSES)
    }),
    zone: combineReducers({
        create: createThunkReducer(actionTypes.ZONE_CREATE),
        list: createThunkReducer(actionTypes.ZONE_LIST),
        update: createThunkReducer(actionTypes.ZONE_UPDATE),
        item: createThunkReducer(actionTypes.ZONE_ITEM),
        statistics: createThunkReducer(actionTypes.ZONE_STAT)
    }),
    tracking: combineReducers({
        list: createThunkReducer(actionTypes.TRACKING_LIST),
        item: createThunkReducer(actionTypes.TRACKING_ITEM),
        location: createThunkReducer(actionTypes.LOCATION_LIST)
    }),
    remainder: combineReducers({
        create: createThunkReducer(actionTypes.REMAINDER_CREATE),
        list: createThunkReducer(actionTypes.REMAINDER_LIST),
        update: createThunkReducer(actionTypes.REMAINDER_UPDATE),
        item: createThunkReducer(actionTypes.REMAINDER_ITEM)
    }),
    statAgent: combineReducers({
        list: createThunkReducer(actionTypes.STAT_AGENT_LIST),
        item: createThunkReducer(actionTypes.STAT_AGENT_ITEM)
    }),
    statProduct: combineReducers({
        list: createThunkReducer(actionTypes.STAT_PRODUCT_LIST)
    }),
    statMarket: combineReducers({
        list: createThunkReducer(actionTypes.STAT_MARKET_LIST),
        item: createThunkReducer(actionTypes.STAT_MARKET_ITEM)
    }),
    statIncome: combineReducers({
        data: createThunkReducer(actionTypes.STAT_INCOME_DATA),
        list: createThunkReducer(actionTypes.STAT_INCOME_LIST)
    }),
    statisticsDebtors: combineReducers({
        data: createThunkReducer(actionTypes.STAT_DEBTORS_DATA),
        list: createThunkReducer(actionTypes.STAT_DEBTORS_LIST),
        item: createThunkReducer(actionTypes.STAT_DEBTORS_ITEM)
    }),
    stockReceive: combineReducers({
        list: createThunkReducer(actionTypes.STOCK_RECEIVE_LIST),
        history: createThunkReducer(actionTypes.STOCK_HISTORY_LIST),
        transfer: createThunkReducer(actionTypes.STOCK_TRANSFER_LIST),
        transferItem: createThunkReducer(actionTypes.STOCK_TRANSFER_ITEM),
        item: createThunkReducer(actionTypes.STOCK_RECEIVE_ITEM),
        create: createThunkReducer(actionTypes.STOCK_RECEIVE_CREATE),
        barcodeList: createThunkReducer(actionTypes.STOCK_BARCODE_LIST)
    }),
    statistics: combineReducers({
        list: createThunkReducer(actionTypes.REMAINDER_LIST),
        item: createThunkReducer(actionTypes.REMAINDER_ITEM)
    }),
    clientBalance: combineReducers({
        create: createThunkReducer(actionTypes.CLIENT_BALANCE_CREATE),
        list: createThunkReducer(actionTypes.CLIENT_BALANCE_LIST),
        update: createThunkReducer(actionTypes.CLIENT_BALANCE_UPDATE),
        item: createThunkReducer(actionTypes.CLIENT_BALANCE_ITEM)
    }),

    snackbar: snackbarReducer(),
    error: errorReducer(),
    form: formReducer,
    toastr: toastrReducer,
    routing: routerReducer
})

export default rootReducer
