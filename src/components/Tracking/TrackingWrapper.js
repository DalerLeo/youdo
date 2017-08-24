import _ from 'lodash'
import React from 'react'
import {Link} from 'react-router'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import sprintf from 'sprintf'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import moment from 'moment'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import TrackingMap from './TrackingMap'
import Dot from 'material-ui/svg-icons/av/fiber-manual-record'
import TrackingDetails from './TrackingDetails'
import ShopDetails from './TrackingShopDetails'
import Man from 'material-ui/svg-icons/action/accessibility'
import Loyalty from 'material-ui/svg-icons/action/loyalty'
import Van from 'material-ui/svg-icons/maps/local-shipping'
import Money from 'material-ui/svg-icons/maps/local-atm'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            background: '#fff',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        red: {
            color: '#e57373 !important'
        },
        green: {
            color: '#81c784 !important'
        },
        trackingWrapper: {
            background: '#f2f5f8',
            position: 'relative',
            overflowX: 'hidden',
            margin: '-60px -28px 0',
            minHeight: 'calc(100% + 28px)',
            zIndex: '1',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -2px 5px, rgba(0, 0, 0, 0.05) 0px -2px 6px',
            '& > div:first-child': {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            }
        },
        wrapper: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        },
        trackingInfo: {
            background: '#fff',
            position: 'absolute',
            width: '350px',
            top: '60px',
            right: '-28px',
            bottom: '-28px',
            borderLeft: '1px #efefef solid',
            transition: 'all 0.3s ease',
            zIndex: '3'
        },
        trackingInfoTitle: {
            display: 'flex',
            alignItems: 'center',
            padding: '20px 30px',
            borderBottom: '1px #efefef solid',
            fontWeight: '600',
            '& span': {
                textAlign: 'right',
                lineHeight: '14px'
            }
        },
        online: {
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            fontSize: '28px',
            lineHeight: '28px',
            marginLeft: '10px',
            '& span': {
                fontSize: 'inherit !important'
            }
        },
        content: {
            padding: '20px 30px'
        },
        inputFieldCustom: {
            flexBasis: '200px',
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        checkbox: {
            margin: '15px 0 !important',
            '& span': {
                top: '-10px !important',
                left: '-10px !important'
            }
        },
        filter: {
            marginBottom: '20px'
        },
        title: {
            fontWeight: '600',
            marginBottom: '15px'
        },
        activeAgents: {
            margin: '-10px 0 10px'
        },
        agent: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            '& a': {
                color: '#333',
                marginRight: '5px'
            },
            '& i': {
                fontSize: '10px',
                color: '#999'
            },
            '& svg': {
                width: '12px !important',
                height: '12px !important',
                marginRight: '10px',
                color: '#666'
            }
        }
    })
)

