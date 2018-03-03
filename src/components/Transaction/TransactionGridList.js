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
import CashPayment from 'material-ui/svg-icons/maps/local-atm'
import BankPayment from 'material-ui/svg-icons/action/credit-card'
import Loader from '../Loader'
import numberFormat from '../../helpers/numberFormat'
import ToolTip from '../ToolTip'
import t from '../../helpers/translate'

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
            padding: '15px 20px 15px 30px',
            margin: '0',
            cursor: 'pointer',
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
            maxWidth: '180px',
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
        },
        icons: {
            position: 'absolute',
            top: '21px',
            right: '20px'
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
        superUser,
        hasRightCashbox,
        updateTransactionDialog,
        usersData,
        hasMarket,
        canSetCustomRate,
        categryPopop,
        detalizationDialog,
        optionsList,
        canRemoveCashboxTransfers
    } = props

    const AllCashboxId = 0
    const cashboxList = _.map(_.get(cashboxData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const currency = _.get(item, ['currency', 'name'])
        const currencyID = _.get(item, ['currency', 'id'])
        const type = _.get(item, 'type')
        const balance = _.toNumber(_.get(item, 'balance'))
        const isActive = item.id === _.get(cashboxData, 'cashboxId')
        const ZERO_NUM = 0
        return (
            <div key={id} className={classes.list} onClick={() => {
                cashboxData.handleClickCashbox(id, currencyID)
            }}
                 style={isActive ? {backgroundColor: '#f2f5f8'} : {backgroundColor: '#fff'}}>
                <div>
                    <div className={classes.title}>{name}</div>
                    <div className={classes.icons}>
                        <ToolTip position="bottom" text={type === 'bank' ? t('банковский счет') : t('наличные')}>
                            {type === 'bank'
                                ? <BankPayment style={{height: '18px', width: '18px', color: '#6261b0'}}/>
                                : <CashPayment style={{height: '18px', width: '18px', color: '#12aaeb'}}/>}
                        </ToolTip>
                    </div>
                </div>
                <div>
                    <div className={balance >= ZERO_NUM ? classes.green : classes.red}>{numberFormat(balance, currency)}</div>
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
                        <div>{t('Кассы')}</div>
                    </div>
                    <Paper zDepth={2} style={{height: '100%'}}>
                        <div className={classes.listWrapper}>
                            <div className={classes.list}
                                 onClick={() => {
                                     cashboxData.handleClickCashbox(AllCashboxId, AllCashboxId)
                                 }}
                                 style={_.get(cashboxData, 'cashboxId') === AllCashboxId ? {backgroundColor: '#f2f5f8'} : {backgroundColor: '#fff'}}>
                                <div className={classes.title}>
                                    {t('Общий объем')}
                                    <span>{t('во всех кассах')}</span>
                                </div>
                            </div>
                            {cashboxListLoading
                                ? <div style={{textAlign: 'center'}}>
                                    <Loader size={0.75}/>
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
                    paymentData={paymentData}
                    transactionInfoDialog={transactionInfoDialog}
                    superUser={superUser}
                    hasRightCashbox={hasRightCashbox}
                    updateTransactionDialog={updateTransactionDialog}
                    usersData={usersData}
                    hasMarket={hasMarket}
                    canSetCustomRate={canSetCustomRate}
                    categryPopop={categryPopop}
                    optionsList={_.get(optionsList, 'results')}
                    detalizationDialog={detalizationDialog}
                    canRemoveCashboxTransfers={canRemoveCashboxTransfers}
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
