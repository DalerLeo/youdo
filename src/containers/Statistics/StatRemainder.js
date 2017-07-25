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
    StatRemainderGridList,
    STAT_REMAINDER_DIALOG_OPEN
} from '../../components/Statistics'
import {
    statRemainderListFetchAction,
    statRemainderItemFetchAction,
    getDocumentAction
} from '../../actions/statRemainder'

const ZERO = 0

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statRemainder', 'item', 'data'])
        const detailLoading = _.get(state, ['statRemainder', 'item', 'loading'])
        const list = _.get(state, ['statRemainder', 'list', 'data'])
        const listLoading = _.get(state, ['statRemainder', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatRemainderFilterForm'])
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
            (!_.get(props, ['params', 'statRemainderId'])) &&
            (!_.get(nextProps, ['params', 'statRemainderId']))
    }, ({dispatch, filter}) => {
        dispatch(statRemainderListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statRemainderId = _.get(nextProps, ['params', 'statRemainderId']) || ZERO
        return statRemainderId > ZERO && _.get(props, ['params', 'statRemainderId']) !== statRemainderId
    }, ({dispatch, params, filter, filterItem}) => {
        const statRemainderId = _.toInteger(_.get(params, 'statRemainderId'))
        if (statRemainderId > ZERO) {
            dispatch(statRemainderItemFetchAction(filter, filterItem, statRemainderId))
        }
    }),

    withHandlers({
        handleOpenStatRemainderDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STATISTICS_AGENT_ITEM_PATH, id), query: filter.getParams({[STAT_REMAINDER_DIALOG_OPEN]: true})})
        },

        handleCloseStatRemainderDialog: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_AGENT_URL, query: filter.getParams({[STAT_REMAINDER_DIALOG_OPEN]: false})})
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_LIST_URL, query: filter.getParams()})
        },

        handleGetDocument: props => () => {
            const {dispatch, filter} = props
            return dispatch(getDocumentAction(filter))
        }
    })
)

const StatRemainderList = enhance((props) => {
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
    const openStatRemainderDialog = toBoolean(_.get(location, ['query', STAT_REMAINDER_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'statRemainderId'))
    const statRemainderDialog = {
        openStatRemainderDialog,
        handleCloseStatRemainderDialog: props.handleCloseStatRemainderDialog,
        handleOpenStatRemainderDialog: props.handleOpenStatRemainderDialog
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
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }

    return (
        <Layout {...layout}>
            <StatRemainderGridList
                filter={filter}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                listData={listData}
                detailData={detailData}
                statRemainderDialog={statRemainderDialog}
                getDocument={getDocument}
            />
        </Layout>
    )
})

export default StatRemainderList
