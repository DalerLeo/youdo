import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Col} from 'react-flexbox-grid'
import * as SUPPLY from '../../constants/supply'
import {Tabs, Tab} from 'material-ui/Tabs'
import SupplyDetailsImg from './SupplyDetailsImg'
import SupplyDetailsMap from './SupplyDetailsMap'
import SupplyDetailsActivity from './SupplyDetailsActivity'
import SupplyDetailsStatistics from './SupplyDetailsStatistics'

const enhance = compose(
    injectSheet({
        rightSide: {
            boxShadow: '-5px 0px 5px #E0E0E0;',
            padding: '8px 25px'
        },
        colorCat: {
            borderBottom: '2px solid #e8e8e8',
            marginBottom: '20px',
            '& > div': {
                width: '60% !important'
            },
            '& > div:nth-child(2) > div': {
                marginTop: '0px !important',
                marginBottom: '-2px',
                backgroundColor: '#a6dff7 !important'
            },
            '& button': {
                color: 'black !important',
                backgroundColor: 'white !important'
            },
            '& button > span:first-line': {
                color: '#a6dff7'
            }
        }
    })
)

const SupplyDetailsTab = enhance((props) => {
    const {classes, tabData, data} = props
    const tab = _.get(tabData, 'tab')
    const lat = _.get(data, 'lat')
    const lng = _.get(data, 'lon')
    return (
        <Col className={classes.rightSide} xs={6} md={8}>
            <div>
                <Tabs
                    className={classes.colorCat}
                    value={tab}
                    onChange={(value) => tabData.handleTabChange(value)}>
                    <Tab label="Map" value={SUPPLY.SUPPLY_TAB_MAP}/>
                    <Tab label="Statistics" value={SUPPLY.SUPPLY_TAB_STATISTICS} />
                    <Tab label="Activity" value={SUPPLY.SUPPLY_TAB_ACTIVITY} />
                    <Tab label="Images" value={SUPPLY.SUPPLY_TAB_IMAGE} />
                </Tabs>
                {SUPPLY.SUPPLY_TAB_MAP === tab &&
                <div style={{width: '100%', height: '385px'}}>
                    <SupplyDetailsMap
                        lat={lat}
                        lng={lng}/>
                </div>}
                {SUPPLY.SUPPLY_TAB_STATISTICS === tab && <SupplyDetailsStatistics />}
                {SUPPLY.SUPPLY_TAB_ACTIVITY === tab && <SupplyDetailsActivity />}
                {SUPPLY.SUPPLY_TAB_IMAGE === tab && <SupplyDetailsImg />}
            </div>
        </Col>
    )
})
SupplyDetailsTab.propTypes = {
    data: PropTypes.object.isRequired,
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    })
}

export default SupplyDetailsTab
