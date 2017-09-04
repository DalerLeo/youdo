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
import * as serializers from '../../serializers/Statistics/statRemainderSerializer'
import getDocuments from '../../helpers/getDocument'
import * as API from '../../constants/api'

import {
    StatRemainderGridList,
    STAT_REMAINDER_DIALOG_OPEN
} from '../../components/Statistics'

import {STAT_REMAINDER_FILTER_KEY} from '../../components/Statistics/StatRemainderGridLIst'
import {
    statRemainderListFetchAction,
    statRemainderItemFetchAction
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
        const filterItem = filterHelper(detail, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})
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
        return statRemainderId > ZERO && (_.get(props, ['params', 'statRemainderId']) !== statRemainderId ||
            props.filterItem.filterRequest() !== nextProps.filterItem.filterRequest())
    }, ({dispatch, params, filterItem}) => {
        const statRemainderId = _.toInteger(_.get(params, 'statRemainderId'))
        if (statRemainderId > ZERO) {
            dispatch(statRemainderItemFetchAction(filterItem, statRemainderId))
        }
    }),

    withHandlers({
        handleOpenStatRemainderDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STATISTICS_REMAINDER_ITEM_PATH, id), query: filter.getParams({[STAT_REMAINDER_DIALOG_OPEN]: true})})
        },

        handleCloseStatRemainderDialog: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_REMAINDER_URL, query: filter.getParams({[STAT_REMAINDER_DIALOG_OPEN]: false})})
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_LIST_URL, query: filter.getParams()})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const product = _.get(filterForm, ['values', 'product', 'value']) || null
            const division = _.get(filterForm, ['values', 'division', 'value']) || null
            const search = _.get(filterForm, ['values', 'search']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || _.get(filterForm, ['values', 'typeParent', 'value']) || null
            const stock = _.get(filterForm, ['values', 'stock', 'value']) || null

            filter.filterBy({
                [STAT_REMAINDER_FILTER_KEY.SEARCH]: search,
                [STAT_REMAINDER_FILTER_KEY.PRODUCT]: product,
                [STAT_REMAINDER_FILTER_KEY.DIVISION]: division,
                [STAT_REMAINDER_FILTER_KEY.TYPE]: type,
                [STAT_REMAINDER_FILTER_KEY.STOCK]: stock

            })
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_REMAINDER_GET_DOCUMENT, params)
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
    const rowDetail = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === detailId
    })
    const detailData = {
        id: detailId,
        data: detail,
        rowDetail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail

    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }

    return (
        <Layout {...layout}>
            <StatRemainderGridList
                filter={filter}
                onSubmit={props.handleSubmitFilterDialog}
                listData={listData}
                detailData={detailData}
                statRemainderDialog={statRemainderDialog}
                getDocument={getDocument}
                filterItem={filterItem}
            />
        </Layout>
    )
})

export default StatRemainderList
