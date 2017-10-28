import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import injectSheet from 'react-jss'
import {compose, withHandlers, lifecycle} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {ManufacturesList} from '../../components/Manufacture'
import {manufactureListFetchAction} from '../../actions/manufacture'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'absolute',
            top: '0',
            left: '0',
            paddingTop: '20px',
            height: '100%',
            width: '100%',
            display: 'flex'
        }
    }),
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
    withHandlers({
        handleClickItem: props => (id) => {
            const {filterEquipment} = props
            hashHistory.push({pathname: sprintf(ROUTER.MANUFACTURE_PERSON_ITEM_PATH, id), query: filterEquipment.getParams()})
        }
    }),
    lifecycle({
        componentWillMount () {
            if (!_.get(this.props, 'list') && !_.get(this.props, 'listLoading')) {
                this.props.dispatch(manufactureListFetchAction())
            }
        }
    })
)

const ManufactureWrapper = enhance((props) => {
    const {
        classes,
        list,
        listLoading,
        children,
        clickDetail,
        detailId
    } = props

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleClickItem: props.handleClickItem
    }
    const detailData = {
        id: detailId,
        handleCloseDetail: props.handleCloseDetail
    }

    return (
        <div className={classes.wrapper}>
            <ManufacturesList listData={listData} detailData={detailData} detailId={detailId} handleClick={clickDetail}/>
            <div style={{width: 'calc(100% - 280px)', marginTop: '-20px', padding: '20px 30px', overflowY: 'auto'}}>
            {children}
            </div>
        </div>
    )
})

export default ManufactureWrapper
