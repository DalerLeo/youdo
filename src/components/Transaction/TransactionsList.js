import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import GridList from '../GridList'
import TransactionFilterForm from './TransactionFilterForm'
import TransactionCreateDialog from './TransactionCreateDialog'
import TransactionSendDialog from './TransactionSendDialog'
import TransactionCashDialog from './TransactionCashDialog'
import TransactionInfoDialog from './TransactionInfoDialog'
import TransactionsFormat from './TransactionsFormat'
import ConfirmDialog from '../ConfirmDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import toBoolean from '../../helpers/toBoolean'
import getConfig from '../../helpers/getConfig'
import moment from 'moment'
import {
    INCOME,
    OUTCOME,
    INCOME_TO_CLIENT,
    OUTCOME_FROM_CLIENT
} from '../../constants/transactionTypes'
const currentDay = new Date()
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
            width: '250px',
            minWidth: '250px'
        },
        rightSide: {
            width: 'calc(100% - 250px)',
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
        listRow: {
            display: 'flex',
            height: '100%',
            minHeight: '50px',
            alignItems: 'center',
            padding: '5px 30px',
            margin: '0 -30px',
            position: 'relative',
            overflow: 'hidden',
            '& > div': {
                padding: '0 8px !important'
            },
            '& a': {
                color: '#12aaeb !important'
            },
            '&:hover > div:last-child': {
                padding: '0 24px !important',
                opacity: '1',
                right: '0'
            }
        },
        deletedRow: {
            extend: 'listRow',
            background: '#fffafa',
            '& > div': {
                opacity: '0.6',
                '&:last-child': {
                    color: '#333 !important'
                }
            },
            '&:after': {
                position: 'absolute',
                content: '""',
                top: '0',
                left: '0',
                bottom: '0',
                width: '3px',
                background: '#e57373'
            }
        },
        actionButtons: {
            transition: 'all 150ms ease-out',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: '#fff',
            opacity: '0',
            right: '-20%',
            height: '100%',
            width: '20%'
        },
        clickable: {
            cursor: 'pointer',
            color: '#12aaeb !important',
            fontWeight: '600'
        }
    }),
)

