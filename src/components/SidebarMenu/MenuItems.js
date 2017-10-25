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
// .. const permissions = ['frontend_orders', 'frontend_clients', 'frontend_products', 'frontend_stat_sales', 'frontend_stat_agents']

export const MenuItems = [
    {
        name: 'Продажи',
        icon: (<AttachMoney />),
        url: ROUTES.ORDER_LIST_URL,
        childs: [
            {name: 'Заказы', url: ROUTES.ORDER_LIST_URL, permission: 'frontend_orders'},
            {name: 'Возвраты', url: ROUTES.RETURN_LIST_URL, permission: 'frontend_order_returns'},
            {name: 'Активность', url: ROUTES.ACTIVITY_LIST_URL, permission: 'frontend_activity'},
            {name: 'План', url: ROUTES.PLAN_LIST_URL, permission: 'frontend_plan'},
            {name: 'Формирование цен', url: ROUTES.PRICE_LIST_URL, permission: 'frontend_prices'},
            {name: 'Отслеживание', url: ROUTES.TRACKING_LIST_URL, permission: 'frontend_tracking'},
            {name: 'Маркетинговые акции', url: ROUTES.PRICES_LIST_URL, permission: 'frontend_bonuses'},
            {name: 'Зоны', url: ROUTES.ZONES_LIST_URL, permission: 'frontend_zones'}
        ]
    },
    {
        name: 'Клиенты',
        icon: (<Person />),
        url: ROUTES.CLIENT_LIST_URL,
        childs: [
            {name: 'Клиенты', url: ROUTES.CLIENT_LIST_URL, permission: 'frontend_clients'},
            {name: 'Магазины', url: ROUTES.SHOP_LIST_URL, permission: 'frontend_shops'}
        ]
    },
    {
        name: 'Продукты',
        icon: (<Products />),
        url: ROUTES.PRODUCT_LIST_URL,
        childs: [
            {name: 'Продукты', url: ROUTES.PRODUCT_LIST_URL, permission: 'frontend_products'}
        ]
    },
    {
        name: 'Склад',
        icon: (<Store />),
        url: ROUTES.REMAINDER_LIST_URL,
        childs: [
            {name: 'Остаток', url: ROUTES.REMAINDER_LIST_URL, permission: 'frontend_remainder'},
            {name: 'Приемка / Передача', url: ROUTES.STOCK_RECEIVE_LIST_URL, permission: 'frontend_in_out'}
        ]
    },
    {
        name: 'Поставки',
        icon: (<Supply />),
        url: ROUTES.SUPPLY_LIST_URL,
        childs: [
            {name: 'Поставщики', url: ROUTES.PROVIDER_LIST_URL, permission: 'frontend_suppliers'},
            {name: 'Поставки', url: ROUTES.SUPPLY_LIST_URL, permission: 'frontend_supply'}
        ]
    },
    {
        name: 'Финансы',
        icon: (<Finance />),
        url: ROUTES.TRANSACTION_LIST_URL,
        childs: [
            {name: 'Транзакции', url: ROUTES.TRANSACTION_LIST_URL, permission: 'frontend_transactions'},
            {name: 'Ожидаемые расходы', url: ROUTES.PENDING_EXPENSES_LIST_URL, permission: 'frontend_pending_expenses'},
            {name: 'Ожидаeмые оплаты', url: ROUTES.PENDING_PAYMENTS_LIST_URL, permission: 'frontend_pending_payments'},
            {name: 'Баланс клиентов', url: ROUTES.CLIENT_BALANCE_LIST_URL, permission: 'frontend_client_balance', query: {pageSize: 25}}
        ]
    },
    {
        name: 'Производство',
        icon: (<Map />),
        url: ROUTES.MANUFACTURE_LIST_URL,
        childs: [
            {name: 'Производство', url: ROUTES.MANUFACTURE_LIST_URL, permission: 'frontend_manufacture'}
        ]
    },
    {
        name: 'Статистика',
        icon: (<Statistics />),
        url: ROUTES.STATISTICS_LIST_URL,
        childs: [
            {name: 'Продажи', url: ROUTES.STATISTICS_SALES_URL, permission: 'frontend_stat_sales'},
            {name: 'Агенты', url: ROUTES.STATISTICS_AGENT_URL, permission: 'frontend_stat_agents'},
            {name: 'Магазины', url: ROUTES.STATISTICS_MARKET_URL, permission: 'frontend_stat_markets'},
            {name: 'Возврат', url: ROUTES.STATISTICS_RETURN_URL, permission: 'frontend_stat_order_returns'},
            {name: 'Оборот', url: ROUTES.STATISTICS_FINANCE_URL, permission: 'frontend_stat_finance'},
            {name: 'Расходы по категориям', url: ROUTES.STATISTICS_OUTCOME_CATEGORY_URL, permission: 'frontend_stat_outcome_category'},
            {name: 'Кассы', url: ROUTES.STATISTICS_CASHBOX_URL, permission: 'frontend_stat_cashbox'},
            {name: 'Оборот клиентов', url: ROUTES.STATISTICS_CLIENT_INCOME_URL, permission: 'frontend_stat_client_income'},
            {name: 'Баланс клиентов', url: ROUTES.STATISTICS_CLIENT_BALANCE_URL, permission: 'frontend_stat_client_balance'},
            {name: 'Склад. Остаток', url: ROUTES.STATISTICS_REMAINDER_URL, permission: 'frontend_stat_remainder'},
            {name: 'Движение товаров', url: ROUTES.STATISTICS_PRODUCT_MOVE_URL, permission: 'frontend_stat_product_move'},
            {name: 'Генеральный отчет', url: ROUTES.STATISTICS_REPORT_URL, permission: 'frontend_stat_report'}
        ]
    },
    {
        name: 'Настройки',
        icon: (<Settings />),
        url: ROUTES.USERS_LIST_URL,
        bottom: true,
        childs: [
            {name: 'Склады', url: ROUTES.STOCK_LIST_URL, permission: 'frontend_settings_stock'},
            {name: 'Валюты', url: ROUTES.CURRENCY_LIST_URL, permission: 'frontend_settings_currency'},
            {name: 'Кассы', url: ROUTES.CASHBOX_LIST_URL, permission: 'frontend_settings_cashbox'},
            {name: 'Категории расходов', url: ROUTES.EXPENSIVE_CATEGORY_LIST_URL, permission: 'frontend_settings_expense_category'},
            {name: 'Типы продуктов', url: ROUTES.PRODUCT_TYPE_LIST_URL, permission: 'frontend_settings_product_type'},
            {name: 'Пользователи', url: ROUTES.USERS_LIST_URL, permission: 'frontend_settings_users'},
            {name: 'Измерения', url: ROUTES.MEASUREMENT_LIST_URL, permission: 'frontend_settings_measurement'},
            {name: 'Оборудование', url: ROUTES.EQUIPMENT_LIST_URL, permission: 'frontend_settings_equipment'},
            {name: 'Смена', url: ROUTES.SHIFT_LIST_URL, permission: 'frontend_settings_shift'},
            {name: 'Тип магазина', url: ROUTES.MARKET_TYPE_LIST_URL, permission: 'frontend_settings_market_type'},
            {name: 'Должности', url: ROUTES.POSITION_LIST_URL, permission: 'frontend_settings_position'},
            {name: 'Объединение', url: ROUTES.JOIN_LIST_URL, permission: 'frontend_settings_join'}
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

