import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Paper from 'material-ui/Paper'
import * as ROUTES from '../../constants/routes'
import {Link} from 'react-router'

const enhance = compose(
    injectSheet({
        tabWrapper: {
            display: 'flex',
            alignItems: 'center',
            '& > a': {
                fontWeight: 'inherit',
                color: 'inherit'
            }
        },
        tab: {
            height: '52px',
            lineHeight: '52px',
            padding: '0 20px',
            transition: 'all 300ms ease',
            cursor: 'pointer'
        },
        activeTab: {
            extend: 'tab',
            color: '#12aaeb',
            fontWeight: '600',
            borderBottom: '3px #12aaeb solid',
            cursor: 'default'
        }
    })
)

const tabs = [
    {
        title: 'Продукция',
        url: ROUTES.MANUFACTURE_PRODUCT_LIST_URL
    },
    {
        title: 'Персонал',
        url: ROUTES.MANUFACTURE_PERSON_LIST_URL
    },
    {
        title: 'Оборудование',
        url: ROUTES.MANUFACTURE_EQUIPMENT_LIST_URL
    },
    {
        title: 'Партия',
        url: ROUTES.MANUFACTURE_SHIPMENT_LIST_URL
    }
]

const ManufactureTabs = enhance((props) => {
    const {classes, currentURL} = props
    return (
        <Paper zDepth={1} className={classes.tabWrapper}>
            {
                _.map(tabs, (tab, index) => {
                    const title = _.get(tab, 'title')
                    const url = _.get(tab, 'url')

                    return (
                        <Link key={index} to={{pathname: url}}>
                            <div className={currentURL === url ? classes.activeTab : classes.tab}>
                                <span>{title}</span>
                            </div>
                        </Link>
                    )
                })
            }
        </Paper>
    )
})

export default ManufactureTabs