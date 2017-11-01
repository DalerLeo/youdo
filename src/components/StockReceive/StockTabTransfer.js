import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import GridList from '../GridList'
import TabTransferFilterForm from './TabTransferFilterForm'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Details from './StockTransferDetails'
import ConfirmDialog from '../ConfirmDialog'
import StockReceiveTabList from '../../containers/StockReceive/StockReceiveTabList'
import * as TAB from '../../constants/stockReceiveTab'
import dateFormat from '../../helpers/dateFormat'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'

const ZERO = 0

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
        sorting: false,
        name: 'stock',
        title: 'Склад',
        xs: 2
    },
    {
        name: 'stock',
        title: 'Кому',
        xs: 3
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
        fabWrapper: {
            position: 'absolute',
            top: '0',
            right: '0'
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
    })
)

const StockTabTransfer = enhance((props) => {
    const {
        filter,
        filterDialog,
        listData,
        detailData,
        handleCloseDetail,
        confirmDialog,
        classes,
        printDialog
    } = props

    const usersFilterDialog = (
        <TabTransferFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const historyDetail = (
        <Details
            detailData={detailData || {}}
            key={_.get(detailData, 'id') + '_' + _.get(detailData, 'type')}
            handleCloseDetail={handleCloseDetail}
            loading={_.get(detailData, 'detailLoading')}
            printDialog={printDialog}
            confirmDialog={confirmDialog}
            confirm={true}
        />

    )
    const historyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const dateRequest = dateFormat(_.get(item, 'dateRequest'))
        const dateDelivery = dateFormat(_.get(item, 'dateDelivery'))
        const receiver = _.get(item, ['receiver'])
        const stockId = _.get(item, ['stock', 'id'])
        const stockName = _.get(item, ['stock', 'name'])

        return (
            <Row
                key={id + '_' + stockId} style={{position: 'relative', cursor: 'pointer'}}
                onClick={() => { listData.handleOpenDetail(id, stockId) }}>
                <div className={classes.closeDetail}
                     onClick={handleCloseDetail}>
                </div>
                <Col xs={2} >{id}</Col>
                <Col xs={2}>{dateRequest}</Col>
                <Col xs={2}>{stockName}</Col>
                <Col xs={3}>{receiver}</Col>
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
            <StockReceiveTabList currentTab={TAB.STOCK_RECEIVE_TAB_TRANSFER}/>
            <div className={classes.fabWrapper}>
                <Tooltip position="left" text="Добавить магазин">
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb">
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>
            <GridList
                filter={filter}
                list={list}
                detail={historyDetail}
                filterDialog={usersFilterDialog}
            />
            <ConfirmDialog
                type="submit"
                message={'Запрос № ' + _.get(detailData, 'id')}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSubmitTransferAcceptDialog}
                open={confirmDialog.openConfirmDialog > ZERO}
            />
        </div>
    )
})

StockTabTransfer.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StockTabTransfer
