import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import injectSheet from 'react-jss'
import Edit from 'material-ui/svg-icons/image/edit'
import AddPayment from 'material-ui/svg-icons/editor/attach-money'
import Expense from 'material-ui/svg-icons/action/credit-card'
import Sync from 'material-ui/svg-icons/notification/sync'
import Delete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import RightSide from './SupplyDetailsRightSideTabs'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import LinearProgress from '../LinearProgress'
import ToolTip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import SupplySetDiscountDialog from './SupplySetDiscountDialog'
import * as ROUTE from '../../constants/routes'
import checkPermission from '../../helpers/checkPermission'
import t from '../../helpers/translate'
import {
    SUPPLY_PENDING,
    SUPPLY_IN_PROGRESS,
    SUPPLY_COMPLETED,
    SUPPLY_CANCELED
} from '../../constants/backendConstants'

const popupWidth = 210
const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            color: '#333 !important',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            transition: 'all 250ms ease-out',
            maxHeight: '720px',
            overflow: 'hidden'
        },
        link: {
            extend: 'blue',
            borderBottom: '1px dashed',
            fontWeight: '600'
        },
        red: {
            color: '#e57373 !important'
        },
        blue: {
            color: '#12aaeb !important'
        },
        green: {
            color: '#81c784 !important'
        },
        yellow: {
            color: '#f0ad4e !important'
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px #efefef solid',
            alignItems: 'center',
            width: '100%',
            height: '65px',
            padding: '0 30px',
            position: 'relative'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600',
            cursor: 'pointer'
        },
        closeDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1'
        },
        titleButtons: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: '3'
        },
        content: {
            display: 'flex',
            width: '100%'
        },
        padding: {
            padding: '20px 30px'
        },
        leftSide: {
            width: '320px',
            borderRight: '1px #efefef solid'
        },
        subBlock: {
            padding: '15px 30px',
            borderBottom: '1px #efefef solid',
            '&:last-child': {
                border: 'none',
                paddingBottom: '20px'
            }
        },
        subtitle: {
            fontWeight: '600',
            textTransform: 'uppercase',
            marginBottom: '10px'
        },
        dataBox: {
            '& li': {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                lineHeight: '25px',
                position: 'relative',
                width: '100%',
                '& span:last-child': {
                    fontWeight: '600',
                    textAlign: 'right'
                },
                '& a': {
                    fontWeight: '600'
                }
            }
        },
        expenseInfo: {
            position: 'absolute',
            top: '-10px',
            left: 'calc(100% + 50px)',
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
            background: '#fff',
            padding: '10px 20px',
            whiteSpace: 'nowrap',
            zIndex: '4',
            '&:before': {
                content: '""',
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                borderRight: '10px solid #ccc',
                position: 'absolute',
                left: '-10px',
                top: '14px'
            },
            '&:after': {
                content: '""',
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                borderRight: '9px solid #fff',
                position: 'absolute',
                left: '-9px',
                top: '14px'
            }
        },
        expenseType: {
            lineHeight: '1.4',
            paddingBottom: '10px',
            marginBottom: '10px',
            borderBottom: '1px #efefef solid',
            '&:last-child': {
                paddingBottom: '0',
                marginBottom: '0',
                borderBottom: 'none'
            }
        },
        discountPop: {
            width: popupWidth + 'px',
            position: 'absolute',
            right: '55px',
            top: '55px',
            transformOrigin: '170px 0',
            transition: 'all 200ms ease-out',
            zIndex: '5'
        },
        arrow: {
            top: -12,
            right: 36,
            position: 'absolute',
            borderRight: '10px solid transparent',
            borderBottom: '12px solid #fff',
            borderLeft: '10px solid transparent',
            zIndex: '2'
        },
        arrowShadow: {
            extend: 'arrow',
            top: -13,
            filter: 'blur(1px)',
            borderBottomColor: '#e0e0e0',
            zIndex: '1'
        }
    }),
    withState('openDiscountDialog', 'setOpenDiscountDialog', false),
    withState('openExpenseInfo', 'setOpenExpenseInfo', null)
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
        padding: 0
    }
}

