import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import * as SHOP from '../../constants/shop'
import {Tabs, Tab} from 'material-ui/Tabs'
import ShopDetailsContact from './ShopDetailsContact'
import ShopDetailsMap from './ShopDetailsMap'
import ShopDetailsActivity from './ShopDetailsActivity'
import ShopDetailsStatistics from './ShopDetailsStatistics'

const enhance = compose(
    injectSheet({
        tabWrapper: {
            width: '100%'
        },
        colorCat: {
            marginBottom: '0',
            width: '100%',
            '& > div': {
                width: '40% !important',
                paddingRight: '60%',
                background: 'transparent !important'
            },
            '& > div:first-child': {
                borderBottom: '1px #f2f5f8 solid',
                whiteSpace: 'initial !important'
            },
            '& > div:last-child': {
                width: '100% !important',
                padding: '0'
            },
            '& > div:nth-child(2) > div': {
                marginTop: '0px !important',
                marginBottom: '-1px',
                backgroundColor: '#12aaeb !important',
                height: '1px !important'
            },
            '& button': {
                color: '#333 !important',
                backgroundColor: '#fefefe !important'
            },
            '& button > span:first-line': {
                color: '#a6dff7'
            },
            '& button div div': {
                textTransform: 'initial'
            }
        }
    })
)

const ShopDetailsTab = enhance((props) => {
    const {classes, tabData, data} = props
    const tab = _.get(tabData, 'tab')
    const lat = _.get(data, 'lat')
    const lng = _.get(data, 'lon')
    return (
        <div className={classes.tabWrapper}>
            <Tabs
                className={classes.colorCat}
                value={tab}
                onChange={(value) => tabData.handleTabChange(value)}>
                <Tab label="Информация" value={SHOP.SHOP_TAB_CONTACT}/>
                <Tab label="Продажи" value={SHOP.SHOP_TAB_ACTIVITY} />
                <Tab label="Статистика" value={SHOP.SHOP_TAB_STATISTICS} />
                <Tab label="Карта" value={SHOP.SHOP_TAB_MAP} />
            </Tabs>
            {SHOP.SHOP_TAB_CONTACT === tab && <ShopDetailsContact data={data} />}
            {SHOP.SHOP_TAB_ACTIVITY === tab && <ShopDetailsActivity data={data} />}
            {SHOP.SHOP_TAB_STATISTICS === tab && <ShopDetailsStatistics data={data} />}
            {SHOP.SHOP_TAB_MAP === tab &&
            <div style={{width: '100%', height: '385px'}}>
                <ShopDetailsMap
                    lat={lat}
                    lng={lng}/>
            </div>}
        </div>
    )
})
ShopDetailsTab.propTypes = {
    data: PropTypes.object.isRequired,
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    })
}

export default ShopDetailsTab
