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
import {
    PRODUCT_PRICE_UPDATE_DIALOG_OPEN,
    PRODUCT_PRICE_FILTER_KEY,
    PRODUCT_PRICE_FILTER_OPEN,
    ProductPriceGridList
} from '../../components/ProductPrice'
import {
    productPriceUpdateAction,
    productPriceListFetchAction,
    productPriceItemFetchAction
} from '../../actions/productPrice'

import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['productPrice', 'item', 'data'])
        const detailLoading = _.get(state, ['productPrice', 'item', 'loading'])
        const createLoading = _.get(state, ['productPrice', 'create', 'loading'])
        const updateLoading = _.get(state, ['productPrice', 'update', 'loading'])
        const list = _.get(state, ['productPrice', 'list', 'data'])
        const listLoading = _.get(state, ['productPrice', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'ProductPriceFilterForm'])
        const createForm = _.get(state, ['form', 'ProductPriceCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            filterForm,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(productPriceListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const productPriceId = _.get(nextProps, ['params', 'productPriceId'])

        return productPriceId && _.get(props, ['params', 'productPriceId']) !== productPriceId
    }, ({dispatch, params}) => {
        const productPriceId = _.toInteger(_.get(params, 'productPriceId'))
        productPriceId && dispatch(productPriceItemFetchAction(productPriceId))
    }),

    withHandlers({
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_PRICE_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_PRICE_FILTER_OPEN]: false})})
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
                [PRODUCT_PRICE_FILTER_OPEN]: false,
                [PRODUCT_PRICE_FILTER_KEY.TYPE]: type,
                [PRODUCT_PRICE_FILTER_KEY.MEASUREMENT]: measurement,
                [PRODUCT_PRICE_FILTER_KEY.BRAND]: brand
            })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PRODUCT_PRICE_ITEM_PATH, id),
                query: filter.getParams({[PRODUCT_PRICE_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_PRICE_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const productPriceId = _.toInteger(_.get(props, ['params', 'productPriceId']))

            return dispatch(productPriceUpdateAction(productPriceId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(productPriceItemFetchAction(productPriceId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PRODUCT_PRICE_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(productPriceListFetchAction(filter))
                })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.PRODUCT_PRICE_LIST_URL, query: filter.getParams()})
        }
    })
)

const ProductPriceList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', PRODUCT_PRICE_FILTER_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PRODUCT_PRICE_UPDATE_DIALOG_OPEN]))

    const brand = _.toInteger(filter.getParam(PRODUCT_PRICE_FILTER_KEY.BRAND))
    const type = _.toInteger(filter.getParam(PRODUCT_PRICE_FILTER_KEY.TYPE))
    const measurement = _.toInteger(filter.getParam(PRODUCT_PRICE_FILTER_KEY.MEASUREMENT))
    const detailId = _.toInteger(_.get(params, 'productPriceId'))

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

    const updateDialog = {
        initialValues: (() => {
            if (!detail) {
                return {}
            }

            return {
                price: _.get(detail, 'price')
            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const filterDialog = {
        initialValues: {
            brand: {value: brand},
            type: {value: type},
            measurement: {value: measurement}
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

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    return (
        <Layout {...layout}>
            <ProductPriceGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
            />
        </Layout>
    )
})

export default ProductPriceList
