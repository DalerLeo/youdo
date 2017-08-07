import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import numberFormat from '../../helpers/numberFormat'
import {reset} from 'redux-form'
import {
    PRICE_FILTER_KEY,
    PRICE_FILTER_OPEN,
    PRICE_SUPPLY_DIALOG_OPEN,
    PRICE_SET_FORM_OPEN,
    PriceGridList
} from '../../components/Price'
import {
    priceCreateAction,
    priceListFetchAction,
    priceItemFetchAction,
    getPriceItemsAction,
    priceItemHistoryFetchAction,
    priceItemExpensesFetchAction
} from '../../actions/price'
import {marketTypeGetAllAction} from '../../actions/marketType'
import {openSnackbarAction} from '../../actions/snackbar'
const ZERO = 0
const USD = 3
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['price', 'item', 'data'])
        const detailLoading = _.get(state, ['price', 'item', 'loading'])
        const list = _.get(state, ['price', 'list', 'data'])
        const listLoading = _.get(state, ['price', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'PriceFilterForm'])
        const createForm = _.get(state, ['form', 'PriceCreateForm'])
        const globalForm = _.get(state, ['form', 'PriceGlobalForm'])
        const filter = filterHelper(list, pathname, query)
        const marketTypeList = _.get(state, ['marketType', 'list', 'data'])
        const marketTypeLoading = _.get(state, ['marketType', 'list', 'loading'])
        const priceListItemsList = _.get(state, ['price', 'price', 'data'])
        const priceListItemsLoading = _.get(state, ['price', 'price', 'loading'])
        const priceItemHistoryList = _.get(state, ['price', 'history', 'data'])
        const priceItemHistoryLoading = _.get(state, ['price', 'history', 'loading'])
        const priceItemExpenseList = _.get(state, ['price', 'expense', 'data'])
        const priceItemExpenseLoading = _.get(state, ['price', 'expense', 'loading'])
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            marketTypeList,
            marketTypeLoading,
            filterForm,
            createForm,
            priceListItemsList,
            priceListItemsLoading,
            priceItemHistoryList,
            priceItemHistoryLoading,
            priceItemExpenseList,
            priceItemExpenseLoading,
            globalForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(priceListFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const priceId = _.get(nextProps, ['params', 'priceId']) || ZERO
        return priceId > ZERO && _.get(props, ['params', 'priceId']) !== priceId
    }, ({dispatch, params, location}) => {
        const priceId = _.toInteger(_.get(params, 'priceId'))
        const supplyId = _.toInteger(_.get(location, ['query', PRICE_SUPPLY_DIALOG_OPEN]))
        if (priceId > ZERO) {
            dispatch(priceItemFetchAction(priceId))
            dispatch(getPriceItemsAction(priceId))
            dispatch(marketTypeGetAllAction())
            dispatch(priceItemHistoryFetchAction(priceId))
        }
        if (supplyId > ZERO) {
            dispatch(priceItemExpensesFetchAction(supplyId))
        }
    }),

    withHandlers({
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_FILTER_OPEN]: true})})
        },
        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_FILTER_OPEN]: false})})
        },
        handleClearFilterDialog: props => () => {
            const {location: {pathname}, dispatch} = props
            hashHistory.push({pathname, query: {}})
            dispatch(reset('PriceFilterForm'))
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const typeParent = _.get(filterForm, ['values', 'typeParent', 'value']) || null
            const typeChild = _.get(filterForm, ['values', 'typeChild', 'value']) || null
            const measurement = _.get(filterForm, ['values', 'measurement', 'value']) || null
            const brand = _.get(filterForm, ['values', 'brand', 'value']) || null

            filter.filterBy({
                [PRICE_FILTER_OPEN]: false,
                [PRICE_FILTER_KEY.TYPE_PARENT]: typeParent,
                [PRICE_FILTER_KEY.TYPE_CHILD]: typeChild,
                [PRICE_FILTER_KEY.MEASUREMENT]: measurement,
                [PRICE_FILTER_KEY.BRAND]: brand
            })
        },
        handleOpenSupplyDialog: props => (id) => {
            const {location: {pathname}, filter, dispatch} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_SUPPLY_DIALOG_OPEN]: id})})
            return dispatch(priceItemExpensesFetchAction(id))
        },
        handleCloseSupplyDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_SUPPLY_DIALOG_OPEN]: false})})
        },
        handleOpenPriceSetForm: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_SET_FORM_OPEN]: true})})
        },
        handleClosePriceSetForm: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_SET_FORM_OPEN]: false})})
        },
        handleSubmitPriceSetForm: props => () => {
            const {dispatch, createForm, detail, priceListItemsList, params: {priceId}, location: {pathname}, filter} = props
            const detailId = _.get(detail, 'id')

            return dispatch(priceCreateAction(_.get(createForm, ['values']), priceId, priceListItemsList))
                .then(() => {
                    dispatch(priceListFetchAction(filter))
                    dispatch(priceItemFetchAction(detailId))
                    dispatch(getPriceItemsAction(detailId))
                    hashHistory.push({pathname})
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
        },
        handleSubmitGlobalPriceForm: props => () => {
            const {globalForm} = props
            const globalPrice = _.get(globalForm, ['values', 'globalPrice'])
            return globalPrice
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.PRICE_LIST_URL, query: filter.getParams()})
        }
    })
)

