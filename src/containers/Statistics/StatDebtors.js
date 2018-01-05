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
    orderMultiUpdateAction
} from '../../actions/statDebtors'
import {currencyListFetchAction} from '../../actions/currency'
import filterHelper from '../../helpers/filter'
import {joinArray, splitToArray} from '../../helpers/joinSplitValues'
import {StatDebtorsGridList} from '../../components/Statistics'
import {STAT_DEBTORS_FILTER_KEY} from '../../components/Statistics/Debtors/DebtorsGridList'
import getDocuments from '../../helpers/getDocument'
import * as serializers from '../../serializers/Statistics/statDebtorsSerializer'
import * as API from '../../constants/api'
import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

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
        const statLoading = _.get(state, ['statisticsDebtors', 'data', 'loading'])
        const list = _.get(state, ['statisticsDebtors', 'list', 'data'])
        const listLoading = _.get(state, ['statisticsDebtors', 'list', 'loading'])
        const currencyList = _.get(state, ['currency', 'list', 'data', 'results'])
        const currencyListLoading = _.get(state, ['currency', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})

        const multiUpdateForm = _.get(state, ['form', 'StatDebtorsForm'])
        return {
            list,
            listLoading,
            currencyList,
            currencyListLoading,
            detail,
            detailLoading,
            filter,
            filterForm,
            filterItem,
            detailOrder,
            detailOrderLoading,
            statData,
            statLoading,
            multiUpdateForm
        }
    }),
    withState('openDetail', 'setOpenDetail', false),
    withPropsOnChange((props, nextProps) => {
        const except = {
            dPage: null,
            dPageSize: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(statDebtorsListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            dPage: null,
            dPageSize: null,
            page: null,
            pageSize: null,
            search: null,
            division: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(currencyListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            search: null,
            dPage: null,
            dPageSize: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(statDebtorsDataFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const orderId = _.toInteger(_.get(props, ['location', 'query', 'orderId']))
        return _.toInteger(_.get(nextProps, ['location', 'query', 'orderId'])) !== orderId &&
            _.toInteger(_.get(nextProps, ['location', 'query', 'orderId'])) !== ZERO
    }, ({dispatch, location}) => {
        const id = _.toInteger(_.get(location, ['query', 'orderId']))
        if (id > ZERO) {
            dispatch(statDebtorsOrderItemFetchAction(id))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const detailId = _.toInteger(_.get(props, ['location', 'query', 'detailId']))
        return (_.toInteger(_.get(nextProps, ['location', 'query', 'detailId'])) !== detailId ||
            props.filterItem.filterRequest() !== nextProps.filterItem.filterRequest()) &&
            _.toInteger(_.get(nextProps, ['location', 'query', 'detailId'])) !== ZERO
    }, ({dispatch, location, filterItem}) => {
        const id = _.toInteger(_.get(location, ['query', 'detailId']))
        if (id > ZERO) {
            dispatch(statDebtorsItemFetchAction(id, filterItem))
        }
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const division = _.get(filterForm, ['values', 'division']) || null
            const paymentType = _.get(filterForm, ['values', 'paymentType', 'value']) || null
            const currency = _.get(filterForm, ['values', 'currency']) || null
            const marketType = _.get(filterForm, ['values', 'marketTypeParent', 'value']) || null
            const marketTypeChild = _.get(filterForm, ['values', 'marketTypeChild', 'value']) || null
            filter.filterBy({
                [STAT_DEBTORS_FILTER_KEY.SEARCH]: search,
                [STAT_DEBTORS_FILTER_KEY.DIVISION]: joinArray(division),
                [STAT_DEBTORS_FILTER_KEY.PAYMENT_TYPE]: paymentType,
                [STAT_DEBTORS_FILTER_KEY.MARKET_TYPE]: marketType,
                [STAT_DEBTORS_FILTER_KEY.MARKET_TYPE_CHILD]: marketTypeChild,
                [STAT_DEBTORS_FILTER_KEY.CURRENCY]: joinArray(currency)

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
            const {location: {pathname}, filterItem} = props
            hashHistory.push({pathname, query: filterItem.getParams({'detailId': ZERO})})
        },
        handleOpenDetail: props => (id) => {
            const {location: {pathname}, filterItem} = props
            hashHistory.push({pathname, query: filterItem.getParams({'detailId': id})})
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_DEBTORS_GET_DOCUMENT, params)
        },

        handleSubmitMultiUpdate: props => (orders) => {
            const {dispatch, multiUpdateForm, location: {query}, filterItem} = props
            const id = _.toInteger(_.get(query, ['detailId']))
            return dispatch(orderMultiUpdateAction(_.get(multiUpdateForm, 'values'), orders))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Заказы успешно изменены')}))
                })
                .then(() => {
                    dispatch(statDebtorsItemFetchAction(id, filterItem))
                }).catch((error) => {
                    dispatch(openErrorAction({message: error}))
                })
        }
    })
)

const StatDebtorsList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        currencyList,
        currencyListLoading,
        detail,
        detailLoading,
        detailOrder,
        detailOrderLoading,
        filter,
        layout,
        statData,
        statLoading,
        filterItem
    } = props

    const detailId = _.toInteger(_.get(location, ['query', 'statDebtorsId']))
    const orderId = _.toInteger(_.get(location, ['query', 'orderId']))
    const openDetailId = _.toInteger(_.get(location, ['query', 'detailId']))
    const openStatDebtorsDialog = _.toInteger(_.get(location, ['query', 'orderId']))
    const division = _.get(location, ['query', 'division'])
    const paymentType = _.get(location, ['query', 'paymentType'])
    const currency = _.get(location, ['query', 'currency'])
    const marketType = _.toInteger(filter.getParam(STAT_DEBTORS_FILTER_KEY.MARKET_TYPE))
    const marketTypeChild = _.toInteger(filter.getParam(STAT_DEBTORS_FILTER_KEY.MARKET_TYPE_CHILD))

    const statDebtorsDialog = {
        openStatDebtorsDialog,
        handleCloseStatDebtorsDialog: props.handleCloseStatDebtorsDialog,
        handleOpenStatDebtorsDialog: props.handleOpenStatDebtorsDialog
    }

    const listData = {
        statData: statData || {},
        statLoading,
        data: _.get(list, 'results') || {},
        listLoading,
        currencyList,
        currencyListLoading
    }

    const initialValues = {
        currency: currency && splitToArray(currency),
        division: division && splitToArray(division),
        marketTypeParent: {
            value: marketType
        },
        marketTypeChild: {
            value: marketTypeChild
        },
        paymentType: {
            value: paymentType
        }
    }
    const detailData = {
        openDetailId: openDetailId,
        id: detailId,
        orderId: orderId,
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
                filterItem={filterItem}
                listData={listData}
                initialValues={initialValues}
                detailData={detailData}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                statDebtorsDialog={statDebtorsDialog}
                handleOpenCloseDetail={handleOpenCloseDetail}
                getDocument={getDocument}
                handleSubmitMultiUpdate={props.handleSubmitMultiUpdate}
            />
        </Layout>
    )
})

export default StatDebtorsList
