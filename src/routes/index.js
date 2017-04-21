import {hashHistory} from 'react-router'
import {userIsAuth} from '../permissions'
import {getToken} from '../helpers/storage'
import * as ROUTES from '../constants/routes'
import App from '../containers/App'
import SignIn from '../containers/SignIn'
import {ShopList} from '../containers/Shop'
import {ProductList} from '../containers/Product'
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
        // Product
        {
            path: ROUTES.PRODUCT_LIST_URL,
            component: userIsAuth(ProductList),
            childRoutes: [
            ]
        },

        {
            path: '*',
            component: NotFound
        }
    ]
}
