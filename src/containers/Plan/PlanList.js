import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import {connect} from 'react-redux'
import {reset, change} from 'redux-form'
import Layout from '../../components/Layout'
import {hashHistory} from 'react-router'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import numberFormat from '../../helpers/numberFormat'
import {
    ADD_PLAN,
    PlanWrapper,
    USER_GROUP,
    OPEN_PLAN_SALES,
    UPDATE_PLAN,
    CREATE_DATE,
    DATE,
    ZONE,
    AGENT,
    MARKET
} from '../../components/Plan'
import {
    planCreateAction,
    planUpdateAction,
    planDeleteAction,
    planComboAction,
    planAgentsListFetchAction,
    planItemFetchAction,
    planZonesListFetchAction,
    planZoneItemFetchAction,
    planMonthlySetAction,
    planMonthlyItemAction,
    agentPlansStatsAction,
    planZonesItemFetchAction,
    marketsLocationAction,
    planUpdateDialogAction,
    planCombinationAction,
    agentPlansAction
} from '../../actions/plan'
import {divisionListFetchAction} from '../../actions/division'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const ZERO = 0
const ONE = 1
const defaultCreateDate = moment().format('YYYY-MM')
const defaultDate = moment().format('YYYY-MM-DD')

const formName = 'PlanCreateForm'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const usersList = _.get(state, ['plan', 'agentsList', 'data'])
        const usersListLoading = _.get(state, ['plan', 'agentsList', 'loading'])
        const detail = _.get(state, ['users', 'item', 'data'])
        const detailLoading = _.get(state, ['users', 'item', 'loading'])
        const zones = _.get(state, ['zone', 'list', 'data'])
        const zonesLoading = _.get(state, ['zone', 'list', 'loading'])
        const divisions = _.get(state, ['division', 'list', 'data', 'results'])
        const divisionsLoading = _.get(state, ['division', 'list', 'loading'])
        const zoneDetail = _.get(state, ['zone', 'item', 'data'])
        const zoneDetailLoading = _.get(state, ['zone', 'item', 'loading'])
        const zoneAgents = _.get(state, ['plan', 'agentsPlan', 'data'])
        const zoneAgentsLoading = _.get(state, ['plan', 'agentsPlan', 'loading'])
        const stat = _.get(state, ['plan', 'statistics', 'data'])
        const statLoading = _.get(state, ['plan', 'statistics', 'loading'])
        const plan = _.get(state, ['plan', 'agentPlan', 'data'])
        const planLoading = _.get(state, ['plan', 'agentPlan', 'loading'])
        const createPlanLoading = _.get(state, ['plan', 'createPlan', 'loading'])
        const updatePlanLoading = _.get(state, ['plan', 'update', 'loading'])
        const monthlyPlanCreateLoading = _.get(state, ['plan', 'monthlyPlan', 'loading'])
        const monthlyPlanItem = _.get(state, ['plan', 'monthlyPlanItem', 'data', 'results'])
        const monthlyPlanItemLoading = _.get(state, ['plan', 'monthlyPlanItem', 'loading'])
        const agentStats = _.get(state, ['plan', 'agentStats', 'data'])
        const agentStatsLoading = _.get(state, ['plan', 'agentStats', 'loading'])
        const createForm = _.get(state, ['form', 'PlanCreateForm', 'values'])
        const monthlyPlanForm = _.get(state, ['form', 'PlanSalesForm', 'values'])
        const selectedDate = _.get(query, DATE) || defaultDate
        const selectedCreateDate = _.get(query, CREATE_DATE) || defaultCreateDate
        const selectedDay = _.get(query, 'day') || moment().format('DD')
        const marketsLocation = _.get(state, ['tracking', 'markets', 'data'])
        const planDetails = _.get(state, ['plan', 'update', 'data'])
        const combinationDetails = _.get(state, ['plan', 'combination', 'data'])
        const combinationLoading = _.get(state, ['plan', 'combination', 'loading'])
        const defaultPriority = _.get(state, ['form', 'PlanCreateForm', 'values', 'priority', 'value'])
        const filter = filterHelper(usersList, pathname, query)
        const selectedWeekDay = moment(selectedCreateDate + '-' + selectedDay).format('e')
        const agentPlansData = _.get(state, ['plan', 'agentPlansItem', 'data'])
        const agentPlansLoading = _.get(state, ['plan', 'agentPlansItem', 'loading'])
        const comboChosenAgent = _.toInteger(_.get(state, ['form', 'PlanCreateForm', 'values', 'agents']))
        const comboPlanId = _.get(_.find(combinationDetails, (o) => {
            return _.get(o, ['agent', 'id']) === comboChosenAgent
        }), 'id')
        return {
            query,
            pathname,
            usersList,
            usersListLoading,
            stat,
            statLoading,
            detail,
            detailLoading,
            zones,
            zonesLoading,
            divisions,
            divisionsLoading,
            monthlyPlanItem,
            monthlyPlanItemLoading,
            zoneDetail,
            zoneDetailLoading,
            zoneAgents,
            zoneAgentsLoading,
            createForm,
            selectedDate,
            selectedCreateDate,
            selectedDay,
            selectedWeekDay,
            monthlyPlanForm,
            monthlyPlanCreateLoading,
            plan,
            planLoading,
            marketsLocation,
            planDetails,
            combinationDetails,
            combinationLoading,
            createPlanLoading,
            updatePlanLoading,
            defaultPriority,
            agentPlansData,
            agentPlansLoading,
            comboChosenAgent,
            comboPlanId,
            agentStats,
            agentStatsLoading,
            filter
        }
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withPropsOnChange((props, nextProps) => {
        const prevMarket = _.toInteger(_.get(props, ['query', MARKET]))
        const nextMarket = _.toInteger(_.get(nextProps, ['query', MARKET]))
        const locations = _.get(props, 'marketsLocation')
        const nextLocations = _.get(nextProps, 'marketsLocation')
        return (prevMarket !== nextMarket && nextMarket > ZERO) || (locations !== nextLocations && nextMarket > ZERO)
    }, ({dispatch, marketsLocation, query}) => {
        const market = _.toInteger(_.get(query, MARKET))
        const marketData = _.find(marketsLocation, {'id': market})
        const hasPlan = _.get(marketData, 'hasPlan')
        if (hasPlan) {
            dispatch(planCombinationAction(market))
        }
    }),

    // DIVISIONS LIST
    withPropsOnChange((props, nextProps) => {
        const prevSalesDialog = toBoolean(_.get(props, ['query', OPEN_PLAN_SALES]))
        const nextSalesDialog = toBoolean(_.get(nextProps, ['query', OPEN_PLAN_SALES]))

        return prevSalesDialog !== nextSalesDialog && nextSalesDialog === true
    }, ({dispatch, filter, location}) => {
        const openSalesDialog = toBoolean(_.get(location, ['query', OPEN_PLAN_SALES]))
        if (openSalesDialog) {
            dispatch(divisionListFetchAction(filter))
        }
    }),

    // COMBO INITIAL VALUES (MARKET HAS PLAN CLICK)
    withPropsOnChange((props, nextProps) => {
        const prevComboDialog = toBoolean(_.get(props, ['query', UPDATE_PLAN]) === 'combo')
        const nextComboDialog = toBoolean(_.get(nextProps, ['query', UPDATE_PLAN]) === 'combo')
        return prevComboDialog !== nextComboDialog && nextComboDialog === true
    }, ({dispatch, query}) => {
        const selectedAgent = _.toInteger(_.get(query, AGENT))
        dispatch(change(formName, 'agents', selectedAgent))
    }),

    // UPDATE INITIAL VALUES
    withPropsOnChange((props, nextProps) => {
        const prevUpdateDialog = _.toInteger(_.get(props, ['planDetails', 'id']))
        const nextUpdateDialog = _.toInteger(_.get(nextProps, ['planDetails', 'id']))
        return prevUpdateDialog !== nextUpdateDialog && nextUpdateDialog > ZERO
    }, ({dispatch, planDetails}) => {
        const planType = _.get(planDetails, ['recurrences', '0', 'type'])
        const priority = _.get(planDetails, 'priority')
        const weekday = _.map(_.get(planDetails, 'recurrences'), (item) => {
            return {
                id: String(_.get(item, 'weekDay')) || String(_.get(item, 'monthDay')),
                active: true
            }
        })
        if (planDetails.id > ZERO) {
            dispatch(change(formName, 'planType', planType))
            dispatch(change(formName, 'priority', {value: priority, text: priority}))
            dispatch(change(formName, 'weekday', weekday))
        }
    }),

    // CREATE PLAN INITIAL VALUES
    withPropsOnChange((props, nextProps) => {
        const prevMarket = _.toInteger(_.get(props, ['query', MARKET]))
        const nextMarket = _.toInteger(_.get(nextProps, ['query', MARKET]))
        return prevMarket !== nextMarket && nextMarket > ZERO
    }, ({dispatch, selectedWeekDay}) => {
        dispatch(change(formName, 'planType', 'week'))
        dispatch(change(formName, 'weekday', [
            {
                id: selectedWeekDay,
                active: true
            }
        ]))
    }),

    // CHANGE FORM VALUES ON TOGGLE AGENTS (COMBO PLAN EDIT)
    withPropsOnChange((props, nextProps) => {
        const prevAgent = _.get(props, 'comboChosenAgent')
        const nextAgent = _.get(nextProps, 'comboChosenAgent')
        const details = _.get(props, 'combinationLoading')
        const nextDetails = _.get(nextProps, 'combinationLoading')
        return (prevAgent !== nextAgent && nextAgent > ZERO) || (details !== nextDetails && nextDetails === false)
    }, ({dispatch, combinationDetails, comboChosenAgent, selectedWeekDay}) => {
        const weekdayByAgent = _.find(combinationDetails, (obj) => {
            return obj.agent.id === comboChosenAgent
        })
        const planType = _.get(weekdayByAgent, ['recurrences', '0', 'type'])
        const priority = _.get(weekdayByAgent, 'priority')
        const weekdayCombo = _.map(_.get(weekdayByAgent, 'recurrences'), (item) => {
            return {
                id: String(_.get(item, 'weekDay')) || String(_.get(item, 'monthDay')),
                active: true
            }
        })
        if (weekdayByAgent) {
            dispatch(change(formName, 'weekday', weekdayCombo))
            dispatch(change(formName, 'planType', planType))
            dispatch(change(formName, 'priority', {value: priority}))
        } else {
            dispatch(change(formName, 'weekday', [{id: selectedWeekDay, active: true}]))
            dispatch(change(formName, 'planType', 'week'))
            dispatch(change(formName, 'priority', {value: ONE}))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevTab = _.get(props, ['query', 'group'])
        const nextTab = _.get(nextProps, ['query', 'group'])
        const prevSearch = _.get(props, ['query', 'search'])
        const nextSearch = _.get(nextProps, ['query', 'search'])

        return (props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()) ||
            (prevTab !== nextTab) ||
            (prevSearch !== nextSearch)
    }, ({dispatch, filter}) => {
        dispatch(planAgentsListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const agentId = _.get(nextProps, ['params', 'agentId'])
        const date = _.get(nextProps, ['query', 'date'])
        const prevDate = _.get(props, ['query', 'date'])
        return (agentId && _.get(props, ['params', 'agentId']) !== agentId) || (date !== prevDate)
    }, ({dispatch, params, filter, selectedDate, query}) => {
        const agentId = _.toInteger(_.get(params, 'agentId'))
        const openCreatePlan = toBoolean(_.get(query, ADD_PLAN))
        if (agentId) {
            if (!openCreatePlan) {
                dispatch(agentPlansAction(agentId, selectedDate))
            }
            dispatch(planItemFetchAction(agentId))
            dispatch(agentPlansStatsAction(agentId, selectedDate))
            dispatch(planMonthlyItemAction(filter, agentId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevDialog = toBoolean(_.get(props, ['query', ADD_PLAN]))
        const nextDialog = toBoolean(_.get(nextProps, ['query', ADD_PLAN]))
        return prevDialog !== nextDialog && nextDialog === true
    }, ({dispatch, location}) => {
        const openCreateDialog = toBoolean(_.get(location, ['query', ADD_PLAN]))
        if (openCreateDialog) {
            dispatch(planZonesListFetchAction())
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevZone = _.toInteger(_.get(props, ['query', ZONE]))
        const nextZone = _.toInteger(_.get(nextProps, ['query', ZONE]))
        return (prevZone !== nextZone && nextZone > ZERO) ||
            (props.selectedCreateDate !== nextProps.selectedCreateDate && nextZone > ZERO) ||
            (props.selectedDay !== nextProps.selectedDay && nextZone > ZERO)
    }, ({dispatch, location, selectedCreateDate, selectedDay, activeWeeks, activeDays}) => {
        _.map(activeWeeks, (w) => {
            w.active = false
        })
        _.map(activeDays, (d) => {
            if (d.id) {
                d.active = false
            }
        })
        const zone = _.toInteger(_.get(location, ['query', ZONE]))
        const date = moment(selectedCreateDate).format('YYYY-MM-' + selectedDay)
        if (zone > ZERO) {
            dispatch(planZonesItemFetchAction(zone, date))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevZone = _.toInteger(_.get(props, ['query', ZONE]))
        const nextZone = _.toInteger(_.get(nextProps, ['query', ZONE]))
        return prevZone !== nextZone && nextZone > ZERO
    }, ({dispatch, location}) => {
        const zone = _.toInteger(_.get(location, ['query', ZONE]))
        if (zone > ZERO) {
            dispatch(marketsLocationAction(zone))
            dispatch(planZoneItemFetchAction(zone))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevUpdate = _.toInteger(_.get(props, ['query', UPDATE_PLAN]))
        const nextUpdate = _.toInteger(_.get(nextProps, ['query', UPDATE_PLAN]))
        return prevUpdate !== nextUpdate && nextUpdate > ZERO
    }, ({dispatch, location}) => {
        const planId = _.toInteger(_.get(location, ['query', UPDATE_PLAN]))
        if (planId > ZERO) {
            dispatch(planUpdateDialogAction(planId))
        }
    }),

    withHandlers({
        handleClickTab: props => (group) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USER_GROUP]: group})})
        },

        handleOpenAddPlan: props => () => {
            const {dispatch, location: {pathname}} = props
            dispatch(change('PlanCreateForm', 'weekday', null))
            hashHistory.push({pathname, query: {[ADD_PLAN]: true}})
        },

        handleCloseAddPlan: props => () => {
            const {dispatch, location: {pathname}} = props
            dispatch(change('PlanCreateForm', 'weekday', null))
            hashHistory.push({pathname, query: {[ADD_PLAN]: false}})
        },

        handleSubmitAddPlan: props => () => {
            const {location: {pathname, query}, dispatch, createForm, filter, selectedCreateDate, selectedDay, activeWeeks, activeDays, defaultPriority} = props
            const HUNDRED = 100
            const zone = _.get(query, ZONE)
            const date = selectedCreateDate + '-' + selectedDay

            return dispatch(planCreateAction(createForm, filter.getParams()))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('План успешно составлен')}))
                })
                .then(() => {
                    if (defaultPriority === HUNDRED) {
                        dispatch(change('PlanCreateForm', 'priority', {
                            text: defaultPriority,
                            value: defaultPriority
                        }))
                    } else {
                        dispatch(change('PlanCreateForm', 'priority', {
                            text: defaultPriority + ONE,
                            value: defaultPriority + ONE
                        }))
                    }
                    hashHistory.push({pathname, query: filter.getParams({[MARKET]: ZERO})})
                    dispatch(planZonesListFetchAction())
                    dispatch(planZonesItemFetchAction(zone, date))
                    dispatch(planAgentsListFetchAction(filter))
                })
                .then(() => {
                    _.map(activeWeeks, (obj) => {
                        obj.active = false
                    })
                    _.map(activeDays, (obj) => {
                        obj.active = false
                    })
                })
        },

        handleUpdateAgentPlan: props => (plan, agent, market) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[UPDATE_PLAN]: plan, [AGENT]: agent, [MARKET]: market})})
        },

        handleSubmitUpdateAgentPlan: props => () => {
            const {dispatch, location: {pathname, query}, filter, createForm, selectedCreateDate, selectedDay} = props
            const zone = _.toInteger(_.get(query, ZONE))
            const date = selectedCreateDate + '-' + selectedDay
            const planId = _.toInteger(_.get(query, UPDATE_PLAN))
            return dispatch(planUpdateAction(createForm, filter.getParams(), planId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'План успешно изменен'}))
                })
                .then(() => {
                    dispatch(change('PlanCreateForm', 'weekday', null))
                    hashHistory.push({pathname, query: filter.getParams({[UPDATE_PLAN]: false, [MARKET]: ZERO})})
                    dispatch(planZonesListFetchAction())
                    dispatch(planZonesItemFetchAction(zone, date))
                })
        },

        handleSubmitComboPlan: props => () => {
            const {dispatch, location: {pathname, query}, filter, createForm, selectedCreateDate, selectedDay, comboChosenAgent, comboPlanId} = props
            const zone = _.toInteger(_.get(query, ZONE))
            const date = selectedCreateDate + '-' + selectedDay

            return ((comboPlanId && comboChosenAgent)
                ? dispatch(planComboAction(createForm, filter.getParams(), comboPlanId))
                : dispatch(planCreateAction(createForm, filter.getParams(), comboChosenAgent)))
                    .then(() => {
                        return dispatch(openSnackbarAction({message: t('План успешно изменен')}))
                    })
                    .then(() => {
                        dispatch(change('PlanCreateForm', 'weekday', null))
                        hashHistory.push({pathname, query: filter.getParams({[UPDATE_PLAN]: false, [MARKET]: ZERO})})
                        dispatch(planZonesListFetchAction())
                        dispatch(planZonesItemFetchAction(zone, date))
                    })
        },

        handleDeleteAgentPlan: props => () => {
            const {dispatch, location: {pathname, query}, filter, selectedCreateDate, selectedDay, setOpenConfirmDialog, comboPlanId} = props
            const zone = _.toInteger(_.get(query, ZONE))
            const openUpdatePlan = _.get(query, UPDATE_PLAN)
            const date = selectedCreateDate + '-' + selectedDay
            const planId = openUpdatePlan === 'combo' ? comboPlanId : _.toInteger(_.get(query, UPDATE_PLAN))
            return dispatch(planDeleteAction(planId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'План успешно удален'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
                    hashHistory.push({pathname, query: filter.getParams({[UPDATE_PLAN]: false, [MARKET]: ZERO})})
                    dispatch(marketsLocationAction(zone))
                    dispatch(planZonesListFetchAction())
                    dispatch(planZonesItemFetchAction(zone, date))
                })
        },

        handleOpenPlanSales: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_PLAN_SALES]: true})})
            dispatch(reset('PlanSalesForm'))
        },

        handleClosePlanSales: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_PLAN_SALES]: false})})
        },

        handleSubmitPlanSales: props => () => {
            const {location: {pathname}, dispatch, monthlyPlanForm, filter, params} = props
            const user = _.toInteger(_.get(params, 'agentId'))

            return dispatch(planMonthlySetAction(monthlyPlanForm, filter, user))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно обновлено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[OPEN_PLAN_SALES]: false})})
                    dispatch(planAgentsListFetchAction(filter))
                    dispatch(planItemFetchAction(user))
                    dispatch(planMonthlyItemAction(filter, user))
                })
        },

        handlePrevMonth: props => () => {
            const {location: {pathname}, filter, selectedCreateDate} = props
            const prevMonth = moment(selectedCreateDate).subtract(ONE, 'month')
            const dateForURL = prevMonth.format('YYYY-MM')
            hashHistory.push({pathname, query: filter.getParams({[CREATE_DATE]: dateForURL})})
        },

        handleNextMonth: props => () => {
            const {location: {pathname}, filter, selectedCreateDate} = props
            const nextMonth = moment(selectedCreateDate).add(ONE, 'month')
            const dateForURL = nextMonth.format('YYYY-MM')
            hashHistory.push({pathname, query: filter.getParams({[CREATE_DATE]: dateForURL})})
        },

        handlePrevDay: props => () => {
            const {location: {pathname}, filter, selectedDate} = props
            const prevDay = moment(selectedDate).subtract(ONE, 'day')
            const dateForURL = prevDay.format('YYYY-MM-DD')
            hashHistory.push({pathname, query: filter.getParams({[DATE]: dateForURL})})
        },

        handleNextDay: props => () => {
            const {location: {pathname}, filter, selectedDate} = props
            const nextDay = moment(selectedDate).add(ONE, 'day')
            const dateForURL = nextDay.format('YYYY-MM-DD')
            hashHistory.push({pathname, query: filter.getParams({[DATE]: dateForURL})})
        },

        handleChooseDay: props => (day) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({'day': day})})
        },

        handleChooseZone: props => (zone) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ZONE]: zone, [AGENT]: null, [MARKET]: null})})
        },

        handleChooseAgent: props => (agent) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[AGENT]: agent})})
        },

        handleChooseMarket: props => (market) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MARKET]: market})})
        }
    })
)

