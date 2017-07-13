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

const StatSideMenu = enhance((props) => {
    const {classes, currentUrl} = props
    const statMenus = [
        {
            section: 'Продажи',
            url: ROUTES.STATISTICS_SALES_URL,
            childs: [
                {name: 'Общее', url: ROUTES.STATISTICS_SALES_URL},
                {name: 'Агенты', url: ROUTES.STATISTICS_AGENT_URL},
                {name: 'Товары', url: ROUTES.STATISTICS_PRODUCT_URL},
                {name: 'Магазины', url: ROUTES.STATISTICS_MARKET_URL}
            ]
        },
        {
            section: 'Финансы',
            url: ROUTES.STATISTICS_FINANCE_URL,
            childs: [
                {name: 'Общее', url: ROUTES.STATISTICS_FINANCE_URL},
                {name: 'Доход', url: ROUTES.STATISTICS_INCOME_URL},
                {name: 'Расход', url: ROUTES.STATISTICS_OUTCOME_URL},
                {name: 'Задолжники', url: ROUTES.STATISTICS_DEBTORS_URL}
            ]
        }
    ]

    return (
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
    )
})

StatSideMenu.propTypes = {
    currentUrl: PropTypes.string.isRequired
}

export default StatSideMenu
