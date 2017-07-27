import React from 'react'
import _ from 'lodash'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import moment from 'moment'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {hashHistory} from 'react-router'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {ADD_ACTIVITY, ActivityWrapper, DAY, MONTH} from '../../components/Activity'
import {
    activityCreateAction,
    activityAgentsListFetchAction,
    activityItemFetchAction,
    activityZonesListFetchAction
} from '../../actions/activity'
import {openSnackbarAction} from '../../actions/snackbar'

const ONE = 1
const today = _.toInteger(moment().format('D'))
let currentMonth = moment()

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
        const stat = _.get(state, ['activity', 'statistics', 'data'])
        const statLoading = _.get(state, ['activity', 'statistics', 'loading'])
        const createForm = _.get(state, ['form', 'ActivityCreateForm', 'values'])
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
        dispatch(activityAgentsListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const agentId = _.get(nextProps, ['params', 'agentId'])
        return agentId && _.get(props, ['params', 'agentId']) !== agentId
    }, ({dispatch, params}) => {
        const agentId = _.toInteger(_.get(params, 'agentId'))
        agentId && dispatch(activityItemFetchAction(agentId))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevDialog = toBoolean(_.get(props, ['query', ADD_ACTIVITY]))
        const nextDialog = toBoolean(_.get(nextProps, ['query', ADD_ACTIVITY]))
        return prevDialog !== nextDialog && nextDialog === true
    }, ({dispatch}) => {
        dispatch(activityZonesListFetchAction())
    }),

    withHandlers({
        handleClickDay: props => (day) => {
            const {location: {pathname}, filter} = props
            const curMonth = currentMonth.format('YYYY-MM-DD')
            hashHistory.push({pathname, query: filter.getParams({[DAY]: day, [MONTH]: curMonth})})
        },

        handleNextMonth: props => (month) => {
            const {location: {pathname}, filter} = props
            currentMonth = moment(month).add(ONE, 'month')
            const monthForURL = currentMonth.format('MMMM')
            hashHistory.push({pathname, query: filter.getParams({[MONTH]: monthForURL})})
            console.log(currentMonth.format('MMMM'))
        },

        handleOpenAddActivity: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_ACTIVITY]: true})})
        },

        handleCloseAddActivity: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_ACTIVITY]: false})})
        },

        handleSubmitAddActivity: props => () => {
            const {location: {pathname}, dispatch, createForm, filter} = props

            return dispatch(activityCreateAction(createForm))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Зона успешно добавлена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ADD_ACTIVITY]: false})})
                    dispatch(activityAgentsListFetchAction(filter))
                })
        }
    })
)

const ActivityList = enhance((props) => {
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
        zonesLoading
    } = props

    const openAddActivity = toBoolean(_.get(location, ['query', ADD_ACTIVITY]))
    const selectedDay = _.toInteger(_.get(location, ['query', DAY]) || today)
    const selectedMonth = _.get(location, ['query', MONTH]) || currentMonth
    const openDetail = !_.isEmpty(_.get(params, 'agentId'))
    const detailId = _.toInteger(_.get(params, 'agentId'))

    const addActivity = {
        openAddActivity,
        zonesList: _.get(zones, 'results'),
        zonesLoading,
        handleOpenAddActivity: props.handleOpenAddActivity,
        handleCloseAddActivity: props.handleCloseAddActivity,
        handleSubmitAddActivity: props.handleSubmitAddActivity
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
        selectedDay: selectedDay,
        currentMonth: currentMonth,
        handleNextMonth: props.handleNextMonth
    }

    return (
        <Layout {...layout}>
            <ActivityWrapper
                filter={filter}
                usersList={listData}
                statData={statData}
                addActivity={addActivity}
                handleClickDay={props.handleClickDay}
                calendar={calendar}
                detailData={detailData}
            />
        </Layout>
    )
})

export default ActivityList
