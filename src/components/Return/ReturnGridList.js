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
import InProcess from 'material-ui/svg-icons/action/cached'
import DoneIcon from 'material-ui/svg-icons/action/done-all'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import ReturnDetails from './ReturnDetails'
import * as ROUTES from '../../constants/routes'
import ReturnCreateDialog from './ReturnCreateDialog'
import GridList from '../GridList'
import Container from '../Container'
import ReturnFilterForm from './ReturnFilterForm'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import getConfig from '../../helpers/getConfig'
import toBoolean from '../../helpers/toBoolean'
import Tooltip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateTimeFormat'
import ReturnUpdateDialog from '../Order/OrderReturnDialog'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: 'Возврат',
        width: '10%'
    },
    {
        sorting: false,
        name: 'client',
        title: 'От кого',
        width: '15%'
    },
    {
        sorting: true,
        name: 'order',
        title: 'Заказ',
        width: '10%'
    },
    {
        sorting: false,
        name: 'stock',
        title: 'Склад',
        width: '15%'
    },
    {
        sorting: false,
        name: 'user',
        title: 'Добавил',
        width: '15%'
    },
    {
        sorting: true,
        name: 'createdDate',
        title: 'Дата возврата',
        width: '15%'
    },
    {
        sorting: true,
        name: 'totalPrice',
        alignRight: true,
        title: 'Сумма возврата',
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
        isAdmin
    } = props

    const showCheckboxes = toBoolean(_.get(filter.getParams(), 'showCheckboxes'))
    const orderFilterDialog = (
        <ReturnFilterForm
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
        <ReturnDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            getDocument={getDocument}
            updateDialog={updateDialog}
            confirmDialog={confirmDialog}
            loading={_.get(detailData, 'detailLoading')}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
            cancelReturnDialog={cancelReturnDialog}
            isAdmin={isAdmin}
        />
    )
    const CLIENT_RETURN = 2
    const returnType = _.toInteger(_.get(detailData, ['data', 'type']))
    const detStatus = _.toInteger(_.get(detailData, ['data', 'status']))

    const PENDING = 0
    const IN_PROGRESS = 1
    const COMPLETED = 2
    const CANCELLED = 3
    const orderList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name']) || '-'
        const order = _.get(item, 'order') || '-'
        const stock = _.get(item, ['stock', 'name'])
        const currentCurrency = getConfig('PRIMARY_CURRENCY')
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
                        {(status === PENDING || status === IN_PROGRESS)
                            ? <Tooltip position="bottom" text="Ожидает">
                                <IconButton
                                    disableTouchRipple={true}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    touch={true}>
                                    <InProcess color="#f0ad4e"/>
                                </IconButton>
                            </Tooltip>
                            : (status === COMPLETED)
                                ? <Tooltip position="bottom" text="Завершен">
                                    <IconButton
                                        disableTouchRipple={true}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        touch={true}>
                                        <DoneIcon color="#81c784"/>
                                    </IconButton>
                                </Tooltip>
                                : (status === CANCELLED)
                                    ? <Tooltip position="bottom" text="Отменен">
                                        <IconButton
                                            disableTouchRipple={true}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            touch={true}>
                                            <Canceled color='#e57373'/>
                                        </IconButton>
                                    </Tooltip> : null
                        }
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

    return (
        <Container>
            <SubMenu url={ROUTES.RETURN_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Возврат с клиента">
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb"
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

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
            />

            {detailData.data && <ConfirmDialog
                type="cancel"
                message={'Заказ № ' + _.get(detailData, ['data', 'id'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
            <ReturnCreateDialog
                open={_.get(createDialog, 'openCreateDialog')}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />
            {(returnType === CLIENT_RETURN)
                ? (isAdmin && <ReturnCreateDialog
                    isUpdate={true}
                    editOnlyCost={detStatus === COMPLETED}
                    name={_.get(detailData, ['data', 'client', 'name'])}
                    initialValues={updateDialog.initialValues}
                    loading={updateDialog.updateLoading}
                    open={updateDialog.openUpdateDialog}
                    onClose={updateDialog.handleCloseUpdateDialog}
                    onSubmit={updateDialog.handleSubmitUpdateDialog}
                />)
                : (isAdmin && <ReturnUpdateDialog
                    isUpdate={true}
                    orderData={_.get(detailData, 'data')}
                    initialValues={updateDialog.initialValues}
                    loading={updateDialog.updateLoading}
                    open={updateDialog.openUpdateDialog}
                    onClose={updateDialog.handleCloseUpdateDialog}
                    onSubmit={updateDialog.handleSubmitUpdateDialog}
                />)}
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
