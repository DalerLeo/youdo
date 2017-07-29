import React from 'react'
import * as ROUTES from '../../constants/routes'
import AttachMoney from 'material-ui/svg-icons/editor/attach-money'
import Home from 'material-ui/svg-icons/action/home'
import AccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet'
import Map from 'material-ui/svg-icons/maps/map'
import Settings from 'material-ui/svg-icons/action/settings'
import Statistics from 'material-ui/svg-icons/action/trending-up'
import Zone from 'material-ui/svg-icons/maps/place'

export const MenuItems = [
    {
        name: 'Продажи',
        icon: (<AttachMoney />),
        url: ROUTES.ORDER_LIST_URL,
        childs: [
            {name: 'Заказы', url: ROUTES.ORDER_LIST_URL},
            {name: 'Клиенты', url: ROUTES.CLIENT_LIST_URL},
            {name: 'Маркетинговые акции', url: ROUTES.PRICES_LIST_URL},
            {name: 'Формирование цен', url: ROUTES.PRICE_LIST_URL},
            {name: 'Магазины', url: ROUTES.SHOP_LIST_URL}
        ]
    },
    {
        name: 'Метрика',
        icon: (<Statistics />),
        url: ROUTES.ACTIVITY_LIST_URL,
        childs: [
            {name: 'Активность', url: ROUTES.ACTIVITY_LIST_URL},
            {name: 'План', url: ROUTES.PLAN_LIST_URL},
            {name: 'Статистика', url: ROUTES.STATISTICS_LIST_URL}
        ]
    },
    {
        name: 'Склад',
        icon: (<Home />),
        childs: [
            {name: 'Продукты', url: ROUTES.PRODUCT_LIST_URL},
            {name: 'Поставщики', url: ROUTES.PROVIDER_LIST_URL},
            {name: 'Поставки', url: ROUTES.SUPPLY_LIST_URL},
            {name: 'Остаток', url: ROUTES.REMAINDER_LIST_URL},
            {name: 'Приемка / Передача', url: ROUTES.STOCK_RECEIVE_LIST_URL}
        ],
        url: ROUTES.PRODUCT_LIST_URL
    },
    {
        name: 'Бухгалтерия',
        icon: (<AccountBalanceWallet />),
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
        name: 'Зоны',
        icon: (<Zone />),
        url: ROUTES.ZONES_LIST_URL,
        childs: [
            {name: 'Зоны', url: ROUTES.ZONES_LIST_URL},
            {name: 'Отслеживание', url: ROUTES.TRACKING_LIST_URL}
        ]
    },
    {
        name: 'Настройки',
        icon: (<Settings />),
        url: ROUTES.STOCK_LIST_URL,
        childs: [
            {name: 'Склады', url: ROUTES.STOCK_LIST_URL},
            {name: 'Валюты', url: ROUTES.CURRENCY_LIST_URL},
            {name: 'Кассы', url: ROUTES.CASHBOX_LIST_URL},
            {name: 'Категории расходов', url: ROUTES.EXPENSIVE_CATEGORY_LIST_URL},
            {name: 'Бренды', url: ROUTES.BRAND_LIST_URL},
            {name: 'Типы продуктов', url: ROUTES.PRODUCT_TYPE_LIST_URL},
            {name: 'Пользователи', url: ROUTES.USERS_LIST_URL},
            {name: 'Измерения', url: ROUTES.MEASUREMENT_LIST_URL},
            {name: 'Оборудование', url: ROUTES.EQUIPMENT_LIST_URL},
            {name: 'Смена', url: ROUTES.SHIFT_LIST_URL},
            {name: 'Тип магазина', url: ROUTES.MARKET_TYPE_LIST_URL},
            {name: 'Должности', url: ROUTES.POSITION_LIST_URL}
        ]
    }
]
