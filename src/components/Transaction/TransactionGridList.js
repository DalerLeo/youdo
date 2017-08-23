import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import Tooltip from '../ToolTip'
import GridList from '../GridList'
import Container from '../Container'
import TransactionFilterForm from './TransactionFilterForm'
import TransactionCreateDialog from './TransactionCreateDialog'
import TransactionSendDialog from './TransactionSendDialog'
import TransactionCashDialog from './TransactionCashDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Paper from 'material-ui/Paper'
import CashPayment from '../CashPayment'
import BankPayment from '../BankPayment'
import CircularProgress from 'material-ui/CircularProgress'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Edit from 'material-ui/svg-icons/image/edit'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import toBoolean from '../../helpers/toBoolean'

const enhance = compose(
    injectSheet({
        wrap: {
            display: 'flex',
            margin: '0 -28px',
            padding: '0 28px 0 0',
            minHeight: 'calc(100% - 72px)'
        },
        listWrapper: {
            border: '1px solid #d9dde1',
            borderBottom: 'none',
            height: '100%'
        },
        leftSide: {
            flexBasis: '20%'
        },
        rightSide: {
            flexBasis: '80%',
            marginLeft: '28px'
        },
        list: {
            borderBottom: '1px solid #efefef',
            display: 'flex',
            padding: '20px 30px',
            margin: '0',
            cursor: 'pointer',
            justifyContent: 'space-between',
            position: 'relative'
        },
        flex: {
            display: 'flex',
            alignItems: 'center'
        },
        outerTitle: {
            extend: 'flex',
            height: '40px',
            justifyContent: 'space-between',
            fontWeight: '600',
            paddingBottom: '10px',
            paddingTop: '5px',
            '& a': {
                padding: '2px 10px',
                border: '1px solid',
                borderRadius: '2px',
                marginLeft: '12px'
            }
        },
        balance: {
            textAlign: 'right',
            position: 'absolute',
            right: '30px'
        },
        btnSend: {
            color: '#12aaeb !important'
        },
        btnAdd: {
            color: '#8acb8d !important'
        },
        btnRemove: {
            color: '#e57373 !important'
        },
        buttons: {
            display: 'flex',
            alignItems: 'center'
        },
        title: {
            fontWeight: '600',
            '& span': {
                fontSize: '11px !important',
                display: 'block',
                color: '#999'
            }
        },
        rightTitle: {
            extend: 'flex',
            height: '40px',
            justifyContent: 'space-between'
        },
        green: {
            color: '#92ce95 !important'
        },
        red: {
            color: '#e57373 !important'
        },
        label: {
            fontWeight: '600'
        },
        actionButtons: {
            pointerEvents: 'none',
            opacity: '0.4'
        },
        rows: {
            '& > div': {
                padding: '0 5px'
            }
        }
    }),
)

