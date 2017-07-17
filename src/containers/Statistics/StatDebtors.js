import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withHandlers, withPropsOnChange} from 'recompose'
import {
    statDebtorsListFetchAction,
    statDebtorsDataFetchAction,
    statDebtorsItemFetchAction
} from '../../actions/statisticsDeptors'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'

import {StatDebtorsGridList, STAT_DEBTORS_DIALOG_OPEN} from '../../components/Statistics'
import {STAT_DEBTORS_FILTER_KEY} from '../../components/Statistics/StatDebtorsGridList'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statDebtors', 'item', 'data'])
        const detailLoading = _.get(state, ['statDebtors', 'item', 'loading'])
        const statData = _.get(state, ['statisticsDebtors', 'data', 'data'])
        const list = _.get(state, ['statDebtors', 'list', 'data'])
        const listLoading = _.get(state, ['statDebtors', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatDebtorsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm,
            filterItem,
            statData
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statDebtorsListFetchAction(filter))
        dispatch(statDebtorsDataFetchAction())
    }),

    withPropsOnChange((props, nextProps) => {
        const statAgentId = _.get(nextProps, ['params', 'statAgentId'])
        return statAgentId && _.get(props, ['params', 'statAgentId']) !== statAgentId
    }, ({dispatch, params, filter, filterItem}) => {
        const statAgentId = _.toInteger(_.get(params, 'statAgentId'))
        dispatch(statDebtorsItemFetchAction(filter, filterItem, statAgentId))
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const product = _.get(filterForm, ['values', 'product', 'value']) || null
            const productType = _.get(filterForm, ['values', 'productType', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_DEBTORS_FILTER_KEY.PRODUCT]: product,
                [STAT_DEBTORS_FILTER_KEY.PRODUCT_TYPE]: productType,
                [STAT_DEBTORS_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_DEBTORS_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },

        handleOpenStatDebtorsDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_DEBTORS_DIALOG_OPEN]: true})})
        },

        handleCloseStatDebtorsDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_DEBTORS_DIALOG_OPEN]: false})})
        }
    })
)

const StatDebtorsList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        statData,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'statDebtorsId'))
    const openStatDebtorsDialog = toBoolean(_.get(location, ['query', STAT_DEBTORS_DIALOG_OPEN]))

    const statDebtorsDialog = {
        openStatDebtorsDialog,
        handleCloseStatDebtorsDialog: props.handleCloseStatDebtorsDialog,
        handleOpenStatDebtorsDialog: props.handleOpenStatDebtorsDialog
    }

    const listData = {
        statData: statData,
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
            <StatDebtorsGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                statDebtorsDialog={statDebtorsDialog}
            />
        </Layout>
    )
})

export default StatDebtorsList
