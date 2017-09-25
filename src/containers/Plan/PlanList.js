import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
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
    DATE
} from '../../components/Plan'
import {
    planCreateAction,
    planAgentsListFetchAction,
    planItemFetchAction,
    planZonesListFetchAction,
    planMonthlySetAction,
    agentMonthlyPlanAction
} from '../../actions/plan'
import {openSnackbarAction} from '../../actions/snackbar'

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
        const stat = _.get(state, ['plan', 'statistics', 'data'])
        const statLoading = _.get(state, ['plan', 'statistics', 'loading'])
        const plan = _.get(state, ['plan', 'agentPlan', 'data'])
        const planLoading = _.get(state, ['plan', 'agentPlan', 'loading'])
        const monthlyPlanCreateLoading = _.get(state, ['plan', 'monthlyPlan', 'loading'])
        const createForm = _.get(state, ['form', 'PlanCreateForm', 'values'])
        const monthlyPlanForm = _.get(state, ['form', 'PlanSalesForm', 'values'])
        const selectedDate = _.get(query, DATE) || defaultDate
        const selectedDay = _.get(query, 'day') || moment().format('DD')
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
            createForm,
            selectedDate,
            selectedDay,
            monthlyPlanForm,
            monthlyPlanCreateLoading,
            plan,
            planLoading,
            filter
        }
    }),

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

    withHandlers({
        handleClickTab: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USER_GROUP]: id})})
        },

        handleOpenAddPlan: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {[ADD_PLAN]: true}})
        },

        handleCloseAddPlan: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {[ADD_PLAN]: false}})
        },

        handleSubmitAddPlan: props => () => {
            const {location: {pathname}, dispatch, createForm, filter} = props

            return dispatch(planCreateAction(createForm))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Зона успешно добавлена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: {[ADD_PLAN]: false}})
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

        handleChooseDay: props => (day) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({'day': day})})
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
        monthlyPlanCreateLoading,
        plan,
        planLoading,
        currentDate,
        selectedDay
    } = props

    const openAddPlan = toBoolean(_.get(location, ['query', ADD_PLAN]))
    const openPlanSales = toBoolean(_.get(location, ['query', OPEN_PLAN_SALES]))
    const groupId = _.toInteger(_.get(location, ['query', USER_GROUP]) || ONE)
    const openDetail = !_.isEmpty(_.get(params, 'agentId'))
    const detailId = _.toInteger(_.get(params, 'agentId'))
    const selectedDate = _.get(location, ['query', DATE]) || currentDate

    const addPlan = {
        openAddPlan,
        zonesList: _.get(zones, 'results'),
        zonesLoading,
        handleOpenAddPlan: props.handleOpenAddPlan,
        handleCloseAddPlan: props.handleCloseAddPlan,
        handleSubmitAddPlan: props.handleSubmitAddPlan
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
