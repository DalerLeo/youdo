import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Person from 'material-ui/svg-icons/social/person'
import PlanMap from './PlanMap'
import PlanAddCalendar from './PlanAddCalendar'
import PlanWeekDayForm from './PlanWeekDayForm'
import {Link} from 'react-router'
import * as ROUTES from '../../constants/routes'
import {TOGGLE_INFO, BIND_AGENT} from '../Zones'
import {AGENT_COLORS} from '../Plan'
import sprintf from 'sprintf'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            padding: '100px 0',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        agentsLoader: {
            extend: 'loader',
            height: 'auto',
            padding: '0 30px'
        },
        podlojkaScroll: {
            padding: '0 !important',
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            },
            '& > div': {
                height: '100% !important',
                '& > div': {
                    height: '100% !important',
                    padding: '0',
                    '& > div': {
                        height: '100%'
                    }
                }
            }
        },
        popUp: {
            background: '#fff',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            maxHeight: 'inherit !important'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '0 10px 0 30px',
            minHeight: '59px',
            zIndex: '999',
            '& button': {
                padding: '0 !important',
                '& > div': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }
        },
        inContent: {
            display: 'flex',
            color: '#333',
            height: '100%'
        },
        bodyContent: {
            color: '#333',
            width: '100%',
            height: '100%'
        },
        form: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between'
        },
        field: {
            width: '100%'
        },
        leftSide: {
            width: '300px',
            borderRight: '1px #efefef solid',
            display: 'flex',
            flexDirection: 'column',
            zIndex: '10'
        },
        scroll: {
            height: '100%',
            overflowY: 'auto'
        },
        zone: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '0 30px',
            height: '40px',
            borderTop: '1px #efefef solid'
        },
        zoneTitle: {
            extend: 'zone',
            cursor: 'default',
            fontWeight: '600'
        },
        activeZone: {
            extend: 'zone',
            cursor: 'default',
            background: '#f2f5f8'
        },
        rightSide: {
            width: 'calc(100% - 300px)',
            position: 'relative'
        },
        agents: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            zIndex: '8',
            transition: 'all 200ms ease-out'
        },
        agentsActive: {
            extend: 'agents',
            top: 'calc(100% - 66px)',
            '& > div': {
                minWidth: '100%',
                maxWidth: '100%'
            }
        },
        agentsWrapper: {
            display: 'flex',
            padding: '0 40px',
            lineHeight: '1.2',
            alignItems: 'center',
            height: '66px',
            transition: 'all 300ms ease-out !important',
            minWidth: '0'
        },
        chooseAgent: {
            fontWeight: 'bold',
            paddingRight: '15px',
            borderRight: '1px #efefef solid'
        },
        chooseZone: {
            fontWeight: '600',
            textAlign: 'center',
            '& a': {
                marginTop: '5px'
            }
        },
        agentItem: {
            background: '#fff',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            margin: '0 15px',
            cursor: 'pointer',
            '& span': {
                color: '#333',
                display: 'block',
                lineHeight: '1.2',
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child': {
                    color: '#666'
                }
            },
            '& > div': {
                zIndex: '8',
                display: 'flex',
                borderBottom: '3px solid',
                padding: '8px 0'
            }
        },
        imgPlace: {
            display: 'flex',
            alignItems: 'center',
            width: '30px',
            minWidth: '30px',
            height: '30px',
            borderRadius: '50%',
            background: '#9aa6b3',
            overflow: 'hidden',
            marginRight: '5px',
            '& svg': {
                margin: 'auto'
            }
        },
        agentItemActive: {
            extend: 'agentItem',
            position: 'relative',
            '&:after': {
                content: '""',
                position: 'absolute',
                top: '-10px',
                bottom: '-11px',
                left: '-15px',
                right: '-15px',
                background: '#f3f6f9',
                zIndex: '2'
            }
        },
        map: {
            height: '100%',
            filter: 'blur(0px)',
            transition: 'all 200ms ease'
        },
        mapBlurred: {
            extend: 'map',
            filter: 'blur(3px)'
        },
        inputFieldCustom: {
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
        inputDateCustom: {
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
            },
            '& div:first-child': {
                height: '45px !important'
            }
        },
        weeks: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            padding: '0 30px'
        },
        weekItem: {
            color: '#666',
            width: '32px',
            height: '32px',
            display: 'flex',
            background: '#eaeaea',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
        },
        weekItemActive: {
            extend: 'weekItem',
            background: '#8de2b3',
            color: '#fff',
            fontWeight: '600'
        },
        addPlan: {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'rgba(0,0,0, 0.3)',
            zIndex: '999',
            '& form': {
                background: '#fff'
            }
        },
        addPlanHidden: {
            extend: 'addPlan',
            zIndex: '-9999'
        }
    })
)

