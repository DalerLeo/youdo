import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {Link, hashHistory} from 'react-router'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import OrderCreateDialog from './OrderCreateDialog'
import OrderMultiUpdateDialog from './OrderMultiUpdateDialog'
import OrderReleaseDialog from './OrderReleaseDialog'
import OrderFilterForm from './OrderFilterForm'
import OrderDetails from './OrderDetails'
import OrderShortageDialog from './OrderShortage'
import ConfirmDialog from '../ConfirmDialog'
import {connect} from 'react-redux'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import getConfig from '../../helpers/getConfig'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Badge from 'material-ui/Badge'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import Available from 'material-ui/svg-icons/action/store'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import Transferred from 'material-ui/svg-icons/maps/local-shipping'
import Delivered from 'material-ui/svg-icons/action/assignment-turned-in'
import Payment from 'material-ui/svg-icons/action/credit-card'
import InProcess from 'material-ui/svg-icons/device/access-time'
import Print from 'material-ui/svg-icons/action/print'
import Excel from 'material-ui/svg-icons/action/assessment'
import OpenInNew from 'material-ui/svg-icons/action/open-in-new'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import Done from 'material-ui/svg-icons/action/check-circle'
import RefreshIcon from 'material-ui/svg-icons/action/cached'
import dateFormat from '../../helpers/dateFormat'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import toBoolean from '../../helpers/toBoolean'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: 'Заказ №',
        width: '10%'
    },
    {
        sorting: false,
        name: 'client',
        title: 'Клиент',
        width: '17.5%'
    },
    {
        sorting: false,
        name: 'market',
        title: 'Магазин',
        width: '17.5%'
    },
    {
        sorting: false,
        name: 'user',
        title: 'Инициатор',
        width: '10%'
    },
    {
        sorting: true,
        name: 'totalPrice',
        alignRight: true,
        title: 'Сумма заказа',
        width: '15%'
    },
    {
        sorting: true,
        name: 'dateDelivery',
        title: 'Дата доставки',
        width: '15%'
    },
    {
        sorting: true,
        name: 'createdDate',
        title: 'Дата создания',
        width: '15%'
    },
    {
        sorting: false,
        title: 'Статус',
        width: '5%'
    }
]

