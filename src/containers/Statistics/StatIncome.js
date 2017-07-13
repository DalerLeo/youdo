import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'

import {StatIncomeGridList, STAT_INCOME_DIALOG_OPEN} from '../../components/Statistics'
import {STAT_INCOME_FILTER_KEY} from '../../components/Statistics/StatIncomeGridList'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statProduct', 'item', 'data'])
        const detailLoading = _.get(state, ['statProduct', 'item', 'loading'])
        const list = _.get(state, ['statProduct', 'list', 'data'])
        const listLoading = _.get(state, ['statProduct', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatIncomeFilterForm'])
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
                [STAT_INCOME_FILTER_KEY.PRODUCT]: product,
                [STAT_INCOME_FILTER_KEY.PRODUCT_TYPE]: productType,
                [STAT_INCOME_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_INCOME_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },

        handleOpenStatIncomeDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_INCOME_DIALOG_OPEN]: true})})
        },

        handleCloseStatIncomeDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_INCOME_DIALOG_OPEN]: false})})
        }
    })
)

const StatIncomeList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'statProductId'))
    const openStatIncomeDialog = toBoolean(_.get(location, ['query', STAT_INCOME_DIALOG_OPEN]))

    const statIncomeDialog = {
        openStatIncomeDialog,
        handleCloseStatIncomeDialog: props.handleCloseStatIncomeDialog,
        handleOpenStatIncomeDialog: props.handleOpenStatIncomeDialog
    }

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
            <StatIncomeGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                statIncomeDialog={statIncomeDialog}
            />
        </Layout>
    )
})

export default StatIncomeList