const customContentStyle = {
    width: '100%',
    maxWidth: 'none'
}
const agentIcon = {
    color: '#fff',
    width: 20,
    height: 20
}
const PlanCreateDialog = enhance((props) => {
    const {
        open,
        filter,
        onClose,
        onSubmit,
        classes,
        isUpdate,
        zonesList,
        zonesLoading,
        zoneDetails,
        addPlanCalendar,
        zoneAgents,
        zoneAgentsLoading,
        handleChooseZone,
        handleChooseAgent,
        handleChooseMarket,
        selectedZone,
        selectedAgent,
        selectedMarket,
        marketsLocation,
        toggleDaysState,
        createPlanLoading,
        updatePlan,
        comboPlan,
        selectedWeekDay
    } = props
    const zoneLoading = _.get(zoneDetails, 'loading')
    const zoneCoordinates = _.map(_.get(zoneDetails, ['data', 'geometry', 'coordinates', '0']), (point) => {
        return {
            lat: _.get(point, '0'),
            lng: _.get(point, '1')
        }
    })
    const meanLat = _.meanBy(_.get(zoneDetails, ['data', 'geometry', 'coordinates', '0']), (item) => {
        return _.get(item, '0')
    })
    const meanLng = _.meanBy(_.get(zoneDetails, ['data', 'geometry', 'coordinates', '0']), (item) => {
        return _.get(item, '1')
    })
    const meanCenter = {
        lat: meanLat,
        lng: meanLng
    }
    const onUpdateSubmit = updatePlan.handleSubmitUpdateAgentPlan
    const onComboSubmit = comboPlan.handleSubmitComboPlan
    const submitDelete = updatePlan.handleDeleteAgentPlan
    const openUpdatePlan = _.get(updatePlan, 'openUpdatePlan')
    const openComboPlan = _.get(comboPlan, 'openComboPlan')
    const ZERO = 0
    const isAgentChosen = selectedAgent > ZERO
    const zones = _.map(zonesList, (item) => {
        const id = _.get(item, 'id')
        const title = _.get(item, 'title')
        const marketsCount = _.get(item, 'marketsCount')
        const marketsWithoutPlan = _.get(item, 'marketsWithoutPlan')
        const marketsWithPlan = marketsCount - marketsWithoutPlan

        return (id === selectedZone)
            ? (
                <div key={id} className={classes.activeZone}>
                    <span>{title}</span>
                    <span>{marketsWithPlan} / {marketsCount}</span>
                </div>
            )
            : (
                <div key={id} className={classes.zone}
                     onClick={() => { handleChooseZone(id) }}>
                    <span>{title}</span>
                    <span>{marketsWithPlan} / {marketsCount}</span>
                </div>
            )
    })
    const agents = _.map(zoneAgents, (agent, index) => {
        const id = _.get(agent, 'id')
        const firstName = _.get(agent, 'firstName')
        const secondName = _.get(agent, 'secondName')
        const plansCount = _.get(agent, 'plans').length
        return (
            <div key={id} className={(id === selectedAgent) ? classes.agentItemActive : classes.agentItem}
                 onClick={() => { handleChooseAgent(id) }} style={{color: _.get(AGENT_COLORS, index)}}>
                <div>
                    <div className={classes.imgPlace}>
                        <Person style={agentIcon}/>
                    </div>
                    <div>
                        <span>{firstName} {secondName}</span>
                        <span>{plansCount} магазинов</span>
                    </div>
                </div>
            </div>
        )
    })
    const plans = _.map(zoneAgents, (plan) => {
        return _.map(_.get(plan, 'plans'), (m) => {
            return {
                id: _.get(m, ['market', 'id']),
                location: {
                    lat: _.get(m, ['market', 'location', 'lat']),
                    lng: _.get(m, ['market', 'location', 'lon'])
                }
            }
        })
    })
    const plansPaths = _.map(zoneAgents, (plan) => {
        const sortedPlan = _.sortBy(_.get(plan, 'plans'), 'priority')
        const agentId = _.get(plan, 'id')
        return _.map(sortedPlan, (m) => {
            return {
                lat: _.get(m, ['market', 'location', 'lat']),
                lng: _.get(m, ['market', 'location', 'lon']),
                agentId: agentId,
                marketId: _.get(m, ['market', 'id']),
                planId: _.get(m, 'id')
            }
        })
    })
    return (
        <Dialog
            modal={true}
            className={classes.podlojkaScroll}
            contentStyle={customContentStyle}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <Paper zDepth={2} className={classes.leftSide}>
                        <div className={classes.titleContent}>
                            <span>{isUpdate ? 'Изменение плана' : 'Составление плана'}</span>
                            <IconButton onTouchTap={onClose}>
                                <CloseIcon color="#666666"/>
                            </IconButton>
                        </div>
                        <div className={classes.scroll}>
                            <PlanAddCalendar calendar={addPlanCalendar}/>
                            <div className={classes.zonesList}>
                                <div className={classes.zoneTitle}>
                                    <span>Зоны</span>
                                    <span>Магазины</span>
                                </div>
                                {zonesLoading
                                    ? <div className={classes.loader}>
                                        <Loader size={0.75}/>
                                    </div>
                                    : zones}
                            </div>
                        </div>
                    </Paper>
                    <div className={classes.rightSide}>
                        <div className={isAgentChosen ? classes.agentsActive : classes.agents}>
                            {zoneAgentsLoading
                                ? <Paper zDepth={2} className={classes.agentsWrapper}>
                                    <div className={classes.agentsLoader}>
                                        <Loader size={0.75}/>
                                    </div>
                                </Paper>
                                : (selectedZone === ZERO)
                                    ? <Paper zDepth={2} className={classes.agentsWrapper}>
                                        <div className={classes.chooseZone}>
                                            <span>Для составления плана <br/>выберите зону</span>
                                        </div>
                                    </Paper>
                                    : (!_.isEmpty(agents)) ? <Paper zDepth={2} className={classes.agentsWrapper}>
                                            <div className={classes.chooseAgent}>
                                                <span>Выберите <br/>агента</span>
                                            </div>
                                            {agents}
                                        </Paper>
                                        : <Paper zDepth={2} className={classes.agentsWrapper}>
                                            <div className={classes.chooseZone}>
                                                <div>В этой зоне не закреплено агентов</div>
                                                <Link target="_blank" to={{
                                                    pathname: sprintf(ROUTES.ZONES_ITEM_PATH, selectedZone),
                                                    query: {[TOGGLE_INFO]: true, [BIND_AGENT]: true}
                                                }}>Добавить агентов?</Link>
                                            </div>
                                        </Paper>}
                        </div>

                        <div className={(selectedMarket > ZERO && !openUpdatePlan && !openComboPlan) ? classes.addPlan : classes.addPlanHidden}>
                            <PlanWeekDayForm
                                selectedWeekDay={selectedWeekDay}
                                createLoading={createPlanLoading}
                                onSubmit={onSubmit}
                                filter={filter}
                                toggleDaysState={toggleDaysState}/>
                        </div>
                        <div className={(selectedMarket > ZERO && openUpdatePlan && !openComboPlan) ? classes.addPlan : classes.addPlanHidden}>
                            <PlanWeekDayForm
                                updateLoading={updatePlan.updatePlanLoading}
                                openConfirmDialog={updatePlan.openConfirmDialog}
                                setOpenConfirmDialog={updatePlan.setOpenConfirmDialog}
                                isUpdate={true}
                                onSubmit={onUpdateSubmit}
                                submitDelete={submitDelete}
                                filter={filter}
                                toggleDaysState={toggleDaysState}/>
                        </div>
                        <div className={(selectedMarket > ZERO && openComboPlan) ? classes.addPlan : classes.addPlanHidden}>
                            <PlanWeekDayForm
                                combo={true}
                                comboPlan={comboPlan}
                                submitDelete={submitDelete}
                                setOpenConfirmDialog={updatePlan.setOpenConfirmDialog}
                                openConfirmDialog={updatePlan.openConfirmDialog}
                                selectedWeekDay={selectedWeekDay}
                                createLoading={createPlanLoading}
                                onSubmit={onComboSubmit}
                                filter={filter}
                                toggleDaysState={toggleDaysState}/>
                        </div>
                        <div className={isAgentChosen ? classes.map : classes.mapBlurred}>
                            {zoneLoading
                                ? <div>{null}</div>
                                : selectedZone > ZERO
                                    ? <PlanMap
                                        plans={plans}
                                        meanCenter={meanCenter}
                                        plansPaths={plansPaths}
                                        zoneAgents={zoneAgents}
                                        zoneCoordinates={zoneCoordinates}
                                        selectedAgent={selectedAgent}
                                        marketsLocation={marketsLocation}
                                        selectedMarket={selectedMarket}
                                        handleChooseMarket={handleChooseMarket}
                                        handleUpdateAgentPlan={updatePlan.handleUpdateAgentPlan}
                                    />
                                    : <div></div>}
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})
PlanCreateDialog.propTyeps = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
PlanCreateDialog.defaultProps = {
    isUpdate: false
}
export default PlanCreateDialog
