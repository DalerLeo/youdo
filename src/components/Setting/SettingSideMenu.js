import React from 'react'
import _ from 'lodash'
import * as ROUTES from '../../constants/routes'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Link} from 'react-router'
import PropTypes from 'prop-types'

const enhance = compose(
    injectSheet({
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '225px',
            maxWidth: '225px'

        },
        wrapper: {
            padding: '30px 30px 20px',
            '& ul': {
                fontWeight: 'bold',
                marginBottom: '20px'
            },
            '& li': {
                paddingLeft: '20px',
                paddingTop: '10px',
                fontWeight: '400',
                '&:last-child': {
                    paddingBottom: '10px'
                }
            }
        },
        active: {
            color: '#12aaeb'
        },
        simple: {
            color: '#333'
        }
    }),
)

const SettingSideMenu = enhance((props) => {
    const {classes, currentUrl} = props
    const statMenus = [
        {
            section: 'Персонал',
            url: ROUTES.USERS_LIST_URL,
            childs: [
                {name: 'Пользователи', url: ROUTES.USERS_LIST_URL},
                {name: 'Смена', url: ROUTES.SHIFT_LIST_URL},
                {name: 'Должности', url: ROUTES.POSITION_LIST_URL}
            ]
        },
        {
            section: 'Финансы',
            url: ROUTES.CURRENCY_LIST_URL,
            childs: [
                {name: 'Валюты', url: ROUTES.CURRENCY_LIST_URL},
                {name: 'Кассы', url: ROUTES.CASHBOX_LIST_URL},
                {name: 'Категории расходов', url: ROUTES.EXPENSIVE_CATEGORY_LIST_URL}
            ]
        },
        {
            section: 'Продукты',
            url: ROUTES.PRODUCT_TYPE_LIST_URL,
            childs: [
                {name: 'Типы продуктов', url: ROUTES.PRODUCT_TYPE_LIST_URL},
                {name: 'Измерения', url: ROUTES.MEASUREMENT_LIST_URL}
            ]
        },
        {
            section: 'Другие',
            url: ROUTES.MARKET_TYPE_LIST_URL,
            childs: [
                {name: 'Тип магазина', url: ROUTES.MARKET_TYPE_LIST_URL},
                {name: 'Склады', url: ROUTES.STOCK_LIST_URL},
                {name: 'Оборудование', url: ROUTES.EQUIPMENT_LIST_URL},
                {name: 'Подразделение', url: ROUTES.DIVISION_LIST_URL},
                {name: 'Объединение', url: ROUTES.JOIN_LIST_URL}

            ]
        }
    ]

    return (
        <div className={classes.leftPanel}>
            <div className={classes.wrapper}>
                {_.map(statMenus, (item, index) => {
                    return (
                        <ul key={index}>
                            {item.section}
                            {_.map(item.childs, (object, i) => {
                                return (
                                    <li key={i}>
                                        <Link to={object.url}>
                                             <span className={object.url === currentUrl ? classes.active : classes.simple}>
                                                 {object.name}
                                             </span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    )
                })}
            </div>
        </div>
    )
})

SettingSideMenu.propTypes = {
    currentUrl: PropTypes.string.isRequired
}

export default SettingSideMenu
