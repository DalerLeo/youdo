import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import TransactionsList from './TransactionsList'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Paper from 'material-ui/Paper'
import CashPayment from '../CashPayment'
import BankPayment from '../BankPayment'
import CircularProgress from 'material-ui/CircularProgress'
import numberFormat from '../../helpers/numberFormat'

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

const TransactionGridList = enhance((props) => {
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
        cashboxListLoading,
        confirmDialog,
        listData,
        acceptCashDialog,
        detailData,
        cashBoxDialog,
        classes,
        paymentData,
        transactionInfoDialog,
        superUser
    } = props

    const AllCashboxId = 0
    const cashboxList = _.map(_.get(cashboxData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const currency = _.get(item, ['currency', 'name'])
        const type = _.get(item, 'type')
        const balance = _.toInteger(_.get(item, 'balance'))
        const isActive = item.id === _.get(cashboxData, 'cashboxId')
        const ZERO_NUM = 0
        return (
            <div key={id} className={classes.list} onClick={() => {
                cashboxData.handleClickCashbox(id)
            }}
                 style={isActive ? {backgroundColor: '#ffffff'} : {backgroundColor: '#f2f5f8'}}>
                <div>
                    <div className={classes.title}>{name}</div>
                    <div className={item.id === cashboxData.cashboxId}>
                        {type === 'bank'
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
                                 }}
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
                <TransactionsList
                    filter={filter}
                    filterItem={filterItem}
                    createExpenseDialog={createExpenseDialog}
                    createIncomeDialog={createIncomeDialog}
                    updateExpenseDialog={updateExpenseDialog}
                    updateIncomeDialog={updateIncomeDialog}
                    createSendDialog={createSendDialog}
                    filterDialog={filterDialog}
                    cashboxData={cashboxData}
                    confirmDialog={confirmDialog}
                    listData={listData}
                    acceptCashDialog={acceptCashDialog}
                    detailData={detailData}
                    cashBoxDialog={cashBoxDialog}
                    classes={classes}
                    paymentData={paymentData}
                    transactionInfoDialog={transactionInfoDialog}
                    superUser={superUser}
                />
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
    }).isRequired,
    transactionInfoDialog: PropTypes.shape({
        data: PropTypes.array,
        open: PropTypes.number.isRequired,
        handleOpenDialog: PropTypes.func.isRequired,
        handleCloseDialog: PropTypes.func.isRequired
    }).isRequired
}

export default TransactionGridList
