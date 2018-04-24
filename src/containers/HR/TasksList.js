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
    tasksItemFetchAction,
    calendarListFetchAction
} from '../../actions/HR/tasks'
import * as TASK_TAB from '../../constants/hrTasksTab'
import {RESUME_FILTER_KEY, RESUME_FILTER_OPEN} from '../../components/HR/Resume'
import {joinArray} from '../../helpers/joinSplitValues'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import {langQueryFormat} from '../../helpers/joinSplitLanguages'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['application', 'item', 'data'])
        const detailLoading = _.get(state, ['application', 'item', 'loading'])
        const list = _.get(state, ['application', 'list', 'data'])
        const calendarList = _.get(state, ['application', 'calendar', 'data'])
        const calendarListLoading = _.get(state, ['application', 'calendar', 'loading'])
        const listLoading = _.get(state, ['application', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'TasksCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            createForm,
            calendarList,
            calendarListLoading
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(tasksListFetchAction(filter))
        dispatch(calendarListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const tasksId = _.get(nextProps, ['params', 'tasksId'])
        return tasksId && _.get(props, ['params', 'tasksId']) !== tasksId
    }, ({dispatch, params}) => {
        const tasksId = _.toInteger(_.get(params, 'tasksId'))
        tasksId && dispatch(tasksItemFetchAction(tasksId))
    }),

    // . withPropsOnChange((props, nextProps) => {
    // .     const tab = _.get(props, ['location', 'query', TAB])
    // .     const nextTab = _.get(nextProps, ['location', 'query', TAB])
    // .     return tab !== nextTab && nextTab
    // . }, ({dispatch, location: {query, pathname}, filter}) => {
    // .     const currentTab = _.get(query, TAB) || TASK_TAB.TASKS_TAB_CURRENT
    // .     const filterList = (status, doing) => {
    // .         return hashHistory.push({
    // .             pathname: pathname,
    // .             query: filter.getParams({status: status, doing: doing})
    // .         })
    // .     }
    // .     switch (currentTab) {
    // .         case TASK_TAB.TASKS_TAB_CURRENT: return filterList(APPLICATION_ASSIGNED, true)
    // .         case TASK_TAB.TASKS_TAB_NEW: return filterList(APPLICATION_ASSIGNED, false)
    // .         case TASK_TAB.TASKS_TAB_COMPLETED: return filterList(APPLICATION_COMPLETED, false)
    // .         default: return null
    // .     }
    // . }),

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
        },

        handleOpenFilterDialog: props => () => {
            return null
        },

        handleCloseFilterDialog: props => () => {
            return null
        },

        handleClearFilterDialog: props => () => {
            return null
        },
        handleOpenResumeMeetingDialog: props => (status, resume, application, relation) => {
            const {filter} = props
            hashHistory.push({
                pathname: ROUTER.HR_LONG_LIST_URL,
                query: filter.getParams({status, resume, application, relation})
            })
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const position = _.get(filterForm, ['values', 'position']) || null
            const mode = _.get(filterForm, ['values', 'mode']) || null
            const ageMin = _.get(filterForm, ['values', 'age', 'min']) || null
            const ageMax = _.get(filterForm, ['values', 'age', 'max']) || null
            const sex = _.get(filterForm, ['values', 'sex', 'value']) || null
            const education = _.get(filterForm, ['values', 'education']) || null
            const levelPc = _.get(filterForm, ['values', 'levelPc', 'value']) || null
            const languages = _.get(filterForm, ['values', 'languages']) || null
            const experience = _.get(filterForm, ['values', 'experience']) || null
            const skills = _.get(filterForm, ['values', 'skills']) || null
            const langToUrl = langQueryFormat(languages)

            filter.filterBy({
                [RESUME_FILTER_OPEN]: false,
                [RESUME_FILTER_KEY.POSITION]: joinArray(position),
                [RESUME_FILTER_KEY.MODE]: joinArray(mode),
                [RESUME_FILTER_KEY.AGE_MIN]: ageMin && numberWithoutSpaces(ageMin),
                [RESUME_FILTER_KEY.AGE_MAX]: ageMax && numberWithoutSpaces(ageMax),
                [RESUME_FILTER_KEY.SEX]: sex,
                [RESUME_FILTER_KEY.EDUCATION]: joinArray(education),
                [RESUME_FILTER_KEY.LEVEL_PC]: levelPc,
                [RESUME_FILTER_KEY.LANGUAGES]: _.join(langToUrl, '|'),
                [RESUME_FILTER_KEY.EXPERIENCE]: experience && numberWithoutSpaces(experience),
                [RESUME_FILTER_KEY.SKILLS]: joinArray(skills)
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
        params,
        calendarListLoading,
        calendarList
    } = props

    const detailId = _.toInteger(_.get(params, 'tasksId'))
    const tab = _.get(location, ['query', TAB]) || TASK_TAB.TASKS_DEFAULT_TAB

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const calendarData = {
        data: calendarList,
        loading: calendarListLoading,
        handleOpenResumeMeetingDialog: props.handleOpenResumeMeetingDialog
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

    const filterDialog = {
        openFilterDialog: true,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    return (
        <Layout {...layout}>
            <TasksGridList
                filter={filter}
                listData={listData}
                calendarData={calendarData}
                detailData={detailData}
                tabData={tabData}
                filterDialog={filterDialog}
            />
        </Layout>
    )
})

export default TasksList
