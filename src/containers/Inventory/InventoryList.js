import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {reset} from 'redux-form'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {splitToArray, joinArray} from '../../helpers/joinSplitValues'
import toBoolean from '../../helpers/toBoolean'
import sprintf from 'sprintf'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'
import {
    InventoryGridList,
    INVENTORY_FILTER_OPEN,
    INVENTORY_FILTER_KEY,
    INVENTORY_INVENTORY_DIALOG_OPEN
} from '../../components/Inventory'
import {
    inventoryListFetchAction,
    inventoryItemFetchAction,
    inventoryProductsFetchAction,
    inventoryCreateFetchAction
} from '../../actions/inventory'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['inventory', 'item', 'data'])
        const detailLoading = _.get(state, ['inventory', 'item', 'loading'])
        const list = _.get(state, ['inventory', 'list', 'data'])
        const listLoading = _.get(state, ['inventory', 'list', 'loading'])
        const inventoryList = _.get(state, ['inventory', 'inventory', 'data', 'results'])
        const inventoryListLoading = _.get(state, ['inventory', 'inventory', 'loading'])
        const filterForm = _.get(state, ['form', 'InventoryFilterForm'])
        const searchForm = _.get(state, ['form', 'InventorySearchForm'])
        const inventoryForm = _.get(state, ['form', 'InventoryForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            inventoryList,
            inventoryListLoading,
            filter,
            filterForm,
            searchForm,
            inventoryForm
        }
    }),
    withState('openAddProductDialog', 'setOpenAddProductDialog', false),
    withState('openAddProductConfirm', 'setOpenAddProductConfirm', false),
    withState('stockChooseDialog', 'setStockChooseDialog', true),

    withState('inventoryData', 'updateInventoryData', []),
    withState('loading', 'setLoading', false),
    withPropsOnChange((props, nextProps) => {
        const except = {
            openInventoryDialog: null,
            pdSearch: null,
            pdStock: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(inventoryListFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const inventoryId = _.get(nextProps, ['params', 'inventoryId'])
        return (inventoryId && _.get(props, ['params', 'inventoryId']) !== inventoryId)
    }, ({dispatch, params, filter}) => {
        const inventoryId = _.toInteger(_.get(params, 'inventoryId'))
        if (inventoryId) {
            dispatch(inventoryItemFetchAction(inventoryId, filter))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            contract: null,
            createdFromDate: null,
            createdToDate: null,
            deliveryFromDate: null,
            deliveryToDate: null,
            paymentType: null,
            openCreateDialog: null,
            openFilterDialog: null,
            product: null,
            provider: null,
            status: null,
            stock: null,
            pdPage: null,
            pdPageSize: null,
            openDiscardDialog: null
        }
        const nextDialog = toBoolean(_.get(nextProps, ['location', 'query', INVENTORY_INVENTORY_DIALOG_OPEN]))
        const productType = _.get(props, ['inventoryForm', 'values', 'productType', 'value'])
        const productTypeNext = _.get(nextProps, ['inventoryForm', 'values', 'productType', 'value'])
        return ((props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)) ||
            (productType !== productTypeNext && nextDialog))
    }, ({dispatch, inventoryForm, filter, location: {query}, updateInventoryData, setLoading}) => {
        updateInventoryData([])
        setLoading(true)
        const productType = _.get(inventoryForm, ['values', 'productType', 'value'])
        const openDialog = toBoolean(_.get(query, INVENTORY_INVENTORY_DIALOG_OPEN))
        const hasStock = _.toInteger(_.get(query, 'pdStock')) > ZERO
        if (openDialog && hasStock) {
            dispatch(inventoryProductsFetchAction(filter, productType))
                .then(() => {
                    setLoading(false)
                })
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevLoading = _.get(props, 'inventoryListLoading')
        const nextLoading = _.get(nextProps, 'inventoryListLoading')
        return prevLoading !== nextLoading && nextLoading === false
    }, ({inventoryData, inventoryList, updateInventoryData}) => {
        updateInventoryData(_.union(inventoryData, inventoryList))
    }),

    withHandlers({
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[INVENTORY_FILTER_OPEN]: true})})
        },
        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[INVENTORY_FILTER_OPEN]: false})})
        },
        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const stock = _.get(filterForm, ['values', 'stock']) || null
            const typeParent = _.get(filterForm, ['values', 'typeParent', 'value']) || null
            const typeChild = _.get(filterForm, ['values', 'typeChild', 'value']) || null
            const measurement = _.get(filterForm, ['values', 'measurement']) || null
            const brand = _.get(filterForm, ['values', 'brand']) || null
            filter.filterBy({
                [INVENTORY_FILTER_OPEN]: false,
                [INVENTORY_FILTER_KEY.STOCK]: joinArray(stock),
                [INVENTORY_FILTER_KEY.TYPE_PARENT]: typeParent,
                [INVENTORY_FILTER_KEY.TYPE_CHILD]: typeChild,
                [INVENTORY_FILTER_KEY.MEASUREMENT]: joinArray(measurement),
                [INVENTORY_FILTER_KEY.BRAND]: joinArray(brand)
            })
        },
        handleSubmitSearch: props => () => {
            const {filter, searchForm} = props
            const search = _.get(searchForm, ['values', 'search']) || null
            filter.filterBy({
                'search': search
            })
        },
        handleResetFilter: props => () => {
            const {dispatch, location: {pathname}} = props
            dispatch(reset('InventoryFilterForm'))
            hashHistory.push({pathname})
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.INVENTORY_LIST_URL, query: filter.getParams()})
        },
        handleOpenDetail: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.INVENTORY_ITEM_PATH, id), query: filter.getParams()})
        },

        handleOpenInventoryDialog: props => () => {
            const {location: {pathname}, filter, dispatch, setStockChooseDialog} = props
            dispatch(reset('InventoryInventoryForm'))
            hashHistory.push({pathname, query: filter.getParams({[INVENTORY_INVENTORY_DIALOG_OPEN]: true})})
            setStockChooseDialog(true)
        },
        handleCloseInventoryDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[INVENTORY_INVENTORY_DIALOG_OPEN]: false, 'pdSearch': null, 'pdStock': null})})
        },
        handleSubmitInventoryDialog: props => (items, closeDialog) => {
            const {location: {pathname, query}, dispatch, filter} = props
            return dispatch(inventoryCreateFetchAction(items, query))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[INVENTORY_INVENTORY_DIALOG_OPEN]: false, 'pdSearch': null, 'pdStock': null})})
                    closeDialog(false)
                    dispatch(inventoryListFetchAction(filter))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleFilterInventoryStock: props => () => {
            const {filter, inventoryForm, setStockChooseDialog} = props
            const stock = _.get(inventoryForm, ['values', 'stock', 'value']) || null
            filter.filterBy({'pdStock': stock})
            setStockChooseDialog(false)
        },
        handleLoadMoreItems: props => (page) => {
            const {dispatch, filter, inventoryForm} = props
            const productType = _.get(inventoryForm, ['values', 'productType', 'value']) || null
            dispatch(inventoryProductsFetchAction(filter, productType, page))
        }
    })
)