const enhance = compose(
    injectSheet({
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
        listWithCheckbox: {
            marginLeft: '-50px !important',
            paddingLeft: '50px !important'
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
            alignItems: 'center',
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
    }),
    connect((state) => {
        const clientId = _.get(state, ['form', 'OrderCreateForm', 'values', 'client', 'value'])
        return {
            clientId
        }
    }),
)

const REQUESTED = 0
const READY = 1
const GIVEN = 2
const DELIVERED = 3
const CANCELED = 4

const OrderGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        multiUpdateDialog,
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
        printDialog,
        type,
        cancelOrderReturnDialog,
        refreshAction,
        canChangeAnyPrice,
        handleSubmitDiscountDialog,
        handleSubmitSetZeroDiscountDialog,
        clientId,
        isSuperUser,
        getExcelDocument,
        releaseDialog
    } = props

    const showCheckboxes = toBoolean(_.get(filter.getParams(), 'showCheckboxes'))
    const statusIsReady = _.toNumber(_.get(filter.getParams(), 'status')) === READY
    const statusIsRequested = _.toNumber(_.get(filter.getParams(), 'status')) === REQUESTED
    const orderCounts = _.get(listData, 'orderCounts')
    const readyCount = _.get(orderCounts, 'readyCount')
    const requestedCount = _.get(orderCounts, 'requestedCount')
    const orderCountsLoading = _.get(listData, 'orderCountsLoading')
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
            filter={filter}
            returnDataLoading={_.get(detailData, 'returnLoading')}
            transactionsDialog={transactionsDialog}
            tabData={tabData}
            getDocument={getDocument}
            paymentData={paymentData}
            returnListData={returnListData}
            returnDialog={returnDialog}
            itemReturnDialog={itemReturnDialog}
            confirmDialog={confirmDialog}
            loading={_.get(detailData, 'detailLoading')}
            updateDialog={updateDialog}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
            cancelOrderReturnDialog={cancelOrderReturnDialog}
            type={type}
            canChangeAnyPrice={canChangeAnyPrice}
            handleSubmitDiscountDialog={handleSubmitDiscountDialog}
            handleSubmitSetZeroDiscountDialog={handleSubmitSetZeroDiscountDialog}
            clientId={clientId}
            isSuperUser={isSuperUser}
        />
    )
    const ZERO = 0
    const orderList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const currentCurrency = getConfig('PRIMARY_CURRENCY')
        const client = _.get(item, ['client', 'name'])
        const market = _.get(item, ['market', 'name'])
        const paymentDate = dateFormat(_.get(item, 'paymentDate'))
        const now = moment()
        const user = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName']) || 'N/A'
        const dateDelivery = dateFormat((_.get(item, 'dateDelivery')), '')
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'), true)
        const totalBalance = _.toNumber(_.get(item, 'totalBalance'))
        const balanceTooltip = numberFormat(totalBalance, currentCurrency)
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), currentCurrency)
        const status = _.toInteger(_.get(item, 'status'))
        const isNew = _.get(item, 'isNew')

        const PAY_PENDING = 'Оплата ожидается: ' +
            paymentDate +
            '<br/>Ожидаемый платеж: ' + balanceTooltip

        const PAY_DELAY = moment(_.get(item, 'paymentDate')).diff(now, 'days') !== ZERO ? 'Оплата ожидалась: ' +
            paymentDate +
            '<br/>Долг: ' + balanceTooltip : 'Оплата ожидается сегодня <br/>Долг: ' + balanceTooltip

        return (
            <div key={id}
                 className={(isNew ? classes.listWrapperNew : classes.listWrapper) + ' ' + (showCheckboxes ? classes.listWithCheckbox : '')}>
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
                                        <Transferred color="#f0ad4e"/>
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
                    <Tooltip position="bottom" text={(totalBalance > ZERO) && ((moment(_.get(item, 'paymentDate')).diff(now, 'days') <= ZERO))
                        ? PAY_DELAY
                        : ((totalBalance > ZERO) && moment(_.get(item, 'paymentDate')).diff(now, 'days') > ZERO)
                            ? PAY_PENDING
                            : totalBalance === ZERO ? 'Оплачено' : ''}>
                        <IconButton
                            disableTouchRipple={true}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}>
                            <Payment color={(totalBalance > ZERO) && ((moment(_.get(item, 'paymentDate')).diff(now, 'days') <= ZERO))
                                ? '#e57373'
                                : (totalBalance > ZERO) && ((moment(_.get(item, 'paymentDate')).diff(now, 'days') > ZERO))
                                    ? '#B7BBB7'
                                    : (totalBalance === ZERO ? '#81c784' : '#B7BBB7')
                            }/>
                        </IconButton>
                    </Tooltip>
                    }
                </div>
            </div>
        )
    })

    const badgeStyle = {
        wrapper: {
            padding: 0
        },
        badge: {
            top: 4,
            right: 4,
            width: 18,
            height: 18,
            fontSize: 9,
            fontWeight: 600,
            border: statusIsReady ? 'none' : '1px #fff solid',
            background: statusIsReady ? '#fff' : '#e57373',
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            zIndex: 1
        },
        icon: {
            color: statusIsReady ? '#81c784' : '#5d6474'
        },
        badgeRequested: {
            top: 4,
            right: 4,
            width: 18,
            height: 18,
            fontSize: 9,
            fontWeight: 600,
            border: statusIsRequested ? 'none' : '1px #fff solid',
            background: statusIsRequested ? '#fff' : '#e57373',
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            zIndex: 1
        },
        iconRequested: {
            color: statusIsRequested ? '#81c784' : '#5d6474'
        }
    }

    const list = {
        header: listHeader,
        list: orderList,
        loading: _.get(listData, 'listLoading') || orderCountsLoading
    }

    const filterByReady = () => {
        return hashHistory.push(filter.createURL({status: READY}))
    }
    const filterByRequested = () => {
        return hashHistory.push(filter.createURL({status: REQUESTED}))
    }

    const extraButtons = (
        <div className={classes.buttons}>
            <Tooltip position="left" text="Обновить список">
                <IconButton
                    disabled={false}
                    onTouchTap={refreshAction}>
                    <RefreshIcon color="#5d6474"/>
                </IconButton>
            </Tooltip>
            <Tooltip position="left" text="Отфильтровать по доступным заказам">
                <Badge
                    primary={true}
                    badgeContent={statusIsReady ? <Done style={badgeStyle.icon}/> : readyCount}
                    style={badgeStyle.wrapper}
                    badgeStyle={badgeStyle.badge}>
                    <IconButton
                        onTouchTap={filterByReady}
                        iconStyle={badgeStyle.icon}>
                        <Available/>
                    </IconButton>
                </Badge>
            </Tooltip>
            <Tooltip position="left" text="Отфильтровать по запрошенным заказам">
                <Badge
                    primary={true}
                    badgeContent={statusIsRequested ? <Done style={badgeStyle.iconRequested}/> : requestedCount}
                    style={badgeStyle.wrapper}
                    badgeStyle={badgeStyle.badgeRequested}>
                    <IconButton
                        onTouchTap={filterByRequested}
                        iconStyle={badgeStyle.iconRequested}>
                        <InProcess/>
                    </IconButton>
                </Badge>
            </Tooltip>
        </div>
    )

    const checkboxActions = (
        <div className={classes.buttons}>
            <Tooltip position="left" text="Распечатать накладные">
                <IconButton onTouchTap={printDialog.handleOpenPrintDialog}>
                    <Print color="#666"/>
                </IconButton>
            </Tooltip>
            <Tooltip position="left" text="Скачать Excel">
                <IconButton onTouchTap={getExcelDocument}>
                    <Excel color="#666"/>
                </IconButton>
            </Tooltip>
            <Tooltip position="left" text="Изменить выбранные заказы">
                <IconButton onTouchTap={multiUpdateDialog.handleOpenMultiUpdate}
                            disabled={multiUpdateDialog.cancelled}>
                    <Edit color="#666"/>
                </IconButton>
            </Tooltip>
            <Tooltip position="left" text="Сформироват Релиз">
                <IconButton onTouchTap={releaseDialog.handleOpenReleaseDialog}>
                    <OpenInNew color="#666"/>
                </IconButton>
            </Tooltip>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.ORDER_LIST_URL}/>

            {<div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить заказ">
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb"
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
                extraButtons={extraButtons}
                activeCheckboxes={showCheckboxes}
                withCheckboxes={true}
                checkboxActions={checkboxActions}
            />

            {createDialog.openCreateDialog && <OrderCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                createClientDialog={createClientDialog}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
                shortageDialog={shortageDialog}
                products={products}
                filter={filter}
                clientId={clientId}
                isSuperUser={isSuperUser}
            />}

            {updateDialog.openUpdateDialog && <OrderCreateDialog
                isUpdate={true}
                status={_.toInteger(_.get(detailData, ['data', 'status'])) || {}}
                canChangeAnyPrice={canChangeAnyPrice}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                editProductsLoading={updateDialog.editProductsLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
                products={products}
                shortageDialog={shortageDialog}
                filter={filter}
                clientId={clientId}
                isSuperUser={isSuperUser}
            />}

            <OrderShortageDialog
                products={products}
                open={shortageDialog.openShortageDialog}
                loading={shortageDialog.shortageLoading}
                onClose={shortageDialog.handleCloseShortageDialog}
                onSubmit={shortageDialog.handleSubmitShortageDialog}
            />

            <OrderMultiUpdateDialog
                open={multiUpdateDialog.openMultiUpdateDialog}
                givenOrDelivery={multiUpdateDialog.givenOrDelivery}
                cancelled={multiUpdateDialog.cancelled}
                loading={multiUpdateDialog.shortageLoading}
                onClose={multiUpdateDialog.handleCloseMultiUpdate}
                onSubmit={multiUpdateDialog.handleSubmitMultiUpdate}
            />
            <OrderReleaseDialog
                open={releaseDialog.openReleaseDialog}
                onClose={releaseDialog.handleCloseReleaseDialog}
                onSubmit={releaseDialog.handleSubmitReleaseDialog}
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
        handleOpenCreateClientDialog: PropTypes.func.isRequired
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
    }).isRequired,
    multiUpdateDialog: PropTypes.shape({
        openMultiUpdateDialog: PropTypes.bool.isRequired,
        handleOpenMultiUpdate: PropTypes.func.isRequired,
        handleCloseMultiUpdate: PropTypes.func.isRequired,
        handleSubmitMultiUpdate: PropTypes.func.isRequired
    }).isRequired,
    getExcelDocument: PropTypes.func.isRequired,
    releaseDialog: PropTypes.shape({
        openReleaseDialog: PropTypes.bool.isRequired,
        handleOpenReleaseDialog: PropTypes.func.isRequired,
        handleCloseReleaseDialog: PropTypes.func.isRequired,
        handleSubmitReleaseDialog: PropTypes.func.isRequired
    }).isRequired
}

export default OrderGridList
