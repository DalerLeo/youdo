import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {splitToArray} from '../../helpers/joinSplitValues'
import toBoolean from '../../helpers/toBoolean'
import getDocuments from '../../helpers/getDocument'
import * as API from '../../constants/api'
import * as serializers from '../../serializers/Statistics/statAgentSerializer'
import moment from 'moment'

import {
    StatAgentGridList,
    STAT_AGENT_DIALOG_OPEN,
    BEGIN_DATE,
    END_DATE
} from '../../components/Statistics'
import {STAT_AGENT_FILTER_KEY} from '../../components/Statistics/Agents/AgentGridList'
import {
    statAgentListFetchAction,
    statAgentSummaryFetchAction,
    statAgentItemFetchAction
} from '../../actions/statAgent'

const defaultDate = moment().format('YYYY-MM-DD')
const ZERO = 0
const ONE = 1
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statAgent', 'item', 'data'])
        const detailLoading = _.get(state, ['statAgent', 'item', 'loading'])
        const list = _.get(state, ['statAgent', 'list', 'data'])
        const listLoading = _.get(state, ['statAgent', 'list', 'loading'])
        const summary = _.get(state, ['statAgent', 'sum', 'data'])
        const summaryLoading = _.get(state, ['statAgent', 'sum', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})
        const beginDate = _.get(query, BEGIN_DATE) || defaultDate
        const endDate = _.get(query, END_DATE) || defaultDate

        return {
            list,
            listLoading,
            summary,
            summaryLoading,
            detail,
            detailLoading,
            filter,
            query,
            filterForm,
            filterItem,
            beginDate,
            endDate
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            openStatAgentDialog: null,
            dPage: null,
            dPageSize: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(statAgentListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            openStatAgentDialog: null,
            dPage: null,
            dPageSize: null,
            search: null,
            page: null,
            pageSize: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(statAgentSummaryFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null
        }
        return props.list && props.filterItem.filterRequest(except) !== nextProps.filterItem.filterRequest(except)
    }, ({dispatch, params, filter, filterItem}) => {
        const statAgentId = _.toInteger(_.get(params, 'statAgentId'))
        if (statAgentId > ZERO) {
            dispatch(statAgentItemFetchAction(filter, filterItem, statAgentId))
        }
    }),

    withHandlers({
        handleOpenStatAgentDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STATISTICS_AGENT_ITEM_PATH, id),
                query: filter.getParams({[STAT_AGENT_DIALOG_OPEN]: true})
            })
        },

        handleCloseStatAgentDialog: props => () => {
            const {filter} = props
            hashHistory.push({
                pathname: ROUTER.STATISTICS_AGENT_URL,
                query: filter.getParams({[STAT_AGENT_DIALOG_OPEN]: false})
            })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_LIST_URL, query: filter.getParams()})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const zone = _.get(filterForm, ['values', 'zone']) || null
            const division = _.get(filterForm, ['values', 'division']) || null
            const marketTypeParent = _.get(filterForm, ['values', 'marketTypeParent', 'value']) || null
            const marketType = _.get(filterForm, ['values', 'marketType', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [STAT_AGENT_FILTER_KEY.SEARCH]: search,
                [STAT_AGENT_FILTER_KEY.ZONE]: _.join(zone, '-'),
                [STAT_AGENT_FILTER_KEY.DIVISION]: _.join(division, '-'),
                [STAT_AGENT_FILTER_KEY.MARKET_TYPE_PARENT]: marketTypeParent,
                [STAT_AGENT_FILTER_KEY.MARKET_TYPE]: marketType,
                [STAT_AGENT_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_AGENT_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_AGENT_GET_DOCUMENT, params)
        },
        handlePrevMonthBegin: props => () => {
            const {location: {pathname}, filter, beginDate} = props
            const prevMonth = moment(beginDate).subtract(ONE, 'month')
            const dateForURL = prevMonth.format('YYYY-MM')
            hashHistory.push({pathname, query: filter.getParams({[BEGIN_DATE]: dateForURL})})
        },

        handleNextMonthBegin: props => () => {
            const {location: {pathname}, filter, beginDate} = props
            const nextMonth = moment(beginDate).add(ONE, 'month')
            const dateForURL = nextMonth.format('YYYY-MM')
            hashHistory.push({pathname, query: filter.getParams({[BEGIN_DATE]: dateForURL})})
        },

        handlePrevMonthEnd: props => () => {
            const {location: {pathname}, filter, endDate} = props
            const prevMonth = moment(endDate).subtract(ONE, 'month')
            const dateForURL = prevMonth.format('YYYY-MM')
            hashHistory.push({pathname, query: filter.getParams({[END_DATE]: dateForURL})})
        },

        handleNextMonthEnd: props => () => {
            const {location: {pathname}, filter, endDate} = props
            const nextMonth = moment(endDate).add(ONE, 'month')
            const dateForURL = nextMonth.format('YYYY-MM')
            hashHistory.push({pathname, query: filter.getParams({[END_DATE]: dateForURL})})
        }
    })
)

const StatAgentList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        summary,
        summaryLoading,
        detail,
        detailLoading,
        filter,
        layout,
        filterItem,
        beginDate,
        endDate,
        params
    } = props

    const openStatAgentDialog = toBoolean(_.get(location, ['query', STAT_AGENT_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'statAgentId'))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const zone = !_.isNull(_.get(location, ['query', 'zone'])) && _.get(location, ['query', 'zone'])
    const division = !_.isNull(_.get(location, ['query', 'division'])) && _.get(location, ['query', 'division'])
    const marketTypeParent = !_.isNull(_.get(location, ['query', 'markettypeParent'])) && _.get(location, ['query', 'markettypeParent'])
    const marketType = !_.isNull(_.get(location, ['query', 'markettypeChild'])) && _.get(location, ['query', 'markettypeChild'])
    const search = !_.isNull(_.get(location, ['query', 'search'])) ? _.get(location, ['query', 'search']) : null

    const statAgentDialog = {
        openStatAgentDialog,
        handleCloseStatAgentDialog: props.handleCloseStatAgentDialog,
        handleOpenStatAgentDialog: props.handleOpenStatAgentDialog
    }
    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const summaryData = {
        data: summary,
        loading: summaryLoading
    }
    const agentDetail = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === detailId
    })
    const detailData = {
        filter: filterItem,
        id: detailId,
        data: detail,
        agentDetail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail,
        beginDate,
        endDate

    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    const initialValues = {
        search: search,
        zone: zone && splitToArray(zone),
        division: division && splitToArray(division),
        marketTypeParent: marketTypeParent && marketTypeParent,
        marketType: marketType && marketType,
        date: {
            fromDate: moment(firstDayOfMonth),
            toDate: moment(lastDayOfMonth)
        }
    }
    const calendarBegin = {
        selectedDate: beginDate,
        handlePrevMonthBegin: props.handlePrevMonthBegin,
        handleNextMonthBegin: props.handleNextMonthBegin
    }
    const calendarEnd = {
        selectedDate: endDate,
        handlePrevMonthEnd: props.handlePrevMonthEnd,
        handleNextMonthEnd: props.handleNextMonthEnd
    }

    return (
        <Layout {...layout}>
            <StatAgentGridList
                filter={filter}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                listData={listData}
                summaryData={summaryData}
                detailData={detailData}
                statAgentDialog={statAgentDialog}
                getDocument={getDocument}
                calendarBegin={calendarBegin}
                calendarEnd={calendarEnd}
                initialValues={initialValues}
            />
        </Layout>
    )
})

export default StatAgentList
