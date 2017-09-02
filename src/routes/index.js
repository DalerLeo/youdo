import {hashHistory} from 'react-router'
import {userIsAuth, visibleOnlyAdmin} from '../permissions'
import {getToken} from '../helpers/storage'
import * as ROUTES from '../constants/routes'
import App from '../containers/App'
import {MainList} from '../containers/Main'
import {AccessList} from '../containers/Access'
import SignIn from '../containers/SignIn'
import {ShopList} from '../containers/Shop'
import {CashboxList} from '../containers/Cashbox'
import {TransactionList} from '../containers/Transaction'
import {ClientTransactionList} from '../containers/ClientTransaction'
import {SupplyList} from '../containers/Supply'
import {OrderList} from '../containers/Order'
import {ReturnList} from '../containers/Return'
import {ProductList} from '../containers/Product'
import {ProductTypeList} from '../containers/ProductType'
import {ProductPriceList} from '../containers/ProductPrice'
import {StockList} from '../containers/Stock'
import {CurrencyList} from '../containers/Currency'
import {PositionList} from '../containers/Position'
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
    StatSalesList,
    StatAgentList,
    StatProductList,
    StatMarketList,
    StatFinanceList,
    StatIncomeList,
    StatOutcomeList,
    StatDebtorsList,
    StatOutcomeCategoryList,
    StatRemainderList,
    StatCashboxList,
    StatProductMoveList,
    StatReportList
} from '../containers/Statistics'
import {ClientBalanceList} from '../containers/ClientBalance'
import {StockReceiveList} from '../containers/StockReceive'
import {PlanList} from '../containers/Plan'
import {ActivityList} from '../containers/Activity'
import {DivisionList} from '../containers/Division'
import {JoinList} from '../containers/Join'
import {PermissionList} from '../containers/Permission'

