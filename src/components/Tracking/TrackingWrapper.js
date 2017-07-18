import _ from 'lodash'
import React from 'react'
import {Link} from 'react-router'
import * as ROUTES from '../../constants/routes'
import {reduxForm, Field} from 'redux-form'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import sprintf from 'sprintf'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import moment from 'moment'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import Checkbox from '../ReduxForm/Basic/CheckBox'
import Arrow from 'material-ui/svg-icons/navigation/arrow-drop-down'
import TrackingMap from './TrackingMap'
import Dot from 'material-ui/svg-icons/av/fiber-manual-record'
import TrackingDetails from './TrackingDetails'

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
            margin: '0 -28px',
            minHeight: 'calc(100% - 32px)',
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

        },
        trackingInfo: {
            background: '#fff',
            position: 'absolute',
            width: '450px',
            top: '0',
            bottom: '0',
            transition: 'all 0.3s ease',
            zIndex: '2'
        },
        toggleButton: {
            position: 'absolute',
            left: '-24px',
            top: '18px',
            padding: '8px 0',
            background: '#fff',
            cursor: 'pointer'
        },
        expanded: {
            display: 'flex',
            alignItems: 'center',
            '& svg': {
                transform: 'rotate(-90deg)',
                position: 'relative',
                left: '1px'
            }
        },
        collapsed: {
            extend: 'expanded',
            '& svg': {
                transform: 'rotate(90deg)',
                position: 'relative',
                left: '1px'
            }
        },
        trackingInfoTitle: {
            display: 'flex',
            alignItems: 'center',
            padding: '20px 30px',
            borderBottom: '1px #efefef solid',
            fontWeight: '600',
            '& span': {
                textAlign: 'right',
                lineHeight: '1'
            }
        },
        online: {
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            fontSize: '30px',
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
    }),
    reduxForm({
        form: 'TrackingFilterForm',
        enableReinitialize: true
    }),
)

const TrackingWrapper = enhance((props) => {
    const ZERO = 0
    const {
        classes,
        filter,
        listData,
        detailData,
        toggle,
        handleOpenDetails,
        agentLocation,
        handleSubmit,
        showAgentTrack,
        filterForm
    } = props

    const listLoading = _.get(listData, 'listLoading')
    const isOpenToggle = toggle.openToggle
    const agentsCount = _.get(listData, ['data', 'length'])
    let agentsOnline = 0

    const openDetail = _.get(detailData, 'openDetail')

    const zoneInfoToggle = (
        <div className={classes.trackingInfo} style={isOpenToggle ? {right: '0'} : {right: '-450px'}}>
            <div className={classes.toggleButton}>
                {isOpenToggle ? <div className={classes.expanded} onClick={toggle.handleCollapseInfo}><Arrow/></div>
                    : <div className={classes.collapsed} onClick={toggle.handleExpandInfo}><Arrow/></div>}
            </div>
            {!listLoading ? <div className={classes.wrapper}>
                <div className={classes.trackingInfoTitle}>
                    <span>Агентов <br/> online</span>
                    <div className={classes.online}>
                        <div>
                            {
                                _.map(_.get(listData, 'data'), (item) => {
                                    const FIVE_MIN = 300000
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
                <div className={classes.content}>
                    <div className={classes.filter}>
                        <div className={classes.title}>Фильтры</div>
                        <form onSubmit={handleSubmit(filterForm.handleSubmitFilterDialog)}>
                            <Field
                                name="showMarkets"
                                className={classes.checkbox}
                                component={Checkbox}
                                label="Отображать магазины"/>
                            <Field
                                name="showZones"
                                className={classes.checkbox}
                                component={Checkbox}
                                label="Отображать зоны"/>
                            <RaisedButton
                                label="Применить"
                                backgroundColor="#12aaeb"
                                labelColor="#fff"
                                type="submit"/>
                        </form>
                    </div>
                    <div className={classes.activeAgents}>
                        {
                            _.map(_.get(listData, 'data'), (item) => {
                                const id = _.get(item, 'id')
                                const agent = _.get(item, 'agent')
                                const FIVE_MIN = 300000
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
                initialValues={props.initialValues}
                filter={filter}
                listData={listData}
                detailData={detailData}
                filterForm={filterForm}
            />
            }
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.TRACKING_LIST_URL}/>
            <div className={classes.trackingWrapper}>
                <TrackingMap
                    listData={_.get(listData, 'data')}
                    handleOpenDetails={handleOpenDetails}
                    agentLocation={agentLocation}
                    showAgentTrack={showAgentTrack}
                />
                {zoneInfoToggle}
            </div>
        </Container>
    )
})

TrackingWrapper.PropTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    agentLocation: PropTypes.object,
    toggle: PropTypes.shape({
        openToggle: PropTypes.bool.isRequired,
        handleExpandInfo: PropTypes.func.isRequired,
        handleCollapseInfo: PropTypes.func.isRequired
    }).isRequired,
    handleOpenDetails: PropTypes.func,
    filterForm: PropTypes.shape({
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default TrackingWrapper
