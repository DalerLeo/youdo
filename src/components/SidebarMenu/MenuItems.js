import _ from 'lodash'
import React from 'react'
import * as ROUTES from '../../constants/routes'
import AttachMoney from 'material-ui/svg-icons/editor/attach-money'
import Finance from 'material-ui/svg-icons/action/account-balance-wallet'
import Map from 'material-ui/svg-icons/maps/map'
import Settings from 'material-ui/svg-icons/action/settings'
import Statistics from 'material-ui/svg-icons/action/timeline'
import Store from 'material-ui/svg-icons/device/storage'
import Markets from 'material-ui/svg-icons/action/store'
import Supply from 'material-ui/svg-icons/action/swap-horiz'
import Products from 'material-ui/svg-icons/device/widgets'

const NOT_FOUND = -1

const SETTINGS_STAFF = 'Персонал'
const SETTINGS_FINANCE = 'Финансы'
const SETTINGS_PRODUCTS = 'Продукты'
const SETTINGS_MISC = 'Другие'

const STATS_SALES = 'Продажи'
const STATS_FINANCE = 'Финансы'
const STATS_CLIENTS = 'Клиенты'
const STATS_STOCK = 'Склад'
const STATS_OVERALL = 'Общее'

export const MenuItems = [
    {
        name: 'Продажи',
        icon: (<AttachMoney/>),
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
        name: 'Магазины',
        icon: (<Markets/>),
        url: ROUTES.SHOP_LIST_URL,
        childs: [
            {name: 'Магазины', url: ROUTES.SHOP_LIST_URL, permission: 'frontend_shops'},
            {name: 'Клиенты', url: ROUTES.CLIENT_LIST_URL, permission: 'frontend_clients'}
        ]
    },
    {
        name: 'Продукты',
        icon: (<Products/>),
        url: ROUTES.PRODUCT_LIST_URL,
        childs: [
            {name: 'Продукты', url: ROUTES.PRODUCT_LIST_URL, permission: 'frontend_products'}
        ]
    },
    {
        name: 'Склад',
        icon: (<Store/>),
        url: ROUTES.REMAINDER_LIST_URL,
        childs: [
            {name: 'Остаток', url: ROUTES.REMAINDER_LIST_URL, permission: 'frontend_remainder'},
            {
                name: 'Приемка / Передача',
                url: ROUTES.STOCK_RECEIVE_LIST_URL,
                extraURLs: {
                    1: ROUTES.STOCK_RECEIVE_LIST_URL,
                    2: ROUTES.STOCK_RECEIVE_HISTORY_LIST_URL,
                    3: ROUTES.STOCK_TRANSFER_LIST_URL,
                    4: ROUTES.STOCK_TRANSFER_HISTORY_LIST_URL,
                    5: ROUTES.STOCK_OUT_HISTORY_LIST_URL
                },
                permission: 'frontend_in_out'
            }
        ]
    },
    {
        name: 'Поставки',
        icon: (<Supply/>),
        url: ROUTES.SUPPLY_LIST_URL,
        childs: [
            {name: 'Поставщики', url: ROUTES.PROVIDER_LIST_URL, permission: 'frontend_suppliers'},
            {name: 'Поставки', url: ROUTES.SUPPLY_LIST_URL, permission: 'frontend_supply'}
        ]
    },
    {
        name: 'Финансы',
        icon: (<Finance/>),
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
        icon: (<Map/>),
        url: ROUTES.MANUFACTURE_LIST_URL,
        childs: [
            {
                name: 'Производство',
                url: ROUTES.MANUFACTURE_LIST_URL,
                permission: 'frontend_manufacture',
                extraURLs: {
                    1: ROUTES.MANUFACTURE_PRODUCT_LIST_URL,
                    2: ROUTES.MANUFACTURE_PERSON_LIST_URL,
                    3: ROUTES.MANUFACTURE_EQUIPMENT_LIST_URL,
                    4: ROUTES.MANUFACTURE_SHIPMENT_LIST_URL
                }

            }
        ]
    },
    {
        name: 'Статистика',
        icon: (<Statistics/>),
        section: 'Statistics',
        url: ROUTES.STATISTICS_LIST_URL,
        childs: [
            {section: STATS_SALES, name: 'Оборот', url: ROUTES.STATISTICS_SALES_URL, permission: 'frontend_stat_sales'},
            {section: STATS_SALES, name: 'Агенты', url: ROUTES.STATISTICS_AGENT_URL, permission: 'frontend_stat_agents', query: {pageSize: 25}},
            {section: STATS_SALES, name: 'Товары', url: ROUTES.STATISTICS_PRODUCT_URL, permission: 'frontend_stat_product', query: {pageSize: 25}},
            {section: STATS_SALES, name: 'Магазины', url: ROUTES.STATISTICS_MARKET_URL, permission: 'frontend_stat_markets', query: {pageSize: 25}},
            {section: STATS_SALES, name: 'Возврат', url: ROUTES.STATISTICS_RETURN_URL, permission: 'frontend_stat_order_returns'},
            {section: STATS_FINANCE, name: 'Оборот', url: ROUTES.STATISTICS_FINANCE_URL, permission: 'frontend_stat_finance'},
            {section: STATS_FINANCE, name: 'Расходы по категориям', url: ROUTES.STATISTICS_OUTCOME_CATEGORY_URL, permission: 'frontend_stat_outcome_category'},
            {section: STATS_FINANCE, name: 'Кассы', url: ROUTES.STATISTICS_CASHBOX_URL, permission: 'frontend_stat_cashbox'},
            {section: STATS_CLIENTS, name: 'Оборот клиентов', url: ROUTES.STATISTICS_CLIENT_INCOME_URL, permission: 'frontend_stat_client_income'},
            {section: STATS_CLIENTS, name: 'Баланс клиентов', url: ROUTES.STATISTICS_CLIENT_BALANCE_URL, permission: 'frontend_stat_client_balance', query: {pageSize: 25}},
            {section: STATS_CLIENTS, name: 'Должники', url: ROUTES.STATISTICS_DEBTORS_URL, permission: 'frontend_stat_debtors'},
            {section: STATS_STOCK, name: 'Остаток', url: ROUTES.STATISTICS_REMAINDER_URL, permission: 'frontend_stat_remainder', query: {pageSize: 25}},
            {section: STATS_STOCK, name: 'Движение товаров', url: ROUTES.STATISTICS_PRODUCT_MOVE_URL, permission: 'frontend_stat_product_move', query: {pageSize: 25}},
            {section: STATS_OVERALL, name: 'Генеральный отчет', url: ROUTES.STATISTICS_REPORT_URL, permission: 'frontend_stat_report'}
        ]
    },
    {
        name: 'Настройки',
        icon: (<Settings/>),
        section: 'Settings',
        url: ROUTES.USERS_LIST_URL,
        bottom: true,
        childs: [
            {section: SETTINGS_STAFF, name: 'Сотрудник', url: ROUTES.USERS_LIST_URL, permission: 'frontend_settings_users'},
            {section: SETTINGS_STAFF, name: 'Смена', url: ROUTES.SHIFT_LIST_URL, permission: 'frontend_settings_shift'},
            {section: SETTINGS_STAFF, name: 'Должность ', url: ROUTES.POST_LIST_URL, permission: 'frontend_settings_post'},
            {section: SETTINGS_STAFF, name: 'Права доступа', url: ROUTES.POSITION_LIST_URL, permission: 'frontend_settings_position'},
            {section: SETTINGS_FINANCE, name: 'Валюты', url: ROUTES.CURRENCY_LIST_URL, permission: 'frontend_settings_currency'},
            {section: SETTINGS_FINANCE, name: 'Кассы', url: ROUTES.CASHBOX_LIST_URL, permission: 'frontend_settings_cashbox'},
            {section: SETTINGS_FINANCE, name: 'Категории расходов', url: ROUTES.EXPENSIVE_CATEGORY_LIST_URL, permission: 'frontend_settings_expense_category'},
            {section: SETTINGS_PRODUCTS, name: 'Типы продуктов', url: ROUTES.PRODUCT_TYPE_LIST_URL, permission: 'frontend_settings_product_type'},
            {section: SETTINGS_PRODUCTS, name: 'Измерения', url: ROUTES.MEASUREMENT_LIST_URL, permission: 'frontend_settings_measurement'},
            {section: SETTINGS_PRODUCTS, name: 'Тип магазина', url: ROUTES.MARKET_TYPE_LIST_URL, permission: 'frontend_settings_market_type'},
            {section: SETTINGS_MISC, name: 'Прайс-лист', url: ROUTES.PRICE_LIST_SETTING_LIST_URL, permission: 'frontend_settings_price_list'},
            {section: SETTINGS_MISC, name: 'Склады', url: ROUTES.STOCK_LIST_URL, permission: 'frontend_settings_stock'},
            {section: SETTINGS_MISC, name: 'Оборудование', url: ROUTES.EQUIPMENT_LIST_URL, permission: 'frontend_settings_equipment'},
            {section: SETTINGS_MISC, name: 'Подразделение', url: ROUTES.DIVISION_LIST_URL, permission: 'frontend_settings_division'},
            {section: SETTINGS_MISC, name: 'Объединение', url: ROUTES.JOIN_LIST_URL, permission: 'frontend_settings_join'},
            {section: SETTINGS_MISC, name: 'Ограничение времени', url: ROUTES.PERMISSION_LIST_URL, permission: 'frontend_settings_permissions'},
            {section: SETTINGS_MISC, name: 'Уведомление', url: ROUTES.NOTIFICATION_TEMPLATE_LIST_URL, permission: 'frontend_settings_notifications'}
        ]
    }
]

