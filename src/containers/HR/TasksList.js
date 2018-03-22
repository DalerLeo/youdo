import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {
    TAB,
    TasksGridList
} from '../../components/HR/Tasks'
import {
    tasksListFetchAction,
    tasksItemFetchAction
} from '../../actions/HR/tasks'
import * as TASK_TAB from '../../constants/hrTasksTab'
import {APPLICATION_ASSIGNED, APPLICATION_COMPLETED} from '../../constants/backendConstants'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['application', 'item', 'data'])
        const detailLoading = _.get(state, ['application', 'item', 'loading'])
        const list = _.get(state, ['application', 'list', 'data'])
        const listLoading = _.get(state, ['application', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'TasksCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            createForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(tasksListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const tasksId = _.get(nextProps, ['params', 'tasksId'])
        return tasksId && _.get(props, ['params', 'tasksId']) !== tasksId
    }, ({dispatch, params}) => {
        const tasksId = _.toInteger(_.get(params, 'tasksId'))
        tasksId && dispatch(tasksItemFetchAction(tasksId))
    }),

    withPropsOnChange((props, nextProps) => {
        const tab = _.get(props, ['location', 'query', TAB])
        const nextTab = _.get(nextProps, ['location', 'query', TAB])
        return tab !== nextTab && nextTab
    }, ({dispatch, location: {query, pathname}, filter}) => {
        const currentTab = _.get(query, TAB) || TASK_TAB.TASKS_TAB_CURRENT
        const filterList = (status, doing) => {
            return hashHistory.push({
                pathname: pathname,
                query: filter.getParams({status: status, doing: doing})
            })
        }
        switch (currentTab) {
            case TASK_TAB.TASKS_TAB_CURRENT: return filterList(APPLICATION_ASSIGNED, true)
            case TASK_TAB.TASKS_TAB_NEW: return filterList(APPLICATION_ASSIGNED, false)
            case TASK_TAB.TASKS_TAB_COMPLETED: return filterList(APPLICATION_COMPLETED, false)
            default: return null
        }
    }),

    withHandlers({
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.HR_TASKS_LIST_URL, query: filter.getParams()})
        },

        handleTabChange: props => (tab) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[TAB]: tab})
            })
        }
    })
)

const TasksList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'tasksId'))
    const tab = _.get(location, ['query', TAB]) || TASK_TAB.TASKS_DEFAULT_TAB

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
    }

    return (
        <Layout {...layout}>
            <TasksGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                tabData={tabData}
            />
        </Layout>
    )
})

export default TasksList