const ZERO = 0
const TransactionGridList = enhance((props) => {
    const {
        filter,
        createExpenseDialog,
        createIncomeDialog,
        updateExpenseDialog,
        updateIncomeDialog,
        createSendDialog,
        filterDialog,
        cashboxData,
        cashboxListLoading,
        confirmDialog,
        listData,
        acceptCashDialog,
        detailData,
        cashBoxDialog,
        classes,
        paymentData
    } = props

    const transactionFilterDialog = (
        <TransactionFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const transactionDetail = (
        <span>a</span>
    )
    const AllCashboxId = 0
    const selectedCashbox = _.find(_.get(cashboxData, 'data'),
        (o) => {
            return _.toInteger(o.id) === _.toInteger(_.get(cashboxData, 'cashboxId'))
        })
    const cashboxName = _.get(cashboxData, 'cashboxId') === AllCashboxId ? 'Общий объем' : _.get(selectedCashbox, 'name')
    const currentCashbox = _.get(cashboxData, 'cashboxId')
    const showCashbox = !toBoolean(currentCashbox && currentCashbox !== ZERO)

    const listHeader = [
        {
            sorting: true,
            name: 'id',
            title: 'Id',
            xs: '10%'
        },
        {
            sorting: true,
            name: 'client',
            title: showCashbox ? 'Касса' : 'Клиент',
            xs: '22%'
        },
        {
            sorting: true,
            name: 'comment',
            title: 'Описание',
            xs: '30%'
        },
        {
            sorting: true,
            name: 'date',
            title: 'Дата',
            xs: '18%'
        },
        {
            sorting: true,
            name: 'amount',
            alignRight: true,
            title: 'Сумма',
            xs: '15%'
        }
    ]

    const transactionList = _.map(_.get(listData, 'data'), (item) => {
        const zero = 0
        const id = _.get(item, 'id')
        const comment = _.get(item, 'comment')
        const type = _.get(item, 'amount') || 'N/A'
        const cashbox = _.get(item, 'cashbox') || 'N/A'
        const user = _.get(item, 'user')
        const amount = numberFormat(_.get(item, 'amount')) || 'N/A'
        const createdDate = dateFormat(_.get(item, 'createdDate'), true)
        const currentCurrency = _.get(_.find(_.get(cashboxData, 'data'), {'id': cashbox}), ['currency', 'name'])
        const client = showCashbox ? _.get(_.find(_.get(cashboxData, 'data'), {'id': cashbox}), 'name') : null
        const clientName = _.get(item, ['client', 'name']) || 'Не указан'
        const expanseCategory = _.get(item, ['expanseCategory', 'name'])

        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id} className={classes.rows}>
                <div style={{flexBasis: '10%', maxWidth: '10%'}}>{id}</div>
                <div style={{flexBasis: '22%', maxWidth: '24%'}}>
                    {client}
                    {!showCashbox ? <div><span className={classes.label}>Клиент: </span>{clientName}</div> : null}
                </div>
                <div style={{flexBasis: '30%', maxWidth: '30%'}}>
                    {expanseCategory ? <div><span className={classes.label}>Категория: </span> {expanseCategory}</div>
                        : ((!_.get(item, 'expanseCategory') && !_.get(item, 'client') && user) ? 'Оплата с ' + _.get(user, 'firstName') + ' ' + _.get(user, 'secondName') : null)}
                    <div>{comment}</div>
                </div>
                <div style={{flexBasis: '18%', maxWidth: '18%'}}>{createdDate}</div>
                <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}
                     className={type >= zero ? classes.green : classes.red}>
                    {amount} {currentCurrency}
                </div>
                <div style={{flexBasis: '5%', maxWidth: '5%', textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        menuItemStyle={{fontSize: '13px'}}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText="Изменить"
                            disabled={true}
                            leftIcon={<Edit />}
                            onTouchTap={() => {
                                updateExpenseDialog.handleOpenUpdateDialog(id, _.get(item, 'amount'))
                            }}
                        />
                        <MenuItem
                            primaryText="Удалить "
                            disabled={true}
                            leftIcon={<DeleteIcon />}
                            onTouchTap={() => {
                                confirmDialog.handleOpenConfirmDialog(id)
                            }}
                        />
                    </IconMenu>
                </div>
            </Row>
        )
    })
    const cashboxList = _.map(_.get(cashboxData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const currency = _.get(item, ['currency', 'name'])
        const type = _.toInteger(_.get(item, 'type'))
        const balance = _.toInteger(_.get(item, 'balance'))
        const isActive = item.id === _.get(cashboxData, 'cashboxId')
        const BANK_ID = 1
        const ZERO_NUM = 0
        return (
            <div key={id} className={classes.list} onClick={() => {
                cashboxData.handleClickCashbox(id)
            } }
                 style={isActive ? {backgroundColor: '#ffffff'} : {backgroundColor: '#f2f5f8'}}>
                <div>
                    <div className={classes.title}>{name}</div>
                    <div className={item.id === cashboxData.cashboxId}>
                        {type === BANK_ID
                            ? <div className={classes.flex}>
                                <BankPayment style={{height: '14px', width: '14px', color: '#6261b0'}}/>
                                <span style={{marginLeft: '5px', color: '#6261b0'}}>банковский счет</span>
                            </div>
                            : <div className={classes.flex}>
                                <CashPayment style={{height: '14px', width: '14px', color: '#12aaeb'}}/>
                                <span style={{marginLeft: '5px', color: '#12aaeb'}}>наличные</span>
                            </div>
                        }
                    </div>
                </div>
                <div className={classes.balance}>
                    <div className={balance >= ZERO_NUM ? classes.green : classes.red}>{numberFormat(balance)}</div>
                    <div>{currency}</div>
                </div>
            </div>
        )
    })

    const list = {
        header: listHeader,
        list: transactionList,
        loading: _.get(listData, 'listLoading')
    }
    return (
        <Container>
            <SubMenu url={ROUTES.TRANSACTION_LIST_URL}/>

            <div className={classes.wrap}>
                <div className={classes.leftSide}>
                    <div className={classes.outerTitle} style={{paddingLeft: '30px'}}>
                        <div>Кассы</div>
                    </div>
                    <Paper zDepth={2} style={{height: '100%'}}>
                        <div className={classes.listWrapper}>
                            <div className={classes.list}
                                 onClick={() => {
                                     cashboxData.handleClickCashbox(AllCashboxId)
                                 } }
                                 style={_.get(cashboxData, 'cashboxId') === AllCashboxId ? {backgroundColor: '#ffffff'} : {backgroundColor: '#f2f5f8'}}>
                                <div className={classes.title}>
                                    Общий объем
                                    <span>во всех кассах</span>
                                </div>
                            </div>
                            {cashboxListLoading
                                ? <div style={{textAlign: 'center'}}>
                                    <CircularProgress size={40} thickness={4}/>
                                </div>
                                : cashboxList
                            }
                        </div>
                    </Paper>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.rightTitle}>
                        <div className={classes.outerTitle}>{cashboxName}</div>
                        <div className={classes.outerTitle}>
                            <div className={classes.buttons}>
                                <a onClick={acceptCashDialog.handleOpenCashDialog} className={classes.btnSend}>Принять наличные</a>

                                { _.get(cashboxData, 'cashboxId') === AllCashboxId &&
                                    <Tooltip position="bottom" text="Пожалуйста выберите кассу">
                                        <div className={classes.actionButtons}>
                                        <a onClick={createSendDialog.handleOpenDialog} className={classes.btnSend}>Перевод</a>
                                        <a onClick={createIncomeDialog.handleOpenDialog} className={classes.btnAdd}>+ Доход</a>
                                        <a onClick={createExpenseDialog.handleOpenDialog} className={classes.btnRemove}>- Расход</a>
                                        </div>
                                    </Tooltip>
                                }
                                { _.get(cashboxData, 'cashboxId') !== AllCashboxId &&
                                    <div>
                                        <a onClick={createSendDialog.handleOpenDialog} className={classes.btnSend}>Перевод</a>
                                        <a onClick={createIncomeDialog.handleOpenDialog} className={classes.btnAdd}>+ Доход</a>
                                        <a onClick={createExpenseDialog.handleOpenDialog} className={classes.btnRemove}>- Расход</a>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <GridList
                        filter={filter}
                        withoutRow={true}
                        list={list}
                        detail={transactionDetail}
                        filterDialog={transactionFilterDialog}
                    />

                    <TransactionCreateDialog
                        isExpense={true}
                        cashboxData={cashboxData}
                        open={createExpenseDialog.open}
                        loading={createExpenseDialog.loading}
                        onClose={createExpenseDialog.handleCloseDialog}
                        onSubmit={createExpenseDialog.handleSubmitDialog}
                    />

                    <TransactionCreateDialog
                        cashboxData={cashboxData}
                        open={createIncomeDialog.open}
                        loading={createIncomeDialog.loading}
                        onClose={createIncomeDialog.handleCloseDialog}
                        onSubmit={createIncomeDialog.handleSubmitDialog}
                    />

                    <TransactionCreateDialog
                        initialValues={updateExpenseDialog.initialValues}
                        isUpdate={true}
                        isExpense={true}
                        cashboxData={cashboxData}
                        open={updateExpenseDialog.open}
                        loading={updateExpenseDialog.loading}
                        onClose={updateExpenseDialog.handleCloseUpdateDialog}
                        onSubmit={updateExpenseDialog.handleSubmitUpdateDialog}
                    />

                    <TransactionCreateDialog
                        initialValues={updateIncomeDialog.initialValues}
                        isUpdate={true}
                        cashboxData={cashboxData}
                        open={updateIncomeDialog.open}
                        loading={updateIncomeDialog.loading}
                        onClose={updateIncomeDialog.handleCloseUpdateDialog}
                        onSubmit={updateIncomeDialog.handleSubmitUpdateDialog}
                    />

                    <TransactionSendDialog
                        cashboxData={cashboxData}
                        open={createSendDialog.open}
                        loading={createSendDialog.loading}
                        onClose={createSendDialog.handleCloseDialog}
                        onSubmit={createSendDialog.handleSubmitDialog}
                    />

                    {detailData.data && <ConfirmDialog
                        type="delete"
                        message={_.get(detailData, ['data', 'comment'])}
                        onClose={confirmDialog.handleCloseConfirmDialog}
                        onSubmit={confirmDialog.handleExpenseConfirmDialog}
                        open={confirmDialog.open}
                    />}

                    <TransactionCashDialog
                        open={acceptCashDialog.open}
                        onClose={acceptCashDialog.handleCloseCashDialog}
                        paymentData={paymentData}
                        loading={acceptCashDialog.loading}
                        cashBoxDialog={cashBoxDialog}
                        acceptCashDialog={acceptCashDialog}
                    />
                </div>
            </div>
        </Container>
    )
})

TransactionGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    cashboxData: PropTypes.object,
    paymentData: PropTypes.object,
    cashboxListLoading: PropTypes.bool,
    detailData: PropTypes.object,
    createExpenseDialog: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        handleOpenDialog: PropTypes.func.isRequired,
        handleCloseDialog: PropTypes.func.isRequired,
        handleSubmitDialog: PropTypes.func.isRequired
    }).isRequired,
    createIncomeDialog: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        handleOpenDialog: PropTypes.func.isRequired,
        handleCloseDialog: PropTypes.func.isRequired,
        handleSubmitDialog: PropTypes.func.isRequired
    }).isRequired,
    updateExpenseDialog: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    updateIncomeDialog: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    createSendDialog: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        handleOpenDialog: PropTypes.func.isRequired,
        handleCloseDialog: PropTypes.func.isRequired,
        handleSubmitDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleExpenseConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    cashBoxDialog: PropTypes.shape({
        openCashBoxDialog: PropTypes.bool.isRequired,
        handleOpenCashBoxDialog: PropTypes.func.isRequired,
        handleCloseCashBoxDialog: PropTypes.func.isRequired,
        handleSubmitCashBoxDialog: PropTypes.func.isRequired
    }).isRequired,
    acceptCashDialog: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpenCashDialog: PropTypes.func.isRequired,
        handleCloseCashDialog: PropTypes.func.isRequired,
        handleSubmitCashDialog: PropTypes.func.isRequired
    }).isRequired
}

export default TransactionGridList
