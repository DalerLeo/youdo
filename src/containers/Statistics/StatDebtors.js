import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withHandlers, withPropsOnChange, withState} from 'recompose'
import {
    statDebtorsListFetchAction,
    statDebtorsDataFetchAction,
    statDebtorsItemFetchAction,
    statDebtorsOrderItemFetchAction,
    getDocumentAction
} from '../../actions/statisticsDebtors'
import filterHelper from '../../helpers/filter'
import {StatDebtorsGridList} from '../../components/Statistics'
import {STAT_DEBTORS_FILTER_KEY} from '../../components/Statistics/Debtors/StatDebtorsGridList'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detailOrder = _.get(state, ['order', 'item'])
        const detailOrderLoading = _.get(state, ['order', 'item', 'loading'])
        const detail = _.get(state, ['statisticsDebtors', 'item', 'data'])
        const detailLoading = _.get(state, ['statisticsDebtors', 'item', 'loading'])
        const statData = _.get(state, ['statisticsDebtors', 'data', 'data'])
        const list = _.get(state, ['statisticsDebtors', 'list', 'data'])
        const listLoading = _.get(state, ['statisticsDebtors', 'list', 'loading'])
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
            detailOrder,
            detailOrderLoading,
            statData
        }
    }),
    withState('openDetail', 'setOpenDetail', false),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statDebtorsListFetchAction(filter))
        dispatch(statDebtorsDataFetchAction())
    }),

    withPropsOnChange((props, nextProps) => {
        const orderId = _.toInteger(_.get(props, ['location', 'query', 'orderId']))
        return _.toInteger(_.get(nextProps, ['location', 'query', 'orderId'])) !== orderId &&
            _.toInteger(_.get(nextProps, ['location', 'query', 'orderId'])) !== ZERO
    }, ({dispatch, location}) => {
        const id = _.toInteger(_.get(location, ['query', 'orderId']))
        dispatch(statDebtorsOrderItemFetchAction(_.toInteger(id)))
    }),

    withPropsOnChange((props, nextProps) => {
        const detailId = _.toInteger(_.get(props, ['location', 'query', 'detailId']))
        return _.toInteger(_.get(nextProps, ['location', 'query', 'detailId'])) !== detailId &&
            _.toInteger(_.get(nextProps, ['location', 'query', 'detailId'])) !== ZERO
    }, ({dispatch, location}) => {
        const id = _.toInteger(_.get(location, ['query', 'detailId']))
        dispatch(statDebtorsItemFetchAction(id))
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const division = _.get(filterForm, ['values', 'division', 'value']) || null

            filter.filterBy({
                [STAT_DEBTORS_FILTER_KEY.SEARCH]: search,
                [STAT_DEBTORS_FILTER_KEY.DIVISION]: division

            })
        },

        handleOpenStatDebtorsDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({'orderId': id})})
        },

        handleCloseStatDebtorsDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({'orderId': ZERO})})
        },
        handleCloseDetail: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({'detailId': ZERO})})
        },
        handleOpenDetail: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({'detailId': id})})
        },
        handleGetDocument: props => () => {
            const {dispatch, filter} = props
            return dispatch(getDocumentAction(filter))
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
        detailOrder,
        detailOrderLoading,
        filter,
        layout,
        statData,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'statDebtorsId'))
    const openDetailId = _.toInteger(_.get(location, ['query', 'detailId']))
    const openStatDebtorsDialog = _.toInteger(_.get(location, ['query', 'orderId']))

    const statDebtorsDialog = {
        openStatDebtorsDialog,
        handleCloseStatDebtorsDialog: props.handleCloseStatDebtorsDialog,
        handleOpenStatDebtorsDialog: props.handleOpenStatDebtorsDialog
    }

    const listData = {
        statData: statData || {},
        data: _.get(list, 'results') || {},
        listLoading
    }

    const detailData = {
        openDetailId: openDetailId,
        id: detailId,
        data: _.get(detail, 'results') || {},
        detailLoading,
        detailOrder: _.get(detailOrder, 'data') || {},
        detailOrderLoading
    }
    const handleOpenCloseDetail = {
        handleOpenDetail: props.handleOpenDetail,
        handleCloseDetail: props.handleCloseDetail
    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    return (
        <Layout {...layout}>
            <StatDebtorsGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                statDebtorsDialog={statDebtorsDialog}
                handleOpenCloseDetail={handleOpenCloseDetail}
                getDocument={getDocument}
            />
        </Layout>
    )
})

export default StatDebtorsList
