import _ from 'lodash'
import React from 'react'
import {Link} from 'react-router'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import sprintf from 'sprintf'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import moment from 'moment'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import TrackingMap from './TrackingMap'
import TrackingMarketsZones from './TrackingMarketsZones'
import TrackingDatePicker from './TrackingDatePicker'
import Dot from 'material-ui/svg-icons/av/fiber-manual-record'
import TrackingTime from './TrackingTime'
import TrackingAgentSearch from './TrackingAgentSearch'
import ShopDetails from './TrackingShopDetails'
import Man from 'material-ui/svg-icons/action/accessibility'
import GROUP from 'material-ui/svg-icons/social/group'
import Loyalty from 'material-ui/svg-icons/action/loyalty'
import Van from 'material-ui/svg-icons/maps/local-shipping'
import Money from 'material-ui/svg-icons/maps/local-atm'
import ToolTip from '../ToolTip'
import NotFound from '../Images/not-found.png'
import LeftArrow from 'material-ui/svg-icons/navigation/chevron-left'
import RightArrow from 'material-ui/svg-icons/navigation/chevron-right'

const minutePerHour = 60
const current = (_.toInteger(moment().format('H')) * minutePerHour) + _.toInteger(moment().format('m'))

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
        mapLoader: {
            background: '#fcfcfc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: '-28px',
            top: '60px',
            bottom: '-28px',
            zIndex: '2'
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
            zIndex: '6'
        },
        trackingInfoTitle: {
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px #efefef solid',
            padding: '0 30px',
            minHeight: '70px',
            fontWeight: '600',
            '& span': {
                textAlign: 'right',
                lineHeight: '14px'
            }
        },
        toggleButton: {
            background: '#fff',
            position: 'absolute',
            border: '1px #efefef solid',
            borderRight: 'none',
            left: '-21px',
            top: '0'
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
        titleTabs: {
            background: '#ccc',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '40px',
            position: 'relative',
            '& button': {
                justifyContent: 'center',
                alignItems: 'center'
            }
        },
        activeTab: {
            '& svg': {
                color: '#666 !important'
            },
            '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '0',
                borderBottom: '6px solid #fff',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent'
            }
        },
        content: {
            padding: '20px 30px 0',
            overflowY: 'auto',
            overflowX: 'hidden',
            borderTop: '1px #efefef solid'
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
            margin: '0 -30px',
            height: '40px',
            padding: '10px 30px',
            cursor: 'pointer',
            position: 'relative',
            '& a': {
                position: 'absolute',
                top: '0',
                left: '0',
                bottom: '0',
                right: '0',
                padding: '0 30px',
                color: '#333'
            },
            '& i': {
                fontSize: '10px',
                marginLeft: '5px',
                color: '#999'
            },
            '& svg': {
                width: '12px !important',
                height: '12px !important',
                marginRight: '10px',
                color: '#666'
            }
        },
        activeAgent: {
            extend: 'agent',
            background: '#f4f4f4'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '175px',
            padding: '175px 40px 0px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        }
    }),
    withState('sliderValue', 'setSliderValue', current),
    withState('searchQuery', 'setSearchQuery', ''),
    withState('openAgentsInfo', 'toggleAgentsInfo', true)
)

