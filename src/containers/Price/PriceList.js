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
    getPriceItemsAction
} from '../../actions/price'
import {marketTypeGetAllAction} from '../../actions/marketType'
import {openSnackbarAction} from '../../actions/snackbar'
const ZERO = 0
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
        const filter = filterHelper(list, pathname, query)
        const marketTypeList = _.get(state, ['marketType', 'list', 'data'])
        const marketTypeLoading = _.get(state, ['marketType', 'list', 'loading'])
        const priceListItemsList = _.get(state, ['price', 'price', 'data'])
        const priceListItemsLoading = _.get(state, ['price', 'price', 'loading'])
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
            priceListItemsLoading
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
    }, ({dispatch, params}) => {
        const priceId = _.toInteger(_.get(params, 'priceId'))
        if (priceId > ZERO) {
            dispatch(priceItemFetchAction(priceId))
            dispatch(getPriceItemsAction(priceId))
            dispatch(marketTypeGetAllAction())
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
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const measurement = _.get(filterForm, ['values', 'measurement', 'value']) || null
            const brand = _.get(filterForm, ['values', 'brand', 'value']) || null
            filter.filterBy({
                [PRICE_FILTER_OPEN]: false,
                [PRICE_FILTER_KEY.TYPE]: type,
                [PRICE_FILTER_KEY.MEASUREMENT]: measurement,
                [PRICE_FILTER_KEY.BRAND]: brand
            })
        },
        handleOpenSupplyDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_SUPPLY_DIALOG_OPEN]: true})})
        },
        handleCloseSupplyDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_SUPPLY_DIALOG_OPEN]: false})})
        },
        handleOpenPriceSetForm: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_SET_FORM_OPEN]: true})})
            return dispatch(marketTypeGetAllAction())
        },
        handleClosePriceSetForm: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_SET_FORM_OPEN]: false})})
        },
        handleSubmitPriceSetForm: props => () => {
            const {dispatch, createForm, filter, detail, params: {priceId}, location: {pathname}} = props
            const detailId = _.get(detail, 'id')
            return dispatch(priceCreateAction(_.get(createForm, ['values']), priceId))
                .then(() => {
                    dispatch(priceItemFetchAction(detailId))
                    hashHistory.push({pathname, query: filter.getParams({[PRICE_SET_FORM_OPEN]: false})})
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.PRICE_LIST_URL, query: filter.getParam()})
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
        filter,
        layout,
        params
    } = props
    const openFilterDialog = toBoolean(_.get(location, ['query', PRICE_FILTER_OPEN]))
    const openPriceSupplyDialog = toBoolean(_.get(location, ['query', PRICE_SUPPLY_DIALOG_OPEN]))
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
        if (fieldName === 'cash') {
            const val = _.get(price, 'cashPrice') || ZERO
            return numberFormat(val)
        }
        const val = _.get(price, 'transferPrice') || ZERO
        return numberFormat(val)
    }
    const detailData = {
        id: detailId,
        marketTypeLoading: marketTypeLoading,
        marketTypeList: _.get(marketTypeList, 'results'),
        mergedList: () => {
            return _.map(_.get(marketTypeList, 'results'), (item) => {
                const marketTypeId = _.get(item, 'id')
                const marketTypeName = _.get(item, 'name')
                return {
                    'cash_price': getPriceByParams(marketTypeId, 'cash'),
                    'transfer_price': getPriceByParams(marketTypeId, 'transfer'),
                    'marketTypeId': marketTypeId,
                    marketTypeName
                }
            })
        },
        priceListItemsList: _.get(priceListItemsList, 'results'),
        priceListItemsLoading,
        data: detail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }
    const priceSetForm = {
        initialValues: (() => {
            const priceList = _.map(detailData.mergedList(), (item) => {
                return {
                    'cash_price': _.get(item, 'cash_price'),
                    'transfer_price': _.get(item, 'transfer_price'),
                    'market_type': _.get(item, 'marketTypeId')
                }
            })
            return {'prices': priceList}
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
            />
        </Layout>
    )
})
export default PriceList
