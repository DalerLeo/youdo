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
            {name: 'История заказов', url: ROUTES.ORDER_HISTORY_LIST_URL}
        ]
    },
    {
        name: 'Склад',
        icon: (<Home />),
        url: ROUTES.PRODUCT_LIST_URL,
        childs: [
            {name: 'Продукты', url: ROUTES.PRODUCT_LIST_URL}
        ]
    },
    {
        name: 'Бухгалтерия',
        icon: (<AccountBalanceWallet />),
        url: ROUTES.SHOP_LIST_URL,
        childs: [
        ]
    },
    {
        name: 'Карта',
        icon: (<Map />),
        url: ROUTES.SHOP_LIST_URL,
        childs: [
        ]
    },
    {
        name: 'Настройки',
        icon: (<Settings />),
        url: ROUTES.CATEGORY_LIST_URL,
        childs: [
            {name: 'Категории', url: ROUTES.CATEGORY_LIST_URL},
            {name: 'Валюта', url: ROUTES.CURRENCY_LIST_URL}
        ]
    }
]
