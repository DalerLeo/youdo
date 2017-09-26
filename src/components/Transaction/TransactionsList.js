import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import {Link} from 'react-router'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import Tooltip from '../ToolTip'
import GridList from '../GridList'
import TransactionFilterForm from './TransactionFilterForm'
import TransactionCreateDialog from './TransactionCreateDialog'
import TransactionSendDialog from './TransactionSendDialog'
import TransactionCashDialog from './TransactionCashDialog'
import TransactionInfoDialog from './TransactionInfoDialog'
import ConfirmDialog from '../ConfirmDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import toBoolean from '../../helpers/toBoolean'
import sprintf from 'sprintf'
import {
    ORDER,
    INCOME_FROM_AGENT,
    formattedType
} from '../../constants/transactionTypes'

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
        actionButtons: {
            pointerEvents: 'none',
            opacity: '0.4'
        },
        deleteBtn: {
            opacity: '0'
        },
        rows: {
            padding: '5px 0',
            '& > div': {
                padding: '0 8px !important'
            },
            '&:hover button': {
                opacity: '1 !important'
            }
        },
        clickable: {
            cursor: 'pointer',
            color: '#12aaeb !important',
            fontWeight: '600'
        }
    }),
)

const ZERO = 0
const TransactionsList = enhance((props) => {
    const {
        filter,
        filterItem,
        createExpenseDialog,
        createIncomeDialog,
        updateExpenseDialog,
        updateIncomeDialog,
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
        listShadow
    } = props

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
            name: '№',
            title: 'Id',
            width: '10%'
        },
        {
            sorting: true,
            name: 'client',
            title: showCashbox ? 'Касса' : 'Клиент',
            width: '22%'
        },
        {
            sorting: true,
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
            width: '15%'
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

    const transactionList = _.map(_.get(listData, 'data'), (item) => {
        const zero = 0
        const id = _.get(item, 'id')
        const comment = _.get(item, 'comment')
        const type = _.get(item, 'amount') || 'N/A'
        const cashbox = _.get(item, ['cashbox', 'id']) || 'N/A'
        const user = _.get(item, 'user')
        const order = _.get(item, 'order')
        const amount = numberFormat(_.get(item, 'amount')) || 'N/A'
        const createdDate = dateFormat(_.get(item, 'createdDate'), true)
        const currentCurrency = _.get(_.find(_.get(cashboxData, 'data'), {'id': cashbox}), ['currency', 'name'])
        const client = showCashbox ? _.get(_.find(_.get(cashboxData, 'data'), {'id': cashbox}), 'name') : null
        const clientName = _.get(item, ['client', 'name'])
        const clientId = _.get(item, ['client', 'id'])
        const expanseCategory = _.get(item, ['expanseCategory', 'name'])
        const transType = _.get(item, ['type'])

        return (
            <Row key={id} className={classes.rows}>
                <div style={{flexBasis: '10%', maxWidth: '10%'}}>{id}</div>
                <div style={{flexBasis: '22%', maxWidth: '24%'}}>
                    {client}
                    {!showCashbox ? <div>{clientName || 'Не указан'}</div> : null}
                </div>
                <div style={{flexBasis: '30%', maxWidth: '30%'}}>
                    {expanseCategory
                        ? <div><span className={classes.label}>Категория: </span> {expanseCategory}</div> : ''}
                    {transType &&
                    <div>
                        <span style={{fontWeight: '600'}}>Тип:</span> {transType === ORDER
                        ? <Link to={{
                            pathname: sprintf(ROUTES.ORDER_ITEM_PATH, order),
                            query: {search: order}
                        }} target="_blank"><span className={classes.clickable}> Оплата заказа № {order}</span></Link>
                        : (transType === INCOME_FROM_AGENT)
                            ? <span className={classes.clickable}
                                    onClick={() => { transactionInfoDialog.handleOpenDialog(id) }}> {'Приемка наличных с  ' + _.get(user, 'firstName') + ' ' + _.get(user, 'secondName')}</span>
                            : <span> {formattedType[transType]} {clientName &&
                                <Link
                                    target="_blank"
                                    className={classes.clickable}
                                    to={{
                                        pathname: ROUTES.CLIENT_BALANCE_LIST_URL,
                                        query: {search: clientId}
                                    }}>
                                    {clientName}
                                </Link>}
                                </span>}

                    </div>}
                    {comment && <div><strong>Комментарий:</strong> {comment}</div>}
                </div>
                <div style={{flexBasis: '18%', maxWidth: '18%'}}>{createdDate}</div>
                <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}
                     className={type >= zero ? classes.green : classes.red}>
                    {amount} {currentCurrency}
                </div>
                <div style={{flexBasis: '5%', maxWidth: '5%', textAlign: 'right'}}>
                    <IconButton
                        className={classes.deleteBtn}
                        style={iconStyle.button}
                        iconStyle={iconStyle.icon}
                        onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                        <DeleteIcon/>
                    </IconButton>
                </div>
            </Row>
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
                        <a onClick={acceptCashDialog.handleOpenCashDialog} className={classes.btnSend}>Принять наличные</a>

                        {_.get(cashboxData, 'cashboxId') === AllCashboxId &&
                        <Tooltip position="bottom" text="Пожалуйста, выберите кассу">
                            <div className={classes.actionButtons}>
                                <a onClick={createSendDialog.handleOpenDialog} className={classes.btnSend}>Перевод</a>
                                <a onClick={createIncomeDialog.handleOpenDialog} className={classes.btnAdd}>Доход</a>
                                <a onClick={createExpenseDialog.handleOpenDialog} className={classes.btnRemove}>Расход</a>
                            </div>
                        </Tooltip>
                        }
                        {_.get(cashboxData, 'cashboxId') !== AllCashboxId &&
                        <div>
                            <a onClick={createSendDialog.handleOpenDialog}
                               className={classes.btnSend}>Перевод</a>
                            <a onClick={createIncomeDialog.handleOpenDialog} className={classes.btnAdd}>Приход</a>
                            <a onClick={createExpenseDialog.handleOpenDialog} className={classes.btnRemove}>Расход</a>
                        </div>
                        }
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
