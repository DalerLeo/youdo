import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {ManufactureEquipmentWrapper} from '../../components/Manufacture'
import {manufactureListFetchAction} from '../../actions/manufacture'
import {equipmentListFetchAction} from '../../actions/equipment'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['manufacture', 'list', 'data'])
        const listLoading = _.get(state, ['manufacture', 'list', 'loading'])
        const filter = filterHelper(list, pathname, query)
        const equipmentList = _.get(state, ['equipment', 'list', 'data'])
        const equipmentListLoading = _.get(state, ['equipment', 'list', 'loading'])
        const filterEquipment = filterHelper(equipmentList, pathname, query)

        return {
            query,
            pathname,
            list,
            filter,
            listLoading,
            equipmentList,
            equipmentListLoading,
            filterEquipment
        }
    }),

    withPropsOnChange((props, nextProps) => {
        let prevPath = _.startsWith(props.pathname, '/') ? props.pathname : '/' + props.pathname
        let nextPath = _.startsWith(nextProps.pathname, '/') ? nextProps.pathname : '/' + nextProps.pathname
        return _.startsWith(prevPath, ROUTER.MANUFACTURE_EQUIPMENT_LIST_URL) !== _.startsWith(nextPath, ROUTER.MANUFACTURE_EQUIPMENT_LIST_URL)
    }, ({dispatch, filter, pathname}) => {
        if (_.startsWith(pathname, ROUTER.MANUFACTURE_EQUIPMENT_LIST_URL)) {
            dispatch(manufactureListFetchAction(filter))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const manufactureId = _.get(props, ['params', 'manufactureId'])
        const nextManufactureId = _.get(nextProps, ['params', 'manufactureId'])
        return (props.filterEquipment.filterRequest() !== nextProps.filterEquipment.filterRequest() && nextManufactureId > ZERO) ||
            (manufactureId !== nextManufactureId && nextManufactureId)
    }, ({dispatch, filterEquipment, params}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        if (manufactureId > ZERO) {
            dispatch(equipmentListFetchAction(filterEquipment, manufactureId))
        }
    }),

    withHandlers({
        handleClickItem: props => (id) => {
            const {filterEquipment} = props
            hashHistory.push({pathname: sprintf(ROUTER.MANUFACTURE_EQUIPMENT_ITEM_PATH, id), query: filterEquipment.getParams()})
        }
    })
)

const ManufactureEquipmentList = enhance((props) => {
    const {
        filter,
        list,
        listLoading,
        filterEquipment,
        equipmentList,
        equipmentListLoading,
        params,
        layout
    } = props

    const detailId = _.toInteger(_.get(params, 'manufactureId'))

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleClickItem: props.handleClickItem
    }

    const detailData = {
        id: detailId,
        handleCloseDetail: props.handleCloseDetail
    }

    const equipmentData = {
        filter: filterEquipment,
        listLoading: equipmentListLoading,
        equipmentList: _.get(equipmentList, 'results')
    }

    return (
        <Layout {...layout}>
            <ManufactureEquipmentWrapper
                filter={filter}
                equipmentData={equipmentData}
                listData={listData}
                detailData={detailData}
            />
        </Layout>
    )
})

export default ManufactureEquipmentList
