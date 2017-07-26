import React from 'react'
import _ from 'lodash'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {hashHistory} from 'react-router'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {ADD_PLAN, PlanWrapper, USER_GROUP} from '../../components/Plan'
import {
    planCreateAction,
    planAgentsListFetchAction,
    planItemFetchAction,
    planZonesListFetchAction
} from '../../actions/plan'
import {openSnackbarAction} from '../../actions/snackbar'

const ONE = 1
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
        const createForm = _.get(state, ['form', 'PlanCreateForm', 'values'])
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
    } = props

    const openAddPlan = toBoolean(_.get(location, ['query', ADD_PLAN]))
    const groupId = _.toInteger(_.get(location, ['query', USER_GROUP]) || ONE)
    const openDetail = !_.isEmpty(_.get(params, 'agentId'))
    const detailId = _.toInteger(_.get(params, 'agentId'))

    const addPlan = {
        openAddPlan,
        zonesList: _.get(zones, 'results'),
        zonesLoading,
        handleOpenAddPlan: props.handleOpenAddPlan,
        handleCloseAddPlan: props.handleCloseAddPlan,
        handleSubmitAddPlan: props.handleSubmitAddPlan
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

    return (
        <Layout {...layout}>
            <PlanWrapper
                filter={filter}
                usersList={listData}
                statData={statData}
                addPlan={addPlan}
                handleClickTab={props.handleClickTab}
                groupId={groupId}
                detailData={detailData}
            />
        </Layout>
    )
})

export default PlanList
