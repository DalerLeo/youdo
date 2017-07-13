import {hashHistory} from 'react-router'
import {userIsAuth} from '../permissions'
import {getToken} from '../helpers/storage'
import * as ROUTES from '../constants/routes'
import App from '../containers/App'
import SignIn from '../containers/SignIn'
import {ShopList} from '../containers/Shop'
import {CashboxList} from '../containers/Cashbox'
import {TransactionList} from '../containers/Transaction'
import {ClientTransactionList} from '../containers/ClientTransaction'
import {SupplyList} from '../containers/Supply'
import {OrderList} from '../containers/Order'
import {ProductList} from '../containers/Product'
import {ProductTypeList} from '../containers/ProductType'
import {ProductPriceList} from '../containers/ProductPrice'
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
import {StatStock} from '../containers/StatStock'
import {StatDebtors} from '../containers/StatDebtors'
import {StatManufacture} from '../containers/StatManufacture'
import {StatCashbox} from '../containers/StatCashbox'
import {PendingPaymentsList} from '../containers/PendingPayments'
import {EquipmentList} from '../containers/Equipment'
import {ShiftList} from '../containers/Shift'
import {Zones} from '../containers/Zones'
import {Tracking} from '../containers/Tracking'
import {MarketTypeList} from '../containers/MarketType'
import {PricesList} from '../containers/Prices'
import {PriceList} from '../containers/Price'
import NotFound from '../containers/NotFound'
import {RemainderList} from '../containers/Remainder'
import {
    StatAgentList,
    StatProductList,
    StatMarketList
} from '../containers/Statistics'
import {StockReceiveList} from '../containers/StockReceive'

