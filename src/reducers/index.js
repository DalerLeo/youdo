import {reducer as formReducer} from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'
import {routerReducer} from 'react-router-redux'
import {combineReducers} from 'redux'
import createThunkReducer from '../helpers/createThunkReducer'
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
    product: combineReducers({
        create: createThunkReducer(actionTypes.PRODUCT_CREATE),
        list: createThunkReducer(actionTypes.PRODUCT_LIST),
        update: createThunkReducer(actionTypes.PRODUCT_UPDATE),
        item: createThunkReducer(actionTypes.SHOP_ITEM),
        csv: createThunkReducer(actionTypes.SHOP_LIST_CSV)
    }),
    category: combineReducers({
        create: createThunkReducer(actionTypes.CATEGORY_CREATE),
        list: createThunkReducer(actionTypes.CATEGORY_LIST),
        update: createThunkReducer(actionTypes.CATEGORY_UPDATE),
        item: createThunkReducer(actionTypes.CATEGORY_ITEM)
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
        item: createThunkReducer(actionTypes.PROVIDER_ITEM)
    }),
    brand: combineReducers({
        create: createThunkReducer(actionTypes.BRAND_CREATE),
        list: createThunkReducer(actionTypes.BRAND_LIST),
        update: createThunkReducer(actionTypes.BRAND_UPDATE),
        item: createThunkReducer(actionTypes.BRAND_ITEM)
    }),
    manufacture: combineReducers({
        create: createThunkReducer(actionTypes.PROVIDER_CREATE),
        list: createThunkReducer(actionTypes.PROVIDER_LIST),
        update: createThunkReducer(actionTypes.PROVIDER_UPDATE),
        item: createThunkReducer(actionTypes.PROVIDER_ITEM)
    }),
    snackbar: snackbarReducer(),
    form: formReducer,
    toastr: toastrReducer,
    routing: routerReducer
})

export default rootReducer