const ZERO = 0
const TWO = 2
const TransactionsList = enhance((props) => {
    const {
        filter,
        filterItem,
        createExpenseDialog,
        createIncomeDialog,
        createSendDialog,
        filterDialog,
        cashboxData,
        confirmDialog,
        listData,
        acceptCashDialog,
        detailData,
        cashBoxDialog,
        classes,
        paymentData,
        transactionInfoDialog,
        superUser,
        showOnlyList,
        listShadow,
        hasRightCashbox,
        updateTransactionDialog
    } = props
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const transactionFilterDialog = showOnlyList
        ? (<div></div>)
        : (<TransactionFilterForm
                initialValues={filterDialog.initialValues}
                filter={filter}
                filterDialog={filterDialog}
            />)

    const transactionDetail = (
        <span>a</span>
    )
    const AllCashboxId = 0
    const selectedCashbox = _.find(_.get(cashboxData, 'data'), (o) => {
        return _.toInteger(o.id) === _.toInteger(_.get(cashboxData, 'cashboxId'))
    })

    const cashboxName = _.get(cashboxData, 'cashboxId') === AllCashboxId ? 'Общий объем' : _.get(selectedCashbox, 'name')
    const currentCashbox = _.get(cashboxData, 'cashboxId')
    const showCashbox = !toBoolean(currentCashbox && currentCashbox !== ZERO)

    const listHeader = [
        {
            sorting: true,
            name: 'id',
            title: '№',
            width: '10%'
        },
        {
            sorting: false,
            name: 'client',
            title: showCashbox ? 'Касса' : 'Клиент',
            width: '22%'
        },
        {
            sorting: false,
            name: 'comment',
            title: 'Описание',
            width: '30%'
        },
        {
            sorting: true,
            name: 'date',
            title: 'Дата',
            width: '18%'
        },
        {
            sorting: true,
            name: 'amount',
            alignRight: true,
            title: 'Сумма',
            width: '20%'
        }
    ]
    const iconStyle = {
        button: {
            width: 44,
            height: 44,
            padding: 3
        },
        icon: {
            color: '#666',
            width: 22,
            height: 22
        }
    }

    /* Getting currentItem for update purpose from openUpdateTransaction in URL */
    const currentTransaction = _.get(updateTransactionDialog, 'open')
    const currentItem = _.find(_.get(listData, 'data'), {'id': currentTransaction})

    /* Forming initial value in order to Update Transaction */
    const TransactionInitialValues = currentTransaction
        ? {
            cashbox: {
                value: _.get(currentItem, ['cashbox', 'id'])
            },
            amount: _.get(currentItem, 'amount'),
            date: _.get(currentItem, 'createdDate') ? moment(_.get(currentItem, 'createdDate')).toDate() : null,
            client: {
                value: _.get(currentItem, ['client', 'id'])
            },
            showClients: _.get(currentItem, ['client', 'id']) && true,
            custom_rate: _.get(currentItem, 'customRate'),
            comment: _.get(currentItem, 'comment'),
            expanseCategory: {
                value: _.get(currentItem, ['expanseCategory', 'id'])
            }
        }
        : null

    const transactionList = _.map(_.get(listData, 'data'), (item) => {
        const zero = 0
        const id = _.get(item, 'id')
        const comment = _.get(item, 'comment')
        const type = _.get(item, 'amount') || 'N/A'
        const cashbox = _.get(item, ['cashbox', 'id']) || 'N/A'
        const user = _.get(item, 'user')
        const order = _.get(item, 'order')
        const amount = _.toNumber(_.get(item, 'amount'))
        const internal = _.toNumber(_.get(item, 'internalAmount'))
        const date = dateFormat(_.get(item, 'date'), true)
        const currentCurrency = _.get(_.find(_.get(cashboxData, 'data'), {'id': cashbox}), ['currency', 'name'])
        const client = showCashbox ? _.get(_.find(_.get(cashboxData, 'data'), {'id': cashbox}), 'name') : null
        const clientName = _.get(item, ['client', 'name'])
        const expanseCategory = _.get(item, ['expanseCategory', 'name'])
        const transType = _.get(item, ['type'])
        const customRate = _.toNumber(_.get(item, 'customRate'))
        const rate = customRate > ZERO ? customRate : _.toInteger(amount / internal)
        const isDeleted = _.get(item, 'isDelete')
        const supply = _.get(item, 'supply')
        return (
            <div key={id} className={isDeleted ? classes.deletedRow : classes.listRow}>
                <div style={{flexBasis: '10%', maxWidth: '10%'}}>{id}</div>
                <div style={{flexBasis: '22%', maxWidth: '24%'}}>
                    {client}
                    {!showCashbox ? <div>{clientName || 'Не указан'}</div> : null}
                </div>
                <div style={{flexBasis: '30%', maxWidth: '30%'}}>
                    {expanseCategory
                        ? <div><span className={classes.label}>Категория: </span> {expanseCategory}</div> : ''}
                    {transType && <TransactionsFormat
                        handleClickAgentIncome={() => { transactionInfoDialog.handleOpenDialog(id) }}
                        type={transType}
                        order={order}
                        supply={supply}
                        client={_.get(item, 'client')}
                        user={user}/>
                    }
                    {comment && <div><strong>Комментарий:</strong> {comment}</div>}
                </div>
                <div style={{flexBasis: '18%', maxWidth: '18%'}}>{date}</div>
                <div style={{flexBasis: '20%', maxWidth: '20%', textAlign: 'right'}} className={type >= zero ? classes.green : classes.red}>
                    {numberFormat(amount, currentCurrency)}
                    {(currentCurrency !== primaryCurrency) && <div>{numberFormat(internal, primaryCurrency)}
                    {internal !== ZERO &&
                    <span style={{fontSize: 11, color: '#333', fontWeight: 600}}> ({rate})</span>}</div>}
                </div>
                {!isDeleted && <div className={classes.actionButtons}>
                    <IconButton
                        className={classes.deleteBtn}
                        style={iconStyle.button}
                        disabled={transType === TWO}
                        iconStyle={iconStyle.icon}
                        disableTouchRipple={true}
                        onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                        <DeleteIcon/>
                    </IconButton>
                    <IconButton
                        disabled={(transType !== INCOME) && (transType !== OUTCOME) && (transType !== INCOME_TO_CLIENT) && (transType !== OUTCOME_FROM_CLIENT)}
                        className={classes.deleteBtn}
                        style={iconStyle.button}
                        iconStyle={iconStyle.icon}
                        disableTouchRipple={true}
                        onTouchTap={() => { updateTransactionDialog.handleOpenDialog(id) }}>
                        <EditIcon/>
                    </IconButton>
                </div>}
            </div>
        )
    })

    const list = {
        header: listHeader,
        list: transactionList,
        loading: _.get(listData, 'listLoading')
    }
    return (
        <div className={showOnlyList ? '' : classes.rightSide}>
            {!showOnlyList && <div className={classes.rightTitle}>
                <div className={classes.outerTitle}>{cashboxName}</div>
                <div className={classes.outerTitle}>
                    <div className={classes.buttons}>
                        {hasRightCashbox && <a onClick={acceptCashDialog.handleOpenCashDialog} className={classes.btnSend}>Принять наличные</a>}
                        <div>
                            <a onClick={createSendDialog.handleOpenDialog}
                               className={classes.btnSend}>Перевод</a>
                            <a onClick={createIncomeDialog.handleOpenDialog} className={classes.btnAdd}>Приход</a>
                            <a onClick={createExpenseDialog.handleOpenDialog} className={classes.btnRemove}>Расход</a>
                        </div>
                    </div>
                </div>
            </div>}

            {showOnlyList
                ? <GridList
                    filter={filter}
                    withoutRow={true}
                    flexibleRow={true}
                    listShadow={listShadow}
                    list={list}
                    detail={transactionDetail}
                />
                : <GridList
                    filter={filter}
                    withoutRow={true}
                    flexibleRow={true}
                    list={list}
                    detail={transactionDetail}
                    filterDialog={transactionFilterDialog}
                />
            }

            {!showOnlyList && <section>
                <TransactionCreateDialog
                    isExpense={true}
                    initialValues={createExpenseDialog.initialValues}
                    noCashbox={_.get(cashboxData, 'cashboxId') === ZERO}
                    cashboxData={cashboxData}
                    open={createExpenseDialog.open}
                    loading={createExpenseDialog.loading}
                    onClose={createExpenseDialog.handleCloseDialog}
                    onSubmit={createExpenseDialog.handleSubmitDialog}
                />
                <TransactionCreateDialog
                    initialValues={{date: currentDay}}
                    noCashbox={_.get(cashboxData, 'cashboxId') === ZERO}
                    cashboxData={cashboxData}
                    open={createIncomeDialog.open}
                    loading={createIncomeDialog.loading}
                    onClose={createIncomeDialog.handleCloseDialog}
                    onSubmit={createIncomeDialog.handleSubmitDialog}
                />
                <TransactionCreateDialog
                    isUpdate={true}
                    initialValues={TransactionInitialValues}
                    isExpense={Number(_.get(currentItem, 'amount')) < ZERO}
                    noCashbox={_.get(cashboxData, 'cashboxId') === ZERO}
                    cashboxData={cashboxData}
                    open={updateTransactionDialog.open > ZERO}
                    onClose={updateTransactionDialog.handleCloseDialog}
                    onSubmit={
                        Number(_.get(currentItem, 'amount')) < ZERO
                        ? updateTransactionDialog.handleExpenseSumbit
                        : updateTransactionDialog.handleIncomeSubmit
                    }
                />

                <TransactionSendDialog
                    noCashbox={_.get(cashboxData, 'cashboxId') === ZERO}
                    cashboxData={cashboxData}
                    open={createSendDialog.open}
                    loading={createSendDialog.loading}
                    onClose={createSendDialog.handleCloseDialog}
                    onSubmit={createSendDialog.handleSubmitDialog}
                />

                <ConfirmDialog
                    type="delete"
                    message={'Транзакция №' + _.get(detailData, 'id')}
                    onClose={confirmDialog.handleCloseConfirmDialog}
                    onSubmit={confirmDialog.handleExpenseConfirmDialog}
                    open={confirmDialog.open}
                />

                <TransactionCashDialog
                    filterItem={filterItem}
                    open={acceptCashDialog.open}
                    onClose={acceptCashDialog.handleCloseCashDialog}
                    paymentData={paymentData}
                    loading={acceptCashDialog.loading}
                    cashBoxDialog={cashBoxDialog}
                    acceptCashDialog={acceptCashDialog}
                    superUser={superUser}
                />
                <TransactionInfoDialog
                    open={transactionInfoDialog.open}
                    onClose={transactionInfoDialog.handleCloseDialog}
                    data={transactionInfoDialog.data}
                    loading={transactionInfoDialog.loading}
                />
            </section>}
        </div>
    )
})

TransactionsList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    cashboxData: PropTypes.object,
    paymentData: PropTypes.object,
    cashboxListLoading: PropTypes.bool,
    detailData: PropTypes.object
}

export default TransactionsList
