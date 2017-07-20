import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'

import {StatProductGridList} from '../../components/Statistics'
import {STAT_PRODUCT_FILTER_KEY} from '../../components/Statistics/StatProductGridList'
import {
    statProductListFetchAction,
    getDocumentAction
} from '../../actions/statProduct'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statProduct', 'item', 'data'])
        const detailLoading = _.get(state, ['statProduct', 'item', 'loading'])
        const list = _.get(state, ['statProduct', 'list', 'data'])
        const listLoading = _.get(state, ['statProduct', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatProductFilterForm'])
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
        dispatch(statProductListFetchAction(filter))
    }),

    withHandlers({
        handleSubmitFilterDialog: props => (event) => {
            event.preventDefault()
            const {filter, filterForm} = props

            const search = _.get(filterForm, ['values', 'search']) || null
            const product = _.get(filterForm, ['values', 'product', 'value']) || null
            const productType = _.get(filterForm, ['values', 'productType', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_PRODUCT_FILTER_KEY.SEARCH]: search,
                [STAT_PRODUCT_FILTER_KEY.PRODUCT]: product,
                [STAT_PRODUCT_FILTER_KEY.PRODUCT_TYPE]: productType,
                [STAT_PRODUCT_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_PRODUCT_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
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

const StatProductList = enhance((props) => {
    const {
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        params
    } = props
    const detailId = _.toInteger(_.get(params, 'statProductId'))

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
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }

    return (
        <Layout {...layout}>
            <StatProductGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                getDocument={getDocument}
            />
        </Layout>
    )
})

export default StatProductList
