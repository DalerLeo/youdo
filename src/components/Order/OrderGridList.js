import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {hashHistory, Link} from 'react-router'
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
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Badge from 'material-ui/Badge'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ToolTip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import Available from 'material-ui/svg-icons/action/store'
import InProcess from 'material-ui/svg-icons/device/access-time'
import NotConfirmed from 'material-ui/svg-icons/alert/warning'
import Print from 'material-ui/svg-icons/action/print'
import Excel from 'material-ui/svg-icons/action/assessment'
import GetRelease from 'material-ui/svg-icons/action/description'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import Done from 'material-ui/svg-icons/action/check-circle'
import RefreshIcon from 'material-ui/svg-icons/action/cached'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import toBoolean from '../../helpers/toBoolean'
import MenuItem from 'material-ui/MenuItem'
import IconMenu from 'material-ui/IconMenu'
import getConfig from '../../helpers/getConfig'
import checkPermission from '../../helpers/checkPermission'
import ApplicationCreateDialog from '../HR/Application/ApplicationCreateDialog'
import t from '../../helpers/translate'
import Payment from 'material-ui/svg-icons/action/credit-card'
import {
    ORDER_REQUESTED,
    ORDER_NOT_CONFIRMED,
    ORDER_READY,
    ZERO
} from '../../constants/backendConstants'

const SUM = 'SUM'
const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: t('Заказ') + ' №',
        width: '15%'
    },
    {
        sorting: false,
        name: 'client',
        title: t('Клиент'),
        width: '30%'
    },
    {
        sorting: true,
        name: 'totalPrice',
        alignRight: true,
        title: t('Сумма заказа'),
        width: '25%'
    },
    {
        sorting: true,
        name: 'createdDate',
        title: t('Дата создания'),
        width: '25%'
    },
    {
        sorting: false,
        title: t('Статус'),
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

const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 30,
        height: 30,
        padding: 5
    }
}

const OrderGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        multiUpdateDialog,
        filterDialog,
        getDocument,
        shortageDialog,
        products,
        confirmDialog,
        listData,
        detailData,
        tabData,
        classes,
        createClientDialog,
        printDialog,
        type,
        refreshAction,
        canChangeAnyPrice,
        handleSubmitDiscountDialog,
        handleSubmitSetZeroDiscountDialog,
        clientId,
        isSuperUser,
        getExcelDocument,
        releaseDialog,
        printSalesDialog,
        scrollValue,
        checkDeliveryDialog,
        servicesData,
        appCreateDialog,
        usersData,
        privilegeData
    } = props

    // CHECKING PERMISSIONS
    const canCreateOrder = checkPermission('add_order')
    const canEditOrder = checkPermission('change_order')

    const hasMarket = toBoolean(getConfig('MARKETS_MODULE'))
    const showCheckboxes = toBoolean(_.get(filter.getParams(), 'showCheckboxes'))
    const statusIsReady = _.get(filter.getParams(), 'status') && _.toNumber(_.get(filter.getParams(), 'status')) === ORDER_READY
    const statusIsRequested = _.get(filter.getParams(), 'status') && _.toNumber(_.get(filter.getParams(), 'status')) === ORDER_REQUESTED
    const statusIsUnconfirmed = _.get(filter.getParams(), 'status') && _.toNumber(_.get(filter.getParams(), 'status')) === ORDER_NOT_CONFIRMED
    const orderCounts = _.get(listData, 'orderCounts')
    const readyCount = _.get(orderCounts, 'readyCount')
    const requestedCount = _.get(orderCounts, 'requestedCount')
    const unconfirmedCount = _.get(orderCounts, 'unconfirmedCount')
    const orderCountsLoading = _.get(listData, 'orderCountsLoading')
    const orderFilterDialog = (
        <OrderFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
            hasMarket={hasMarket}/>
    )

    const orderDetail = (
        <OrderDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            filter={filter}
            tabData={tabData}
            getDocument={getDocument}
            confirmDialog={confirmDialog}
            loading={_.get(detailData, 'detailLoading')}
            updateDialog={updateDialog}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
            type={type}
            canChangeAnyPrice={canChangeAnyPrice}
            handleSubmitDiscountDialog={handleSubmitDiscountDialog}
            handleSubmitSetZeroDiscountDialog={handleSubmitSetZeroDiscountDialog}
            clientId={clientId}
            isSuperUser={isSuperUser}
            hasMarket={hasMarket}
            checkDeliveryDialog={checkDeliveryDialog}
        />
    )
    const iconButton = (
        <IconButton>
            <Print color="#666"/>
        </IconButton>
    )

    const orderList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name'])
        const currentCurrency = _.get(item, ['currency', 'name'])
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'), true)
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), currentCurrency)
        const paid = _.toInteger(_.get(item, 'paid'))
        const isNew = _.get(item, 'isNew')

        return (
            <div key={id}
                 className={(isNew ? classes.listWrapperNew : classes.listWrapper) + ' ' + (showCheckboxes ? classes.listWithCheckbox : '')}>
                <Link className={classes.openDetails} to={{
                    pathname: sprintf(ROUTES.ORDER_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                </Link>
                <div style={{width: '15%'}}>{id}</div>
                <div style={{width: '30%'}}>{client}</div>
                <div style={{width: '25%', textAlign: 'right'}}>{numberFormat(totalPrice, SUM)}</div>
                <div style={{width: '25%'}}>{createdDate}</div>
                <div style={{width: '5%'}} className={classes.buttons}>
                    <ToolTip position="left" text={paid ? 'Оплачено' : 'Не оплачено'}>
                        <IconButton
                            disableTouchRipple={true}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}>
                            <Payment color={paid ? '#81c784' : '#666'}/>
                        </IconButton>
                    </ToolTip>
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
        },
        badgeUnconfirmed: {
            top: 4,
            right: 4,
            width: 18,
            height: 18,
            fontSize: 9,
            fontWeight: 600,
            border: statusIsUnconfirmed ? 'none' : '1px #fff solid',
            background: statusIsUnconfirmed ? '#fff' : '#e57373',
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            zIndex: 1
        },
        iconUnconfirmed: {
            color: statusIsUnconfirmed ? '#81c784' : '#5d6474'
        }
    }

    const list = {
        header: listHeader,
        list: orderList,
        loading: _.get(listData, 'listLoading') || orderCountsLoading
    }

    const filterByReady = () => {
        return hashHistory.push(filter.createURL({status: ORDER_READY}))
    }
    const filterByRequested = () => {
        return hashHistory.push(filter.createURL({status: ORDER_REQUESTED}))
    }
    const filterByUnconfirmed = () => {
        return hashHistory.push(filter.createURL({status: ORDER_NOT_CONFIRMED}))
    }

    const extraButtons = (
        <div className={classes.buttons}>
            <ToolTip position="left" text={t('Обновить список')}>
                <IconButton
                    disabled={false}
                    onTouchTap={refreshAction}>
                    <RefreshIcon color="#5d6474"/>
                </IconButton>
            </ToolTip>

            {unconfirmedCount > ZERO && <ToolTip position="left" text={t('Отфильтровать по неподтвержденным заказам')}>
                <Badge
                    primary={true}
                    badgeContent={statusIsUnconfirmed ? <Done style={badgeStyle.iconUnconfirmed}/> : unconfirmedCount}
                    style={badgeStyle.wrapper}
                    badgeStyle={badgeStyle.badgeUnconfirmed}>
                    <IconButton
                        onTouchTap={filterByUnconfirmed}
                        iconStyle={badgeStyle.iconUnconfirmed}>
                        <NotConfirmed/>
                    </IconButton>
                </Badge>
            </ToolTip>}
            {requestedCount > ZERO && <ToolTip position="left" text={t('Отфильтровать по запрошенным заказам')}>
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
            </ToolTip>}
            {readyCount > ZERO && <ToolTip position="left" text={t('Отфильтровать по доступным заказам')}>
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
            </ToolTip>}
        </div>
    )

    const checkboxActions = (
        <div className={classes.buttons}>
            <ToolTip position="left" text="">
                <IconMenu
                    menuItemStyle={{fontSize: '13px'}}
                    iconButtonElement={iconButton}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem
                        primaryText={t('Распечатать накладные')}
                        onTouchTap={() => { printDialog.handleOpenPrintDialog() }}
                    />
                    <MenuItem
                        primaryText={t('Продажа товаров')}
                        onTouchTap={() => { printSalesDialog.handleOpenSalesPrintDialog() }}
                    />
                </IconMenu>
            </ToolTip>
            <ToolTip position="left" text={t('Скачать накладные')}>
                <IconButton onTouchTap={getExcelDocument}>
                    <Excel color="#666"/>
                </IconButton>
            </ToolTip>
            {canEditOrder &&
            <ToolTip position="left" text={t('Изменить выбранные заказы')}>
                <IconButton onTouchTap={multiUpdateDialog.handleOpenMultiUpdate}
                            disabled={multiUpdateDialog.cancelled}>
                    <Edit color="#666"/>
                </IconButton>
            </ToolTip>}
            {canEditOrder &&
            <ToolTip position="left" text={t('Сформировать Релиз')}>
                <IconButton onTouchTap={releaseDialog.handleOpenReleaseDialog}>
                    <GetRelease color="#666"/>
                </IconButton>
            </ToolTip>}
        </div>
    )

    const scrollData = {
        value: scrollValue,
        leftOffset: 'standart',
        rightOffset: 'standart'
    }
    return (
        <Container>
            <SubMenu url={ROUTES.ORDER_LIST_URL}/>
            {canCreateOrder &&
            <div className={classes.addButtonWrapper}>
                <ToolTip position="left" text={t('Добавить заказ')}>
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb"
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd/>
                    </FloatingActionButton>
                </ToolTip>
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
                scrollData={scrollData}
            />

            {createDialog.openCreateDialog &&
            <OrderCreateDialog
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
                servicesData={servicesData}
                openAppCreate={appCreateDialog.openAppCreateDialog}
                handleOpenAppCreateDialog={appCreateDialog.handleOpenDialog}
            />}

            {updateDialog.openUpdateDialog &&
            <OrderCreateDialog
                isUpdate={true}
                status={_.toInteger(_.get(detailData, ['data', 'status'])) || {}}
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
                servicesData={servicesData}
                openAppCreate={appCreateDialog.openAppCreateDialog}
                handleOpenAppCreateDialog={appCreateDialog.handleOpenDialog}
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
                onClose={multiUpdateDialog.handleCloseMultiUpdate}
                onSubmit={multiUpdateDialog.handleSubmitMultiUpdate}
            />
            <OrderReleaseDialog
                open={releaseDialog.openReleaseDialog}
                givenOrDelivery={releaseDialog.givenOrDelivery}
                onClose={releaseDialog.handleCloseReleaseDialog}
                onSubmit={releaseDialog.handleSubmitReleaseDialog}
            />

            {detailData.data && <ConfirmDialog
                type="cancel"
                message={t('Заказ') + '№ ' + _.get(detailData, ['data', 'id'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}

            {detailData.data && <ConfirmDialog
                type="submit"
                message={t('Отметить доставку')}
                onClose={checkDeliveryDialog.handleClose}
                onSubmit={checkDeliveryDialog.handleSubmit}
                open={checkDeliveryDialog.open}
            />}
            <ApplicationCreateDialog
                open={appCreateDialog.openAppCreateDialog}
                loading={appCreateDialog.createLoading}
                onClose={appCreateDialog.handleCloseDialog}
                onSubmit={appCreateDialog.handleSubmitDialog}
                openRecruiterList={appCreateDialog.openRecruiterList}
                setOpenRecruiterList={appCreateDialog.setOpenRecruiterList}
                usersData={usersData}
                privilegeData={privilegeData}
                initialValues={privilegeData.initial}
            />

        </Container>
    )
})

OrderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    paymentData: PropTypes.object,
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
    }).isRequired,
    addProductDialog: PropTypes.shape({
        openAddProductDialog: PropTypes.bool,
        filter: PropTypes.object,
        data: PropTypes.array,
        loading: PropTypes.bool,
        handleOpenAddProduct: PropTypes.func,
        handleCloseAddProduct: PropTypes.func,
        handleSubmitAddProduct: PropTypes.func,
        openAddProductConfirm: PropTypes.bool,
        handleCloseAddProductConfirm: PropTypes.func,
        handleSubmitAddProductConfirm: PropTypes.func
    })
}

export default OrderGridList
