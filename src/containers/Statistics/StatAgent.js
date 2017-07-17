import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'

import {
    StatAgentGridList,
    STAT_AGENT_DIALOG_OPEN
} from '../../components/Statistics'
import {STAT_AGENT_FILTER_KEY} from '../../components/Statistics/StatAgentGridList'
import {
    statAgentListFetchAction,
    statAgentItemFetchAction
} from '../../actions/statAgent'

const ZERO = 0

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statAgent', 'item', 'data'])
        const detailLoading = _.get(state, ['statAgent', 'item', 'loading'])
        const list = _.get(state, ['statAgent', 'list', 'data'])
        const listLoading = _.get(state, ['statAgent', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatAgentFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            query,
            filterForm,
            filterItem
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest() &&
            (!_.get(props, ['params', 'statAgentId'])) &&
            (!_.get(nextProps, ['params', 'statAgentId']))
    }, ({dispatch, filter}) => {
        dispatch(statAgentListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statAgentId = _.get(nextProps, ['params', 'statAgentId']) || ZERO
        return statAgentId > ZERO && _.get(props, ['params', 'statAgentId']) !== statAgentId
    }, ({dispatch, params, filter, filterItem}) => {
        const statAgentId = _.toInteger(_.get(params, 'statAgentId'))
        if (statAgentId > ZERO) {
            dispatch(statAgentItemFetchAction(filter, filterItem, statAgentId))
        }
    }),

    withHandlers({
        handleOpenStatAgentDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STATISTICS_AGENT_ITEM_PATH, id), query: filter.getParams({[STAT_AGENT_DIALOG_OPEN]: true})})
        },

        handleCloseStatAgentDialog: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_AGENT_URL, query: filter.getParams({[STAT_AGENT_DIALOG_OPEN]: false})})
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_LIST_URL, query: filter.getParam()})
        },

        handleSubmitFilterDialog: props => (event) => {
            event.preventDefault()
            const {filter, filterForm} = props

            const search = _.get(filterForm, ['values', 'search']) || null
            const user = _.get(filterForm, ['values', 'user', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [STAT_AGENT_FILTER_KEY.SEARCH]: search,
                [STAT_AGENT_FILTER_KEY.USER]: user,
                [STAT_AGENT_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_AGENT_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        }
    })
)

const StatAgentList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        filterItem,
        filterForm,
        params
    } = props

    const openStatAgentDialog = toBoolean(_.get(location, ['query', STAT_AGENT_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'statAgentId'))
    const statAgentDialog = {
        openStatAgentDialog,
        handleCloseStatAgentDialog: props.handleCloseStatAgentDialog,
        handleOpenStatAgentDialog: props.handleOpenStatAgentDialog
    }
    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const agentDetail = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === detailId
    })
    const filterDateRange = {
        'fromDate': _.get(filterForm, ['values', 'date', 'fromDate']) || null,
        'toDate': _.get(filterForm, ['values', 'date', 'toDate']) || null
    }
    const detailData = {
        filter: filterItem,
        id: detailId,
        data: detail,
        agentDetail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail,
        filterDateRange

    }

    return (
        <Layout {...layout}>
            <StatAgentGridList
                filter={filter}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                listData={listData}
                detailData={detailData}
                statAgentDialog={statAgentDialog}
            />
        </Layout>
    )
})

export default StatAgentList
