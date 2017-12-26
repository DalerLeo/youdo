import React from 'react'
import _ from 'lodash'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import moment from 'moment'
import {connect} from 'react-redux'
import {getMenus} from '../SidebarMenu/MenuItems'

const enhance = compose(
    injectSheet({
        wrapper: {
            padding: '20px 30px',
            overflowY: 'auto',
            height: '100%',
            '&::-webkit-scrollbar': {
                width: '0'
            },
            '&:hover': {
                '&::-webkit-scrollbar': {
                    width: '4px !important'
                }
            },
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
    connect((state) => {
        const permissions = _.map(_.get(state, ['authConfirm', 'data', 'permissions']), (item) => {
            return _.get(item, 'codename')
        })
        const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        return {
            permissions,
            isAdmin
        }
    })
)

const lastDay = moment().daysInMonth()
const firstDayOfMonth = moment().format('YYYY-MM-01')
const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

const StatSideMenu = enhance((props) => {
    const {classes, currentUrl, filter, permissions, isAdmin} = props
    const fromDate = filter ? _.get(filter.getParams(), 'fromDate') : firstDayOfMonth
    const toDate = filter ? _.get(filter.getParams(), 'toDate') : lastDayOfMonth
    const MenuItems = _.find(getMenus(permissions, isAdmin), {'section': 'Statistics'})
    const sortedMenu = _.groupBy(MenuItems.childs, 'section')
    const customQuery = {fromDate: fromDate, toDate: toDate}

    return (
        <div className={classes.wrapper}>
            {_.map(sortedMenu, (item, index) => {
                return (
                    <ul key={index}>
                        {index}
                        {_.map(item, (object, i) => {
                            return (
                                <li key={i}>
                                    <Link to={{pathname: object.url, query: _.merge(object.query, customQuery)}}>
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
