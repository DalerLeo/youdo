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
        item: createThunkReducer(actionTypes.CURRENCY_ITEM)
    }),
    snackbar: snackbarReducer(),
    form: formReducer,
    toastr: toastrReducer,
    routing: routerReducer
})

export default rootReducer
