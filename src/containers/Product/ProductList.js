import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {splitToArray, joinArray} from '../../helpers/joinSplitValues'
import toBoolean from '../../helpers/toBoolean'
import {
    PRODUCT_CREATE_DIALOG_OPEN,
    PRODUCT_SHOW_PHOTO_OPEN,
    PRODUCT_UPDATE_DIALOG_OPEN,
    PRODUCT_DELETE_DIALOG_OPEN,
    PRODUCT_FILTER_KEY,
    PRODUCT_FILTER_OPEN,
    ProductGridList
} from '../../components/Product'
import {
    productCreateAction,
    productUpdateAction,
    productListFetchAction,
    productDeleteAction,
    productItemFetchAction
} from '../../actions/product'

import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['product', 'item', 'data'])
        const detailLoading = _.get(state, ['product', 'item', 'loading'])
        const createLoading = _.get(state, ['product', 'create', 'loading'])
        const showBigImgLoading = _.get(state, ['product', 'item', 'loading'])
        const updateLoading = _.get(state, ['product', 'update', 'loading'])
        const list = _.get(state, ['product', 'list', 'data'])
        const listLoading = _.get(state, ['product', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'ProductFilterForm'])
        const createForm = _.get(state, ['form', 'ProductCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            showBigImgLoading,
            updateLoading,
            filter,
            filterForm,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(productListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const productId = _.get(nextProps, ['params', 'productId'])

        return productId && _.get(props, ['params', 'productId']) !== productId
    }, ({dispatch, params, nextProps}) => {
        const productId = _.toInteger(_.get(params, 'productId'))
        productId && !_.get(nextProps, PRODUCT_DELETE_DIALOG_OPEN) && dispatch(productItemFetchAction(productId))
    }),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PRODUCT_ITEM_PATH, id),
                query: filter.getParams({[PRODUCT_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_DELETE_DIALOG_OPEN]: false})})
        },

        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(productDeleteAction(detail.id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PRODUCT_DELETE_DIALOG_OPEN]: false})})
                    dispatch(productListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const typeParent = _.get(filterForm, ['values', 'typeParent', 'value']) || null
            const typeChild = _.get(filterForm, ['values', 'typeChild', 'value']) || null
            const measurement = _.get(filterForm, ['values', 'measurement']) || null
            const brand = _.get(filterForm, ['values', 'brand']) || null

            filter.filterBy({
                [PRODUCT_FILTER_OPEN]: false,
                [PRODUCT_FILTER_KEY.TYPE_PARENT]: typeParent,
                [PRODUCT_FILTER_KEY.TYPE_CHILD]: typeChild,
                [PRODUCT_FILTER_KEY.MEASUREMENT]: joinArray(measurement),
                [PRODUCT_FILTER_KEY.BRAND]: joinArray(brand)
            })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('ProductCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_CREATE_DIALOG_OPEN]: false})})
        },

        handleOpenShowBigImg: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PRODUCT_ITEM_PATH, id),
                query: filter.getParams({[PRODUCT_SHOW_PHOTO_OPEN]: true})
            })
        },

        handleCloseShowBigImg: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_SHOW_PHOTO_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(productCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PRODUCT_CREATE_DIALOG_OPEN]: false})})
                    dispatch(productListFetchAction(filter))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PRODUCT_ITEM_PATH, id),
                query: filter.getParams({[PRODUCT_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const productId = _.toInteger(_.get(props, ['params', 'productId']))

            return dispatch(productUpdateAction(productId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PRODUCT_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(productListFetchAction(filter))
                })
        }
    })
)

const ProductList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        showBigImgLoading,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', PRODUCT_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', PRODUCT_CREATE_DIALOG_OPEN]))
    const openShowBigImg = toBoolean(_.get(location, ['query', PRODUCT_SHOW_PHOTO_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PRODUCT_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', PRODUCT_DELETE_DIALOG_OPEN]))
    const brand = (filter.getParam(PRODUCT_FILTER_KEY.BRAND))
    const typeParent = _.toInteger(filter.getParam(PRODUCT_FILTER_KEY.TYPE_PARENT))
    const typeChild = _.toInteger(filter.getParam(PRODUCT_FILTER_KEY.TYPE_CHILD))
    const measurement = (filter.getParam(PRODUCT_FILTER_KEY.MEASUREMENT))
    const detailId = _.toInteger(_.get(params, 'productId'))

    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }
    const showBigImg = {
        initialValues: (() => {
            if (!detail) {
                return {}
            }

            return {
                image: _.get(detail, 'image')
            }
        })(),
        showBigImgLoading,
        openShowBigImg,
        handleOpenShowBigImg: props.handleOpenShowBigImg,
        handleCloseShowBigImg: props.handleCloseShowBigImg
    }
    const confirmDialog = {
        confirmLoading: detailLoading,
        openConfirmDialog: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const updateDialog = {
        initialValues: (() => {
            if (!detail || openCreateDialog) {
                return {}
            }
            const childType = _.get(detail, ['type', 'id'])
            const parentType = _.get(detail, ['type', 'parent'])

            return {
                name: _.get(detail, 'name'),
                code: _.get(detail, 'code'),
                priority: _.get(detail, 'priority'),
                productTypeParent: {
                    value: parentType || childType
                },
                type: {
                    text: _.get(detail, ['type', 'name']),
                    value: parentType && childType
                },
                measurement: {
                    text: _.get(detail, ['measurement', 'name']),
                    value: _.get(detail, ['measurement', 'id'])
                },
                image: _.get(detail, ['image'])
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
            brand: brand && splitToArray(brand),
            typeParent: {value: typeParent},
            typeChild: {value: typeChild},
            measurement: measurement && splitToArray(measurement)
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
        detailLoading
    }

    return (
        <Layout {...layout}>
            <ProductGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                showBigImg={showBigImg}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                filterDialog={filterDialog}
            />
        </Layout>
    )
})

export default ProductList
