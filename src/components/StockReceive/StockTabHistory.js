import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import GridList from '../GridList'
import HistoryFilterForm from './StockHistoryFilterForm'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import numberFormat from '../../helpers/numberFormat'
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward'
import StockReturnDialog from '../StockReceive/StockReturnDialog'
import StockSupplyDialog from '../StockReceive/StockSupplyDialog'
import stockTypeFormat from '../../helpers/stockTypeFormat'
import InfoDialog from '../Statistics/Sales/StatSaleDialog'
import PopoverDialog from './PopoverDialog'
import StockReceiveTabList from '../../containers/StockReceive/StockReceiveTabList'
import * as TAB from '../../constants/stockReceiveTab'

const ZERO = 0
const listHeader = [
    {
        sorting: false,
        name: 'product',
        title: 'Товар',
        xs: 4
    },
    {
        sorting: true,
        name: 'amount',
        title: 'Кол-во',
        xs: 1
    },
    {
        sorting: true,
        name: 'createdDate',
        title: 'Дата',
        xs: 3
    },
    {
        name: 'stock',
        title: 'Склад',
        xs: 2
    },
    {
        sorting: false,
        name: 'type',
        title: 'Тип',
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
        },
        infoDialog: {
            color: '#129fdd',
            cursor: 'pointer',
            fontWeight: '600',
            '&:hover': {
                textDecoration: 'underline'
            }
        }
    })
)

const StockTabHistory = enhance((props) => {
    const {
        filter,
        filterDialog,
        listData,
        classes,
        historyDialog,
        returnDialog,
        supplyDialog,
        popoverDialog
    } = props

    const usersFilterDialog = (
        <HistoryFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const historyDetail = (
        <span>a</span>
    )
    const historyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const product = _.get(item, ['product', 'name'])
        const stock = _.get(item, ['stock', 'name'])
        const amount = numberFormat(_.get(item, 'amount'))
        const measurement = _.get(item, ['product', 'measurement', 'name'])
        const date = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY HH:mm')
        const parent = _.get(item, 'dParentId')
        const genericType = stockTypeFormat(_.get(item, ['generic', 'type']))
        const genericTypeUse = _.get(item, ['generic', 'type'])
        const type = _.get(item, 'type')
        return (
            <Row key={id}>
                <Col xs={4}>
                    {(type === 'Out') ? <ArrowUp color="#e57373"/> : <ArrowDown color="#81c784"/>} {product}
                </Col>
                <Col xs={1}>{amount} {measurement}</Col>
                <Col xs={3}>{date}</Col>
                <Col xs={2}>{stock}</Col>
                <Col xs={2}>{genericType} {_.get(item, ['generic', 'type']) === 'order transfer product'
                        ? <span className={classes.infoDialog} onClick={() => {
                            historyDialog.handleOpenHistoryDialog(parent)
                        }}>{parent}</span>
                        : (_.get(item, ['generic', 'type']) === 'order return accept' || _.get(item, ['generic', 'type']) === 'order_return'
                        ? <span className={classes.infoDialog} onClick={() => {
                            returnDialog.handleOpenStockReturnDialog(parent)
                        }}>{parent}</span>
                        : (_.get(item, ['generic', 'type']) === 'supply'
                            ? <span className={classes.infoDialog} onClick={() => {
                                supplyDialog.handleOpenStockSupplyDialog(parent)
                            }}>{parent}</span>
                            : ((genericTypeUse === 'stock_transfer' || genericTypeUse === 'transfer' ||
                                genericTypeUse === 'delivery_return' || genericTypeUse === 'order_return')
                                ? <span className={classes.infoDialog} onClick={() => {
                                    popoverDialog.handleOpenDialog(parent, genericTypeUse)
                                }}>{parent}</span> : null)))}
                </Col>
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
            <StockReceiveTabList currentTab={TAB.STOCK_RECEIVE_TAB_OUT_HISTORY}/>
            <GridList
                filter={filter}
                list={list}
                detail={historyDetail}
                filterDialog={usersFilterDialog}/>

            <InfoDialog
                loading={_.get(listData, 'historyOrderLoading')}
                detailData={_.get(listData, 'detailData')}
                open={_.toNumber(historyDialog.openHistoryInfoDialog) > ZERO}
                onClose={historyDialog.handleCloseHistoryDialog}
                filter={filter}
                type={false}/>
            <StockReturnDialog
                open={_.toNumber(_.get(returnDialog, 'open')) > ZERO}
                onClose={_.get(returnDialog, 'handleCloseStockReturnDialog')}
                key={_.get(returnDialog, 'open')}
                data={_.get(returnDialog, 'data') || {}}
                loading={_.get(returnDialog, 'loading')}/>
            <StockSupplyDialog
                open={_.toNumber(_.get(supplyDialog, 'open')) > ZERO}
                onClose={_.get(supplyDialog, 'handleCloseStockSupplyDialog')}
                key={_.get(supplyDialog, 'open')}
                data={_.get(supplyDialog, 'data') || {}}
                loading={_.get(supplyDialog, 'loading')}
                filter={_.get(supplyDialog, 'filter')}/>
            <PopoverDialog
                open={_.toNumber(_.get(popoverDialog, 'open')) > ZERO}
                onClose={_.get(popoverDialog, 'onClose')}
                popoverDialog={popoverDialog}
                loading={_.get(popoverDialog, 'loading')}/>
        </div>
    )
})

StockTabHistory.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    historyDialog: PropTypes.shape({
        openHistoryInfoDialog: PropTypes.number.isRequired,
        handleOpenHistoryDialog: PropTypes.func.isRequired,
        handleCloseHistoryDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StockTabHistory
