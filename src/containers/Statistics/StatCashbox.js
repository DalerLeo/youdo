import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import * as API from '../../constants/api'
import * as serializers from '../../serializers/Statistics/statCashboxSerializer'
import getDocuments from '../../helpers/getDocument'

import {StatCashboxGridList} from '../../components/Statistics'
import {STAT_CASHBOX_FILTER_KEY} from '../../components/Statistics/StatCashboxGridList'
import {
    statCashboxListFetchAction,
    statCashboxItemFetchAction
} from '../../actions/statisticsCashboxt'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['cashbox', 'item', 'data'])
        const detailLoading = _.get(state, ['cashbox', 'item', 'loading'])
        const list = _.get(state, ['cashbox', 'list', 'data'])
        const listLoading = _.get(state, ['cashbox', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatCashboxFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statCashboxListFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const prevId = _.toInteger(_.get(props, ['params', 'cashboxId']))
        const nextId = _.toInteger(_.get(nextProps, ['params', 'cashboxId']))
        return prevId !== nextId && nextId > ZERO
    }, ({dispatch, params}) => {
        const id = _.toInteger(_.get(params, 'cashboxId'))
        if (id > ZERO) {
            dispatch(statCashboxItemFetchAction(id))
        }
    }),

    withHandlers({
        handleSubmitFilterDialog: props => (event) => {
            event.preventDefault()
            const {filter, filterForm} = props

            const cashbox = _.get(filterForm, ['values', 'cashbox', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_CASHBOX_FILTER_KEY.CASHBOX]: cashbox,
                [STAT_CASHBOX_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_CASHBOX_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_CASHBOX_URL, query: filter.getParams()})
        },

        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_CASHBOX_GET_DOCUMENT, params)
        }
    })
)

const StatCashboxList = enhance((props) => {
    const {
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'cashboxId'))
    const openDetails = detailId > ZERO

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        openDetails
    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }

    return (
        <Layout {...layout}>
            <StatCashboxGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                getDocument={getDocument}
            />
        </Layout>
    )
})

export default StatCashboxList
