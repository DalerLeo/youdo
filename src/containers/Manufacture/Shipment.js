import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {ManufactureShipmentWrapper, OPEN_FILTER} from '../../components/Manufacture'
import * as SHIPMENT_TAB from '../../constants/manufactureShipmentTab'
import {MANUF_ACTIVITY_FILTER_KEY} from '../../components/Manufacture/Tab/ManufactureShipment'
import {
    shipmentListFetchAction,
    shipmentItemFetchAction,
    shipmentLogsListFetchAction,
    shipmentProductsListFetchAction,
    shipmentMaterialsListFetchAction
} from '../../actions/manufactureShipment'
import ManufactureWrapper from './Wrapper'

const TAB = 'tab'
const MINUS_ONE = -1
const ZERO = 0
const defaultDate = moment().format('YYYY-MM-DD')
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['manufacture', 'list', 'data'])
        const listLoading = _.get(state, ['manufacture', 'list', 'loading'])
        const filter = filterHelper(list, pathname, query)
        const shipmentList = _.get(state, ['shipment', 'list', 'data'])
        const shipmentListLoading = _.get(state, ['shipment', 'list', 'loading'])
        const shipmentDetail = _.get(state, ['shipment', 'item', 'data'])
        const shipmentDetailLoading = _.get(state, ['shipment', 'item', 'loading'])
        const shipmentLogs = _.get(state, ['shipment', 'logs', 'data'])
        const shipmentLogsLoading = _.get(state, ['shipment', 'logs', 'loading'])
        const shipmentProducts = _.get(state, ['shipment', 'products', 'data'])
        const shipmentProductsLoading = _.get(state, ['shipment', 'products', 'loading'])
        const shipmentMaterials = _.get(state, ['shipment', 'materials', 'data'])
        const shipmentMaterialsLoading = _.get(state, ['shipment', 'materials', 'loading'])
        const filterShipment = filterHelper(shipmentList, pathname, query)
        const filterLogs = filterHelper(shipmentLogs, pathname, query, {'page': 'logsPage', 'pageSize': 'logsPageSize'})
        const beginDate = _.get(query, 'beginDate') || defaultDate
        const endDate = _.get(query, 'endDate') || defaultDate
        const filterForm = _.get(state, ['form', 'ManufactureActivityFilterForm'])

        return {
            query,
            pathname,
            list,
            filter,
            filterLogs,
            listLoading,
            shipmentList,
            shipmentListLoading,
            shipmentDetail,
            shipmentDetailLoading,
            shipmentProducts,
            shipmentProductsLoading,
            shipmentMaterials,
            shipmentMaterialsLoading,
            shipmentLogs,
            shipmentLogsLoading,
            filterShipment,
            beginDate,
            endDate,
            filterForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            logsPage: null,
            logsPageSize: null
        }
        const manufactureId = _.get(props, ['params', 'manufactureId'])
        const nextManufactureId = _.get(nextProps, ['params', 'manufactureId'])
        return (props.filterShipment.filterRequest(except) !== nextProps.filterShipment.filterRequest(except) && nextManufactureId > ZERO) ||
            (manufactureId !== nextManufactureId && nextManufactureId)
    }, ({dispatch, filterShipment, params, location}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        const shipmentId = _.toInteger(_.get(location, ['query', 'shipmentId']))
        if (manufactureId > ZERO) {
            dispatch(shipmentItemFetchAction(shipmentId))
            dispatch(shipmentListFetchAction(filterShipment, manufactureId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const shipmentId = _.toInteger(_.get(props, ['location', 'query', 'shipmentId']))
        const nextShipmentId = _.toInteger(_.get(nextProps, ['location', 'query', 'shipmentId']))
        const manufacture = _.toInteger(_.get(props, ['params', 'manufactureId']))
        const nextManufacture = _.toInteger(_.get(nextProps, ['params', 'manufactureId']))
        return (shipmentId !== nextShipmentId && nextShipmentId > ZERO) || (manufacture !== nextManufacture && nextShipmentId > ZERO)
    }, ({dispatch, location}) => {
        const shipmentId = _.toInteger(_.get(location, ['query', 'shipmentId']))
        if (shipmentId > ZERO) {
            dispatch(shipmentProductsListFetchAction(shipmentId))
            dispatch(shipmentMaterialsListFetchAction(shipmentId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const shipmentId = _.toInteger(_.get(props, ['location', 'query', 'shipmentId']))
        const nextShipmentId = _.toInteger(_.get(nextProps, ['location', 'query', 'shipmentId']))
        const manufacture = _.toInteger(_.get(props, ['params', 'manufactureId']))
        const nextManufacture = _.toInteger(_.get(nextProps, ['params', 'manufactureId']))
        const page = _.toInteger(_.get(props, ['location', 'query', 'logsPage']))
        const nextPage = _.toInteger(_.get(nextProps, ['location', 'query', 'logsPage']))
        return (shipmentId !== nextShipmentId && nextShipmentId > ZERO) ||
            (page !== nextPage && nextShipmentId > ZERO) ||
            (manufacture !== nextManufacture && nextShipmentId > ZERO)
    }, ({dispatch, location, params}) => {
        const manufactuureId = _.toInteger(_.get(params, 'manufactureId'))
        const shipmentId = _.toInteger(_.get(location, ['query', 'shipmentId']))
        const page = _.get(location, ['query', 'logsPage']) || '1'
        if (shipmentId > ZERO) {
            dispatch(shipmentLogsListFetchAction(shipmentId, manufactuureId, page))
        }
    }),

    withHandlers({
        handleTabChange: props => (tab) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[TAB]: tab})
            })
        },

        handleClickItem: props => (id) => {
            const {filterShipment} = props
            hashHistory.push({pathname: sprintf(ROUTER.MANUFACTURE_SHIPMENT_ITEM_PATH, id), query: filterShipment.getParams()})
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {[OPEN_FILTER]: true}})
        },
        handleCloseFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {[OPEN_FILTER]: false}})
        },
        handleSubmitFilterDialog: props => () => {
            const {location: {pathname}, filter, filterForm} = props
            const shift = _.get(filterForm, ['values', 'shift', 'value']) || null
            filter.filterBy({
                [MANUF_ACTIVITY_FILTER_KEY.SHIFT]: shift
            })
            hashHistory.push({pathname, query: {[OPEN_FILTER]: false}})
        },

        handleShipmentClick: props => (id) => {
            const {filterShipment, location: {pathname}, dispatch} = props
            hashHistory.push({
                pathname,
                query: filterShipment.getParams({'shipmentId': id})
            })
            dispatch(shipmentItemFetchAction(id))
        },

        handleCloseDetail: props => () => {
            const {location: {pathname, query}} = props
            const page = _.get(query, 'page')
            const pageSize = _.get(query, 'pageSize')
            hashHistory.push({pathname: pathname, query: {page: page, pageSize: pageSize}})
        }
    })
)

