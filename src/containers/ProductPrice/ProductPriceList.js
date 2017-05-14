import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    PRODUCT_PRICE_CREATE_DIALOG_OPEN,
    PRODUCT_PRICE_UPDATE_DIALOG_OPEN,
    PRODUCT_PRICE_DELETE_DIALOG_OPEN,
    PRODUCT_PRICE_FILTER_KEY,
    PRODUCT_PRICE_FILTER_OPEN,
    ProductPriceGridList
} from '../../components/ProductPrice'
import {
    productPriceCreateAction,
    productPriceUpdateAction,
    productPriceListFetchAction,
    productPriceCSVFetchAction,
    productPriceDeleteAction,
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
        const csvData = _.get(state, ['productPrice', 'csv', 'data'])
        const csvLoading = _.get(state, ['productPrice', 'csv', 'loading'])
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
            csvData,
            csvLoading,
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

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(productPriceCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PRODUCT_PRICE_ITEM_PATH, id),
                query: filter.getParams({[PRODUCT_PRICE_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_PRICE_DELETE_DIALOG_OPEN]: false})})
        },

        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(productPriceDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PRODUCT_PRICE_DELETE_DIALOG_OPEN]: false})})
                    dispatch(productPriceListFetchAction(filter))
                })
        },

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
        handleOpenDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({openDeleteDialog: 'yes'})
            })
        },

        handleCloseDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openDeleteDialog: false})})
        },

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_PRICE_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_PRICE_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(productPriceCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PRODUCT_PRICE_CREATE_DIALOG_OPEN]: false})})
                    dispatch(productPriceListFetchAction(filter))
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
        createLoading,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', PRODUCT_PRICE_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', PRODUCT_PRICE_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PRODUCT_PRICE_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', PRODUCT_PRICE_DELETE_DIALOG_OPEN]))

    const category = _.toInteger(filter.getParam(PRODUCT_PRICE_FILTER_KEY.CATEGORY))
    const detailId = _.toInteger(_.get(params, 'productPriceId'))
    const tab = _.get(params, 'tab')

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const confirmDialog = {
        openConfirmDialog: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
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
            category: {
                value: category
            }
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    const csvDialog = {
        csvData: props.csvData,
        csvLoading: props.csvLoading,
        openCSVDialog: props.openCSVDialog,
        handleOpenCSVDialog: props.handleOpenCSVDialog,
        handleCloseCSVDialog: props.handleCloseCSVDialog
    }

    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    return (
        <Layout {...layout}>
            <ProductPriceGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                tabData={tabData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default ProductPriceList