const PriceList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        marketTypeLoading,
        marketTypeList,
        priceListItemsList,
        priceListItemsLoading,
        priceItemHistoryList,
        priceItemHistoryLoading,
        priceItemExpenseList,
        priceItemExpenseLoading,
        filter,
        layout,
        params
    } = props
    const openFilterDialog = toBoolean(_.get(location, ['query', PRICE_FILTER_OPEN]))
    const openPriceSupplyDialog = _.toInteger(_.get(location, ['query', PRICE_SUPPLY_DIALOG_OPEN]))
    const openPriceSetForm = toBoolean(_.get(location, ['query', PRICE_SET_FORM_OPEN]))
    const detailId = _.toInteger(_.get(params, 'priceId'))
    const priceSupplyDialog = {
        openPriceSupplyDialog,
        handleOpenSupplyDialog: props.handleOpenSupplyDialog,
        handleCloseSupplyDialog: props.handleCloseSupplyDialog
    }
    const filterDialog = {
        initialValues: {
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }
    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const getPriceByParams = (marketTypeId, fieldName) => {
        const price = _.find(_.get(priceListItemsList, ['results']), (item) => {
            return item.marketType.id === marketTypeId
        })

        if (fieldName === 'isPrimary') {
            const val = _.get(price, 'isPrimary')
            return toBoolean(val)
        }

        if (fieldName === 'cash') {
            const val = _.get(price, 'cashPrice') || ZERO
            return numberFormat(val)
        }
        const val = _.get(price, 'transferPrice') || ZERO
        return numberFormat(val)
    }
    const getCurrencyByParams = (marketTypeId) => {
        const priceList = _.find(_.get(priceListItemsList, ['results']), (item) => {
            return item.marketType.id === marketTypeId
        })
        return _.get(priceList, 'currency')
    }
    const detailData = {
        priceItemExpenseLoading,
        priceItemExpenseList,
        priceItemHistoryList,
        priceItemHistoryLoading,
        id: detailId,
        priceListItemsLoading,
        marketTypeLoading: marketTypeLoading,
        mergedList: () => {
            return _.map(_.get(marketTypeList, 'results'), (item) => {
                const marketTypeId = _.get(item, 'id')
                const marketTypeName = _.get(item, 'name')
                return {
                    'cash_price': getPriceByParams(marketTypeId, 'cash'),
                    'currency': getCurrencyByParams(marketTypeId),
                    'transfer_price': getPriceByParams(marketTypeId, 'transfer'),
                    'marketTypeId': marketTypeId,
                    'isPrimary': toBoolean(getPriceByParams(marketTypeId, 'isPrimary')),
                    marketTypeName
                }
            })
        },
        data: detail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }
    const getVal = (listD) => {
        let primary = null
        _.map(listD, (obj) => {
            if (_.get(obj, 'isPrimary')) {
                primary = _.get(obj, 'marketTypeId')
            }
        })
        return _.toInteger(primary)
    }
    const priceSetForm = {
        initialValues: (() => {
            const priceList = _.map(detailData.mergedList(), (item) => {
                return {
                    'market_type': _.get(item, 'marketTypeId'),
                    'currency': {value: _.get(item, ['currency', 'id']) || USD}
                }
            })
            return {'prices': priceList, 'isPrimary': getVal(detailData.mergedList())}
        })(),
        openPriceSetForm,
        handleOpenPriceSetForm: props.handleOpenPriceSetForm,
        handleClosePriceSetForm: props.handleClosePriceSetForm,
        handleSubmitPriceSetForm: props.handleSubmitPriceSetForm
    }
    return (
        <Layout {...layout}>
            <PriceGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                priceSupplyDialog={priceSupplyDialog}
                priceSetForm={priceSetForm}
                filterDialog={filterDialog}
                onSubmit={props.handleSubmitGlobalPriceForm}
            />
        </Layout>
    )
})
export default PriceList