const ManufactureShipmentList = enhance((props) => {
    const {
        filter,
        filterLogs,
        list,
        location,
        listLoading,
        shipmentList,
        shipmentListLoading,
        shipmentDetail,
        shipmentDetailLoading,
        shipmentLogs,
        shipmentLogsLoading,
        shipmentProducts,
        shipmentProductsLoading,
        shipmentMaterials,
        shipmentMaterialsLoading,
        filterShipment,
        params,
        layout,
        beginDate,
        endDate
    } = props

    const detailId = _.toInteger(_.get(params, 'manufactureId'))
    const shipmentId = _.toNumber(_.get(props, ['location', 'query', 'shipmentId']) || MINUS_ONE)
    const tab = _.get(location, ['query', TAB]) || SHIPMENT_TAB.DEFAULT_TAB
    const openFilterDialog = toBoolean(_.get(location, ['query', OPEN_FILTER]))

    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleClickItem: props.handleClickItem
    }

    const detailData = {
        id: detailId,
        handleCloseDetail: props.handleCloseDetail
    }

    const shipmentDetailData = {
        id: shipmentId,
        data: shipmentDetail,
        loading: shipmentDetailLoading,
        logs: _.get(shipmentLogs, 'results'),
        logsLoading: shipmentLogsLoading,
        products: shipmentProducts,
        productsLoading: shipmentProductsLoading,
        materials: shipmentMaterials,
        materialsLoading: shipmentMaterialsLoading
    }

    const shipmentData = {
        filter: filterShipment,
        listLoading: shipmentListLoading,
        shipmentList: _.get(shipmentList, 'results'),
        detailData: shipmentDetailData,
        handleShipmentClick: props.handleShipmentClick
    }

    const filterDialog = {
        initialValues: {
            dateRange: {
                startDate: moment(beginDate),
                endDate: moment(endDate)
            }
        },
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    return (
        <Layout {...layout}>
            <ManufactureWrapper detailId={detailId} clickDetail={props.handleClickItem}>
                <ManufactureShipmentWrapper
                    filter={filter}
                    filterDialog={filterDialog}
                    filterLogs={filterLogs}
                    tabData={tabData}
                    shipmentData={shipmentData}
                    listData={listData}
                    detailData={detailData}
                />
            </ManufactureWrapper>
        </Layout>
    )
})

export default ManufactureShipmentList
