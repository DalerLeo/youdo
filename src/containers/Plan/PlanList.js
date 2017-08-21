import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import {connect} from 'react-redux'
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
    planMonthlySetAction
} from '../../actions/plan'
import {openSnackbarAction} from '../../actions/snackbar'

const ONE = 1
const defaultDate = moment().format('YYYY-MM-DD')
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const usersList = _.get(state, ['users', 'list', 'data'])
        const usersListLoading = _.get(state, ['users', 'list', 'loading'])
        const detail = _.get(state, ['users', 'item', 'data'])
        const detailLoading = _.get(state, ['users', 'item', 'loading'])
        const zones = _.get(state, ['zone', 'list', 'data'])
        const zonesLoading = _.get(state, ['zone', 'list', 'loading'])
        const stat = _.get(state, ['plan', 'statistics', 'data'])
        const statLoading = _.get(state, ['plan', 'statistics', 'loading'])
        const monthlyPlanCreateLoading = _.get(state, ['plan', 'monthlyPlan', 'loading'])
        const createForm = _.get(state, ['form', 'PlanCreateForm', 'values'])
        const monthlyPlanForm = _.get(state, ['form', 'PlanSalesForm', 'values'])
        const selectedDate = _.get(query, DATE) || defaultDate
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
            monthlyPlanForm,
            monthlyPlanCreateLoading,
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
        return agentId && _.get(props, ['params', 'agentId']) !== agentId
    }, ({dispatch, params}) => {
        const agentId = _.toInteger(_.get(params, 'agentId'))
        agentId && dispatch(planItemFetchAction(agentId))
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
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_PLAN]: true})})
        },

        handleCloseAddPlan: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_PLAN]: false})})
        },

        handleSubmitAddPlan: props => () => {
            const {location: {pathname}, dispatch, createForm, filter} = props

            return dispatch(planCreateAction(createForm))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Зона успешно добавлена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ADD_PLAN]: false})})
                    dispatch(planAgentsListFetchAction(filter))
                })
        },

        handleOpenPlanSales: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_PLAN_SALES]: true})})
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
        currentDate
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
        selectedDate: selectedDate,
        handlePrevMonth: props.handlePrevMonth,
        handleNextMonth: props.handleNextMonth
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
            />
        </Layout>
    )
})

export default PlanList