const TrackingWrapper = enhance((props) => {
    const ZERO = 0
    const {
        classes,
        filter,
        listData,
        detailData,
        handleOpenDetails,
        agentLocation,
        marketsLocation,
        isOpenTrack,
        isOpenMarkets,
        filterForm,
        shopDetails
    } = props

    const listLoading = _.get(listData, 'listLoading')
    const agentsCount = _.get(listData, ['data', 'length'])
    let agentsOnline = 0

    const openDetail = _.get(detailData, 'openDetail')
    let openShopDetail = false
    if (_.get(shopDetails, 'openShopDetails') > ZERO) {
        openShopDetail = true
    }
    const orderedData = _.orderBy(_.get(listData, 'data'), ['registeredDate'], ['desc'])

    const iconStyle = {
        icon: {
            color: '#fff',
            width: 22,
            height: 22
        },
        button: {
            width: 40,
            height: 40,
            padding: 0,
            display: 'flex',
            margin: '0 10px'
        }
    }
    const buttons = [
        {
            group: 1,
            icon: <Man/>
        },
        {
            group: 2,
            icon: <Loyalty/>
        },
        {
            group: 3,
            icon: <Van/>
        },
        {
            group: 4,
            icon: <Money/>
        }
    ]

    const zoneInfoToggle = (
        <div className={classes.trackingInfo}>
            {!listLoading ? <div className={classes.wrapper}>
                <div className={classes.trackingInfoTitle}>
                    <span>Сотрудников <br/> online</span>
                    <div className={classes.online}>
                        <div>
                            {
                                _.map(_.get(listData, 'data'), (item) => {
                                    const FIVE_MIN = 350000
                                    const dateNow = _.toInteger(moment().format('x'))
                                    const registeredDate = _.toInteger(moment(_.get(item, 'registeredDate')).format('x'))
                                    let isOnline = false
                                    if ((dateNow - registeredDate) <= FIVE_MIN) {
                                        isOnline = true
                                    }
                                    if (isOnline) {
                                        agentsOnline++
                                    }
                                })
                            }
                            <span className={agentsOnline > ZERO && classes.green}>{agentsOnline}</span>/<span>{agentsCount}</span>
                        </div>
                    </div>
                </div>
                <div className={classes.titleTabs}>
                    {_.map(buttons, (item) => {
                        const group = _.get(item, 'group')
                        const icon = _.get(item, 'icon')

                        return (
                            <IconButton
                                key={group}
                                disableTouchRipple={true}
                                className={(group === groupId) && classes.activeTab}
                                // onTouchTap={() => { handleClickTab(group) }}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                {icon}
                            </IconButton>
                        )
                    })}
                </div>
                <div className={classes.content}>
                    <div className={classes.activeAgents}>
                        {_.map(orderedData, (item) => {
                            const id = _.get(item, 'id')
                            const agent = _.get(item, 'agent')
                            const FIVE_MIN = 350000
                            const dateNow = _.toInteger(moment().format('x'))
                            const registeredDate = _.toInteger(moment(_.get(item, 'registeredDate')).format('x'))
                            const difference = dateNow - registeredDate
                            let isOnline = false
                            if (difference <= FIVE_MIN) {
                                isOnline = true
                            }
                            const lastSeen = moment(registeredDate).fromNow()

                            return (
                                    <div key={id} className={classes.agent}>
                                        <Dot style={isOnline ? {color: '#81c784'} : {color: '#666'}}/>
                                        <Link to={{
                                            pathname: sprintf(ROUTES.TRACKING_ITEM_PATH, id),
                                            query: filter.getParams()
                                        }}>{agent}</Link>
                                        {!isOnline && <i>({lastSeen})</i>}
                                    </div>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
                : <div className={classes.loader}>
                    <div>
                        <CircularProgress size={40} thickness={4}/>
                    </div>
                </div>}
            {openDetail &&
            <TrackingDetails
                initialValues={filterForm.initialValues}
                filter={filter}
                listData={listData}
                detailData={detailData}
                filterForm={filterForm}
                isOpenTrack={isOpenTrack}
                agentLocation={agentLocation}
            />
            }
            {openShopDetail &&
            <ShopDetails
                shopDetails={shopDetails}
            />
            }
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.TRACKING_LIST_URL} opacity={true}/>
            <div className={classes.trackingWrapper}>
                <TrackingMap
                    filter={filter}
                    agentId={_.get(detailData, 'id')}
                    listData={_.get(listData, 'data')}
                    handleOpenDetails={handleOpenDetails}
                    agentLocation={agentLocation}
                    marketsLocation={marketsLocation}
                    isOpenMarkets={isOpenMarkets}
                    shopDetails={shopDetails}
                />
            </div>
            {zoneInfoToggle}
        </Container>
    )
})

TrackingWrapper.PropTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    agentLocation: PropTypes.object,
    marketsLocation: PropTypes.object,
    handleOpenDetails: PropTypes.func,
    filterForm: PropTypes.shape({
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    isOpenTrack: PropTypes.bool,
    isOpenMarkets: PropTypes.bool,
    shopDetails: PropTypes.shape({
        openShopDetails: PropTypes.number.isRequired,
        handleOpenShopDetails: PropTypes.func.isRequired,
        handleCloseShopDetails: PropTypes.func.isRequired
    })
}

export default TrackingWrapper
