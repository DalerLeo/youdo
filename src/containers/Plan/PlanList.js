import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
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
    planAgentsListFetchAction,
    planItemFetchAction,
    planZonesListFetchAction,
    planMonthlySetAction,
    agentMonthlyPlanAction,
    planZonesItemFetchAction,
    marketsLocationAction,
    planUpdateDialogAction
} from '../../actions/plan'
import {openSnackbarAction} from '../../actions/snackbar'

const ZERO = 0
const ONE = 1
const LAST_DAY = 31
const defaultDate = moment().format('YYYY-MM')

export const weeks = [
    {id: 1, name: 'Пн', active: false},
    {id: 2, name: 'Вт', active: false},
    {id: 3, name: 'Ср', active: false},
    {id: 4, name: 'Чт', active: false},
    {id: 5, name: 'Пт', active: false},
    {id: 6, name: 'Сб', active: false},
    {id: 0, name: 'Вс', active: false}
]
export let days = []
for (let i = ONE; i <= LAST_DAY; i++) {
    const obj = {id: i, name: i, active: false}
    days.push(obj)
}
days.push('', '', '', '')

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
        const zoneAgents = _.get(state, ['plan', 'agentsPlan', 'data'])
        const zoneAgentsLoading = _.get(state, ['plan', 'agentsPlan', 'loading'])
        const stat = _.get(state, ['plan', 'statistics', 'data'])
        const statLoading = _.get(state, ['plan', 'statistics', 'loading'])
        const plan = _.get(state, ['plan', 'agentPlan', 'data'])
        const planLoading = _.get(state, ['plan', 'agentPlan', 'loading'])
        const monthlyPlanCreateLoading = _.get(state, ['plan', 'monthlyPlan', 'loading'])
        const createForm = _.get(state, ['form', 'PlanCreateForm', 'values'])
        const monthlyPlanForm = _.get(state, ['form', 'PlanSalesForm', 'values'])
        const selectedDate = _.get(query, DATE) || defaultDate
        const selectedDay = _.get(query, 'day') || moment().format('DD')
        const marketsLocation = _.get(state, ['tracking', 'markets', 'data'])
        const planDetails = _.get(state, ['plan', 'update', 'data'])
        const filter = filterHelper(usersList, pathname, query)
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
            zoneAgents,
            zoneAgentsLoading,
            createForm,
            selectedDate,
            selectedDay,
            monthlyPlanForm,
            monthlyPlanCreateLoading,
            plan,
            planLoading,
            marketsLocation,
            planDetails,
            filter
        }
    }),
    withState('activeWeeks', 'updateWeeks', weeks),
    withState('activeDays', 'updateDays', days),

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
    }, ({dispatch, params, filter}) => {
        const agentId = _.toInteger(_.get(params, 'agentId'))
        if (agentId) {
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
        const date = selectedDate + '-' + selectedDay
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
            dispatch(reset('PlanCreateForm'))
            hashHistory.push({pathname, query: {[ADD_PLAN]: true}})
        },

        handleCloseAddPlan: props => () => {
            const {dispatch, location: {pathname}, updateWeeks, updateDays} = props
            dispatch(reset('PlanCreateForm'))
            hashHistory.push({pathname, query: {[ADD_PLAN]: false}})
            updateWeeks(weeks)
            updateDays(days)
        },

        handleSubmitAddPlan: props => () => {
            const {location: {pathname, query}, dispatch, createForm, filter, selectedDate, selectedDay, activeWeeks, activeDays} = props
            const zone = _.get(query, ZONE)
            const date = selectedDate + '-' + selectedDay

            return dispatch(planCreateAction(createForm, filter.getParams()))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'План успешно составлен'}))
                })
                .then(() => {
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
        zoneAgents,
        zoneAgentsLoading,
        monthlyPlanCreateLoading,
        plan,
        planLoading,
        currentDate,
        selectedDay,
        marketsLocation,
        planDetails,
        activeWeeks,
        activeDays
    } = props

    const openAddPlan = toBoolean(_.get(location, ['query', ADD_PLAN]))
    const openPlanSales = toBoolean(_.get(location, ['query', OPEN_PLAN_SALES]))
    const openUpdatePlan = _.toInteger(_.get(location, ['query', UPDATE_PLAN])) > ZERO
    const groupId = _.toInteger(_.get(location, ['query', USER_GROUP]) || ONE)
    const openDetail = !_.isEmpty(_.get(params, 'agentId'))
    const detailId = _.toInteger(_.get(params, 'agentId'))
    const selectedDate = _.get(location, ['query', DATE]) || currentDate
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
        toggleDaysState: {
            activeWeeks: props.activeWeeks,
            updateWeeks: props.updateWeeks,
            activeDays: props.activeDays,
            updateDays: props.updateDays
        },
        handleChooseZone: props.handleChooseZone,
        handleChooseAgent: props.handleChooseAgent,
        handleChooseMarket: props.handleChooseMarket,
        handleOpenAddPlan: props.handleOpenAddPlan,
        handleCloseAddPlan: props.handleCloseAddPlan,
        handleSubmitAddPlan: props.handleSubmitAddPlan
    }

    const updatePlan = {
        initialValues: (() => {
            const planType = _.get(planDetails, ['recurrences', '0', 'type'])
            const priority = _.get(planDetails, 'priority')
            const weekday = _.map(_.get(planDetails, 'recurrences'), (item) => {
                const type = _.get(item, 'type')
                if (type === 'week') {
                    const filteredWeeks = _.filter(activeWeeks, (w) => {
                        return w.id === item.weekDay
                    })
                    _.map(filteredWeeks, (w) => {
                        w.active = true
                    })
                    console.warn(activeWeeks)
                } else {
                    const filteredDays = _.filter(activeDays, (d) => {
                        return d.id === item.monthDay
                    })
                    _.map(filteredDays, (d) => {
                        d.active = true
                    })
                    console.warn(activeDays)
                }
                return {
                    id: _.get(item, 'weekDay') || _.get(item, 'monthDay'),
                    active: true
                }
            })
            if (!openUpdatePlan) {
                _.map(activeWeeks, (w) => {
                    w.active = false
                })
                _.map(activeDays, (d) => {
                    if (d.id) {
                        d.active = false
                    }
                })
                return {}
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
        selectedDate: selectedDate,
        handleChooseDay: props.handleChooseDay,
        handlePrevMonth: props.handlePrevMonth,
        handleNextMonth: props.handleNextMonth
    }

    const monthlyPlan = {
        data: plan,
        planLoading
    }

    return (
        <Layout {...layout}>
            <PlanWrapper
                filter={filter}
                usersList={listData}
                statData={statData}
                addPlan={addPlan}
                updatePlan={updatePlan}
                planSalesDialog={planSalesDialog}
                handleClickTab={props.handleClickTab}
                groupId={groupId}
                calendar={calendar}
                detailData={detailData}
                monthlyPlan={monthlyPlan}
            />
        </Layout>
    )
})

export default PlanList
