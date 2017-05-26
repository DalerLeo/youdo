import {reducer as formReducer} from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'
import {routerReducer} from 'react-router-redux'
import {combineReducers} from 'redux'
import createThunkReducer from '../helpers/createThunkReducer'
import createStandardReducer from '../helpers/createStandardReducer'
import * as actionTypes from '../constants/actionTypes'
import snackbarReducer from './snackbarReducer'

const rootReducer = combineReducers({
    signIn: createThunkReducer(actionTypes.SIGN_IN),
    shop: combineReducers({
        create: createThunkReducer(actionTypes.SHOP_CREATE),
        list: createThunkReducer(actionTypes.SHOP_LIST),
        item: createThunkReducer(actionTypes.SHOP_ITEM),
        update: createThunkReducer(actionTypes.SHOP_UPDATE),
        csv: createThunkReducer(actionTypes.SHOP_LIST_CSV)
    }),
    cashbox: combineReducers({
        create: createThunkReducer(actionTypes.CASHBOX_CREATE),
        list: createThunkReducer(actionTypes.CASHBOX_LIST),
        item: createThunkReducer(actionTypes.CASHBOX_ITEM),
        update: createThunkReducer(actionTypes.CASHBOX_UPDATE),
        csv: createThunkReducer(actionTypes.CASHBOX_LIST_CSV)
    }),
    transaction: combineReducers({
        create: createThunkReducer(actionTypes.TRANSACTION_CREATE),
        list: createThunkReducer(actionTypes.TRANSACTION_LIST),
        item: createThunkReducer(actionTypes.TRANSACTION_ITEM),
        update: createThunkReducer(actionTypes.TRANSACTION_UPDATE),
        csv: createThunkReducer(actionTypes.TRANSACTION_LIST_CSV)
    }),
    supply: combineReducers({
        create: createThunkReducer(actionTypes.SUPPLY_CREATE),
        list: createThunkReducer(actionTypes.SUPPLY_LIST),
        item: createThunkReducer(actionTypes.SUPPLY_ITEM),
        update: createThunkReducer(actionTypes.SUPPLY_UPDATE),
        csv: createThunkReducer(actionTypes.SUPPLY_LIST_CSV)
    }),
    supplyExpense: combineReducers({
        create: createThunkReducer(actionTypes.SUPPLY_EXPENSE_CREATE),
        list: createThunkReducer(actionTypes.SUPPLY_EXPENSE_LIST),
        item: createThunkReducer(actionTypes.SUPPLY_EXPENSE_ITEM),
        update: createThunkReducer(actionTypes.SUPPLY_EXPENSE_UPDATE),
        csv: createThunkReducer(actionTypes.SUPPLY_EXPENSE_LIST_CSV)
    }),
    order: combineReducers({
        create: createThunkReducer(actionTypes.ORDER_CREATE),
        list: createThunkReducer(actionTypes.ORDER_LIST),
        item: createThunkReducer(actionTypes.ORDER_ITEM),
        update: createThunkReducer(actionTypes.ORDER_UPDATE),
        csv: createThunkReducer(actionTypes.ORDER_LIST_CSV)
    }),
    product: combineReducers({
        create: createThunkReducer(actionTypes.PRODUCT_CREATE),
        list: createThunkReducer(actionTypes.PRODUCT_LIST),
        update: createThunkReducer(actionTypes.PRODUCT_UPDATE),
        item: createThunkReducer(actionTypes.PRODUCT_ITEM),
        csv: createThunkReducer(actionTypes.PRODUCT_LIST_CSV),
        measurement: createStandardReducer(actionTypes.PRODUCT_MEASUREMENT),
        extra: createStandardReducer(actionTypes.PRODUCT_EXTRA)
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
        item: createThunkReducer(actionTypes.PRODUCT_PRICE_ITEM),
        csv: createThunkReducer(actionTypes.PRODUCT_PRICE_LIST_CSV)
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
        item: createThunkReducer(actionTypes.NOTIFICATIONS_ITEM)
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
        item: createThunkReducer(actionTypes.STATSTOCK_ITEM)
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
        update: createThunkReducer(actionTypes.TRANSACTION_STOCK_UPDATE),
        item: createThunkReducer(actionTypes.TRANSACTION_STOCK_ITEM)
    }),
    statDebtors: combineReducers({
        create: createThunkReducer(actionTypes.STATDEBTORS_CREATE),
        list: createThunkReducer(actionTypes.STATDEBTORS_LIST),
        update: createThunkReducer(actionTypes.STATDEBTORS_UPDATE),
        item: createThunkReducer(actionTypes.STATDEBTORS_ITEM)
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
    snackbar: snackbarReducer(),
    form: formReducer,
    toastr: toastrReducer,
    routing: routerReducer
})

export default rootReducer