const hundred = 100
const SupplyDetails = enhance((props) => {
    const {
        classes,
        loading,
        data,
        handleSupplyExpenseOpenCreateDialog,
        returnDataLoading,
        supplyListData,
        itemReturnDialog,
        confirmDialog,
        updateDialog,
        tabData,
        returnData,
        handleCloseDetail,
        openDiscountDialog,
        setOpenDiscountDialog,
        handleSubmitDiscountDialog,
        handleSubmitSetZeroDiscountDialog,
        confirmExpenseDialog,
        transactionsDialog,
        openExpenseInfo,
        setOpenExpenseInfo,
        isAdmin,
        confirmSyncDialog
    } = props

    const canUpdatePrice = checkPermission('can_update_price')

    const zero = 0
    const id = _.get(data, 'id')
    const agent = _.get(data, ['user', 'firstName']) + ' ' + _.get(data, ['user', 'secondName'])
    const provider = _.get(data, ['provider', 'name'])
    const stockName = _.get(data, ['stock', 'name']) || t('Не указан')
    const paymentType = _.get(data, 'paymentType') === 'cash' ? t('Наличный') : t('Банковский счет')
    const phone = _.get(data, ['contact', 'phone']) || t('Не указан')
    const email = _.get(data, ['contact', 'email']) || t('Не указан')
    const dateDelivery = dateFormat(_.get(data, 'dateDelivery'), false, t('Не указана'))
    const acceptedTime = (_.get(data, 'acceptedTime')) ? dateTimeFormat(_.get(data, 'acceptedTime')) : t('Не началась')
    const finishedTime = (_.get(data, 'finishedTime')) ? dateTimeFormat(_.get(data, 'finishedTime')) : t('Не закончилась')
    const contract = _.get(data, 'contract') || t('Не указан')

    const status = _.toInteger(_.get(data, 'status'))
    const statusOutput = () => {
        switch (status) {
            case SUPPLY_PENDING: return <span className={classes.yellow}>{t('Ожидает')}</span>
            case SUPPLY_IN_PROGRESS: return <span className={classes.blue}>{t('В процессе')}</span>
            case SUPPLY_COMPLETED: return <span className={classes.green}>{t('Завершен')}</span>
            case SUPPLY_CANCELED: return <span className={classes.red}>{t('Отменен')}</span>
            default: return null
        }
    }

    const comment = _.get(data, 'comment') || t('Не указан')
    const totalPaid = _.toNumber(_.get(data, 'totalPaid'))
    const totalCost = _.toNumber(_.get(data, 'totalCost'))
    const totalBalance = totalCost - totalPaid
    const discountPrice = _.toNumber(_.get(data, 'discountPrice'))
    const price = (discountPrice * hundred) / (totalCost + discountPrice)
    const totalAdditionalCosts = _.get(data, 'totalAdditionalCosts')
    const totalAdditionalCostsPaid = _.get(data, 'totalAdditionalCostsPaid')
    const currency = _.get(data, ['currency', 'name'])
    if (loading) {
        return (
            <div className={classes.wrapper}>
                <div className={classes.loader}>
                    <LinearProgress/>
                </div>
            </div>
        )
    }
    const groupedByCurrency = _.groupBy(totalAdditionalCosts, (item) => _.get(item, ['currency', 'name']))
    const groupedByCurrencyPaid = _.groupBy(totalAdditionalCostsPaid, (item) => _.get(item, ['currency', 'name']))
    const totalAmountPaid = _.map(groupedByCurrencyPaid, (item, index) => {
        const asd = _.sumBy(item, (obj) => Math.abs(_.toNumber(obj.totalAmount)))
        return {
            currency: index,
            paid: asd
        }
    })
    const editButtonDisableStatus = () => {
        switch (status) {
            case SUPPLY_CANCELED: return true
            default: return false
        }
    }
    const cancelButtonDisableStatus = () => {
        if (status === SUPPLY_CANCELED) {
            return true
        } else if (status !== SUPPLY_CANCELED && isAdmin) {
            return false
        } else if (status === SUPPLY_COMPLETED && isAdmin) {
            return false
        } else if (status === SUPPLY_COMPLETED && !isAdmin) {
            return true
        }
        return false
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{t('Поставка')} № {id}</div>
                <div className={classes.closeDetail} onClick={handleCloseDetail}/>
                <div className={classes.discountPop}
                     style={openDiscountDialog ? {transform: 'scale(1)'} : {transform: 'scale(0)'}}>
                    <SupplySetDiscountDialog
                        id={id}
                        percent={price}
                        handleSubmitSetZeroDiscountDialog={handleSubmitSetZeroDiscountDialog}
                        setOpenDiscountDialog={setOpenDiscountDialog}
                        onSubmit={handleSubmitDiscountDialog}/>
                    <div className={classes.arrow}>{null}</div>
                    <div className={classes.arrowShadow}>{null}</div>
                </div>
                <div className={classes.titleButtons}>
                    <ToolTip position="bottom" text={t('Добавить оплату')}>
                        <Link target="_blank" to={{pathname: ROUTE.PENDING_EXPENSES_LIST_URL, query: {supply: id}}}>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                disabled={status === SUPPLY_CANCELED}
                                style={iconStyle.button}
                                touch={true}>
                                <AddPayment/>
                            </IconButton>
                        </Link>
                    </ToolTip>
                    <ToolTip position="bottom" text={t('Добавить расход')}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            disabled={(status === SUPPLY_CANCELED)}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { handleSupplyExpenseOpenCreateDialog(id) }}>
                            <Expense/>
                        </IconButton>
                    </ToolTip>
                    <ToolTip position="bottom" text={t('Синхронизировать кол-во товаров с приёмкой')}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            disabled={status !== SUPPLY_COMPLETED}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { confirmSyncDialog.handleOpenConfirmDialog() }}>
                            <Sync/>
                        </IconButton>
                    </ToolTip>
                    {updateDialog && <ToolTip position="bottom" text={t('Изменить')}>
                        <IconButton
                            disabled={editButtonDisableStatus() || !canUpdatePrice}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={updateDialog.handleOpenUpdateDialog}>
                            <Edit/>
                        </IconButton>
                    </ToolTip>}
                    {confirmDialog && <ToolTip position="bottom" text={t('Отменить')}>
                        <IconButton
                            disabled={cancelButtonDisableStatus()}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                            <Delete/>
                        </IconButton>
                    </ToolTip>}
                </div>
            </div>
            <div className={classes.content}>
                <div className={classes.leftSide}>
                    <div className={classes.subBlock}>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>{t('Договор')} №:</span>
                                    <span>{contract}</span>
                                </li>
                                <li>
                                    <span>{t('Поставщик')}:</span>
                                    <span>{provider}</span>
                                </li>
                                <li>
                                    <span>{t('Телефон')}:</span>
                                    <span>{phone}</span>
                                </li>
                                <li>
                                    <span>{t('E-mail')}:</span>
                                    <span>{email}</span>
                                </li>
                                <li>
                                    <span>{t('Инициатор')}:</span>
                                    <span>{agent}</span>
                                </li>
                                <li>
                                    <span>{t('Склад')}:</span>
                                    <span>{stockName}</span>
                                </li>
                                <li>
                                    <span>{t('Дата доставки')}:</span>
                                    <span>{dateDelivery}</span>
                                </li>

                                <li>
                                    <span>{t('Комментарии')}:</span>
                                    <span>{comment}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>{t('Баланс')}</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>{t('Стоимость поставки')}</span>
                                    <span>{numberFormat(totalCost, currency)}</span>
                                </li>
                                <li>
                                    <span>{t('Тип оплаты')}</span>
                                    <span>{paymentType}</span>
                                </li>
                                <li>
                                    <span>{t('Оплачено')}:</span>
                                    <span>{totalPaid > zero
                                        ? <a onClick={() => { transactionsDialog.handleOpenTransactionsDialog(id) }}>
                                            <strong>{numberFormat(totalPaid, currency)}</strong>
                                        </a>
                                        : numberFormat(totalPaid, currency)}</span>
                                </li>
                                <li>
                                    <span>{t('Остаток')}:</span>
                                    <span className={totalBalance > zero ? classes.red : classes.green}>{numberFormat(totalBalance)} {currency}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>{t('Доп. расходы')}</div>
                        <div className={classes.dataBox}>
                            <ul>
                                {!_.isEmpty(groupedByCurrency)
                                    ? _.map(groupedByCurrency, (item, index) => {
                                        const itemAmount = _.sumBy(item, (o) => _.toNumber(_.get(o, 'totalAmount')))
                                        const paidAmount = _.get(_.find(totalAmountPaid, {'currency': index}), 'paid')
                                        return (
                                            <li
                                                key={index}
                                                style={{display: 'block'}}
                                                onMouseEnter={() => { setOpenExpenseInfo(index) }}
                                                onMouseLeave={() => { setOpenExpenseInfo(null) }}>
                                                {openExpenseInfo === index
                                                    ? <div className={classes.expenseInfo}>
                                                        {_.map(item, (o) => {
                                                            const expensePT = _.get(o, 'paymentType')
                                                            const expenseCurrency = _.get(o, ['currency', 'name'])
                                                            const totalAmount = _.toNumber(_.get(o, 'totalAmount'))
                                                            const expPaidAmount = _.toNumber(_.get(_.find(totalAdditionalCostsPaid, (obj) => {
                                                                return obj.currency.name === expenseCurrency && obj.paymentType === expensePT
                                                            }), 'totalAmount'))
                                                            const expTotalPaid = !_.isNaN(expPaidAmount) ? Math.abs(expPaidAmount) : zero
                                                            return (expensePT === 'cash')
                                                                ? (
                                                                    <div key={expensePT} className={classes.expenseType}>
                                                                        <div><strong>{t('Наличные')}:</strong> {numberFormat(totalAmount, expenseCurrency)}</div>
                                                                        <div>{t('Оплачено')}: {numberFormat(expTotalPaid)} Остаток: {numberFormat(totalAmount - expTotalPaid)}</div>
                                                                    </div>
                                                                )
                                                                : (
                                                                    <div key={expensePT} className={classes.expenseType}>
                                                                        <div><strong>{t('Перечисление')}:</strong> {numberFormat(totalAmount, expenseCurrency)}</div>
                                                                        <div>{t('Оплачено')}: {numberFormat(expTotalPaid)} Остаток: {numberFormat(totalAmount - expTotalPaid)}</div>
                                                                    </div>
                                                                )
                                                        })}
                                                    </div>
                                                    : null}
                                                <span
                                                    style={{fontWeight: 'normal'}}>
                                                    {t('Сумма')}: {numberFormat(itemAmount, index)} ({t('Оплачено')}: {numberFormat(paidAmount)})
                                                </span>
                                            </li>
                                        )
                                    })
                                    : <div>{t('Нет дополнительных расходов')}</div>}
                            </ul>
                        </div>
                    </div>

                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>{t('Исполнение')}</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>{t('Статус')}:</span>
                                    <span>{statusOutput()}</span>
                                </li>
                                <li>
                                    <span>{t('Начало приемки')}:</span>
                                    <span>{acceptedTime}</span>
                                </li>
                                <li>
                                    <span>{t('Конец приемки')}:</span>
                                    <span>{finishedTime}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <RightSide
                    data={data}
                    tabData={tabData}
                    itemReturnDialog={itemReturnDialog}
                    returnData={returnData}
                    returnDataLoading={returnDataLoading}
                    expensesListData={supplyListData}
                    confirmExpenseDialog={confirmExpenseDialog}/>
            </div>
        </div>
    )
})

