import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import OrderFilterForm from './OrderFilterForm'
import OrderDetails from './OrderDetails'
import OrderCreateDialog from './OrderCreateDialog'
import OrderShortageDialog from './OrderShortage'
import ConfirmDialog from '../ConfirmDialog'
import ClientCreateDialog from '../Client/ClientCreateDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import getConfig from '../../helpers/getConfig'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import Delivered from 'material-ui/svg-icons/action/done-all'
import Available from 'material-ui/svg-icons/av/playlist-add-check'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import Transfered from 'material-ui/svg-icons/action/motorcycle'
import Payment from 'material-ui/svg-icons/action/credit-card'
import InProcess from 'material-ui/svg-icons/action/cached'
import dateFormat from '../../helpers/dateFormat'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: 'Заказ №',
        xs: '10%'
    },
    {
        sorting: true,
        name: 'client',
        title: 'Клиент',
        xs: '17.5%'
    },
    {
        sorting: true,
        name: 'market',
        title: 'Магазин',
        xs: '17.5%'
    },
    {
        sorting: true,
        name: 'user',
        title: 'Инициатор',
        xs: '10%'
    },
    {
        sorting: true,
        name: 'totalPrice',
        alignRight: true,
        title: 'Сумма заказа',
        xs: '15%'
    },
    {
        sorting: true,
        name: 'dateDelivery',
        title: 'Дата доставки',
        xs: '15%'
    },
    {
        sorting: true,
        name: 'createdDate',
        title: 'Дата создания',
        xs: '15%'
    },
    {
        sorting: false,
        name: 'acceptedCost',
        title: 'Статус',
        xs: '5%'
    }
]

const enhance = compose(
    injectSheet({
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        listWrapper: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            margin: '0 -30px',
            padding: '0 30px',
            position: 'relative',
            '& > div': {
                padding: '0 0.5rem',
                '&:last-child': {
                    padding: '0'
                }
            }
        },
        listWrapperNew: {
            extend: 'listWrapper',
            fontWeight: '600',
            '&:before': {
                content: '""',
                position: 'absolute',
                left: '0',
                bottom: '0',
                top: '0',
                width: '3px',
                background: '#12aaeb'
            }
        },
        dot: {
            display: 'inline-block',
            height: '7px',
            width: '7px',
            borderRadius: '50%',
            marginRight: '6px'
        },
        success: {
            extend: 'dot',
            backgroundColor: '#81c784'
        },
        error: {
            extend: 'dot',
            backgroundColor: '#e57373'
        },
        buttons: {
            display: 'flex',
            justifyContent: 'space-around'
        },
        openDetails: {
            position: 'absolute',
            top: '0',
            bottom: '0',
            right: '0',
            left: '0',
            cursor: 'pointer'
        }
    })
)

const OrderGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        filterDialog,
        getDocument,
        transactionsDialog,
        returnDialog,
        shortageDialog,
        products,
        confirmDialog,
        itemReturnDialog,
        listData,
        detailData,
        returnListData,
        paymentData,
        tabData,
        classes,
        createClientDialog,
        returnDataLoading,
        printDialog,
        type,
        cancelOrderReturnDialog,
        refreshAction
    } = props

    const orderFilterDialog = (
        <OrderFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}/>
    )
    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 30,
            height: 30,
            padding: 0,
            zIndex: 0
        }
    }
    const orderDetail = (
        <OrderDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            returnData={_.get(detailData, 'return')}
            transactionsDialog={transactionsDialog}
            tabData={tabData}
            getDocument={getDocument}
            paymentData={paymentData}
            returnListData={returnListData}
            returnDialog={returnDialog}
            itemReturnDialog={itemReturnDialog}
            confirmDialog={confirmDialog}
            loading={_.get(detailData, 'detailLoading')}
            returnDataLoading={returnDataLoading}
            handleOpenUpdateDialog={updateDialog.handleOpenUpdateDialog}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
            cancelOrderReturnDialog={cancelOrderReturnDialog}
            type={type}
        />
    )
    const orderList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const currentCurrency = getConfig('PRIMARY_CURRENCY')
        const client = _.get(item, ['client', 'name'])
        const market = _.get(item, ['market', 'name'])
        const paymentDate = moment(_.get(item, 'paymentDate'))
        const now = moment()
        const user = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName']) || 'N/A'
        const dateDelivery = dateFormat((_.get(item, 'dateDelivery')), '')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY HH:MM')
        const totalBalance = _.toInteger(_.get(item, 'totalBalance'))
        const balanceTooltip = numberFormat(totalBalance, currentCurrency)
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), currentCurrency)
        const status = _.toInteger(_.get(item, 'status'))
        const isNew = _.get(item, 'isNew')
        const REQUESTED = 0
        const PAY_PENDING = 'Оплата ожидается: ' +
                            paymentDate.locale('ru').format('DD MMM YYYY') +
                            '<br/>Ожидаемый платеж: ' + balanceTooltip

        const PAY_DELAY = 'Оплата ожидалась: ' +
                            paymentDate.locale('ru').format('DD MMM YYYY') +
                            '<br/>Долг: ' + balanceTooltip

        const READY = 1
        const GIVEN = 2
        const DELIVERED = 3
        const CANCELED = 4
        const ZERO = 0
        return (
            <div className={isNew ? classes.listWrapperNew : classes.listWrapper} key={id}>
                <Link className={classes.openDetails} to={{
                    pathname: sprintf(ROUTES.ORDER_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                </Link>
                <div style={{width: '10%'}}>{id}</div>
                <div style={{width: '17.5%'}}>{client}</div>
                <div style={{width: '17.5%'}}>{market}</div>
                <div style={{width: '10%'}}>{user}</div>
                <div style={{width: '15%', textAlign: 'right'}}>{totalPrice}</div>
                <div style={{width: '15%'}}>{dateDelivery}</div>
                <div style={{width: '15%'}}>{createdDate}</div>
                <div style={{width: '5%'}} className={classes.buttons}>
                    {(status === REQUESTED) ? <Tooltip position="bottom" text="В процессе">
                        <IconButton
                            disableTouchRipple={true}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}>
                            <InProcess color="#f0ad4e"/>
                        </IconButton>
                    </Tooltip>
                        : (status === READY) ? <Tooltip position="bottom" text="Есть на складе">
                            <IconButton
                                disableTouchRipple={true}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}>
                                <Available color="#f0ad4e"/>
                            </IconButton>
                        </Tooltip>

                            : (status === DELIVERED) ? <Tooltip position="bottom" text="Доставлен">
                                <IconButton
                                    disableTouchRipple={true}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    touch={true}>
                                    <Delivered color="#81c784"/>
                                </IconButton>
                            </Tooltip>
                                : (status === GIVEN) ? <Tooltip position="bottom" text="Передан доставщику">
                                    <IconButton
                                        disableTouchRipple={true}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        touch={true}>
                                        <Transfered color="#f0ad4e"/>
                                    </IconButton>
                                </Tooltip>
                                    : <Tooltip position="bottom" text="Заказ отменен">
                                        <IconButton
                                            disableTouchRipple={true}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            touch={true}>
                                            <Canceled color='#e57373'/>
                                        </IconButton>
                                    </Tooltip>
                    }
                    {!(status === CANCELED) &&
                    <Tooltip position="bottom" text={(totalBalance > ZERO) && ((paymentDate.diff(now, 'days') <= ZERO))
                        ? PAY_DELAY
                        : (totalBalance > ZERO) && ((paymentDate.diff(now, 'days') > ZERO))
                            ? PAY_PENDING
                            : 'Оплачено'}>
                        <IconButton
                            disableTouchRipple={true}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}>
                            <Payment color={(totalBalance > ZERO) && ((paymentDate.diff(now, 'days') <= ZERO))
                                ? '#e57373'
                                : (totalBalance > ZERO) && ((paymentDate.diff(now, 'days') > ZERO))
                                    ? '#B7BBB7'
                                    : '#81c784'
                            }/>
                        </IconButton>
                    </Tooltip>
                    }
                </div>
            </div>
        )
    })

    const list = {
        header: listHeader,
        list: orderList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.ORDER_LIST_URL}/>

            {false && <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить заказ">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>}

            <GridList
                filter={filter}
                list={list}
                detail={orderDetail}
                withoutRow={true}
                withInvoice={true}
                filterDialog={orderFilterDialog}
                printDialog={printDialog}
                refreshAction={refreshAction}
            />

            <OrderCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                createClientDialog={createClientDialog}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
                shortageDialog={shortageDialog}
                products={products}
            />

            <OrderShortageDialog
                products={products}
                open={shortageDialog.openShortageDialog}
                loading={shortageDialog.shortageLoading}
                onClose={shortageDialog.handleCloseShortageDialog}
                onSubmit={shortageDialog.handleSubmitShortageDialog}
            />

            <OrderCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <ClientCreateDialog
                open={createClientDialog.openCreateClientDialog}
                initialValues={createClientDialog.initialValues}
                loading={createClientDialog.createClientLoading}
                onClose={createClientDialog.handleCloseCreateClientDialog}
                onSubmit={createClientDialog.handleSubmitCreateClientDialog}
            />

            {detailData.data && <ConfirmDialog
                type="cancel"
                message={'Заказ № ' + _.get(detailData, ['data', 'id'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

OrderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    paymentData: PropTypes.object,
    returnListData: PropTypes.object,
    products: PropTypes.array,
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    }),
    detailData: PropTypes.object,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    transactionsDialog: PropTypes.shape({
        openTransactionsDialog: PropTypes.bool.isRequired,
        handleOpenTransactionsDialog: PropTypes.func.isRequired,
        handleCloseTransactionsDialog: PropTypes.func.isRequired
    }).isRequired,
    itemReturnDialog: PropTypes.shape({
        returnDialogLoading: PropTypes.bool.isRequired,
        openOrderItemReturnDialog: PropTypes.bool.isRequired,
        handleOpenItemReturnDialog: PropTypes.func.isRequired,
        handleCloseItemReturnDialog: PropTypes.func.isRequired
    }).isRequired,
    returnDialog: PropTypes.shape({
        returnLoading: PropTypes.bool.isRequired,
        openReturnDialog: PropTypes.bool.isRequired,
        handleOpenReturnDialog: PropTypes.func.isRequired,
        handleCloseReturnDialog: PropTypes.func.isRequired
    }).isRequired,
    shortageDialog: PropTypes.shape({
        shortageLoading: PropTypes.bool.isRequired,
        openShortageDialog: PropTypes.bool.isRequired,
        handleOpenShortageDialog: PropTypes.func.isRequired,
        handleCloseShortageDialog: PropTypes.func.isRequired
    }).isRequired,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    createClientDialog: PropTypes.shape({
        createClientLoading: PropTypes.bool.isRequired,
        openCreateClientDialog: PropTypes.bool.isRequired,
        handleOpenCreateClientDialog: PropTypes.func.isRequired,
        handleCloseCreateClientDialog: PropTypes.func.isRequired,
        handleSubmitCreateClientDialog: PropTypes.func.isRequired
    }).isRequired,
    getDocument: PropTypes.shape({
        handleGetDocument: PropTypes.func.isRequired
    }),
    returnDataLoading: PropTypes.bool,
    printDialog: PropTypes.shape({
        openPrint: PropTypes.bool.isRequired,
        handleOpenPrintDialog: PropTypes.func.isRequired,
        handleClosePrintDialog: PropTypes.func.isRequired
    }).isRequired,
    cancelOrderReturnDialog: PropTypes.shape({
        handleOpenCancelOrderReturnDialog: PropTypes.func.isRequired,
        handleCloseCancelOrderReturnDialog: PropTypes.func.isRequired,
        handleSubmitCancelOrderReturnDialog: PropTypes.func.isRequired,
        openCancelOrderReturnDialog: PropTypes.number.isRequired
    }).isRequired
}

export default OrderGridList
