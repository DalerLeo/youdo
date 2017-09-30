import React from 'react'
import _ from 'lodash'
import * as ROUTES from '../../constants/routes'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Link} from 'react-router'
import PropTypes from 'prop-types'

const enhance = compose(
    injectSheet({
        wrapper: {
            padding: '20px 30px',
            '& .row': {
                margin: '0rem !important',
                '& div': {
                    lineHeight: '55px'
                }
            },
            '& ul': {
                fontWeight: 'bold',
                marginBottom: '20px',
                '& > a': {
                    fontWeight: 'bold',
                    color: '#333'
                }
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
            color: '#12aaeb !important'
        },
        simple: {
            color: '#333 !important'
        }
    }),
)

const StatSideMenu = enhance((props) => {
    const {classes, currentUrl} = props
    const statMenus = [
        {
            section: 'Продажи',
            url: ROUTES.STATISTICS_SALES_URL,
            childs: [
                {name: 'Агенты', url: ROUTES.STATISTICS_AGENT_URL},
                {name: 'Товары', url: ROUTES.STATISTICS_PRODUCT_URL, query: {pageSize: 25}},
                {name: 'Магазины', url: ROUTES.STATISTICS_MARKET_URL},
                {name: 'Возврат', url: ROUTES.STATISTICS_RETURN_URL}
            ]
        },
        {
            section: 'Финансы',
            url: ROUTES.STATISTICS_FINANCE_URL,
            childs: [
                {name: 'Расходы по категориям', url: ROUTES.STATISTICS_OUTCOME_CATEGORY_URL},
                {name: 'Кассы', url: ROUTES.STATISTICS_CASHBOX_URL}
            ]
        },
        {
            section: 'Клиенты',
            childs: [
                {name: 'Оборот клиентов', url: ROUTES.STATISTICS_CLIENT_INCOME_URL},
                {name: 'Баланс клиентов', url: ROUTES.STATISTICS_CLIENT_BALANCE_URL, query: {pageSize: 25}}
            ]
        },
        {
            section: 'Склад',
            childs: [
                {name: 'Остаток', url: ROUTES.STATISTICS_REMAINDER_URL, query: {pageSize: 25}},
                {name: 'Движение товаров', url: ROUTES.STATISTICS_PRODUCT_MOVE_URL, query: {pageSize: 25}}
            ]
        },
        {
            section: 'Генеральный отчет',
            url: ROUTES.STATISTICS_REPORT_URL,
            childs: []
        }
    ]

    return (
        <div className={classes.wrapper}>
            {_.map(statMenus, (item, index) => {
                return (
                    <ul key={index}>
                        {item.url
                            ? <Link to={{pathname: item.url, query: item.query}} className={(item.url === currentUrl) && classes.active}>{item.section}</Link>
                            : <span>{item.section}</span>}
                        {_.map(item.childs, (object, i) => {
                            return (
                                <li key={i}>
                                    {object.url ? <Link to={{pathname: object.url, query: object.query}}>
                                         <span className={object.url === currentUrl ? classes.active : classes.simple}>
                                             {object.name}
                                         </span>
                                     </Link>
                                    : <span>{object.name}</span>}
                                </li>
                            )
                        })}
                    </ul>
                )
            })}
        </div>
    )
})

StatSideMenu.propTypes = {
    currentUrl: PropTypes.string.isRequired
}

export default StatSideMenu