export default {
    path: '/',
    component: App,
    indexRoute: {
        component: userIsAuth(MainList)
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

        // Access Denied
        {
            path: ROUTES.ACCESS_DENIED_URL,
            component: userIsAuth(AccessList),
            childRoutes: []
        },
        // Shop
        {
            path: ROUTES.SHOP_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(ShopList)),
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
            component: userIsAuth(visibleOnlyAdmin(UsersList)),
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
            component: userIsAuth(visibleOnlyAdmin(CashboxList)),
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
            component: userIsAuth(visibleOnlyAdmin(TransactionList)),
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
            component: userIsAuth(visibleOnlyAdmin(ClientTransactionList)),
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
            component: userIsAuth(visibleOnlyAdmin(SupplyList)),
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
            component: userIsAuth(visibleOnlyAdmin(PricesList)),
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
            component: userIsAuth(visibleOnlyAdmin(PriceList)),
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
            component: userIsAuth(visibleOnlyAdmin(OrderList)),
            childRoutes: [
                {
                    path: ROUTES.ORDER_ITEM_URL,
                    component: userIsAuth(OrderList)
                }
            ]
        },
        // Return
        {
            path: ROUTES.RETURN_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(ReturnList)),
            childRoutes: [
                {
                    path: ROUTES.RETURN_ITEM_URL,
                    component: userIsAuth(ReturnList)
                }
            ]
        },
        // Product
        {
            path: ROUTES.PRODUCT_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(ProductList)),
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
            component: userIsAuth(visibleOnlyAdmin(ProductTypeList)),
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
            component: userIsAuth(visibleOnlyAdmin(ProductPriceList)),
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
            component: userIsAuth(visibleOnlyAdmin(EquipmentList)),
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
            component: userIsAuth(visibleOnlyAdmin(StockList)),
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
            component: userIsAuth(visibleOnlyAdmin(CurrencyList)),
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
            component: userIsAuth(visibleOnlyAdmin(MeasurementList)),
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
            component: userIsAuth(visibleOnlyAdmin(ExpensiveCategoryList)),
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
            component: userIsAuth(visibleOnlyAdmin(ProviderList)),
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
            component: userIsAuth(visibleOnlyAdmin(ClientList)),
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
            component: userIsAuth(visibleOnlyAdmin(BrandList)),
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
            component: userIsAuth(visibleOnlyAdmin(ShiftList)),
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
            component: userIsAuth(visibleOnlyAdmin(ManufactureList)),
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
            component: userIsAuth(visibleOnlyAdmin(PendingExpensesList)),
            childRoutes: [{
                path: ROUTES.PENDING_EXPENSES_ITEM_URL,
                component: userIsAuth(PendingExpensesList)
            }]
        },

        // Pending Payments
        {
            path: ROUTES.PENDING_PAYMENTS_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(PendingPaymentsList)),
            childRoutes: [{
                path: ROUTES.PENDING_PAYMENTS_ITEM_URL,
                component: userIsAuth(PendingPaymentsList)
            }]
        },
        // METRICA (Stat Stock)
        {
            path: ROUTES.STATSTOCK_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(StatStock)),
            childRoutes: [{
                path: ROUTES.STATSTOCK_ITEM_URL,
                component: userIsAuth(StatStock)
            }]
        },
        // METRICA (Stat Debtors)
        {
            path: ROUTES.STATDEBTORS_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(StatDebtors)),
            childRoutes: [{
                path: ROUTES.STATDEBTORS_ITEM_URL,
                component: userIsAuth(StatDebtors)
            }]
        },
        // METRICA (Stat Manufacture)
        {
            path: ROUTES.STAT_MANUFACTURE_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(StatManufacture)),
            childRoutes: [{
                path: ROUTES.STAT_MANUFACTURE_ITEM_URL,
                component: userIsAuth(StatManufacture)
            }]
        },
        // METRICA (Stat Cashbox)
        {
            path: ROUTES.STAT_CASHBOX_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(StatCashbox)),
            childRoutes: [{
                path: ROUTES.STAT_CASHBOX_ITEM_URL,
                component: userIsAuth(StatCashbox)
            }]
        },
        // ZONES
        {
            path: ROUTES.ZONES_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(Zones)),
            childRoutes: [{
                path: ROUTES.ZONES_ITEM_URL,
                component: userIsAuth(Zones)
            }]
        },
        // TRACKING
        {
            path: ROUTES.TRACKING_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(Tracking)),
            childRoutes: [{
                path: ROUTES.TRACKING_ITEM_URL,
                component: userIsAuth(Tracking)
            }]
        },
        // MARKET TYPE
        {
            path: ROUTES.MARKET_TYPE_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(MarketTypeList)),
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
            component: userIsAuth(visibleOnlyAdmin(PricesList)),
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
            component: userIsAuth(visibleOnlyAdmin(RemainderList)),
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
            component: userIsAuth(visibleOnlyAdmin(StatSalesList, ROUTES.STATISTICS_LIST_URL)),
            childRoutes: [
            ]
        },
        // Statistics/sales all
        {
            path: ROUTES.STATISTICS_SALES_URL,
            component: userIsAuth(visibleOnlyAdmin(StatSalesList)),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_SALES_ITEM_URL,
                    component: userIsAuth(StatSalesList)
                }
            ]
        },
        // Statistics/agent
        {
            path: ROUTES.STATISTICS_AGENT_URL,
            component: userIsAuth(visibleOnlyAdmin(StatAgentList)),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_AGENT_ITEM_URL,
                    component: userIsAuth(StatAgentList)
                }
            ]
        },
        // Statistics/product
        {
            path: ROUTES.STATISTICS_PRODUCT_URL,
            component: userIsAuth(visibleOnlyAdmin(StatProductList)),
            childRoutes: []
        },
        // Statistics/market
        {
            path: ROUTES.STATISTICS_MARKET_URL,
            component: userIsAuth(visibleOnlyAdmin(StatMarketList)),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_MARKET_ITEM_URL,
                    component: userIsAuth(StatMarketList)
                }
            ]
        },
        // Statistics/finance
        {
            path: ROUTES.STATISTICS_FINANCE_URL,
            component: userIsAuth(visibleOnlyAdmin(StatFinanceList)),
            childRoutes: []
        },
        // Statistics/income
        {
            path: ROUTES.STATISTICS_INCOME_URL,
            component: userIsAuth(visibleOnlyAdmin(StatIncomeList)),
            childRoutes: []
        },
        // Statistics/outcome
        {
            path: ROUTES.STATISTICS_OUTCOME_URL,
            component: userIsAuth(visibleOnlyAdmin(StatOutcomeList)),
            childRoutes: []
        },
        // Statistics/debtors
        {
            path: ROUTES.STATISTICS_DEBTORS_URL,
            component: userIsAuth(visibleOnlyAdmin(StatDebtorsList)),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_DEBTORS_ITEM_URL,
                    component: userIsAuth(StatDebtorsList)
                }
            ]
        },
        // Statistics/outcomeCategory
        {
            path: ROUTES.STATISTICS_OUTCOME_CATEGORY_URL,
            component: userIsAuth(visibleOnlyAdmin(StatOutcomeCategoryList)),
            childRoutes: []
        },
        // Stock Receive Transfer
        {
            path: ROUTES.STOCK_RECEIVE_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(StockReceiveList)),
            childRoutes: [
                {
                    path: ROUTES.STOCK_RECEIVE_ITEM_URL,
                    component: userIsAuth(StockReceiveList)
                }
            ]
        },
        // ClientBalance
        {
            path: ROUTES.CLIENT_BALANCE_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(ClientBalanceList)),
            childRoutes: [
                {
                    path: ROUTES.CLIENT_BALANCE_ITEM_URL,
                    component: userIsAuth(ClientBalanceList)
                }
            ]
        },
        // Plan
        {
            path: ROUTES.PLAN_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(PlanList)),
            childRoutes: [
                {
                    path: ROUTES.PLAN_ITEM_URL,
                    component: userIsAuth(PlanList)
                }
            ]
        },
        // Statistics/remainder
        {
            path: ROUTES.STATISTICS_REMAINDER_URL,
            component: userIsAuth(visibleOnlyAdmin(StatRemainderList)),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_REMAINDER_ITEM_URL,
                    component: userIsAuth(StatRemainderList)
                }
            ]
        },
        // Statistics/cashbox
        {
            path: ROUTES.STATISTICS_CASHBOX_URL,
            component: userIsAuth(visibleOnlyAdmin(StatCashboxList)),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_CASHBOX_ITEM_URL,
                    component: userIsAuth(StatCashboxList)
                }
            ]
        },

        // Position
        {
            path: ROUTES.POSITION_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(PositionList)),
            childRoutes: [
                {
                    path: ROUTES.POSITION_ITEM_URL,
                    component: userIsAuth(PositionList)
                }
            ]
        },
        // Activity
        {
            path: ROUTES.ACTIVITY_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(ActivityList)),
            childRoutes: [
                {
                    path: ROUTES.ACTIVITY_ITEM_URL,
                    component: userIsAuth(ActivityList)
                }
            ]
        },
        // Statistics/productMove
        {
            path: ROUTES.STATISTICS_PRODUCT_MOVE_URL,
            component: userIsAuth(visibleOnlyAdmin(StatProductMoveList)),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_PRODUCT_MOVE_ITEM_URL,
                    component: userIsAuth(StatProductMoveList)
                }
            ]
        },
        // Statistics/report
        {
            path: ROUTES.STATISTICS_REPORT_URL,
            component: userIsAuth(visibleOnlyAdmin(StatReportList)),
            childRoutes: []
        },
        // Division
        {
            path: ROUTES.DIVISION_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(DivisionList)),
            childRoutes: [
                {
                    path: ROUTES.DIVISION_ITEM_URL,
                    component: userIsAuth(DivisionList)
                }
            ]
        },
        // Join
        {
            path: ROUTES.JOIN_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(JoinList)),
            childRoutes: [
                {
                    path: ROUTES.JOIN_ITEM_URL,
                    component: userIsAuth(JoinList)
                }
            ]
        },

        // Permission
        {
            path: ROUTES.PERMISSION_LIST_URL,
            component: userIsAuth(visibleOnlyAdmin(PermissionList)),
            childRoutes: [
                {
                    path: ROUTES.PERMISSION_ITEM_URL,
                    component: userIsAuth(PermissionList)
                }
            ]
        },
        {
            path: '*',
            component: NotFound
        }
    ]
}

