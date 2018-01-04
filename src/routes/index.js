import {compose} from 'redux'
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
import {ZonesList} from '../containers/Zones'
import {ExpensiveCategoryList} from '../containers/ExpensiveCategory'
import {PostList} from '../containers/Post'
import {UsersList} from '../containers/Users'
import {ProviderList} from '../containers/Provider'
import {ClientList} from '../containers/Client'
import {
    ManufactureProductList,
    ManufacturePersonList,
    ManufactureEquipmentList,
    ManufactureShipmentList,
    ManufactureWrapper
} from '../containers/Manufacture'
import {PendingExpensesList} from '../containers/PendingExpenses'
import {StatStock} from '../containers/StatStock'
import {StatManufacture} from '../containers/StatManufacture'
import {StatCashbox} from '../containers/StatCashbox'
import {PendingPaymentsList} from '../containers/PendingPayments'
import {EquipmentList} from '../containers/Equipment'
import {ShiftList} from '../containers/Shift'
import {ClientTransactionList} from '../containers/ClientTransaction'
import {Tracking} from '../containers/Tracking'
import {MarketTypeList} from '../containers/MarketType'
import {PricesList} from '../containers/Prices'
import {PriceList} from '../containers/Price'
import NotFound from '../containers/NotFound'
import {RemainderList} from '../containers/Remainder'
import {InventoryList} from '../containers/Inventory'
import {
    StatSalesList,
    StatAgentList,
    StatReturnList,
    StatProductList,
    StatMarketList,
    StatFinanceList,
    StatOutcomeCategoryList,
    StatExpenditureOnStaffList,
    StatRemainderList,
    StatCashboxList,
    StatProductMoveList,
    StatReportList,
    StatClientIncomeList,
    StatClientBalance,
    StatDebtorsList,
    StatProviderList
} from '../containers/Statistics'
import {ClientBalanceList} from '../containers/ClientBalance'
import {StockReceiveHistoryList, StockReceiveList, StockTransferList, StockTransferHistoryList, StockOutHistoryList} from '../containers/StockReceive'
import {PlanList} from '../containers/Plan'
import {ActivityList} from '../containers/Activity'
import {DivisionList} from '../containers/Division'
import {JoinList} from '../containers/Join'
import {PermissionList} from '../containers/Permission'
import {NotificationTemplateList} from '../containers/NotificationTemplate'
import {PriceListSetting} from '../containers/PriceListSetting'
import {TelegramList} from '../containers/Telegram'
import {TelegramNewsList} from '../containers/TelegramNews'

