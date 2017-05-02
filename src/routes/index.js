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
import {ExpensiveCategoryList} from '../containers/ExpensiveCategory'
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
        // Cashbox
        {
            path: ROUTES.CASHBOX_LIST_URL,
            component: userIsAuth(CashboxList),
            childRoutes: [
                {
                    path: ROUTES.CASHBOX_ITEM_URL,
                    component: userIsAuth(CashboxList)
                },

                {
                    path: ROUTES.CASHBOX_ITEM_TAB_URL,
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
                },

                {
                    path: ROUTES.TRANSACTION_ITEM_TAB_URL,
                    component: userIsAuth(CashboxList)
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
                },

                {
                    path: ROUTES.SUPPLY_ITEM_TAB_URL,
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

        {
            path: '*',
            component: NotFound
        }
    ]
}
