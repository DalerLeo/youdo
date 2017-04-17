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
        id: 1,
        name: 'Метрика',
        url: ROUTES.SHOP_LIST_URL,
        icon: (<TrendingUp />),
        childs: [
        ]
    },
    {
        id: 2,
        name: 'Продажи',
        icon: (<AttachMoney />),
        url: ROUTES.SHOP_LIST_URL,
        childs: [
            {id: 7, name: 'Торговые точки', url: ROUTES.SHOP_LIST_URL},
            {id: 8, name: 'История заказов', url: ROUTES.ORDER_HISTORY_LIST_URL}
        ]
    },
    {
        id: 3,
        name: 'Склад',
        icon: (<Home />),
        url: ROUTES.SHOP_LIST_URL,
        childs: [
        ]
    },
    {
        id: 4,
        name: 'Бухгалтерия',
        icon: (<AccountBalanceWallet />),
        url: ROUTES.SHOP_LIST_URL,
        childs: [
        ]
    },
    {
        id: 5,
        name: 'Карта',
        icon: (<Map />),
        url: ROUTES.SHOP_LIST_URL,
        childs: [
        ]
    },
    {
        id: 6,
        name: 'Настройки',
        icon: (<Settings />),
        url: ROUTES.SHOP_LIST_URL,
        childs: [
        ]
    }
]
