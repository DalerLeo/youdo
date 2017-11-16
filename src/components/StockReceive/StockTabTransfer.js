import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import GridList from '../GridList'
import TabTransferFilterForm from './TabTransferFilterForm'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Details from './StockTransferDetails'
import DeliveryDetails from './StockTransferDeliveryDetails'
import StockTabTransferDateRange from './StockTabTransferDateRange'
import ConfirmDialog from '../ConfirmDialog'
import StockReceiveTabList from '../../containers/StockReceive/StockReceiveTabList'
import * as TAB from '../../constants/stockReceiveTab'
import dateFormat from '../../helpers/dateFormat'
import FlatButton from 'material-ui/FlatButton'
import Order from 'material-ui/svg-icons/editor/monetization-on'
import Delivery from 'material-ui/svg-icons/maps/local-taxi'
import Tooltip from '../ToolTip'
import toBoolean from '../../helpers/toBoolean'

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

const deliveryHeader = [
    {
        sorting: false,
        name: 'id',
        title: 'Доставщик',
        xs: 6
    },
    {
        sorting: true,
        name: 'stock',
        title: 'Склад',
        xs: 6
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
        filters: {
            display: 'flex',
            height: '40px',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '-10px 0 10px'
        },
        filtersReverse: {
            extend: 'filters',
            justifyContent: 'flex-end'
        },
        dateRange: {
            '& a': {
                fontWeight: '600'
            }
        },
        toggleWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            '& > div': {
                display: 'flex',
                background: 'transparent !important'
            },
            '& button': {
                height: '32px !important',
                lineHeight: '32px !important',
                minWidth: '66px !important',
                '& > div': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& svg': {
                        width: '20px !important',
                        height: '20px !important'
                    }
                }
            }
        },
        shadowButton: {
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
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
        filterDelivery,
        deliveryData,
        deliveryDetailsData,
        listData,
        detailData,
        handleCloseDetail,
        getRelease,
        getRoute,
        confirmDialog,
        classes,
        printDialog,
        toggleData,
        confirmTransfer
    } = props

    const toggle = _.get(toggleData, 'toggle')
    const currentDeliverer = _.find(_.get(deliveryData, 'data'), (item) => {
        return _.toInteger(_.get(item, ['user', 'id'])) === _.get(deliveryDetailsData, 'id') &&
            _.toInteger(_.get(item, ['stock', 'id'])) === _.get(deliveryDetailsData, 'stock')
    })

    const usersFilterDialog = (
        <TabTransferFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const deliveryDetail = (
        <DeliveryDetails
            detailData={_.get(deliveryDetailsData, 'data')}
            key={_.get(deliveryDetailsData, 'id')}
            currentDeliverer={currentDeliverer}
            handleCloseDetail={handleCloseDetail}
            handleOpenDeliveryPrintDialog={_.get(deliveryDetailsData, 'handleOpenDeliveryPrintDialog')}
            loading={_.get(deliveryDetailsData, 'deliveryDetailLoading')}
            getRelease={getRelease}
            getRoute={getRoute}
            confirmTransfer={confirmTransfer}
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

    const deliveryList = _.map(_.get(deliveryData, 'data'), (item) => {
        const user = _.get(item, ['user', 'id'])
        const keyname = user || ZERO
        const userName = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName'])
        const stockName = _.get(item, ['stock', 'name'])
        const stockid = _.get(item, ['stock', 'id'])

        return (
            <Row key={keyname} style={{position: 'relative', cursor: 'pointer'}}
                 onClick={() => { listData.handleOpenDetail(keyname, stockid) }}>
                <Col xs={6} >{user ? userName : 'Не определен'}</Col>
                <div className={classes.closeDetail} onClick={handleCloseDetail}>{null}</div>
                <Col xs={6}>{stockName}</Col>
            </Row>
        )
    })

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

    const list = {
        header: listHeader,
        list: historyList,
        loading: _.get(listData, 'listLoading')
    }
    const listDelivery = {
        header: deliveryHeader,
        list: deliveryList,
        loading: _.get(deliveryData, 'deliveryListLoading')
    }

    const primaryColor = '#12aaeb'
    const disabledColor = '#dadada'
    const whiteColor = '#fff'
    const isOrder = toggle === 'order'
    const isDelivery = toggle === 'delivery'
    return (
        <div className={classes.wrapper}>
            <StockReceiveTabList currentTab={TAB.STOCK_RECEIVE_TAB_TRANSFER}/>
            <div className={toggle === 'delivery' ? classes.filters : classes.filtersReverse}>
                {toggle === 'delivery' &&
                <Tooltip position="bottom" text="Период доставки">
                    <StockTabTransferDateRange filter={filterDelivery} initialValues={filterDialog.initialValues}/>
                </Tooltip>}
                <div className={classes.toggleWrapper}>
                    <Tooltip position="left" text="Показать по заказам">
                        <FlatButton
                            icon={<Order color={whiteColor}/>}
                            className={isOrder ? classes.shadowButton : ''}
                            onTouchTap={() => { toggleData.handleChooseToggle('order') }}
                            backgroundColor={isOrder ? primaryColor : disabledColor}
                            rippleColor={whiteColor}
                            hoverColor={isOrder ? primaryColor : disabledColor}/>
                    </Tooltip>
                    <Tooltip position="left" text="Показать по доставщикам">
                        <FlatButton
                            icon={<Delivery color={whiteColor}/>}
                            className={isDelivery ? classes.shadowButton : ''}
                            onTouchTap={() => { toggleData.handleChooseToggle('delivery') }}
                            backgroundColor={isDelivery ? primaryColor : disabledColor}
                            rippleColor={whiteColor}
                            hoverColor={isDelivery ? primaryColor : disabledColor}/>
                    </Tooltip>
                </div>
            </div>
            {toggle === 'order'
            ? <GridList
                    filter={filter}
                    list={list}
                    detail={historyDetail}
                    filterDialog={usersFilterDialog}
                />
            : <GridList
                    filter={filterDelivery}
                    list={listDelivery}
                    detail={deliveryDetail}
                    filterDialog={usersFilterDialog}
                />}
            <ConfirmDialog
                type="submit"
                message={'Запрос № ' + _.get(detailData, 'id')}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSubmitTransferAcceptDialog}
                open={toBoolean(confirmDialog.openConfirmDialog)}
            />
            <ConfirmDialog
                type="submit"
                message={'Передать доставщику?'}
                onClose={confirmTransfer.handleCloseDeliveryConfirmDialog}
                onSubmit={confirmTransfer.handleSubmitDeliveryConfirmDialog}
                open={_.toInteger(confirmTransfer.openConfirmTransfer) > ZERO}
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
    }).isRequired,
    confirmTransfer: PropTypes.shape({
        openConfirmTransfer: PropTypes.bool,
        handleOpenDeliveryConfirmDialog: PropTypes.func,
        handleCloseDeliveryConfirmDialog: PropTypes.func,
        handleSubmitDeliveryConfirmDialog: PropTypes.func
    })
}

export default StockTabTransfer
