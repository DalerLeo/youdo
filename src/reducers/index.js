import {reducer as formReducer} from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'
import {routerReducer} from 'react-router-redux'
import {combineReducers} from 'redux'
import createThunkReducer from '../helpers/createThunkReducer'
import * as actionTypes from '../constants/actionTypes'

const rootReducer = combineReducers({
    signIn: createThunkReducer(actionTypes.SIGN_IN),
    dailyEntry: combineReducers({
        list: createThunkReducer(actionTypes.DAILY_ENTRY_LIST),
        item: createThunkReducer(actionTypes.DAILY_ENTRY_ITEM),
        create: createThunkReducer(actionTypes.DAILY_ENTRY_CREATE)
    }),
    dailyReport: combineReducers({
        list: createThunkReducer(actionTypes.DAILY_REPORT_LIST),
        csv: createThunkReducer(actionTypes.DAILY_REPORT_LIST_CSV)
    }),
    client: combineReducers({
        list: createThunkReducer(actionTypes.CLIENT_LIST),
        item: createThunkReducer(actionTypes.DAILY_ENTRY_ITEM),
        create: createThunkReducer(actionTypes.CLIENT_CREATE)
    }),
    shop: combineReducers({
        create: createThunkReducer(actionTypes.SHOP_CREATE),
        list: createThunkReducer(actionTypes.SHOP_LIST),
        csv: createThunkReducer(actionTypes.SHOP_LIST_CSV)
    }),
    balance: combineReducers({
        create: createThunkReducer(actionTypes.BALANCE_CREATE),
        list: createThunkReducer(actionTypes.BALANCE_LIST),
        csv: createThunkReducer(actionTypes.BALANCE_LIST_CSV)
    }),
    dashboardStatics: combineReducers({
        pieChart: createThunkReducer(actionTypes.DASHBOARD_CHART_PIE),
        lineChart: createThunkReducer(actionTypes.DASHBOARD_CHART_LINE)
    }),
    broker: combineReducers({
        list: createThunkReducer(actionTypes.BROKER_LIST),
        item: createThunkReducer(actionTypes.BROKER_ITEM),
        create: createThunkReducer(actionTypes.BROKER_CREATE),
        edit: createThunkReducer(actionTypes.BROKER_EDIT)
    }),
    monthlyReport: combineReducers({
        list: createThunkReducer(actionTypes.MONTHLY_REPORT_LIST),
        item: createThunkReducer(actionTypes.MONTHLY_REPORT_ITEM),
        create: createThunkReducer(actionTypes.MONTHLY_REPORT_CREATE),
        edit: createThunkReducer(actionTypes.MONTHLY_REPORT_EDIT),
        csv: createThunkReducer(actionTypes.MONTHLY_REPORT_LIST_CSV)
    }),
    fundManager: combineReducers({
        list: createThunkReducer(actionTypes.FUND_MANAGER_LIST),
        item: createThunkReducer(actionTypes.FUND_MANAGER_ITEM),
        create: createThunkReducer(actionTypes.FUND_MANAGER_CREATE),
        edit: createThunkReducer(actionTypes.FUND_MANAGER_EDIT)
    }),
    form: formReducer,
    toastr: toastrReducer,
    routing: routerReducer
})

export default rootReducer
