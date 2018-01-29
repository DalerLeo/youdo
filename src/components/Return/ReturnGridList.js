import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ReturnDetails from './ReturnDetails'
import * as ROUTES from '../../constants/routes'
import ReturnCreateDialog from './ReturnCreateDialog'
import GridList from '../GridList'
import Container from '../Container'
import ReturnFilterForm from './ReturnFilterForm'
import OrderReturnStatusIcons from './OrderReturnStatusIcons'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import toBoolean from '../../helpers/toBoolean'
import ToolTip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateTimeFormat'
import ReturnUpdateDialog from '../Order/OrderReturnDialog'
import AddProductsDialog from '../Order/OrderAddProductsDialog'
import Print from 'material-ui/svg-icons/action/print'
import t from '../../helpers/translate'
import getConfig from '../../helpers/getConfig'
import {
    ORDER_RETURN_COMPLETED
} from '../../constants/backendConstants'

const canReturnFromCLient = toBoolean(getConfig('CAN_RETURN_FROM_CLIENT'))
const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: t('Возврат'),
        width: '10%'
    },
    {
        sorting: false,
        name: 'client',
        title: t('От кого'),
        width: '15%'
    },
    {
        sorting: true,
        name: 'order',
        title: t('Заказ'),
        width: '10%'
    },
    {
        sorting: false,
        name: 'stock',
        title: t('Склад'),
        width: '15%'
    },
    {
        sorting: false,
        name: 'user',
        title: t('Добавил'),
        width: '15%'
    },
    {
        sorting: true,
        name: 'createdDate',
        title: t('Дата возврата'),
        width: '15%'
    },
    {
        sorting: true,
        name: 'totalPrice',
        alignRight: true,
        title: t('Сумма возврата'),
        width: '15%'
    },
    {
        sorting: false,
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
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            position: 'relative',
            '& > div': {
                padding: '0 0.5rem !important'
            }
        },
        listWithCheckbox: {
            marginLeft: '-50px !important',
            paddingLeft: '50px !important'
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
        filterDialog,
        getDocument,
        confirmDialog,
        listData,
        detailData,
        classes,
        printDialog,
        updateDialog,
        cancelReturnDialog,
        createDialog,
        isAdmin,
        canChangeAnyReturn,
        hasMarket,
        addProductDialog
    } = props

    const showCheckboxes = toBoolean(_.get(filter.getParams(), 'showCheckboxes'))
    const orderFilterDialog = (
        <ReturnFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
            hasMarket={hasMarket}/>
    )
    const orderDetail = (
        <ReturnDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            getDocument={getDocument}
            updateDialog={updateDialog}
            confirmDialog={confirmDialog}
            canChangeAnyReturn={canChangeAnyReturn}
            loading={_.get(detailData, 'detailLoading')}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
            cancelReturnDialog={cancelReturnDialog}
            isAdmin={isAdmin}
            hasMarket={hasMarket}
        />
    )
    const CLIENT_RETURN = 2
    const returnType = _.toInteger(_.get(detailData, ['data', 'type']))
    const detStatus = _.toInteger(_.get(detailData, ['data', 'status']))

    const orderList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name']) || '-'
        const order = _.get(item, 'order') || '-'
        const stock = _.get(item, ['stock', 'name'])
        const currentCurrency = _.get(item, ['currency', 'name'])
        const user = _.get(item, ['createdBy', 'firstName']) + ' ' + _.get(item, ['createdBy', 'secondName']) || 'N/A'
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), currentCurrency)
        const status = _.toInteger(_.get(item, 'status'))

        return (
            <div className={classes.listWrapper + ' ' + (showCheckboxes ? classes.listWithCheckbox : '')} key={id}>
                <div style={{width: '10%'}}>{id}</div>
                <div style={{width: '15%'}}>{client}</div>
                <div style={{width: '10%'}}>{order}</div>
                <Link className={classes.openDetails} to={{
                    pathname: sprintf(ROUTES.RETURN_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                </Link>
                <div style={{width: '15%'}}>{stock}</div>
                <div style={{width: '15%'}}>{user}</div>
                <div style={{width: '15%'}}>{createdDate}</div>
                <div style={{width: '15%', textAlign: 'right'}}>{totalPrice}</div>
                <div style={{width: '5%'}}>
                    <div className={classes.buttons}>
                        <OrderReturnStatusIcons status={status}/>
                    </div>
                </div>
            </div>
        )
    })

    const list = {
        header: listHeader,
        list: orderList,
        loading: _.get(listData, 'listLoading')
    }
    const checkboxActions = (
        <div className={classes.buttons}>
            <ToolTip position="left" text={t('Распечатать накладные')}>
                <IconButton onTouchTap={printDialog.handleOpenPrintDialog}>
                    <Print color="#666"/>
                </IconButton>
            </ToolTip>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.RETURN_LIST_URL}/>
            {canChangeAnyReturn && canReturnFromCLient &&
            <div className={classes.addButtonWrapper}>
                <ToolTip position="left" text={t('Возврат с клиента')}>
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb"
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </ToolTip>
            </div>}

            <GridList
                filter={filter}
                list={list}
                detail={orderDetail}
                withInvoice={true}
                withoutRow={true}
                filterDialog={orderFilterDialog}
                printDialog={printDialog}
                withCheckboxes={true}
                activeCheckboxes={showCheckboxes}
                checkboxActions={checkboxActions}

            />

            {detailData.data &&
            <ConfirmDialog
                type="cancel"
                message={t('Заказ') + ' № ' + _.get(detailData, ['data', 'id'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
            <ReturnCreateDialog
                open={_.get(createDialog, 'openCreateDialog')}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
                hasMarket={hasMarket}
                handleOpenAddProduct={addProductDialog.handleOpenAddProduct}
            />
            {(returnType === CLIENT_RETURN)
                ? (isAdmin &&
                    <ReturnCreateDialog
                        isUpdate={true}
                        editOnlyCost={detStatus === ORDER_RETURN_COMPLETED}
                        name={_.get(detailData, ['data', 'client', 'name'])}
                        initialValues={updateDialog.initialValues}
                        loading={updateDialog.updateLoading}
                        open={updateDialog.openUpdateDialog}
                        onClose={updateDialog.handleCloseUpdateDialog}
                        onSubmit={updateDialog.handleSubmitUpdateDialog}
                        hasMarket={hasMarket}
                        handleOpenAddProduct={addProductDialog.handleOpenAddProduct}
                    />)
                : (isAdmin &&
                    <ReturnUpdateDialog
                        isUpdate={true}
                        orderData={_.get(detailData, 'data')}
                        initialValues={updateDialog.initialValues}
                        loading={updateDialog.updateLoading}
                        open={updateDialog.openUpdateDialog}
                        onClose={updateDialog.handleCloseUpdateDialog}
                        onSubmit={updateDialog.handleSubmitUpdateDialog}
                    />)}
            {addProductDialog.openAddProductDialog &&
            <AddProductsDialog
                open={addProductDialog.openAddProductDialog}
                loading={addProductDialog.loading}
                filter={addProductDialog.filter}
                data={addProductDialog.data}
                onClose={addProductDialog.handleCloseAddProduct}
                onSubmit={addProductDialog.handleSubmitAddProduct}
                initialValues={addProductDialog.initialValues}
                openAddProductConfirm={addProductDialog.openAddProductConfirm}
                handleCloseAddProductConfirm={addProductDialog.handleCloseAddProductConfirm}
                handleSubmitAddProductConfirm={addProductDialog.handleSubmitAddProductConfirm}
                withoutCustomPrice={true}
                isReturn={true}
            />}
        </Container>
    )
})

OrderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    getDocument: PropTypes.shape({
        handleGetDocument: PropTypes.func.isRequired
    }),
    printDialog: PropTypes.shape({
        openPrint: PropTypes.bool.isRequired,
        handleOpenPrintDialog: PropTypes.func.isRequired,
        handleClosePrintDialog: PropTypes.func.isRequired
    }).isRequired,
    cancelReturnDialog: PropTypes.shape({
        openCancelDialog: PropTypes.number.isRequired,
        handleOpenCancelReturnDialog: PropTypes.func.isRequired,
        handleCloseCancelReturnDialog: PropTypes.func.isRequired,
        handleSubmitCancelReturnDialog: PropTypes.func.isRequired
    }).isRequired,
    createDialog: PropTypes.shape({
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired
}

export default OrderGridList
