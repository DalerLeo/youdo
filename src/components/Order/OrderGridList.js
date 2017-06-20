import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import OrderFilterForm from './OrderFilterForm'
import OrderDetails from './OrderDetails'
import OrderCreateDialog from './OrderCreateDialog'
import DeleteDialog from '../DeleteDialog'
import ConfirmDialog from '../ConfirmDialog'
import ClientCreateDialog from '../Client/ClientCreateDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import MapsLocalShipping from 'material-ui/svg-icons/maps/local-shipping'
import Tooltip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import Home from 'material-ui/svg-icons/action/home'
import AccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet'
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off'
import moment from 'moment'
import CachedIcon from 'material-ui/svg-icons/action/cached'

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
        xs: '20%'
    },
    {
        sorting: true,
        name: 'user',
        title: 'Инициатор',
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
        name: 'totalCost',
        title: 'Сумма заказа',
        xs: '15%'
    },
    {
        sorting: true,
        name: 'createdDate',
        title: 'Дата создания',
        xs: '15%'
    },
    {
        sorting: true,
        name: 'acceptedCost',
        title: 'Статус',
        xs: '10%'
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
            justifyContent: 'flex-end'
        }
    })
)

const OrderGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        filterDialog,
        actionsDialog,
        getDocument,
        transactionsDialog,
        returnDialog,
        shortageDialog,
        confirmDialog,
        itemReturnDialog,
        deleteDialog,
        listData,
        detailData,
        paymentData,
        tabData,
        classes,
        createClientDialog
    } = props
    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon />
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <DeleteIcon />
            </IconButton>
        </div>
    )

    const orderFilterDialog = (
        <OrderFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )
    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 48,
            height: 48,
            padding: 0,
            zIndex: 0
        }
    }
    const orderDetail = (
        <OrderDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            returnData={_.get(detailData, 'return')}
            deleteDialog={deleteDialog}
            transactionsDialog={transactionsDialog}
            tabData={tabData}
            getDocument={getDocument}
            paymentData={paymentData}
            returnDialog={returnDialog}
            itemReturnDialog={itemReturnDialog}
            shortageDialog={shortageDialog}
            confirmDialog={confirmDialog}
            loading={_.get(detailData, 'detailLoading')}
            handleOpenUpdateDialog={updateDialog.handleOpenUpdateDialog}
        />
    )
    const orderList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name'])
        const user = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName']) || 'N/A'
        const dateDelivery = _.get(item, 'dateDelivery') || 'N/A'
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY HH:MM')
        const totalBalance = _.toInteger(_.get(item, 'totalBalance'))
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), 'SUM')
        const status = _.toInteger(_.get(item, 'status'))
        const REQUESTED = 0
        const READY = 1
        const DELIVERED = 2
        const ZERO = 0
        return (
        <div style={{width: '100%', display: 'flex', alignItems: 'center'}} key={id}>
            <div style={{width: '10%'}}>
                {id}
            </div>
            <div style={{width: '20%'}}>
                <Link to={{
                    pathname: sprintf(ROUTES.ORDER_ITEM_PATH, id),
                    query: filter.getParams()
                }}>{client}</Link>
            </div>
            <div style={{width: '15%'}}>
                {user}
            </div>
            <div style={{width: '15%'}}>
                {dateDelivery}
            </div>
            <div style={{width: '15%'}}>
                {totalPrice}
            </div>
            <div style={{width: '15%'}}>
                {createdDate}
            </div>
            <div style={{width: '10%'}} className={classes.buttons}>
                {(status === REQUESTED) ? <Tooltip position="bottom" text="В процессе">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}>
                            <CachedIcon color="#666"/>
                        </IconButton>
                    </Tooltip>
                    : (status === READY) ? <Tooltip position="bottom" text="Есть на складе">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}>
                                <Home color="#81c784"/>
                            </IconButton>
                        </Tooltip>

                        : (status === DELIVERED) ? <Tooltip position="bottom" text="Забрали товар">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}>
                                <MapsLocalShipping color="#81c784" />
                            </IconButton>
                        </Tooltip>
                            : <Tooltip position="bottom" text="Заказ отменен">
                                <IconButton
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    touch={true}>
                                    <VisibilityOff color='#e57373'/>
                                </IconButton>
                            </Tooltip>
                }
               <Tooltip position="bottom" text="Есть долг">
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}>
                        <AccountBalanceWallet color={totalBalance > ZERO ? '#e57373' : '#4db6ac'}/>
                    </IconButton>
                </Tooltip>
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

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить заказ">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <GridList
                filter={filter}
                list={list}
                detail={orderDetail}
                withoutRow={true}
                actionsDialog={actions}
                filterDialog={orderFilterDialog}
            />

            <OrderCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                createClientDialog={createClientDialog}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
                shortageDialog={shortageDialog}
            />

            <OrderCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <DeleteDialog
                filter={filter}
                open={deleteDialog.openDeleteDialog}
                onClose={deleteDialog.handleCloseDeleteDialog}
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
    deleteDialog: PropTypes.shape({
        openDeleteDialog: PropTypes.bool.isRequired,
        handleOpenDeleteDialog: PropTypes.func.isRequired,
        handleCloseDeleteDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired,
    transactionsDialog: PropTypes.shape({
        transactionsLoading: PropTypes.bool.isRequired,
        openTransactionsDialog: PropTypes.bool.isRequired,
        handleOpenTransactionsDialog: PropTypes.func.isRequired,
        handleCloseTransactionsDialog: PropTypes.func.isRequired
    }).isRequired,
    itemReturnDialog: PropTypes.shape({
        returnLoading: PropTypes.bool.isRequired,
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
    })
}

export default OrderGridList
