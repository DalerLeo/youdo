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
import Clients from 'material-ui/svg-icons/social/group'
import Supply from 'material-ui/svg-icons/action/swap-horiz'
import Products from 'material-ui/svg-icons/device/widgets'
import Telegram from '../CustomIcons/Telegram'
import {getPageSize} from '../../helpers/storage'
import t from '../../helpers/translate'

const NOT_FOUND = -1

const SETTINGS_STAFF = t('Персонал')
const SETTINGS_FINANCE = t('Финансы')
const SETTINGS_PRODUCTS = t('Продукты')
const SETTINGS_MISC = t('Разное')

const STATS_SALES = t('Продажи')
const STATS_FINANCE = t('Финансы')
const STATS_CLIENTS = t('Клиенты')
const STATS_PROVIDERS = t('Поставщики')
const STATS_STOCK = t('Склад')
const STATS_OVERALL = t('Общее')

const DEFAULT_PAGE_SIZE = getPageSize()
const defaultPageSizeQuery = {pageSize: DEFAULT_PAGE_SIZE}
export const MenuItems = [
    {
        name: t('Продажи'),
        icon: (<AttachMoney/>),
        url: ROUTES.ORDER_LIST_URL,
        query: defaultPageSizeQuery,
        childs: [
            {name: t('Заказы'), url: ROUTES.ORDER_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_orders'},
            {name: t('Возвраты'), url: ROUTES.RETURN_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_order_returns'},
            {name: t('Активность'), url: ROUTES.ACTIVITY_LIST_URL, permission: 'frontend_activity'},
            {name: t('План'), url: ROUTES.PLAN_LIST_URL, permission: 'frontend_plan'},
            {name: t('Формирование цен'), url: ROUTES.PRICE_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_prices'},
            {name: t('Отслеживание'), url: ROUTES.TRACKING_LIST_URL, permission: 'frontend_tracking'},
            {name: t('Маркетинговые акции'), url: ROUTES.PRICES_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_bonuses'},
            {name: t('Зоны'), url: ROUTES.ZONES_LIST_URL, permission: 'frontend_zones'}
        ]
    },
    {
        name: t('Магазины'),
        icon: (<Markets/>),
        url: ROUTES.SHOP_LIST_URL,
        query: defaultPageSizeQuery,
        dynamic: true,
        childs: [
            {name: t('Магазины'), url: ROUTES.SHOP_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_shops', icon: (<Markets/>)},
            {name: t('Клиенты'), url: ROUTES.CLIENT_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_clients', icon: (<Clients/>)}
        ]
    },
    {
        name: t('Продукты'),
        icon: (<Products/>),
        url: ROUTES.PRODUCT_LIST_URL,
        query: defaultPageSizeQuery,
        childs: [
            {name: t('Продукты'), url: ROUTES.PRODUCT_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_products'}
        ]
    },
    {
        name: t('Склад'),
        icon: (<Store/>),
        url: ROUTES.REMAINDER_LIST_URL,
        query: defaultPageSizeQuery,
        childs: [
            {name: t('Остаток'), url: ROUTES.REMAINDER_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_remainder'},
            {name: t('Инвентаризация'), url: ROUTES.INVENTORY_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_inventory'},
            {
                name: t('Приемка / Передача'),
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
        name: t('Поставки'),
        icon: (<Supply/>),
        url: ROUTES.SUPPLY_LIST_URL,
        query: defaultPageSizeQuery,
        childs: [
            {name: t('Поставщики'), url: ROUTES.PROVIDER_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_suppliers'},
            {name: t('Поставки'), url: ROUTES.SUPPLY_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_supply'}
        ]
    },
    {
        name: t('Финансы'),
        icon: (<Finance/>),
        url: ROUTES.TRANSACTION_LIST_URL,
        query: defaultPageSizeQuery,
        childs: [
            {name: t('Транзакции'), url: ROUTES.TRANSACTION_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_transactions'},
            {name: t('Ожидаемые расходы'), url: ROUTES.PENDING_EXPENSES_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_pending_expenses'},
            {name: t('Ожидаeмые оплаты'), url: ROUTES.PENDING_PAYMENTS_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_pending_payments'},
            {name: t('Баланс клиентов'), url: ROUTES.CLIENT_BALANCE_LIST_URL, permission: 'frontend_client_balance', query: {pageSize: 25}},
            {name: t('Баланс поставщиков'), url: ROUTES.PROVIDER_BALANCE_LIST_URL, permission: 'frontend_provider_balance', query: {pageSize: 25}}
        ]
    },
    {
        name: t('Производство'),
        icon: (<Map/>),
        url: ROUTES.MANUFACTURE_LIST_URL,
        query: defaultPageSizeQuery,
        childs: [
            {
                name: t('Производство'),
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
        name: t('Статистика'),
        icon: (<Statistics/>),
        section: 'Statistics',
        url: ROUTES.STATISTICS_LIST_URL,
        childs: [
            {section: STATS_SALES, name: t('Оборот'), url: ROUTES.STATISTICS_SALES_URL, permission: 'frontend_stat_sales'},
            {section: STATS_SALES, name: t('Агенты'), url: ROUTES.STATISTICS_AGENT_URL, permission: 'frontend_stat_agents', query: {pageSize: 25}},
            {section: STATS_SALES, name: t('Товары'), url: ROUTES.STATISTICS_PRODUCT_URL, permission: 'frontend_stat_product', query: {pageSize: 25}},
            {section: STATS_SALES, name: t('Магазины'), url: ROUTES.STATISTICS_MARKET_URL, permission: 'frontend_stat_markets', query: {pageSize: 25}},
            {section: STATS_SALES, name: t('Возврат'), url: ROUTES.STATISTICS_RETURN_URL, permission: 'frontend_stat_order_returns'},
            // -------------------------------------------------------------------------------------------------- //
            {section: STATS_FINANCE, name: t('Оборот'), url: ROUTES.STATISTICS_FINANCE_URL, permission: 'frontend_stat_finance'},
            {section: STATS_FINANCE, name: t('Расходы по категориям'), url: ROUTES.STATISTICS_OUTCOME_CATEGORY_URL, permission: 'frontend_stat_outcome_category'},
            {section: STATS_FINANCE, name: t('Расходы на персонал'), url: ROUTES.STATISTICS_EXPENDITURE_ON_STAFF_URL, permission: 'frontend_stat_expenditure_on_staff'},
            {section: STATS_FINANCE, name: t('Кассы'), url: ROUTES.STATISTICS_CASHBOX_URL, permission: 'frontend_stat_cashbox'},
            // -------------------------------------------------------------------------------------------------- //
            {section: STATS_CLIENTS, name: t('Оборот клиентов'), url: ROUTES.STATISTICS_CLIENT_INCOME_URL, permission: 'frontend_stat_client_income'},
            {section: STATS_CLIENTS, name: t('Баланс клиентов'), url: ROUTES.STATISTICS_CLIENT_BALANCE_URL, permission: 'frontend_stat_client_balance', query: {pageSize: 25}},
            {section: STATS_CLIENTS, name: t('Должники'), url: ROUTES.STATISTICS_DEBTORS_URL, permission: 'frontend_stat_debtors'},
            // -------------------------------------------------------------------------------------------------- //
            {section: STATS_PROVIDERS, name: t('Оборот поставщиков'), url: ROUTES.STATISTICS_PROVIDER_TRANSACTIONS_URL, permission: 'frontend_stat_providers_transactions'},
            {section: STATS_PROVIDERS, name: t('Баланс поставщиков'), url: ROUTES.STATISTICS_PROVIDERS_URL, permission: 'frontend_stat_providers', query: {pageSize: 25}},
            // -------------------------------------------------------------------------------------------------- //
            {section: STATS_STOCK, name: t('Остаток'), url: ROUTES.STATISTICS_REMAINDER_URL, permission: 'frontend_stat_remainder', query: {pageSize: 25}},
            {section: STATS_STOCK, name: t('Движение товаров'), url: ROUTES.STATISTICS_PRODUCT_MOVE_URL, permission: 'frontend_stat_product_move', query: {pageSize: 25}},
            // -------------------------------------------------------------------------------------------------- //
            {section: STATS_OVERALL, name: t('Генеральный отчет'), url: ROUTES.STATISTICS_REPORT_URL, permission: 'frontend_stat_report'}
        ]
    },
    {
        name: t('Телеграм'),
        icon: (<Telegram/>),
        url: ROUTES.TELEGRAM_LIST_URL,
        childs: [
            {name: t('Пользователи'), url: ROUTES.TELEGRAM_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_telegram_users'},
            {name: t('Новости'), url: ROUTES.TELEGRAM_NEWS_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_telegram_news'},
            {name: t('Оплаты'), url: ROUTES.CLIENT_TRANSACTION_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_client_transaction'},
            {name: t('Системные страницы'), url: ROUTES.SYSTEM_PAGES_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_system_pages'}
        ]
    },
    {
        name: t('Настройки'),
        icon: (<Settings/>),
        section: 'Settings',
        url: ROUTES.USERS_LIST_URL,
        bottom: true,
        childs: [
            {section: SETTINGS_STAFF, name: t('Сотрудники'), url: ROUTES.USERS_LIST_URL, permission: 'frontend_settings_users'},
            {section: SETTINGS_STAFF, name: t('Смены'), url: ROUTES.SHIFT_LIST_URL, permission: 'frontend_settings_shift'},
            {section: SETTINGS_STAFF, name: t('Должности'), url: ROUTES.POST_LIST_URL, permission: 'frontend_settings_post'},
            {section: SETTINGS_STAFF, name: t('Права доступа'), url: ROUTES.POSITION_LIST_URL, permission: 'frontend_settings_position'},

            {section: SETTINGS_FINANCE, name: t('Валюты'), url: ROUTES.CURRENCY_LIST_URL, permission: 'frontend_settings_currency'},
            {section: SETTINGS_FINANCE, name: t('Кассы'), url: ROUTES.CASHBOX_LIST_URL, permission: 'frontend_settings_cashbox'},
            {section: SETTINGS_FINANCE, name: t('Категории приходов'), url: ROUTES.INCOME_CATEGORY_LIST_URL, permission: 'frontend_settings_income_category'},
            {section: SETTINGS_FINANCE, name: t('Категории расходов'), url: ROUTES.EXPENSIVE_CATEGORY_LIST_URL, permission: 'frontend_settings_expense_category'},

            {section: SETTINGS_PRODUCTS, name: t('Типы продуктов'), url: ROUTES.PRODUCT_TYPE_LIST_URL, permission: 'frontend_settings_product_type'},
            {section: SETTINGS_PRODUCTS, name: t('Измерения'), url: ROUTES.MEASUREMENT_LIST_URL, permission: 'frontend_settings_measurement'},
            {section: SETTINGS_PRODUCTS, name: t('Типы магазинов'), url: ROUTES.MARKET_TYPE_LIST_URL, permission: 'frontend_settings_market_type'},

            {section: SETTINGS_MISC, name: t('Прайс-листы'), url: ROUTES.PRICE_LIST_SETTING_LIST_URL, permission: 'frontend_settings_price_list'},
            {section: SETTINGS_MISC, name: t('Склады'), url: ROUTES.STOCK_LIST_URL, permission: 'frontend_settings_stock'},
            {section: SETTINGS_MISC, name: t('Оборудования'), url: ROUTES.EQUIPMENT_LIST_URL, permission: 'frontend_settings_equipment'},
            {section: SETTINGS_MISC, name: t('Организация'), url: ROUTES.DIVISION_LIST_URL, permission: 'frontend_settings_division'},
            {section: SETTINGS_MISC, name: t('Объединение'), url: ROUTES.JOIN_LIST_URL, permission: 'frontend_settings_join'},
            {section: SETTINGS_MISC, name: t('Ограничение времени'), url: ROUTES.PERMISSION_LIST_URL, permission: 'frontend_settings_permissions'},
            {section: SETTINGS_MISC, name: t('Уведомления'), url: ROUTES.NOTIFICATION_TEMPLATE_LIST_URL, permission: 'frontend_settings_notifications'}
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
                query: _.get(parent, 'query'),
                icon: _.get(parent, 'icon'),
                section: _.get(parent, 'section') || '',
                dynamic: _.get(parent, 'dynamic'),
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

