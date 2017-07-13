import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'

import {StatSalesGridList} from '../../components/Statistics'
import {STAT_SALES_FILTER_KEY} from '../../components/Statistics/StatSalesGridList'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statProduct', 'item', 'data'])
        const detailLoading = _.get(state, ['statProduct', 'item', 'loading'])
        const list = _.get(state, ['statProduct', 'list', 'data'])
        const listLoading = _.get(state, ['statProduct', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatAgentFilterForm'])
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

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const product = _.get(filterForm, ['values', 'product', 'value']) || null
            const productType = _.get(filterForm, ['values', 'productType', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_SALES_FILTER_KEY.PRODUCT]: product,
                [STAT_SALES_FILTER_KEY.PRODUCT_TYPE]: productType,
                [STAT_SALES_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        }
    })
)

const StatSalesList = enhance((props) => {
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
    return (
        <Layout {...layout}>
            <StatSalesGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
            />
        </Layout>
    )
})

export default StatSalesList
