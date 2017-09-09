import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {ManufactureShipmentWrapper} from '../../components/Manufacture'
import {manufactureListFetchAction} from '../../actions/manufacture'
import {
    shipmentListFetchAction,
    shipmentItemFetchAction
} from '../../actions/shipment'

const MINUS_ONE = -1
const ZERO = 0
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
        const filterShipment = filterHelper(shipmentList, pathname, query)

        return {
            query,
            pathname,
            list,
            filter,
            listLoading,
            shipmentList,
            shipmentListLoading,
            shipmentDetail,
            shipmentDetailLoading,
            filterShipment
        }
    }),

    withPropsOnChange((props, nextProps) => {
        let prevPath = _.startsWith(props.pathname, '/') ? props.pathname : '/' + props.pathname
        let nextPath = _.startsWith(nextProps.pathname, '/') ? nextProps.pathname : '/' + nextProps.pathname
        return _.startsWith(prevPath, ROUTER.MANUFACTURE_SHIPMENT_LIST_URL) !== _.startsWith(nextPath, ROUTER.MANUFACTURE_SHIPMENT_LIST_URL)
    }, ({dispatch, filter, pathname}) => {
        if (_.startsWith(pathname, ROUTER.MANUFACTURE_SHIPMENT_LIST_URL)) {
            dispatch(manufactureListFetchAction(filter))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const manufactureId = _.get(props, ['params', 'manufactureId'])
        const nextManufactureId = _.get(nextProps, ['params', 'manufactureId'])
        return (props.filterShipment.filterRequest() !== nextProps.filterShipment.filterRequest() && nextManufactureId > ZERO) ||
            (manufactureId !== nextManufactureId && nextManufactureId)
    }, ({dispatch, filterShipment, params, location}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        const shipmentId = _.toInteger(_.get(location, ['query', 'shipmentId']))
        if (manufactureId > ZERO) {
            if (shipmentId > ZERO) {
                dispatch(shipmentItemFetchAction(shipmentId))
            }
            dispatch(shipmentListFetchAction(filterShipment, manufactureId))
        }
    }),

    withHandlers({
        handleClickItem: props => (id) => {
            const {filterShipment} = props
            hashHistory.push({pathname: sprintf(ROUTER.MANUFACTURE_SHIPMENT_ITEM_PATH, id), query: filterShipment.getParams()})
        },

        handleShipmentClick: props => (id) => {
            const {filterShipment, location: {pathname}, dispatch} = props
            hashHistory.push({
                pathname,
                query: filterShipment.getParams({'shipmentId': id})
            })
            dispatch(shipmentItemFetchAction(id))
        }
    })
)

const ManufactureShipmentList = enhance((props) => {
    const {
        filter,
        list,
        listLoading,
        shipmentList,
        shipmentListLoading,
        shipmentDetail,
        shipmentDetailLoading,
        filterShipment,
        params,
        layout
    } = props

    const detailId = _.toInteger(_.get(params, 'manufactureId'))
    const shipmentId = _.toNumber(_.get(props, ['location', 'query', 'shipmentId']) || MINUS_ONE)

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
        loading: shipmentDetailLoading
    }

    const shipmentData = {
        filter: filterShipment,
        listLoading: shipmentListLoading,
        shipmentList: _.get(shipmentList, 'results'),
        detailData: shipmentDetailData,
        handleShipmentClick: props.handleShipmentClick
    }

    return (
        <Layout {...layout}>
            <ManufactureShipmentWrapper
                filter={filter}
                shipmentData={shipmentData}
                listData={listData}
                detailData={detailData}
            />
        </Layout>
    )
})

export default ManufactureShipmentList