const TrackingWrapper = enhance((props) => {
    const NOT_FOUND = -1
    const ZERO = 0
    const {
        classes,
        filter,
        listData,
        detailData,
        handleOpenDetails,
        agentLocation,
        agentLocationLoading,
        marketsLocation,
        zonesLocation,
        isOpenMarkets,
        initialValues,
        tabData,
        filterForm,
        calendar,
        shopDetails,
        sliderValue,
        setSliderValue,
        searchQuery,
        setSearchQuery,
        openAgentsInfo,
        toggleAgentsInfo
    } = props

    const listLoading = _.get(listData, 'listLoading')
    const agentsCount = _.get(listData, ['data', 'length'])
    let agentsOnline = 0
    const agentId = _.get(detailData, 'id')

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
    const buttonStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            height: 38,
            width: 20,
            padding: '9px 0'
        }
    }
    const buttons = [
        {
            group: 'all',
            icon: <GROUP/>,
            name: 'Все'
        },
        {
            group: 1,
            icon: <Man/>,
            name: 'Агенты'

        },
        {
            group: 2,
            icon: <Loyalty/>,
            name: 'Мерчендайзеры'

        },
        {
            group: 3,
            icon: <Van/>,
            name: 'Доставщики'

        },
        {
            group: 4,
            icon: <Money/>,
            name: 'Инкассаторы'

        }
    ]
    const today = moment().format('YYYY-MM-DD')
    const urlDate = _.get(filter.getParams(), 'date') || moment().format('YYYY-MM-DD')

    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase())
    }
    const filteredList = orderedData.filter((el) => {
        const searchValue = el.agent.toLowerCase()
        return searchValue.indexOf(searchQuery) !== NOT_FOUND
    })

    const zoneInfoToggle = (
        <div className={classes.trackingInfo} style={openAgentsInfo ? {right: -28} : {right: (-378)}}>
            <div className={classes.wrapper}>
                {openDetail && <TrackingDatePicker
                    filter={filter}
                    calendar={calendar}
                    initialValues={filterForm.initialValues}/>}

                {(today === urlDate) &&
                <div className={classes.trackingInfoTitle}>
                    <span>Сотрудников <br/> online</span>
                    {listLoading
                        ? <div className={classes.loader} style={{width: '65px'}}>
                            <div>
                                <CircularProgress size={25} thickness={3}/>
                            </div>
                        </div>
                        : <div className={classes.online}>
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
                                <span
                                    className={agentsOnline > ZERO && classes.green}>{agentsOnline}</span>/<span>{agentsCount}</span>
                            </div>
                        </div>}
                </div>}
                <div className={classes.titleTabs}>
                    <div className={classes.toggleButton}>
                        <IconButton
                            onTouchTap={() => { toggleAgentsInfo(!openAgentsInfo) }}
                            iconStyle={buttonStyle.icon}
                            style={buttonStyle.button}
                            disableTouchRipple={true}>
                            {openAgentsInfo ? <RightArrow/> : <LeftArrow/>}
                        </IconButton>
                    </div>
                    {_.map(buttons, (item) => {
                        const group = _.get(item, 'group')
                        const name = _.get(item, 'name')
                        const groupId = _.get(tabData, 'groupId')
                        const icon = _.get(item, 'icon')
                        return (
                            <ToolTip position="bottom" text={name} key={group}>
                                <IconButton
                                    disableTouchRipple={true}
                                    className={(group === groupId) ? classes.activeTab : ''}
                                    onTouchTap={() => { tabData.handleClickTab(group) }}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}>
                                    {icon}
                                </IconButton>
                            </ToolTip>
                        )
                    })}
                </div>
                <TrackingAgentSearch filter={filter} handleSearch={handleSearch}/>
                <div className={classes.content} style={listLoading ? {overflow: 'hidden'} : {overflowY: 'auto'}}>
                    {listLoading
                        ? <div className={classes.loader}>
                            <div>
                                <CircularProgress size={40} thickness={4}/>
                            </div>
                        </div>
                        : (!_.isEmpty(filteredList) ? <div className={classes.activeAgents}>
                                {_.map(filteredList, (item) => {
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
                                        <div key={id} className={(id === agentId) ? classes.activeAgent : classes.agent}>
                                            <Link to={{
                                                pathname: sprintf(ROUTES.TRACKING_ITEM_PATH, id),
                                                query: filter.getParams()
                                            }}>
                                            </Link>
                                            <Dot style={isOnline ? {color: '#81c784'} : {color: '#666'}}/>
                                            <span>{agent}</span>
                                            {!isOnline && <i>({lastSeen})</i>}
                                        </div>
                                    )
                                })
                                }
                            </div>
                            : <div className={classes.emptyQuery}>
                                <div>По вашему запросу сотрудников не найдено...</div>
                            </div>)}
                </div>
            </div>
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
            {(listLoading || agentLocationLoading) &&
            <div className={classes.mapLoader} style={openAgentsInfo ? {right: 322} : {right: -28}}>
                <div>
                    <CircularProgress size={40} thickness={4}/>
                </div>
            </div>}
            <div className={classes.trackingWrapper}>
                <TrackingMap
                    filter={filter}
                    agentId={agentId}
                    listData={_.get(listData, 'data')}
                    handleOpenDetails={handleOpenDetails}
                    agentLocation={agentLocation}
                    marketsLocation={marketsLocation}
                    zonesLocation={zonesLocation}
                    isOpenMarkets={isOpenMarkets}
                    shopDetails={shopDetails}
                    sliderValue={sliderValue}
                />
            </div>
            {zoneInfoToggle}
            <TrackingMarketsZones
                filter={filter}
                filterForm={filterForm}
                agentId={agentId}
                openAgentsInfo={openAgentsInfo}
                openDetail={openDetail}/>
            <TrackingTime
                openAgentsInfo={openAgentsInfo}
                sliderValue={sliderValue}
                setSliderValue={setSliderValue}
                initialValues={initialValues}
                openDetail={openDetail}/>
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
