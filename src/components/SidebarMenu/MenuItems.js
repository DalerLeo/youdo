import _ from 'lodash'
import React from 'react'
import * as ROUTES from '../../constants/routes'
import AttachMoney from 'material-ui/svg-icons/editor/attach-money'
import Finance from 'material-ui/svg-icons/action/account-balance-wallet'
import Map from 'material-ui/svg-icons/maps/map'
import Settings from 'material-ui/svg-icons/action/settings'
import Statistics from 'material-ui/svg-icons/action/timeline'
import Store from 'material-ui/svg-icons/action/store'
import Person from 'material-ui/svg-icons/social/group'
import Supply from 'material-ui/svg-icons/action/swap-horiz'
import Products from 'material-ui/svg-icons/device/widgets'

const NOT_FOUND = -1

export const MenuItems = [
    {
        name: 'Продажи',
        icon: (<AttachMoney />),
        url: ROUTES.ORDER_LIST_URL,
        childs: [
            {name: 'Заказы', url: ROUTES.ORDER_LIST_URL},
            {name: 'Возвраты', url: ROUTES.RETURN_LIST_URL},
            {name: 'Активность', url: ROUTES.ACTIVITY_LIST_URL},
            {name: 'План', url: ROUTES.PLAN_LIST_URL},
            {name: 'Формирование цен', url: ROUTES.PRICE_LIST_URL},
            {name: 'Отслеживание', url: ROUTES.TRACKING_LIST_URL},
            {name: 'Маркетинговые акции', url: ROUTES.PRICES_LIST_URL},
            {name: 'Зоны', url: ROUTES.ZONES_LIST_URL}
        ]
    },
    {
        name: 'Клиенты',
        icon: (<Person />),
        url: ROUTES.CLIENT_LIST_URL,
        childs: [
            {name: 'Клиенты', url: ROUTES.CLIENT_LIST_URL},
            {name: 'Магазины', url: ROUTES.SHOP_LIST_URL}
        ]
    },
    {
        name: 'Продукты',
        icon: (<Products />),
        url: ROUTES.PRODUCT_LIST_URL,
        childs: [
            {name: 'Продукты', url: ROUTES.PRODUCT_LIST_URL}
        ]
    },
    {
        name: 'Склад',
        icon: (<Store />),
        url: ROUTES.REMAINDER_LIST_URL,
        childs: [
            {name: 'Остаток', url: ROUTES.REMAINDER_LIST_URL},
            {name: 'Приемка / Передача', url: ROUTES.STOCK_RECEIVE_LIST_URL}
        ]
    },
    {
        name: 'Поставки',
        icon: (<Supply />),
        url: ROUTES.SUPPLY_LIST_URL,
        childs: [
            {name: 'Поставщики', url: ROUTES.PROVIDER_LIST_URL},
            {name: 'Поставки', url: ROUTES.SUPPLY_LIST_URL}
        ]
    },
    {
        name: 'Финансы',
        icon: (<Finance />),
        url: ROUTES.TRANSACTION_LIST_URL,
        childs: [
            {name: 'Транзакции', url: ROUTES.TRANSACTION_LIST_URL},
            {name: 'Ожидаемые расходы', url: ROUTES.PENDING_EXPENSES_LIST_URL},
            {name: 'Ожидаeмые оплаты', url: ROUTES.PENDING_PAYMENTS_LIST_URL},
            {name: 'Баланс клиентов', url: ROUTES.CLIENT_BALANCE_LIST_URL}
        ]
    },
    {
        name: 'Производство',
        icon: (<Map />),
        url: ROUTES.MANUFACTURE_CUSTOM_URL,
        childs: [
            {name: 'Производство', url: ROUTES.MANUFACTURE_CUSTOM_URL}
        ]
    },
    {
        name: 'Статистика',
        icon: (<Statistics />),
        url: ROUTES.STATISTICS_LIST_URL,
        childs: [
            {name: 'Статистика', url: ROUTES.STATISTICS_LIST_URL}
        ]
    },
    {
        name: 'Настройки',
        icon: (<Settings />),
        url: ROUTES.USERS_LIST_URL,
        bottom: true,
        childs: [
            {name: 'Склады', url: ROUTES.STOCK_LIST_URL},
            {name: 'Валюты', url: ROUTES.CURRENCY_LIST_URL},
            {name: 'Кассы', url: ROUTES.CASHBOX_LIST_URL},
            {name: 'Категории расходов', url: ROUTES.EXPENSIVE_CATEGORY_LIST_URL},
            {name: 'Типы продуктов', url: ROUTES.PRODUCT_TYPE_LIST_URL},
            {name: 'Пользователи', url: ROUTES.USERS_LIST_URL},
            {name: 'Измерения', url: ROUTES.MEASUREMENT_LIST_URL},
            {name: 'Оборудование', url: ROUTES.EQUIPMENT_LIST_URL},
            {name: 'Смена', url: ROUTES.SHIFT_LIST_URL},
            {name: 'Тип магазина', url: ROUTES.MARKET_TYPE_LIST_URL},
            {name: 'Должности', url: ROUTES.POSITION_LIST_URL},
            {name: 'Объединение', url: ROUTES.JOIN_LIST_URL}
        ]
    }
]

export const groups = [
    {
        id: 1,
        name: 'SupDir',
        urls: [
            ROUTES.REMAINDER_LIST_URL,
            ROUTES.STOCK_RECEIVE_LIST_URL
        ]
    },
    {
        id: 2,
        name: 'delivery',
        urls: []
    },
    {
        id: 3,
        name: 'agent',
        urls: []
    },
    {
        id: 4,
        name: 'merch',
        urls: []
    },
    {
        id: 5,
        name: 'collector',
        urls: []
    },
    {
        id: 6,
        name: 'cashier',
        urls: [
            ROUTES.TRANSACTION_LIST_URL,
            ROUTES.PENDING_EXPENSES_LIST_URL,
            ROUTES.PENDING_PAYMENTS_LIST_URL,
            ROUTES.CLIENT_BALANCE_LIST_URL
        ]
    },
    {
        id: 7,
        name: 'supervisor',
        urls: []
    }
]

const getLinksByGroup = (groupId) => {
    return _.get(_.find(groups, {'id': _.toInteger(groupId)}), 'urls')
}

export const getNeedMenu = (sessionGroups) => {
    let menus = []
    _.map(sessionGroups, (item) => {
        const links = getLinksByGroup(item)
        _.map(links, (link) => {
            const parent = _
                .chain(MenuItems)
                .find((obj) => {
                    return (_.findIndex(obj.childs,
                        (ch) => ch.url === link) > NOT_FOUND)
                })
                .value()
            let hasIn = false
            _.map(menus, (menu) => {
                if (menu.url === link) {
                    hasIn = true
                }
                _.map(menu.childs, (child) => {
                    if (child.url === link) {
                        hasIn = true
                    }
                })
            })
            if (!hasIn) {
                menus.push(parent)
            }
        })
    })
    return menus
}

export const getMenus = (sessionGroups, isAdmin) => {
    if (isAdmin) {
        return MenuItems
    }
    return getNeedMenu(sessionGroups)
}

