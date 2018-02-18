import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import StockReceiveTabList from '../../containers/StockReceive/StockReceiveTabList'
import StockReceiveDetails from './StockReceiveDetails'
import stockTypeFormat from '../../helpers/stockTypeFormat'
import dateFormat from '../../helpers/dateFormat'
import ConfirmDialog from '../ConfirmDialog'
import CreateDialog from './StockReceiveCreateDialog'
import TabReceiveFilterForm from './TabReceiveFilterForm'
import GridList from '../GridList'
import * as TAB from '../../constants/stockReceiveTab'
import t from '../../helpers/translate'

const ZERO = 0
const RETURN = 3
const CANCEL = 2
const DELIVERY = 4
const enhance = compose(
    injectSheet({
        wrapper: {
            '& .row > div > svg': {
                position: 'relative',
                width: '16px !important',
                height: '16px !important',
                top: '3px',
                marginRight: '5px'
            }
        },
        loader: {
            position: 'absolute',
            background: '#fff',
            top: '100px',
            left: '0',
            width: '100%',
            minHeight: '400px',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        listWrapper: {
            position: 'relative',
            '& > div:nth-child(2)': {
                marginTop: '0 !important'
            }
        },
        list: {
            cursor: 'pointer',
            marginBottom: '5px',
            '& > a': {
                color: 'inherit'
            }
        },
        expandedList: {
            margin: '20px -15px',
            transition: 'all 400ms ease-out !important',
            position: 'relative',
            '& > a': {
                color: 'inherit'
            }
        },
        semibold: {
            fontWeight: '600',
            cursor: 'pointer'
        },
        headers: {
            color: '#666',
            fontWeight: '600',
            padding: '15px 30px',
            '& .row': {
                alignItems: 'center'
            }
        },
        actionButton: {
            background: '#12aaeb',
            borderRadius: '2px',
            color: '#fff',
            padding: '5px 10px'
        },
        success: {
            color: '#81c784'
        },
        begin: {
            color: '#f0ad4e'
        },
        error: {
            color: '#e57373'
        },
        waiting: {
            color: '#64b5f6'
        }
    })
)

const listHeader = [
    {
        name: 'id',
        sorting: true,
        title: '№ ' + t('заказа'),
        xs: 2
    },
    {
        name: 'by',
        sorting: false,
        title: t('От кого'),
        xs: 4
    },
    {
        name: 'type',
        sorting: false,
        title: t('Тип'),
        xs: 2
    },
    {
        sorting: true,
        name: 'date',
        title: t('Дата приемки'),
        xs: 2
    },
    {
        name: 'stock',
        sorting: false,
        title: t('Склад'),
        xs: 2
    }
]
const listHeaderHistory = [
    {
        name: 'id',
        sorting: true,
        title: '№ ' + t('заказа'),
        xs: 2
    },
    {
        name: 'by',
        sorting: false,
        title: t('От кого'),
        xs: 2
    },
    {
        name: 'type',
        sorting: false,
        title: t('Тип'),
        xs: 2
    },
    {
        sorting: true,
        name: 'date',
        title: t('Дата приемки'),
        xs: 2
    },
    {
        sorting: true,
        name: 'acceptedBy',
        title: t('Принял'),
        xs: 2
    },
    {
        name: 'stock',
        sorting: false,
        title: t('Склад'),
        xs: 1
    }
]

const StockTabReceive = enhance((props) => {
    const {
        listData,
        detailData,
        filter,
        classes,
        confirmDialog,
        handleCloseDetail,
        filterDialog,
        createDialog,
        updateDialog,
        history,
        handleCheckNoDefect,
        repealDialog
    } = props
    const listLoading = _.get(listData, 'listLoading')
    const stockReceiveFilterDialog = (
        <TabReceiveFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
            history={history}
        />
    )
    const receiveDetails = (
        <StockReceiveDetails
            key={_.get(detailData, 'id') + '_' + _.get(detailData, 'type')}
            detailData={detailData}
            confirmDialog={confirmDialog}
            handleCloseDetail={handleCloseDetail}
            createDialog={createDialog}
            updateDialog={updateDialog}
            repealDialog={repealDialog}
            history={history}
        />
    )

    const stockReceiveList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const orderId = _.get(item, 'orderId')
        const by = _.get(item, 'by')
        const type = _.get(item, 'type')
        const formattedType = stockTypeFormat(type)
        const acceptedBy = _.get(item, ['acceptedBy', 'firstName']) && _.get(item, ['acceptedBy', 'secondName'])
            ? _.get(item, ['acceptedBy', 'firstName']) + ' ' + _.get(item, ['acceptedBy', 'secondName'])
            : t('Не указано')
        const acceptedTime = _.get(item, 'acceptedTime') ? dateFormat(_.get(item, 'acceptedTime')) : t('Не указана')
        const date = _.get(item, 'date') ? dateFormat(_.get(item, 'date')) : 'Не указана'
        const stockName = _.get(item, ['stock', 'name'])
        const key = (type === 'delivery_return') ? orderId : id

        if (history) {
            return (
                <Row
                    key={key + '_' + type}
                    onClick={() => {
                        listData.handleOpenDetail(key, type, id)
                    }}
                    style={{cursor: 'pointer'}}>
                    <Col xs={2}>{key}</Col>
                    <Col xs={2}>{by}</Col>
                    <Col xs={2}>{formattedType}</Col>
                    <Col xs={2}>{acceptedTime}</Col>
                    <Col xs={2}>{acceptedBy}</Col>
                    <Col xs={1}>{stockName}</Col>
                </Row>
            )
        }
        return (
            <Row
                key={key + '_' + type}
                onClick={() => {
                    listData.handleOpenDetail(key, type, id)
                }}
                style={{cursor: 'pointer'}}>
                <Col xs={2}>{key}</Col>
                <Col xs={4}>{by}</Col>
                <Col xs={2}>{formattedType}</Col>
                <Col xs={2}>{date}</Col>
                <Col xs={2}>{stockName}</Col>
            </Row>
        )
    })

    const list = {
        header: history ? listHeaderHistory : listHeader,
        list: stockReceiveList,
        loading: listLoading
    }

    return (
        <div className={classes.wrapper}>
            <StockReceiveTabList currentTab={history ? TAB.STOCK_RECEIVE_TAB_HISTORY : TAB.STOCK_RECEIVE_TAB_RECEIVE}/>
            <GridList
                filter={filter}
                filterDialog={stockReceiveFilterDialog}
                list={list}
                detail={receiveDetails}/>

            <ConfirmDialog
                type={confirmDialog.openConfirmDialog === CANCEL ? 'cancel' : 'submit'}
                message={t('Запрос') + ' № ' + _.get(detailData, 'id')}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.openConfirmDialog === RETURN
                    ? confirmDialog.handleSubmitOrderReturnDialog
                    : (confirmDialog.openConfirmDialog === DELIVERY)
                        ? confirmDialog.handleSubmitReceiveDeliveryConfirmDialog
                        : confirmDialog.handleSubmitReceiveConfirmDialog}
                open={confirmDialog.openConfirmDialog > ZERO}/>

            {history && <ConfirmDialog
                type="submit"
                message={t('Запрос') + ' № ' + _.get(detailData, 'id')}
                onClose={repealDialog.handleCloseRepealDialog}
                onSubmit={repealDialog.handleSubmitRepealDialog}
                open={repealDialog.openRepealDialog}
            />}
            {!history && <CreateDialog
                loading={createDialog.createLoading}
                open={createDialog.openCreateDialog}
                detailProducts={_.get(detailData, 'data')}
                listLoading={createDialog.detailLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
                handleCheckNoDefect={handleCheckNoDefect}/>}

            {!history && <CreateDialog
                loading={updateDialog.updateLoading}
                open={updateDialog.openUpdateDialog}
                detailProducts={_.get(detailData, 'data')}
                listLoading={updateDialog.detailLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                handleCheckNoDefect={handleCheckNoDefect}/>}
        </div>
    )
})

StockTabReceive.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    handleCloseDetail: PropTypes.func.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.number.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSubmitOrderReturnDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StockTabReceive
