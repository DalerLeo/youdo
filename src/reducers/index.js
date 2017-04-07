import {reducer as formReducer} from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'
import {routerReducer} from 'react-router-redux'
import {combineReducers} from 'redux'
import createThunkReducer from '../helpers/createThunkReducer'
import * as actionTypes from '../constants/actionTypes'

const rootReducer = combineReducers({
    signIn: createThunkReducer(actionTypes.SIGN_IN),
    shop: combineReducers({
        create: createThunkReducer(actionTypes.SHOP_CREATE),
        list: createThunkReducer(actionTypes.SHOP_LIST),
        item: createThunkReducer(actionTypes.SHOP_ITEM),
        csv: createThunkReducer(actionTypes.SHOP_LIST_CSV)
    }),
    form: formReducer,
    toastr: toastrReducer,
    routing: routerReducer
})

export default rootReducer
