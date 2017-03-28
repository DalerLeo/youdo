import {hashHistory} from 'react-router'
import * as ROUTES from '../constants/routes'
import App from '../containers/App'
import SignIn from '../containers/SignIn'
import Dashboard from '../containers/Dashboard'
import ShopList from '../containers/ShopList'
import BalanceList from '../containers/BalanceList'
import BalanceCreate from '../containers/BalanceCreate'
import DailyEntryList from '../containers/DailyEntryList'
import DailyEntryCreate from '../containers/DailyEntryCreate'
import DailyEntryItem from '../containers/DailyEntryItem'
import DailyReportList from '../containers/DailyReportList'
import NotFound from '../containers/NotFound'
import {userIsAuth} from '../permissions'
import {getToken} from '../helpers/storage'
import ClientList from '../containers/ClientList'
import ClientCreate from '../containers/ClientCreate'
import BrokerList from '../containers/BrokerList'
import BrokerCreate from '../containers/BrokerCreate'
import BrokerEdit from '../containers/BrokerEdit'
import MonthlyReportList from '../containers/MonthlyReportList'
import MonthlyReportCreate from '../containers/MonthlyReportCreate'
import MonthlyReportEdit from '../containers/MonthlyReportEdit'
import FundManagerList from '../containers/FundManagerList'
import FundManagerCreate from '../containers/FundManagerCreate'
import FundManagerEdit from '../containers/FundManagerEdit'


export default {
    path: '/',
    component: App,
    indexRoute: {
        component: userIsAuth(ShopList)
    },
    childRoutes: [
        {
            path: ROUTES.SIGN_IN_URL,
            component: SignIn,
            onEnter: () => {
                if (getToken()) {
                    hashHistory.push(ROUTES.DASHBOARD_URL)
                }
            }
        },

        // Balance
        {
            path: ROUTES.BALANCE_LIST_URL,
            component: userIsAuth(BalanceList)
        },

        {
            path: ROUTES.BALANCE_CREATE_URL,
            component: userIsAuth(BalanceCreate)
        },

        // Shop
        {
            path: ROUTES.SHOP_LIST_URL,
            component: userIsAuth(ShopList)
        },

        {
            path: ROUTES.SHOP_ITEM_URL,
            component: userIsAuth(ShopList)
        },

        // Daily entry
        {
            path: ROUTES.DAILY_ENTRY_LIST_URL,
            component: userIsAuth(DailyEntryList)
        },

        {
            path: ROUTES.DAILY_ENTRY_CREATE_URL,
            component: userIsAuth(DailyEntryCreate)
        },

        {
            path: ROUTES.DAILY_ENTRY_ITEM_URL,
            component: userIsAuth(DailyEntryItem)
        },

        // Daily report
        {
            path: ROUTES.DAILY_REPORT_LIST_URL,
            component: userIsAuth(DailyReportList)
        },

        // Client
        {
            path: ROUTES.CLIENT_LIST,
            component: userIsAuth(ClientList)
        },
        {
            path: ROUTES.CLIENT_CREATE,
            component: userIsAuth(ClientCreate)
        },

        // Broker
        {
            path: ROUTES.BROKER_LIST_URL,
            component: userIsAuth(BrokerList)
        },
        {
            path: ROUTES.BROKER_CREATE_URL,
            component: userIsAuth(BrokerCreate)
        },
        {
            path: ROUTES.BROKER_EDIT_URL,
            component: userIsAuth(BrokerEdit)
        },

        // Monthly Report
        {
            path: ROUTES.MONTHLY_REPORT_LIST_URL,
            component: userIsAuth(MonthlyReportList)
        },
        {
            path: ROUTES.MONTHLY_REPORT_CREATE_URL,
            component: userIsAuth(MonthlyReportCreate)
        },
        {
            path: ROUTES.MONTHLY_REPORT_EDIT_URL,
            component: userIsAuth(MonthlyReportEdit)
        },

        // Fund Manager
        {
            path: ROUTES.FUND_MANAGER_LIST_URL,
            component: userIsAuth(FundManagerList)
        },
        {
            path: ROUTES.FUND_MANAGER_CREATE_URL,
            component: userIsAuth(FundManagerCreate)
        },
        {
            path: ROUTES.FUND_MANAGER_EDIT_URL,
            component: userIsAuth(FundManagerEdit)
        },

        {
            path: '*',
            component: NotFound
        }
    ]
}
