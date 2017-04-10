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
import ShopGridList from '../../components/ShopGridList'
import {shopListFetchAction, shopCSVFetchAction, shopItemFetchAction} from '../../actions/shop'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['shop', 'item', 'data'])
        const detailLoading = _.get(state, ['shop', 'item', 'loading'])
        const list = _.get(state, ['shop', 'list', 'data'])
        const listLoading = _.get(state, ['shop', 'list', 'loading'])
        const csvData = _.get(state, ['shop', 'csv', 'data'])
        const csvLoading = _.get(state, ['shop', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'ShopFilterForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            csvData,
            csvLoading,
            filter,
            filterForm
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
        dispatch(shopItemFetchAction(shopId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            console.log('action edit')
        },

        handleActionDelete: props => () => {
            console.log('action delete')
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

            filter.filterBy({
                openFilterDialog: false,
                fromDate: fromDate && fromDate.format('YYYY-MM-DD'),
                toDate: toDate && toDate.format('YYYY-MM-DD')
            })
        }
    })
)

const ShopList = enhance((props) => {
    const {location, list, listLoading, detail, detailLoading, filter, layout, params} = props

    const openFilterDialog = toBoolean(_.get(location, ['query', 'openFilterDialog']))
    const fromDate = filter.getParam('fromDate')
    const toDate = filter.getParam('toDate')
    const detailId = _.toInteger(_.get(params, 'shopId') || 0)
    const tab = _.get(params, 'tab') || SHOP.SHOP_TAB_IMAGE

    const initialValues = {
        date: {
            fromDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
            toDate: toDate && moment(toDate, 'YYYY-MM-DD')
        }
    }

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleActionDelete
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
        loading: listLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        loading: detailLoading
    }

    return (
        <Layout {...layout}>
            <ShopGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                tabData={tabData}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default ShopList