export default {
    path: '/',
    component: App,
    indexRoute: {
        component: userIsAuth(StatStock)
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
        // Client Transactoin
        {
            path: ROUTES.CLIENT_TRANSACTION_LIST_URL,
            component: userIsAuth(ClientTransactionList),
            childRoutes: [
                {
                    path: ROUTES.CLIENT_TRANSACTION_ITEM_URL,
                    component: userIsAuth(ClientTransactionList)
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
        // Prices
        {
            path: ROUTES.PRICES_LIST_URL,
            component: userIsAuth(PricesList),
            childRoutes: [
                {
                    path: ROUTES.PRICES_ITEM_URL,
                    component: userIsAuth(PricesList)
                }
            ]
        },
        // PRICE
        {
            path: ROUTES.PRICE_LIST_URL,
            component: userIsAuth(PriceList),
            childRoutes: [
                {
                    path: ROUTES.PRICE_ITEM_URL,
                    component: userIsAuth(PriceList)
                }
            ]
        },
        // Order
        {
            path: ROUTES.ORDER_LIST_URL,
            component: userIsAuth(OrderList),
            childRoutes: [
                {
                    path: ROUTES.ORDER_ITEM_URL,
                    component: userIsAuth(OrderList)
                }
            ]
        },
        // Product
        {
            path: ROUTES.PRODUCT_LIST_URL,
            component: userIsAuth(ProductList),
            childRoutes: [
                {
                    path: ROUTES.PRODUCT_ITEM_URL,
                    component: userIsAuth(ProductList)
                }
            ]
        },
        // Product Type
        {
            path: ROUTES.PRODUCT_TYPE_LIST_URL,
            component: userIsAuth(ProductTypeList),
            childRoutes: [
                {
                    path: ROUTES.PRODUCT_TYPE_ITEM_URL,
                    component: userIsAuth(ProductTypeList)
                }
            ]
        },
        // Product Price
        {
            path: ROUTES.PRODUCT_PRICE_LIST_URL,
            component: userIsAuth(ProductPriceList),
            childRoutes: [
                {
                    path: ROUTES.PRODUCT_PRICE_ITEM_URL,
                    component: userIsAuth(ProductPriceList)
                }
            ]
        },
        // Equipment
        {
            path: ROUTES.EQUIPMENT_LIST_URL,
            component: userIsAuth(EquipmentList),
            childRoutes: [
                {
                    path: ROUTES.EQUIPMENT_ITEM_URL,
                    component: userIsAuth(EquipmentList)
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
        // Shift
        {
            path: ROUTES.SHIFT_LIST_URL,
            component: userIsAuth(ShiftList),
            childRoutes: [
                {
                    path: ROUTES.SHIFT_ITEM_URL,
                    component: userIsAuth(ShiftList)
                }
            ]
        },
        // Manufacture
        {
            path: ROUTES.MANUFACTURE_LIST_URL,
            component: userIsAuth(ManufactureList),
            childRoutes: [
                {
                    path: ROUTES.MANUFACTURE_ITEM_URL,
                    component: userIsAuth(ManufactureList)
                }
            ]
        },
        // Pending Expenses
        {
            path: ROUTES.PENDING_EXPENSES_LIST_URL,
            component: userIsAuth(PendingExpensesList),
            childRoutes: [{
                path: ROUTES.PENDING_EXPENSES_ITEM_URL,
                component: userIsAuth(PendingExpensesList)
            }]
        },

        // Pending Payments
        {
            path: ROUTES.PENDING_PAYMENTS_LIST_URL,
            component: userIsAuth(PendingPaymentsList),
            childRoutes: [{
                path: ROUTES.PENDING_PAYMENTS_ITEM_URL,
                component: userIsAuth(PendingPaymentsList)
            }]
        },
        // METRICA (Stat Stock)
        {
            path: ROUTES.STATSTOCK_LIST_URL,
            component: userIsAuth(StatStock),
            childRoutes: [{
                path: ROUTES.STATSTOCK_ITEM_URL,
                component: userIsAuth(StatStock)
            }]
        },
        // METRICA (Stat Debtors)
        {
            path: ROUTES.STATDEBTORS_LIST_URL,
            component: userIsAuth(StatDebtors),
            childRoutes: [{
                path: ROUTES.STATDEBTORS_ITEM_URL,
                component: userIsAuth(StatDebtors)
            }]
        },
        // METRICA (Stat Manufacture)
        {
            path: ROUTES.STAT_MANUFACTURE_LIST_URL,
            component: userIsAuth(StatManufacture),
            childRoutes: [{
                path: ROUTES.STAT_MANUFACTURE_ITEM_URL,
                component: userIsAuth(StatManufacture)
            }]
        },
        // METRICA (Stat Cashbox)
        {
            path: ROUTES.STAT_CASHBOX_LIST_URL,
            component: userIsAuth(StatCashbox),
            childRoutes: [{
                path: ROUTES.STAT_CASHBOX_ITEM_URL,
                component: userIsAuth(StatCashbox)
            }]
        },
        // ZONES
        {
            path: ROUTES.ZONES_LIST_URL,
            component: userIsAuth(Zones),
            childRoutes: [{
                path: ROUTES.ZONES_ITEM_URL,
                component: userIsAuth(Zones)
            }]
        },
        // TRACKING
        {
            path: ROUTES.TRACKING_LIST_URL,
            component: userIsAuth(Tracking),
            childRoutes: [{
                path: ROUTES.TRACKING_LIST_URL,
                component: userIsAuth(Tracking)
            }]
        },
        // MARKET TYPE
        {
            path: ROUTES.MARKET_TYPE_LIST_URL,
            component: userIsAuth(MarketTypeList),
            childRoutes: [
                {
                    path: ROUTES.MARKET_TYPE_ITEM_URL,
                    component: userIsAuth(MarketTypeList)
                }
            ]
        },
        // Price
        {
            path: ROUTES.PRICES_LIST_URL,
            component: userIsAuth(PricesList),
            childRoutes: [
                {
                    path: ROUTES.PRICES_ITEM_URL,
                    component: userIsAuth(PricesList)
                }
            ]
        },
        // Remainder
        {
            path: ROUTES.REMAINDER_LIST_URL,
            component: userIsAuth(RemainderList),
            childRoutes: [
                {
                    path: ROUTES.REMAINDER_ITEM_URL,
                    component: userIsAuth(RemainderList)
                }
            ]
        },
        // Statistics
        {
            path: ROUTES.STATISTICS_LIST_URL,
            component: userIsAuth(StatAgentList),
            childRoutes: []
        },
        // Statistics/agent
        {
            path: ROUTES.STATISTICS_AGENT_URL,
            component: userIsAuth(StatAgentList),
            childRoutes: []
        },
        // Statistics/product
        {
            path: ROUTES.STATISTICS_PRODUCT_URL,
            component: userIsAuth(StatProductList),
            childRoutes: []
        },
        // Statistics/market
        {
            path: ROUTES.STATISTICS_MARKET_URL,
            component: userIsAuth(StatMarketList),
            childRoutes: []
        },
        // Stock Receive Transfer
        {
            path: ROUTES.STOCK_RECEIVE_LIST_URL,
            component: userIsAuth(StockReceiveList),
            childRoutes: [
                {
                    path: ROUTES.STOCK_RECEIVE_ITEM_URL,
                    component: userIsAuth(StockReceiveList)
                }
            ]
        },
        {
            path: '*',
            component: NotFound
        }
    ]
}

