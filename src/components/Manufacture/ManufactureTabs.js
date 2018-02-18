import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Paper from 'material-ui/Paper'
import * as ROUTES from '../../constants/routes'
import {Link} from 'react-router'
import t from '../../helpers/translate'

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
            borderBottom: '2px #12aaeb solid',
            cursor: 'default'
        }
    })
)

const tabs = [
    {
        title: t('Продукция'),
        url: ROUTES.MANUFACTURE_PRODUCT_LIST_URL
    },
    {
        title: t('Персонал'),
        url: ROUTES.MANUFACTURE_PERSON_LIST_URL
    },
    {
        title: t('Оборудование'),
        url: ROUTES.MANUFACTURE_EQUIPMENT_LIST_URL
    },
    {
        title: t('Активность'),
        url: ROUTES.MANUFACTURE_SHIPMENT_LIST_URL
    }
]

const ManufactureTabs = enhance((props) => {
    const {classes, currentURL, detailId} = props
    return (
        <Paper zDepth={1} className={classes.tabWrapper}>
            {
                _.map(tabs, (tab, index) => {
                    const title = _.get(tab, 'title')
                    const url = _.get(tab, 'url')
                    if (detailId) {
                        return (
                            <Link key={index} to={{pathname: url + '/' + detailId}}>
                                <div className={currentURL === url ? classes.activeTab : classes.tab}>
                                    <span>{title}</span>
                                </div>
                            </Link>
                        )
                    }

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