const PlanList = enhance((props) => {
    const {
        filter,
        usersList,
        usersListLoading,
        location,
        layout,
        params,
        stat,
        statLoading,
        detail,
        detailLoading,
        divisions,
        divisionsLoading,
        zones,
        zonesLoading,
        zoneDetail,
        zoneDetailLoading,
        monthlyPlanItem,
        monthlyPlanItemLoading,
        zoneAgents,
        zoneAgentsLoading,
        monthlyPlanCreateLoading,
        plan,
        planLoading,
        selectedDate,
        selectedCreateDate,
        selectedDay,
        selectedWeekDay,
        marketsLocation,
        planDetails,
        combinationDetails,
        combinationLoading,
        createPlanLoading,
        updatePlanLoading,
        openConfirmDialog,
        setOpenConfirmDialog,
        agentPlansData,
        agentPlansLoading,
        comboPlanId,
        agentStats,
        agentStatsLoading
    } = props

    const openAddPlan = toBoolean(_.get(location, ['query', ADD_PLAN]))
    const openComboPlan = _.get(location, ['query', UPDATE_PLAN]) === 'combo'
    const openPlanSales = toBoolean(_.get(location, ['query', OPEN_PLAN_SALES]))
    const openUpdatePlan = _.get(location, ['query', UPDATE_PLAN]) === 'combo' ? 'combo' : _.toInteger(_.get(location, ['query', UPDATE_PLAN])) > ZERO
    const groupId = _.get(location, ['query', USER_GROUP]) || 'agent'
    const openDetail = !_.isEmpty(_.get(params, 'agentId'))
    const detailId = _.toInteger(_.get(params, 'agentId'))
    const selectedAgent = _.toInteger(_.get(location, ['query', AGENT]))
    const selectedZone = _.toInteger(_.get(location, ['query', ZONE]))
    const selectedMarket = _.toInteger(_.get(location, ['query', MARKET]))

    const addPlan = {
        openAddPlan,
        zonesList: _.get(zones, 'results'),
        zonesLoading,
        zoneAgents,
        zoneAgentsLoading,
        selectedAgent,
        selectedMarket,
        selectedZone,
        marketsLocation,
        createPlanLoading,
        handleChooseZone: props.handleChooseZone,
        handleChooseAgent: props.handleChooseAgent,
        handleChooseMarket: props.handleChooseMarket,
        handleOpenAddPlan: props.handleOpenAddPlan,
        handleCloseAddPlan: props.handleCloseAddPlan,
        handleSubmitAddPlan: props.handleSubmitAddPlan
    }

    const zoneDetails = {
        data: zoneDetail,
        loading: zoneDetailLoading
    }

    const comboPlan = {
        agents: zoneAgents,
        openComboPlan,
        combinationDetails,
        combinationLoading,
        comboPlanId,
        handleSubmitComboPlan: props.handleSubmitComboPlan
    }

    const updatePlan = {
        initialValues: (() => {
            const planType = _.get(planDetails, ['recurrences', '0', 'type'])
            const priority = _.get(planDetails, 'priority')
            const comboPlanDetails = _.find(combinationDetails, {'id': comboPlanId})
            const comboPlanType = _.get(comboPlanDetails, ['recurrences', '0', 'type'])
            const comboWeekday = _.map(_.get(comboPlanDetails, 'recurrences'), (item) => {
                return {
                    id: String(_.get(item, 'weekDay')) || String(_.get(item, 'monthDay')),
                    active: true
                }
            })
            const weekday = _.map(_.get(planDetails, 'recurrences'), (item) => {
                return {
                    id: String(_.get(item, 'weekDay')) || String(_.get(item, 'monthDay')),
                    active: true
                }
            })
            return (!openUpdatePlan)
            ? {
                planType: 'week',
                weekday: [
                    {
                        id: selectedWeekDay,
                        active: true
                    }
                ]
            }
            : (openComboPlan && comboPlanId)
                ? {
                    planType: comboPlanType,
                    weekday: comboWeekday
                }
                : {
                    priority: {
                        value: priority
                    },
                    planType: planType,
                    weekday: weekday
                }
        })(),
        openUpdatePlan,
        updatePlanLoading,
        openConfirmDialog,
        setOpenConfirmDialog,
        handleSubmitUpdateAgentPlan: props.handleSubmitUpdateAgentPlan,
        handleDeleteAgentPlan: props.handleDeleteAgentPlan,
        handleUpdateAgentPlan: props.handleUpdateAgentPlan
    }

    const planSalesDialog = {
        initialValues: (() => {
            const divisionsObject = {}
            _.map(monthlyPlanItem, (item) => {
                divisionsObject['_' + _.get(item, ['division', 'id'])] = {
                    amount: String(numberFormat(_.get(item, 'amount')))
                }
            })
            return {
                divisions: divisionsObject
            }
        })(),
        divisions,
        divisionsLoading,
        openPlanSales,
        monthlyPlanCreateLoading,
        handleOpenPlanSales: props.handleOpenPlanSales,
        handleClosePlanSales: props.handleClosePlanSales,
        handleSubmitPlanSales: props.handleSubmitPlanSales
    }

    const listData = {
        data: _.get(usersList, 'results'),
        usersListLoading
    }

    const statData = {
        data: stat,
        statLoading
    }

    const detailData = {
        openDetail,
        id: detailId,
        data: detail,
        detailLoading
    }

    const addPlanCalendar = {
        selectedDay,
        selectedCreateDate,
        handleChooseDay: props.handleChooseDay,
        handlePrevMonth: props.handlePrevMonth,
        handleNextMonth: props.handleNextMonth
    }

    const calendar = {
        selectedDate,
        handlePrevDay: props.handlePrevDay,
        handleNextDay: props.handleNextDay
    }

    const monthlyPlan = {
        data: plan,
        planLoading,
        monthlyPlanItem,
        monthlyPlanItemLoading
    }

    const agentPlans = {
        data: agentPlansData,
        loading: agentPlansLoading,
        stats: agentStats,
        statsLoading: agentStatsLoading
    }

    return (
        <Layout {...layout}>
            <PlanWrapper
                filter={filter}
                usersList={listData}
                statData={statData}
                addPlan={addPlan}
                zoneDetails={zoneDetails}
                updatePlan={updatePlan}
                comboPlan={comboPlan}
                planSalesDialog={planSalesDialog}
                handleClickTab={props.handleClickTab}
                groupId={groupId}
                addPlanCalendar={addPlanCalendar}
                calendar={calendar}
                detailData={detailData}
                monthlyPlan={monthlyPlan}
                selectedWeekDay={selectedWeekDay}
                agentPlans={agentPlans}
            />
        </Layout>
    )
})

export default PlanList
