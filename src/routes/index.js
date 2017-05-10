import {hashHistory} from 'react-router'
import {userIsAuth} from '../permissions'
import {getToken} from '../helpers/storage'
import * as ROUTES from '../constants/routes'
import App from '../containers/App'
import SignIn from '../containers/SignIn'
import {ShopList} from '../containers/Shop'
import {CashboxList} from '../containers/Cashbox'
import {TransactionList} from '../containers/Transaction'
import {SupplyList} from '../containers/Supply'
import {ProductList} from '../containers/Product'
import {CategoryList} from '../containers/Category'
import {StockList} from '../containers/Stock'
import {CurrencyList} from '../containers/Currency'
import {BrandList} from '../containers/Brand'
import {MeasurementList} from '../containers/Measurement'
import {ExpensiveCategoryList} from '../containers/ExpensiveCategory'
import {UsersList} from '../containers/Users'
import {ProviderList} from '../containers/Provider'
import {ClientList} from '../containers/Client'
import {ManufactureList} from '../containers/Manufacture'
import {PendingExpensesList} from '../containers/PendingExpenses'
import NotFound from '../containers/NotFound'

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

        // Shop
        {
            path: ROUTES.SHOP_LIST_URL,
            component: userIsAuth(ShopList),
            childRoutes: [
                {
                    path: ROUTES.SHOP_ITEM_URL,
                    component: userIsAuth(ShopList)
                },

                {
                    path: ROUTES.SHOP_ITEM_TAB_URL,
                    component: userIsAuth(ShopList)
                }
            ]
        },
        // Users
        {
            path: ROUTES.USERS_LIST_URL,
            component: userIsAuth(UsersList),
            childRoutes: [
                {
                    path: ROUTES.USERS_ITEM_URL,
                    component: userIsAuth(UsersList)
                }
            ]
        },
        // Cashbox
        {
            path: ROUTES.CASHBOX_LIST_URL,
            component: userIsAuth(CashboxList),
            childRoutes: [
                {
                    path: ROUTES.CASHBOX_ITEM_URL,
                    component: userIsAuth(CashboxList)
                }
            ]
        },
        // Transactoin
        {
            path: ROUTES.TRANSACTION_LIST_URL,
            component: userIsAuth(TransactionList),
            childRoutes: [
                {
                    path: ROUTES.TRANSACTION_ITEM_URL,
                    component: userIsAuth(TransactionList)
                }
            ]
        },
        // Supply
        {
            path: ROUTES.SUPPLY_LIST_URL,
            component: userIsAuth(SupplyList),
            childRoutes: [
                {
                    path: ROUTES.SUPPLY_ITEM_URL,
                    component: userIsAuth(SupplyList)
                }
            ]
        },
        // Product
        {
            path: ROUTES.PRODUCT_LIST_URL,
            component: userIsAuth(ProductList),
            childRoutes: [
            ]
        },
        // Category
        {
            path: ROUTES.CATEGORY_LIST_URL,
            component: userIsAuth(CategoryList),
            childRoutes: [
                {
                    path: ROUTES.CATEGORY_ITEM_URL,
                    component: userIsAuth(CategoryList)
                }
            ]
        },
        // Stock
        {
            path: ROUTES.STOCK_LIST_URL,
            component: userIsAuth(StockList),
            childRoutes: [
                {
                    path: ROUTES.STOCK_ITEM_URL,
                    component: userIsAuth(StockList)
                }
            ]
        },
        // Currency
        {
            path: ROUTES.CURRENCY_LIST_URL,
            component: userIsAuth(CurrencyList),
            childRoutes: [
                {
                    path: ROUTES.CURRENCY_ITEM_URL,
                    component: userIsAuth(CurrencyList)
                }
            ]
        },
        // Measurement
        {
            path: ROUTES.MEASUREMENT_LIST_URL,
            component: userIsAuth(MeasurementList),
            childRoutes: [
                {
                    path: ROUTES.MEASUREMENT_ITEM_URL,
                    component: userIsAuth(MeasurementList)
                }
            ]
        },
        // ExpensiveCategory
        {
            path: ROUTES.EXPENSIVE_CATEGORY_LIST_URL,
            component: userIsAuth(ExpensiveCategoryList),
            childRoutes: [
                {
                    path: ROUTES.EXPENSIVE_CATEGORY_ITEM_URL,
                    component: userIsAuth(ExpensiveCategoryList)
                }
            ]
        },
        // Provider
        {
            path: ROUTES.PROVIDER_LIST_URL,
            component: userIsAuth(ProviderList),
            childRoutes: [
                {
                    path: ROUTES.PROVIDER_ITEM_URL,
                    component: userIsAuth(ProviderList)
                }
            ]
        },
        // Client
        {
            path: ROUTES.CLIENT_LIST_URL,
            component: userIsAuth(ClientList),
            childRoutes: [
                {
                    path: ROUTES.CLIENT_ITEM_URL,
                    component: userIsAuth(ClientList)
                }
            ]
        },
        // Brand
        {
            path: ROUTES.BRAND_LIST_URL,
            component: userIsAuth(BrandList),
            childRoutes: [
                {
                    path: ROUTES.BRAND_ITEM_URL,
                    component: userIsAuth(BrandList)
                }
            ]
        },
        // Manufacture
        {
            path: ROUTES.MANUFACTURE_LIST_URL,
            component: userIsAuth(ManufactureList),
            childRoutes: [
            ]
        },
        // Pending Expenses
        {
            path: ROUTES.PENDING_EXPENSES_LIST_URL,
            component: userIsAuth(PendingExpensesList),
            childRoutes: [
            ]
        },

        {
            path: '*',
            component: NotFound
        }
    ]
}
