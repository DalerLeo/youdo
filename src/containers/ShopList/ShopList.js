import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import React from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import * as SHOP from '../../constants/shop'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import ShopGridList from '../../components/ShopGridList'
import {
    shopCreateAction,
    shopListFetchAction,
    shopCSVFetchAction,
    shopItemFetchAction
} from '../../actions/shop'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['shop', 'item', 'data'])
        const detailLoading = _.get(state, ['shop', 'item', 'loading'])
        const createLoading = _.get(state, ['shop', 'create', 'loading'])
        const createErrors = _.get(state, ['shop', 'create', 'error'])
        const list = _.get(state, ['shop', 'list', 'data'])
        const listLoading = _.get(state, ['shop', 'list', 'loading'])
        const csvData = _.get(state, ['shop', 'csv', 'data'])
        const csvLoading = _.get(state, ['shop', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'ShopFilterForm'])
        const createForm = _.get(state, ['form', 'ShopCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            createErrors,
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
        dispatch(shopListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const shopId = _.get(nextProps, ['params', 'shopId'])

        return shopId && _.get(props, ['params', 'shopId']) !== shopId
    }, ({dispatch, params}) => {
        const shopId = _.toInteger(_.get(params, 'shopId'))
        shopId && dispatch(shopItemFetchAction(shopId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleActionDelete: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(shopCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openFilterDialog: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openFilterDialog: false})})
        },

        handleTabChange: props => (tab) => {
            const shopId = _.toInteger(_.get(props, ['params', 'shopId']))
            hashHistory.push({pathname: sprintf(ROUTER.SHOP_ITEM_TAB_PATH, shopId, tab)})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const category = _.get(filterForm, ['values', 'category', 'value']) || null

            filter.filterBy({
                openFilterDialog: false,
                category,
                fromDate: fromDate && fromDate.format('YYYY-MM-DD'),
                toDate: toDate && toDate.format('YYYY-MM-DD')
            })
        },

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openCreateDialog: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openCreateDialog: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter} = props

            return dispatch(shopCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Successful saved'}))
                })
                .then(() => {
                    hashHistory.push({query: filter.getParams({openCreateDialog: false})})
                })
        }
    })
)

const ShopList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        createErrors,
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', 'openFilterDialog']))
    const openCreateDialog = toBoolean(_.get(location, ['query', 'openCreateDialog']))
    const category = _.toInteger(filter.getParam('category'))
    const fromDate = filter.getParam('fromDate')
    const toDate = filter.getParam('toDate')
    const detailId = _.toInteger(_.get(params, 'shopId'))
    const tab = _.get(params, 'tab') || SHOP.SHOP_TAB_MAP

    const initialValues = {
        category: {
            value: category
        },
        date: {
            fromDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
            toDate: toDate && moment(toDate, 'YYYY-MM-DD')
        }
    }

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleActionDelete
    }

    const createDialog = {
        createLoading,
        openCreateDialog,
        createErrors,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const filterDialog = {
        initialValues,
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
            <ShopGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                tabData={tabData}
                createDialog={createDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default ShopList
