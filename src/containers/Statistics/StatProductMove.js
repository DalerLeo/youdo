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
import * as serializers from '../../serializers/Statistics/statProductMoveSerializer'
import moment from 'moment'

import {
    StatProductMoveGridList,
    STAT_PRODUCT_MOVE_DIALOG_OPEN
} from '../../components/Statistics'
import {STAT_PRODUCT_MOVE_FILTER_KEY} from '../../components/Statistics/StatProductMoveGridList'
import {
    statProductMoveListFetchAction,
    statProductMoveItemFetchAction
} from '../../actions/statProductMove'

const ZERO = 0
const ONE = 1
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statProductMove', 'item', 'data'])
        const detailLoading = _.get(state, ['statProductMove', 'item', 'loading'])
        const list = _.get(state, ['statProductMove', 'list', 'data'])
        const listLoading = _.get(state, ['statProductMove', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatProductMoveFilterForm'])
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
            (!_.get(props, ['params', 'statProductMoveId'])) &&
            (!_.get(nextProps, ['params', 'statProductMoveId']))
    }, ({dispatch, filter}) => {
        dispatch(statProductMoveListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statProductMoveId = _.get(nextProps, ['params', 'statProductMoveId']) || ZERO
        return statProductMoveId > ZERO && _.get(props, ['params', 'statProductMoveId']) !== statProductMoveId
    }, ({dispatch, params, filter, filterItem}) => {
        const statProductMoveId = _.toInteger(_.get(params, 'statProductMoveId'))
        if (statProductMoveId > ZERO) {
            dispatch(statProductMoveItemFetchAction(filter, filterItem, statProductMoveId))
        }
    }),

    withHandlers({
        handleOpenStatProductMoveDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STATISTICS_AGENT_ITEM_PATH, id), query: filter.getParams({[STAT_PRODUCT_MOVE_DIALOG_OPEN]: true})})
        },

        handleCloseStatProductMoveDialog: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_AGENT_URL, query: filter.getParams({[STAT_PRODUCT_MOVE_DIALOG_OPEN]: false})})
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_LIST_URL, query: filter.getParams()})
        },

        handleSubmitFilterDialog: props => (event) => {
            event.preventDefault()
            const {filter, filterForm} = props

            const search = _.get(filterForm, ['values', 'search']) || null
            const zone = _.get(filterForm, ['values', 'zone', 'value']) || null
            const division = _.get(filterForm, ['values', 'division', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [STAT_PRODUCT_MOVE_FILTER_KEY.SEARCH]: search,
                [STAT_PRODUCT_MOVE_FILTER_KEY.DIVISION]: division,
                [STAT_PRODUCT_MOVE_FILTER_KEY.ZONE]: zone,
                [STAT_PRODUCT_MOVE_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_PRODUCT_MOVE_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_PRODUCT_MOVE_GET_DOCUMENT, params)
        }
    })
)

const StatProductMoveList = enhance((props) => {
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

    const openStatProductMoveDialog = toBoolean(_.get(location, ['query', STAT_PRODUCT_MOVE_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'statProductMoveId'))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)

    const statProductMoveDialog = {
        openStatProductMoveDialog,
        handleCloseStatProductMoveDialog: props.handleCloseStatProductMoveDialog,
        handleOpenStatProductMoveDialog: props.handleOpenStatProductMoveDialog
    }
    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const productMoveDetail = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === detailId
    })
    const filterDateRange = (_.get(filterForm, ['values', 'date', 'fromDate']) && _.get(filterForm, ['values', 'date', 'toDate'])) ? {
        'fromDate': _.get(filterForm, ['values', 'date', 'fromDate']),
        'toDate': _.get(filterForm, ['values', 'date', 'toDate'])
    } : {}

    const defaultDate = {
        'fromDate': moment().subtract(ONE, 'month'),
        'toDate': moment()
    }

    const detailData = {
        filter: filterItem,
        id: detailId,
        data: detail,
        productMoveDetail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail,
        filterDateRange

    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    const initialValues = {
        date: {
            date: filterDateRange || defaultDate,
            fromDate: moment(firstDayOfMonth),
            toDate: moment(lastDayOfMonth)
        }
    }

    return (
        <Layout {...layout}>
            <StatProductMoveGridList
                filter={filter}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                listData={listData}
                detailData={detailData}
                statProductMoveDialog={statProductMoveDialog}
                getDocument={getDocument}
                initialValues={initialValues}
            />
        </Layout>
    )
})

export default StatProductMoveList

