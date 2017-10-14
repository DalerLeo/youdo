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
import {
    ADD_PLAN,
    PlanWrapper,
    USER_GROUP,
    OPEN_PLAN_SALES,
    UPDATE_PLAN,
    DATE,
    ZONE,
    AGENT,
    MARKET
} from '../../components/Plan'
import {
    planCreateAction,
    planUpdateAction,
    planDeleteAction,
    planAgentsListFetchAction,
    planItemFetchAction,
    planZonesListFetchAction,
    planZoneItemFetchAction,
    planMonthlySetAction,
    agentMonthlyPlanAction,
    planZonesItemFetchAction,
    marketsLocationAction,
    planUpdateDialogAction,
    agentPlansAction
} from '../../actions/plan'
import {openSnackbarAction} from '../../actions/snackbar'

const ZERO = 0
const ONE = 1
const defaultDate = moment().format('YYYY-MM-DD')

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
        const createForm = _.get(state, ['form', 'PlanCreateForm', 'values'])
        const monthlyPlanForm = _.get(state, ['form', 'PlanSalesForm', 'values'])
        const selectedDate = _.get(query, DATE) || defaultDate
        const selectedDay = _.get(query, 'day') || moment().format('DD')
        const marketsLocation = _.get(state, ['tracking', 'markets', 'data'])
        const planDetails = _.get(state, ['plan', 'update', 'data'])
        const defaultPriority = _.get(state, ['form', 'PlanCreateForm', 'values', 'priority', 'value'])
        const filter = filterHelper(usersList, pathname, query)
        const selectedWeekDay = _.toInteger(moment(selectedDate + '-' + selectedDay).format('e'))
        const agentPlansData = _.get(state, ['plan', 'agentPlansItem', 'data'])
        const agentPlansLoading = _.get(state, ['plan', 'agentPlansItem', 'loading'])
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
            zoneDetail,
            zoneDetailLoading,
            zoneAgents,
            zoneAgentsLoading,
            createForm,
            selectedDate,
            selectedDay,
            selectedWeekDay,
            monthlyPlanForm,
            monthlyPlanCreateLoading,
            plan,
            planLoading,
            marketsLocation,
            planDetails,
            createPlanLoading,
            updatePlanLoading,
            defaultPriority,
            agentPlansData,
            agentPlansLoading,
            filter
        }
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withPropsOnChange((props, nextProps) => {
        const prevTab = _.get(props, ['query', 'group'])
        const nextTab = _.get(nextProps, ['query', 'group'])
        const prevSearch = _.get(props, ['query', 'search'])
        const nextSearch = _.get(nextProps, ['query', 'search'])

        return (props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()) ||
            (prevTab !== nextTab && nextTab) ||
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
            dispatch(agentMonthlyPlanAction(filter, agentId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevDialog = toBoolean(_.get(props, ['query', ADD_PLAN]))
        const nextDialog = toBoolean(_.get(nextProps, ['query', ADD_PLAN]))
        return prevDialog !== nextDialog && nextDialog === true
    }, ({dispatch}) => {
        dispatch(planZonesListFetchAction())
    }),

    withPropsOnChange((props, nextProps) => {
        const prevZone = _.toInteger(_.get(props, ['query', ZONE]))
        const nextZone = _.toInteger(_.get(nextProps, ['query', ZONE]))
        return (prevZone !== nextZone && nextZone > ZERO) ||
            (props.selectedDate !== nextProps.selectedDate && nextZone > ZERO) ||
            (props.selectedDay !== nextProps.selectedDay && nextZone > ZERO)
    }, ({dispatch, location, selectedDate, selectedDay, activeWeeks, activeDays}) => {
        _.map(activeWeeks, (w) => {
            w.active = false
        })
        _.map(activeDays, (d) => {
            if (d.id) {
                d.active = false
            }
        })
        const zone = _.toInteger(_.get(location, ['query', ZONE]))
        const date = moment(selectedDate).format('YYYY-MM-' + selectedDay)
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
        handleClickTab: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USER_GROUP]: id})})
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
            const {location: {pathname, query}, dispatch, createForm, filter, selectedDate, selectedDay, activeWeeks, activeDays, defaultPriority} = props
            const HUNDRED = 100
            const zone = _.get(query, ZONE)
            const date = selectedDate + '-' + selectedDay

            return dispatch(planCreateAction(createForm, filter.getParams()))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'План успешно составлен'}))
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
            const {dispatch, location: {pathname, query}, filter, createForm, selectedDate, selectedDay} = props
            const zone = _.get(query, ZONE)
            const date = selectedDate + '-' + selectedDay
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
                    dispatch(planAgentsListFetchAction(filter))
                })
        },

        handleDeleteAgentPlan: props => () => {
            const {dispatch, location: {pathname, query}, filter, selectedDate, selectedDay, setOpenConfirmDialog} = props
            const zone = _.get(query, ZONE)
            const date = selectedDate + '-' + selectedDay
            const planId = _.toInteger(_.get(query, UPDATE_PLAN))
            return dispatch(planDeleteAction(planId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'План успешно удален'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
                    hashHistory.push({pathname, query: filter.getParams({[UPDATE_PLAN]: false, [MARKET]: ZERO})})
                    dispatch(planZonesListFetchAction())
                    dispatch(planZonesItemFetchAction(zone, date))
                    dispatch(planAgentsListFetchAction(filter))
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
                    return dispatch(openSnackbarAction({message: 'Успешно обновлено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[OPEN_PLAN_SALES]: false})})
                    dispatch(planAgentsListFetchAction(filter))
                    dispatch(planItemFetchAction(user))
                    dispatch(agentMonthlyPlanAction(filter, user))
                })
        },

        handlePrevMonth: props => () => {
            const {location: {pathname}, filter, selectedDate} = props
            const prevMonth = moment(selectedDate).subtract(ONE, 'month')
            const dateForURL = prevMonth.format('YYYY-MM')
            hashHistory.push({pathname, query: filter.getParams({[DATE]: dateForURL})})
        },

        handleNextMonth: props => () => {
            const {location: {pathname}, filter, selectedDate} = props
            const nextMonth = moment(selectedDate).add(ONE, 'month')
            const dateForURL = nextMonth.format('YYYY-MM')
            hashHistory.push({pathname, query: filter.getParams({[DATE]: dateForURL})})
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
        zones,
        zonesLoading,
        zoneDetail,
        zoneDetailLoading,
        zoneAgents,
        zoneAgentsLoading,
        monthlyPlanCreateLoading,
        plan,
        planLoading,
        selectedDate,
        selectedDay,
        selectedWeekDay,
        marketsLocation,
        planDetails,
        createPlanLoading,
        updatePlanLoading,
        openConfirmDialog,
        setOpenConfirmDialog,
        agentPlansData,
        agentPlansLoading
    } = props

    const openAddPlan = toBoolean(_.get(location, ['query', ADD_PLAN]))
    const openPlanSales = toBoolean(_.get(location, ['query', OPEN_PLAN_SALES]))
    const openUpdatePlan = _.toInteger(_.get(location, ['query', UPDATE_PLAN])) > ZERO
    const groupId = _.toInteger(_.get(location, ['query', USER_GROUP]) || ONE)
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

    const updatePlan = {
        initialValues: (() => {
            const planType = _.get(planDetails, ['recurrences', '0', 'type'])
            const priority = _.get(planDetails, 'priority')
            const weekday = _.map(_.get(planDetails, 'recurrences'), (item) => {
                return {
                    id: _.get(item, 'weekDay') || _.get(item, 'monthDay'),
                    active: true
                }
            })
            if (!openUpdatePlan) {
                return {
                    planType: 'week',
                    weekday: [
                        {
                            id: selectedWeekDay,
                            active: true
                        }
                    ]
                }
            }
            return {
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

    const calendar = {
        selectedDay,
        selectedDate,
        handleChooseDay: props.handleChooseDay,
        handlePrevMonth: props.handlePrevMonth,
        handleNextMonth: props.handleNextMonth,
        handlePrevDay: props.handlePrevDay,
        handleNextDay: props.handleNextDay
    }

    const monthlyPlan = {
        data: plan,
        planLoading
    }

    const agentPlans = {
        data: agentPlansData,
        loading: agentPlansLoading
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
                planSalesDialog={planSalesDialog}
                handleClickTab={props.handleClickTab}
                groupId={groupId}
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
