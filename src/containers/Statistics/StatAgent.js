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
import getDocuments from '../../helpers/getDocument'
import * as API from '../../constants/api'
import * as serializers from '../../serializers/Statistics/statAgentSerializer'
import moment from 'moment'

import {
    StatAgentGridList,
    STAT_AGENT_DIALOG_OPEN,
    DATE
} from '../../components/Statistics'
import {STAT_AGENT_FILTER_KEY} from '../../components/Statistics/Agents/StatAgentGridList'
import {
    statAgentListFetchAction,
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
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query)
        const selectedDate = _.get(query, DATE) || defaultDate

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            query,
            filterForm,
            filterItem,
            selectedDate
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
    }, ({dispatch, params, filter, filterItem, location: {query}}) => {
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
            hashHistory.push({pathname: ROUTER.STATISTICS_LIST_URL, query: filter.getParams()})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const zone = _.get(filterForm, ['values', 'zone', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [STAT_AGENT_FILTER_KEY.SEARCH]: search,
                [STAT_AGENT_FILTER_KEY.ZONE]: zone,
                [STAT_AGENT_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_AGENT_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_AGENT_GET_DOCUMENT, params)
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
        currentDate,
        params
    } = props

    const openStatAgentDialog = toBoolean(_.get(location, ['query', STAT_AGENT_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'statAgentId'))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const selectedDate = _.get(location, ['query', DATE]) || currentDate
    const zone = !_.isNull(_.get(location, ['query', 'zone'])) && _.toInteger(_.get(location, ['query', 'zone']))

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
    const detailData = {
        filter: filterItem,
        id: detailId,
        data: detail,
        agentDetail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail,
        selectedDate

    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    const initialValues = {
        zone: {
            value: zone
        },
        date: {
            fromDate: moment(firstDayOfMonth),
            toDate: moment(lastDayOfMonth)
        }
    }
    const calendar = {
        selectedDate: selectedDate,
        handlePrevMonth: props.handlePrevMonth,
        handleNextMonth: props.handleNextMonth
    }

    return (
        <Layout {...layout}>
            <StatAgentGridList
                filter={filter}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                listData={listData}
                detailData={detailData}
                statAgentDialog={statAgentDialog}
                getDocument={getDocument}
                calendar={calendar}
                initialValues={initialValues}
            />
        </Layout>
    )
})

export default StatAgentList