SupplyDetails.propTypes = {
    paymentData: PropTypes.object,
    returnListData: PropTypes.object,
    tabData: PropTypes.shape({
        tab: PropTypes.string,
        handleTabChange: PropTypes.func
    }).isRequired,
    data: PropTypes.object.isRequired,
    returnData: PropTypes.array,
    loading: PropTypes.bool,
    returnDialog: PropTypes.shape({
        returnLoading: PropTypes.bool,
        openReturnDialog: PropTypes.bool,
        handleOpenReturnDialog: PropTypes.func,
        handleCloseReturnDialog: PropTypes.func
    }),
    itemReturnDialog: PropTypes.shape({
        returnDialogLoading: PropTypes.bool,
        openSupplyItemReturnDialog: PropTypes.bool,
        handleOpenItemReturnDialog: PropTypes.func,
        handleCloseItemReturnDialog: PropTypes.func
    }),
    handleOpenUpdateDialog: PropTypes.func,
    supplyListData: PropTypes.object,
    getDocument: PropTypes.shape({
        handleGetDocument: PropTypes.func.isRequired
    }),
    returnDataLoading: PropTypes.bool,
    cancelSupplyReturnDialog: PropTypes.shape({
        handleOpenCancelSupplyReturnDialog: PropTypes.func,
        handleCloseCancelSupplyReturnDialog: PropTypes.func,
        handleSubmitCancelSupplyReturnDialog: PropTypes.func,
        openCancelSupplyReturnDialog: PropTypes.number
    }),
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    })
}

export default SupplyDetails