export const getNeedMenu = (userPermissions) => {
    const menus = []
    _.map(userPermissions, (perm) => {
        const parent = _
            .chain(MenuItems)
            .find((obj) => {
                const filteredChilds = _.filter(obj.childs, (child) => {
                    return child.permission === perm
                })
                return (_.findIndex(filteredChilds, (ch) => {
                    return ch.permission === perm
                }) > NOT_FOUND)
            })
            .value()
        let hasIn = false
        _.map(menus, (menu) => {
            _.map(menu.childs, (child) => {
                if (child.permission === perm) {
                    hasIn = true
                }
            })
        })
        const filteredChilds = _.filter(_.get(parent, 'childs'), (child) => {
            return child.permission === perm
        })
        if (!hasIn) {
            const newParent = {
                name: _.get(parent, 'name'),
                icon: _.get(parent, 'icon'),
                section: _.get(parent, 'section') || '',
                bottom: _.get(parent, 'name') === 'Настройки',
                childs: _.filter(_.get(parent, 'childs'), (ch) => {
                    return _.includes(userPermissions, ch.permission)
                }),
                url: _.get(_.first(filteredChilds), 'url')
            }
            menus.push(newParent)
        }
    })
    return _.uniqBy(_.filter(menus, (o) => {
        return _.get(o, 'url')
    }), 'url')
}

export const getMenus = (userPermissions, isAdmin) => {
    if (isAdmin) {
        return MenuItems
    }
    return getNeedMenu(userPermissions)
}