const InventoryList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        params,
        filterItem,
        inventoryListLoading,
        inventoryData,
        stockChooseDialog
    } = props

    const stock = (filter.getParam(INVENTORY_FILTER_KEY.STOCK))
    const brand = (filter.getParam(INVENTORY_FILTER_KEY.BRAND))
    const measurement = (filter.getParam(INVENTORY_FILTER_KEY.MEASUREMENT))
    const typeParent = _.toInteger(filter.getParam(INVENTORY_FILTER_KEY.TYPE_PARENT))
    const typeChild = _.toInteger(filter.getParam(INVENTORY_FILTER_KEY.TYPE_CHILD))
    const openFilterDialog = toBoolean(_.get(location, ['query', INVENTORY_FILTER_OPEN]))
    const openInventoryDialog = toBoolean(_.get(location, ['query', INVENTORY_INVENTORY_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'inventoryId'))

    const filterDialog = {
        initialValues: {
            stock: stock && splitToArray(stock),
            brand: brand && splitToArray(brand),
            measurement: measurement && splitToArray(measurement),
            typeParent: {value: typeParent},
            typeChild: {value: typeChild}
        },
        openFilterDialog: openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog
    }
    const inventoryDialog = {
        data: inventoryData,
        loading: props.loading,
        loadMore: props.handleLoadMoreItems,
        moreLoading: inventoryListLoading,
        openInventoryDialog,
        stockChooseDialog,
        filterStock: props.handleFilterInventoryStock,
        handleOpenInventoryDialog: props.handleOpenInventoryDialog,
        handleCloseInventoryDialog: props.handleCloseInventoryDialog,
        handleSubmitInventoryDialog: props.handleSubmitInventoryDialog
    }
    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const currentRow = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === detailId
    })

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading,
        currentRow
    }

    return (
        <Layout {...layout}>
            <InventoryGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                filterDialog={filterDialog}
                handleCloseDetail={props.handleCloseDetail}
                handleOpenDetail={props.handleOpenDetail}
                resetFilter={props.handleResetFilter}
                searchSubmit={props.handleSubmitSearch}
                filterItem={filterItem}
                inventoryDialog={inventoryDialog}
            />
        </Layout>
    )
})

export default InventoryList