const userIsAdminChain = compose(userIsAuth, visibleOnlyAdmin)

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
            component: userIsAdminChain(ShopList),
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
            component: userIsAdminChain(UsersList),
            childRoutes: [
                {
                    path: ROUTES.USERS_ITEM_URL,
                    component: userIsAuth(UsersList)
                }
            ]
        },
        // NotificationTemplate
        {
            path: ROUTES.NOTIFICATION_TEMPLATE_LIST_URL,
            component: userIsAdminChain(NotificationTemplateList),
            childRoutes: [
                {
                    path: ROUTES.NOTIFICATION_TEMPLATE_ITEM_URL,
                    component: userIsAuth(NotificationTemplateList)
                }
            ]
        },
        // Cashbox
        {
            path: ROUTES.CASHBOX_LIST_URL,
            component: userIsAdminChain(CashboxList),
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
            component: userIsAdminChain(TransactionList),
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
            component: userIsAdminChain(SupplyList),
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
            component: userIsAdminChain(PricesList),
            childRoutes: [
                {
                    path: ROUTES.PRICES_ITEM_URL,
                    component: userIsAuth(PricesList)
                }
            ]
        },
        // Client Transactoin
        {
            path: ROUTES.CLIENT_TRANSACTION_LIST_URL,
            component: userIsAdminChain(ClientTransactionList),
            childRoutes: [
                {
                    path: ROUTES.CLIENT_TRANSACTION_ITEM_URL,
                    component: userIsAuth(ClientTransactionList)
                }
            ]
        },
        // PRICE
        {
            path: ROUTES.PRICE_LIST_URL,
            component: userIsAdminChain(PriceList),
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
            component: userIsAdminChain(OrderList),
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
            component: userIsAdminChain(ReturnList),
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
            component: userIsAdminChain(ProductList),
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
            component: userIsAdminChain(ProductTypeList),
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
            component: userIsAdminChain(ProductPriceList),
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
            component: userIsAdminChain(EquipmentList),
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
            component: userIsAdminChain(StockList),
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
            component: userIsAdminChain(CurrencyList),
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
            component: userIsAdminChain(MeasurementList),
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
            component: userIsAdminChain(ExpensiveCategoryList),
            childRoutes: [
                {
                    path: ROUTES.EXPENSIVE_CATEGORY_ITEM_URL,
                    component: userIsAuth(ExpensiveCategoryList)
                }
            ]
        },
        // Post
        {
            path: ROUTES.POST_LIST_URL,
            component: userIsAdminChain(PostList),
            childRoutes: [
                {
                    path: ROUTES.POST_ITEM_URL,
                    component: userIsAuth(PostList)
                }
            ]
        },
        // Provider
        {
            path: ROUTES.PROVIDER_LIST_URL,
            component: userIsAdminChain(ProviderList),
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
            component: userIsAdminChain(ClientList),
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
            component: userIsAdminChain(BrandList),
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
            component: userIsAdminChain(ShiftList),
            childRoutes: [
                {
                    path: ROUTES.SHIFT_ITEM_URL,
                    component: userIsAuth(ShiftList)
                }
            ]
        },
        // Pending Expenses
        {
            path: ROUTES.PENDING_EXPENSES_LIST_URL,
            component: userIsAdminChain(PendingExpensesList),
            childRoutes: [{
                path: ROUTES.PENDING_EXPENSES_ITEM_URL,
                component: userIsAuth(PendingExpensesList)
            }]
        },

        // Pending Payments
        {
            path: ROUTES.PENDING_PAYMENTS_LIST_URL,
            component: userIsAdminChain(PendingPaymentsList),
            childRoutes: [{
                path: ROUTES.PENDING_PAYMENTS_ITEM_URL,
                component: userIsAuth(PendingPaymentsList)
            }]
        },
        // METRICA (Stat Stock)
        {
            path: ROUTES.STATSTOCK_LIST_URL,
            component: userIsAdminChain(StatStock),
            childRoutes: [{
                path: ROUTES.STATSTOCK_ITEM_URL,
                component: userIsAuth(StatStock)
            }]
        },
        // METRICA (Stat Manufacture)
        {
            path: ROUTES.STAT_MANUFACTURE_LIST_URL,
            component: userIsAdminChain(StatManufacture),
            childRoutes: [{
                path: ROUTES.STAT_MANUFACTURE_ITEM_URL,
                component: userIsAuth(StatManufacture)
            }]
        },
        // METRICA (Stat Cashbox)
        {
            path: ROUTES.STAT_CASHBOX_LIST_URL,
            component: userIsAdminChain(StatCashbox),
            childRoutes: [{
                path: ROUTES.STAT_CASHBOX_ITEM_URL,
                component: userIsAuth(StatCashbox)
            }]
        },
        // ZONES
        {
            path: ROUTES.ZONES_LIST_URL,
            component: userIsAdminChain(ZonesList),
            childRoutes: [{
                path: ROUTES.ZONES_ITEM_URL,
                component: userIsAuth(ZonesList)
            }]
        },
        // TRACKING
        {
            path: ROUTES.TRACKING_LIST_URL,
            component: userIsAdminChain(Tracking),
            childRoutes: [{
                path: ROUTES.TRACKING_ITEM_URL,
                component: userIsAuth(Tracking)
            }]
        },
        // MARKET TYPE
        {
            path: ROUTES.MARKET_TYPE_LIST_URL,
            component: userIsAdminChain(MarketTypeList),
            childRoutes: [
                {
                    path: ROUTES.MARKET_TYPE_ITEM_URL,
                    component: userIsAuth(MarketTypeList)
                }
            ]
        },
        // PRICE LIST
        {
            path: ROUTES.PRICE_LIST_SETTING_LIST_URL,
            component: userIsAdminChain(PriceListSetting),
            childRoutes: [
                {
                    path: ROUTES.PRICE_LIST_SETTING_ITEM_URL,
                    component: userIsAuth(PriceListSetting)
                }
            ]
        },
        // Price
        {
            path: ROUTES.PRICES_LIST_URL,
            component: userIsAdminChain(PricesList),
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
            component: userIsAdminChain(RemainderList),
            childRoutes: [
                {
                    path: ROUTES.REMAINDER_ITEM_URL,
                    component: userIsAuth(visibleOnlyAdmin(RemainderList))
                }
            ]
        },
        // Inventory
        {
            path: ROUTES.INVENTORY_LIST_URL,
            component: userIsAdminChain(InventoryList),
            childRoutes: [
                {
                    path: ROUTES.INVENTORY_ITEM_URL,
                    component: userIsAuth(visibleOnlyAdmin(InventoryList))
                }
            ]
        },
        // Manufact
        {
            path: ROUTES.MANUFACT_PERSON,
            component: userIsAdminChain(ManufactureWrapper),
            childRoutes: [
                {
                    path: ROUTES.MANUFACT_PRODUCT,
                    component: userIsAdminChain(ManufactureProductList)
                },
                {
                    path: ROUTES.MANUFACT_PERSON,
                    component: userIsAdminChain(ManufacturePersonList)
                }
            ]
        },
        // Manufacture
        {
            path: ROUTES.MANUFACTURE_LIST_URL,
            component: userIsAdminChain(ManufactureProductList),
            childRoutes: []
        },
        // Manufacture Product
        {
            path: ROUTES.MANUFACTURE_PRODUCT_LIST_URL,
            component: userIsAdminChain(ManufactureProductList),
            childRoutes: [
                {
                    path: ROUTES.MANUFACTURE_PRODUCT_ITEM_URL,
                    component: userIsAuth(ManufactureProductList)
                }
            ]
        },
        // Manufacture Person
        {
            path: ROUTES.MANUFACTURE_PERSON_LIST_URL,
            component: userIsAdminChain(ManufacturePersonList),
            childRoutes: [
                {
                    path: ROUTES.MANUFACTURE_PERSON_ITEM_URL,
                    component: userIsAuth(ManufacturePersonList)
                }
            ]
        },
        // Manufacture Equipment
        {
            path: ROUTES.MANUFACTURE_EQUIPMENT_LIST_URL,
            component: userIsAdminChain(ManufactureEquipmentList),
            childRoutes: [
                {
                    path: ROUTES.MANUFACTURE_EQUIPMENT_ITEM_URL,
                    component: userIsAuth(ManufactureEquipmentList)
                }
            ]
        },
        // Manufacture Shipment
        {
            path: ROUTES.MANUFACTURE_SHIPMENT_LIST_URL,
            component: userIsAdminChain(ManufactureShipmentList),
            childRoutes: [
                {
                    path: ROUTES.MANUFACTURE_SHIPMENT_ITEM_URL,
                    component: userIsAuth(ManufactureShipmentList)
                }
            ]
        },
        // Statistics
        {
            path: ROUTES.STATISTICS_LIST_URL,
            component: userIsAdminChain(StatSalesList),
            childRoutes: [
            ]
        },
        // Statistics/sales all
        {
            path: ROUTES.STATISTICS_SALES_URL,
            component: userIsAdminChain(StatSalesList),
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
            component: userIsAdminChain(StatAgentList),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_AGENT_ITEM_URL,
                    component: userIsAuth(StatAgentList)
                }
            ]
        },
        // Statistics/return
        {
            path: ROUTES.STATISTICS_RETURN_URL,
            component: userIsAdminChain(StatReturnList),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_RETURN_ITEM_URL,
                    component: userIsAuth(StatReturnList)
                }
            ]
        },
        // Statistics/product
        {
            path: ROUTES.STATISTICS_PRODUCT_URL,
            component: userIsAdminChain(StatProductList),
            childRoutes: []
        },
        // Statistics/market
        {
            path: ROUTES.STATISTICS_MARKET_URL,
            component: userIsAdminChain(StatMarketList),
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
            component: userIsAdminChain(StatFinanceList),
            childRoutes: []
        },
        // Statistics/outcomeCategory
        {
            path: ROUTES.STATISTICS_OUTCOME_CATEGORY_URL,
            component: userIsAdminChain(StatOutcomeCategoryList),
            childRoutes: []
        },
        // Statistics/expenditureOnStaff
        {
            path: ROUTES.STATISTICS_EXPENDITURE_ON_STAFF_URL,
            component: userIsAdminChain(StatExpenditureOnStaffList),
            childRoutes: []
        },
        // Statistics/ client income
        {
            path: ROUTES.STATISTICS_CLIENT_INCOME_URL,
            component: userIsAdminChain(StatClientIncomeList),
            childRoutes: []
        },
        // Statistics/debtors
        {
            path: ROUTES.STATISTICS_DEBTORS_URL,
            component: userIsAdminChain(StatDebtorsList),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_DEBTORS_ITEM_URL,
                    component: userIsAuth(StatDebtorsList)
                }
            ]
        },
        // Statistics/debtors
        {
            path: ROUTES.STATISTICS_PROVIDERS_URL,
            component: userIsAdminChain(StatProviderList),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_PROVIDERS_ITEM_URL,
                    component: userIsAuth(StatProviderList)
                }
            ]
        },
        // Stock Receive
        {
            path: ROUTES.STOCK_RECEIVE_LIST_URL,
            component: userIsAdminChain(StockReceiveList),
            childRoutes: [
                {
                    path: ROUTES.STOCK_RECEIVE_ITEM_URL,
                    component: userIsAuth(StockReceiveList)
                }
            ]
        },
        // Stock Receive History
        {
            path: ROUTES.STOCK_RECEIVE_HISTORY_LIST_URL,
            component: userIsAdminChain(StockReceiveHistoryList),
            childRoutes: [
                {
                    path: ROUTES.STOCK_RECEIVE_HISTORY_ITEM_URL,
                    component: userIsAuth(StockReceiveHistoryList)
                }
            ]
        },
        // Stock Receive Tab Transfer
        {
            path: ROUTES.STOCK_TRANSFER_LIST_URL,
            component: userIsAdminChain(StockTransferList),
            childRoutes: [
                {
                    path: ROUTES.STOCK_TRANSFER_ITEM_URL,
                    component: userIsAuth(StockTransferList)
                }
            ]
        },
        // Stock Receive Tab Transfer History
        {
            path: ROUTES.STOCK_TRANSFER_HISTORY_LIST_URL,
            component: userIsAdminChain(StockTransferHistoryList),
            childRoutes: [
                {
                    path: ROUTES.STOCK_TRANSFER_HISTORY_ITEM_URL,
                    component: userIsAuth(StockTransferHistoryList)
                }
            ]
        },
        // Stock Receive Tab Out History
        {
            path: ROUTES.STOCK_OUT_HISTORY_LIST_URL,
            component: userIsAdminChain(StockOutHistoryList),
            childRoutes: [
                {
                    path: ROUTES.STOCK_OUT_HISTORY_ITEM_URL,
                    component: userIsAuth(StockOutHistoryList)
                }
            ]
        },
        // ClientBalance
        {
            path: ROUTES.CLIENT_BALANCE_LIST_URL,
            component: userIsAdminChain(ClientBalanceList),
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
            component: userIsAdminChain(PlanList),
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
            component: userIsAdminChain(StatRemainderList),
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
            component: userIsAdminChain(StatCashboxList),
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
            component: userIsAdminChain(PositionList),
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
            component: userIsAdminChain(ActivityList),
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
            component: userIsAdminChain(StatProductMoveList),
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
            component: userIsAdminChain(StatReportList),
            childRoutes: []
        },
        // Division
        {
            path: ROUTES.DIVISION_LIST_URL,
            component: userIsAdminChain(DivisionList),
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
            component: userIsAdminChain(JoinList),
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
            component: userIsAdminChain(PermissionList),
            childRoutes: [
                {
                    path: ROUTES.PERMISSION_ITEM_URL,
                    component: userIsAuth(PermissionList)
                }
            ]
        },
        // Statistics/clientBalance
        {
            path: ROUTES.STATISTICS_CLIENT_BALANCE_URL,
            component: userIsAdminChain(StatClientBalance),
            childRoutes: [
                {
                    path: ROUTES.STATISTICS_CLIENT_BALANCE_ITEM_URL,
                    component: userIsAuth(StatClientBalance)
                }
            ]
        },
        // Telegram Users
        {
            path: ROUTES.TELEGRAM_LIST_URL,
            component: userIsAdminChain(TelegramList),
            childRoutes: [
                {
                    path: ROUTES.TELEGRAM_ITEM_URL,
                    component: userIsAuth(TelegramList)
                }
            ]
        },
        // Telegram Users
        {
            path: ROUTES.TELEGRAM_NEWS_LIST_URL,
            component: userIsAdminChain(TelegramNewsList),
            childRoutes: [
                {
                    path: ROUTES.TELEGRAM_NEWS_ITEM_URL,
                    component: userIsAuth(TelegramNewsList)
                }
            ]
        },
        {
            path: '*',
            component: NotFound
        }
    ]
}

