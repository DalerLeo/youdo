import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import GridList from '../GridList'
import TabTransferFilterForm from './TabTransferFilterForm'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import Details from './StockTabTransferHistoryDetails'
import StockReceiveDetails from './StockReceiveDetails'
import * as TAB from '../../constants/stockReceiveTab'
import ConfirmDialog from '../ConfirmDialog'
import StockReceiveTabList from '../../containers/StockReceive/StockReceiveTabList'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: '№ запроса',
        xs: 2
    },
    {
        sorting: true,
        name: 'dateRequest',
        title: 'Дата запроса',
        xs: 2
    },
    {
        sorting: true,
        name: 'stock',
        title: 'Склад',
        xs: 2
    },
    {
        sorting: true,
        name: 'type',
        title: 'Тип',
        xs: 2
    },
    {
        name: 'receiver',
        title: 'Кому',
        xs: 2
    },
    {
        sorting: true,
        name: 'dateDelivery',
        title: 'Дата передачи',
        xs: 2
    }
]

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            background: '#fff',
            top: '72px',
            left: '0',
            width: '100%',
            minHeight: '400px',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        wrapper: {
            '& .row > div > svg': {
                position: 'relative',
                width: '16px !important',
                height: '16px !important',
                top: '3px',
                marginRight: '5px'
            }
        }
    }),
)

const ZERO = 0
const StockTabTransferHistory = enhance((props) => {
    const {
        filter,
        filterDialog,
        listData,
        detailData,
        handleCloseDetail,
        classes,
        printDialog,
        transferType,
        confirmDialog
    } = props

    const usersFilterDialog = (
        <TabTransferFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
            transfer={true}
        />
    )
    const historyDetail = (
        <Details
            detailData={detailData || {}}
            key={_.get(detailData, 'id') + '_' + _.get(detailData, 'type')}
            handleCloseDetail={handleCloseDetail}
            loading={_.get(detailData, 'detailLoading')}
            handleOpenPrint={printDialog.handleOpenPrintDialog}
            confirm={false}
            confirmDialog={confirmDialog}/>
    )
    const historyTransferDetail = (
        <StockReceiveDetails
            key={_.get(detailData, 'id') + '_' + _.get(detailData, 'type')}
            handleCloseDetail={handleCloseDetail}
            detailData={detailData}
            loading={_.get(detailData, 'detailLoading')}
            history={true}
            popover={true}
        />)

    const historyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const dateRequest = moment(_.get(item, 'dateRequest')).format('DD.MM.YYYY')
        const dateDelivery = moment(_.get(item, 'dateDelivery')).format('DD.MM.YYYY')
        const receiver = _.get(item, ['receiver'])
        const stockId = _.get(item, ['stock', 'id'])
        const typeOrg = _.get(item, 'type')
        const type = typeOrg === 'order' ? 'Заказ' : (typeOrg === 'transfer' ? 'Передача' : null)
        const stockName = _.get(item, ['stock', 'name'])
        return (
            <Row
                key={id + '_' + stockId}
                style={{position: 'relative', cursor: 'pointer'}}
                onClick={() => { listData.handleOpenDetail(id, stockId, typeOrg) }}>
                <Col xs={2} >{id}</Col>
                <Col xs={2}>{dateRequest}</Col>
                <Col xs={2}>{stockName}</Col>
                <Col xs={2}>{type}</Col>
                <Col xs={2}>{receiver}</Col>
                <Col xs={2}>{dateDelivery}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: historyList,
        loading: _.get(listData, 'listLoading')
    }
    return (
        <div className={classes.wrapper}>
            <StockReceiveTabList currentTab={TAB.STOCK_RECEIVE_TAB_TRANSFER_HISTORY}/>
            <GridList
                filter={filter}
                list={list}
                detail={transferType === 'transfer' ? historyTransferDetail : historyDetail}
                filterDialog={usersFilterDialog}
            />
            <ConfirmDialog
                type={'submit' }
                message={'Запрос № ' + _.get(detailData, 'id')}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.openConfirmDialog}
                open={confirmDialog.openConfirmDialog > ZERO}
            />
        </div>
    )
})

StockTabTransferHistory.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StockTabTransferHistory
