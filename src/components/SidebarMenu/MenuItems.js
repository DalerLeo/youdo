import React from 'react'
import * as ROUTES from '../../constants/routes'
import TrendingUp from 'material-ui/svg-icons/action/trending-up'
import AttachMoney from 'material-ui/svg-icons/editor/attach-money'
import Home from 'material-ui/svg-icons/action/home'
import AccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet'
import Map from 'material-ui/svg-icons/maps/map'
import Settings from 'material-ui/svg-icons/action/settings'

export const MenuItems = [
    {
        name: 'Метрика',
        url: ROUTES.SHOP_LIST_URL,
        icon: (<TrendingUp />),
        childs: [
        ]
    },
    {
        name: 'Продажи',
        icon: (<AttachMoney />),
        url: ROUTES.SHOP_LIST_URL,
        childs: [
            {name: 'Торговые точки', url: ROUTES.SHOP_LIST_URL},
            {name: 'Закази', url: ROUTES.ORDER_LIST_URL},
            {name: 'Клиенты', url: ROUTES.CLIENT_LIST_URL}
        ]
    },
    {
        name: 'Склад',
        icon: (<Home />),
        url: ROUTES.PRODUCT_LIST_URL,
        childs: [
            {name: 'Продукты', url: ROUTES.PRODUCT_LIST_URL},
            {name: 'Поставщики', url: ROUTES.PROVIDER_LIST_URL},
            {name: 'Поставки', url: ROUTES.SUPPLY_LIST_URL}
        ]
    },
    {
        name: 'Бухгалтерия',
        icon: (<AccountBalanceWallet />),
        url: ROUTES.TRANSACTION_LIST_URL,
        childs: [
            {name: 'Транзакции', url: ROUTES.TRANSACTION_LIST_URL},
            {name: 'Ожидаемые расходы', url: ROUTES.PENDING_EXPENSES_LIST_URL},
            {name: 'Ожидание оплаты', url: ROUTES.PENDING_PAYMENTS_LIST_URL}
        ]
    },
    {
        name: 'Производство',
        icon: (<Map />),
        url: ROUTES.MANUFACTURE_LIST_URL,
        childs: [
            {name: 'Производство', url: ROUTES.MANUFACTURE_LIST_URL}
        ]
    },
    {
        name: 'Настройки',
        icon: (<Settings />),
        url: ROUTES.CATEGORY_LIST_URL,
        childs: [
            {name: 'Категории', url: ROUTES.CATEGORY_LIST_URL},
            {name: 'Склады', url: ROUTES.STOCK_LIST_URL},
            {name: 'Валюты', url: ROUTES.CURRENCY_LIST_URL},
            {name: 'Кассы', url: ROUTES.CASHBOX_LIST_URL},
            {name: 'Категории расходов', url: ROUTES.EXPENSIVE_CATEGORY_LIST_URL},
            {name: 'Бренды', url: ROUTES.BRAND_LIST_URL},
            {name: 'Пользователи', url: ROUTES.USERS_LIST_URL},
            {name: 'Измерения', url: ROUTES.MEASUREMENT_LIST_URL}
        ]
    }
]
