import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import sprintf from 'sprintf'
import {Link} from 'react-router'
import injectSheet from 'react-jss'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'
import Return from 'material-ui/svg-icons/content/reply'
import MenuItem from 'material-ui/MenuItem'
import IconMenu from 'material-ui/IconMenu'
import {connect} from 'react-redux'
import PrintIcon from 'material-ui/svg-icons/action/print'
import MoneyOffIcon from 'material-ui/svg-icons/editor/money-off'
import IconButton from 'material-ui/IconButton'
import OrderTransactionsDialog from './OrderTransactionsDialog'
import OrderReturnDialog from './OrderReturnDialog'
import StatRightSide from './OrderStatDetailsRightSide'
import OrderSetDiscountDialog from './OrderSetDiscountDialog'
import RightSide from './OrderDetailsRightSideTabs'
import ConfirmDialog from '../ConfirmDialog'
import Tooltip from '../ToolTip'
import * as ROUTES from '../../constants/routes'
import LinearProgress from '../LinearProgress'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import getConfig from '../../helpers/getConfig'
import t from '../../helpers/translate'
const ZERO = 0

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
            maxHeight: '660px',
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
        grey: {
            color: '#999 !important'
        },
        loader: {
            width: '100%',
            background: '#fff',
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
                    textAlign: 'right',
                    maxWidth: '50%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                },
                '& a': {
                    fontWeight: '600'
                },
                '& > div': {
                    background: '#fff',
                    position: 'absolute',
                    padding: '15px 30px',
                    left: 'calc(100% + 15px)',
                    minWidth: '335px',
                    zIndex: '-99',
                    opacity: '0',
                    top: '10px'
                }
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
    connect((state) => {
        const userCurrencies = _.get(state, ['authConfirm', 'data', 'currencies'])
        return {
            userCurrencies
        }
    })
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
const OrderDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        transactionsDialog,
        returnDialog,
        returnDataLoading,
        cancelOrderReturnDialog,
        confirmDialog,
        updateDialog,
        type,
        tabData,
        paymentData,
        getDocument,
        returnData,
        handleCloseDetail,
        openDiscountDialog,
        setOpenDiscountDialog,
        handleSubmitDiscountDialog,
        handleSubmitSetZeroDiscountDialog,
        handleOpenPrintContract,
        hasMarket,
        isSuperUser,
        userCurrencies
    } = props
    const id = _.get(data, 'id')
    const market = _.get(data, ['market', 'name'])
    const marketId = _.get(data, ['market', 'id']) || ZERO
    const agent = _.get(data, ['user', 'firstName']) + ' ' + _.get(data, ['user', 'secondName'])
    const dealType = _.get(data, 'dealType')
    const division = _.get(data, ['division', 'name'])
    const divisionBool = _.toInteger(_.get(data, ['division', 'id']))
    const deliveryMan = _.get(data, ['deliveryMan', 'firstName']) && _.get(data, ['deliveryMan', 'firstName'])
        ? _.get(data, ['deliveryMan', 'firstName']) + ' ' + _.get(data, ['deliveryMan', 'secondName'])
        : null
    const client = _.get(data, ['client', 'name'])
    const contract = _.get(data, ['contract']) || 'Не указан'
    const deliveryType = _.get(data, 'deliveryType')
    const dateDelivery = dateFormat(_.get(data, 'dateDelivery'), '', false)
    const createdDate = dateFormat(_.get(data, 'createdDate'))
    const paymentDate = dateFormat(_.get(data, 'paymentDate'))
    const requestDeadline = _.get(data, 'requestDeadline') ? dateFormat(_.get(data, 'requestDeadline')) : 'Не задан'
    const currency = _.get(data, ['currency', 'name'])
    const currencyAccess = _.isEmpty(_.find(userCurrencies, {'id': _.get(data, ['currency', 'id'])}))
    const REQUESTED = 0
    const READY = 1
    const GIVEN = 2
    const DELIVERED = 3
    const CANCELED = 4
    const NOT_CONFIRMED = 5
    const status = _.toInteger(_.get(data, 'status'))
    const editableWhenGiven = status === GIVEN && isSuperUser
    const zero = 0
    const totalPaid = _.toNumber(_.get(data, 'totalPaid'))
    const priceList = _.get(data, ['priceList', 'name'])
    const paymentType = _.get(data, 'paymentType')
    const totalBalance = _.get(data, 'totalBalance')
    const productTotal = _.toNumber(_.get(data, 'totalPrice'))
    const discountPrice = _.toNumber(_.get(data, 'discountPrice'))
    const price = (discountPrice * hundred) / (productTotal + discountPrice)

    if (loading) {
        return (
            <div className={classes.wrapper} style={loading ? {maxHeight: '100px'} : {}}>
                <div className={classes.loader}>
                    <LinearProgress/>
                </div>
            </div>
        )
    }
    const totalReturned = _.sumBy(_.get(data, 'products'), (item) => {
        return _.toNumber(_.get(item, 'returnAmount'))
    })
    const configDivisions = getConfig('DIVISIONS')
    return (
        <div className={classes.wrapper}>
            {type && <div className={classes.title}>
                <div className={classes.titleLabel}>{t('Заказ')} №{id}</div>
                <div className={classes.closeDetail}
                     onClick={handleCloseDetail}>
                </div>
                <div className={classes.discountPop} style={openDiscountDialog ? {transform: 'scale(1)'} : {transform: 'scale(0)'}}>
                    <OrderSetDiscountDialog
                        id={id}
                        percent={price}
                        handleSubmitSetZeroDiscountDialog={handleSubmitSetZeroDiscountDialog}
                        setOpenDiscountDialog={setOpenDiscountDialog}
                        onSubmit={handleSubmitDiscountDialog}/>
                    <div className={classes.arrow}> </div>
                    <div className={classes.arrowShadow}> </div>
                </div>
                <div className={classes.titleButtons}>
                    <Tooltip position="bottom" text={t('Добавить возврат')}>
                        <IconButton
                            disabled={!(status === DELIVERED || status === GIVEN)}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={returnDialog.handleOpenReturnDialog}>
                            <Return />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="left" text={t('Распечатать')}>
                        <IconMenu
                            menuItemStyle={{fontSize: '13px'}}
                            iconButtonElement={<IconButton
                                disabled={(status === CANCELED)}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}>
                                <PrintIcon />
                            </IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                            <MenuItem
                                primaryText={t('Накладную')}
                                onTouchTap={() => { getDocument.handleGetDocument(id) }}
                            />
                            <MenuItem
                                disabled={currency !== 'SUM' && currency !== 'СУМ'}
                                primaryText={currency === 'SUM' || currency === 'СУМ' ? t('Договор') : t('Договор (валюта должна быть в сумах)')}
                                onTouchTap={() => { handleOpenPrintContract() }}
                            />
                        </IconMenu>
                    </Tooltip>
                    <Tooltip position="bottom" text={t('Изменить')}>
                        <IconButton
                            disabled={(status === CANCELED ? true : status === GIVEN ? !editableWhenGiven : currencyAccess)}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={updateDialog.handleOpenUpdateDialog}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text={t('Скидка')}>
                        <IconButton
                            disabled={(status === CANCELED) || (totalReturned > zero)}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { setOpenDiscountDialog(!openDiscountDialog) }}>
                            <MoneyOffIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text={t('Отменить')}>
                        <IconButton
                            disabled={(status === CANCELED || status === GIVEN || status === DELIVERED)}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>}
            <div className={classes.content}>
                <div className={classes.leftSide}>
                    <div className={classes.subBlock}>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>{t('Клиент')}:</span>
                                    <span title={client}>{client}</span>
                                </li>
                                {hasMarket && <li>
                                    <span>{t('Магазин')}:</span>
                                    <span title={market}>
                                        <Link to={{
                                            pathname: sprintf(ROUTES.SHOP_ITEM_PATH, marketId),
                                            query: {search: market}
                                        }} target='_blank'>{market}</Link>
                                    </span>
                                </li>}
                                <li>
                                    <span>{t('Инициатор')}:</span>
                                    <span>{agent}</span>
                                </li>
                                <li>
                                    <span>{t('Дата создания')}</span>
                                    <span>{createdDate}</span>
                                </li>

                                <li>
                                    <span>{t('Тип сделки')}:</span>
                                    <span>{(dealType === '0') ? t('Стандартная') : t('Консигнация')}</span>
                                </li>
                                {(configDivisions && divisionBool) ? <li>
                                    <span>{t('Организация')}:</span>
                                    <span>{division}</span>
                                </li> : null}
                                <li>
                                    <span>{t('Номер договора')}:</span>
                                    <span>{contract}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>{t('Баланс')}</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>{t('Прайс-лист')}:</span>
                                    <span>{priceList}</span>
                                </li>
                                <li>
                                    <span>{t('Дата ожидаемой оплаты')}:</span>
                                    <span>{paymentDate}</span>
                                </li>
                                <li>
                                    <span>{t('Тип оплаты')}:</span>
                                    <span>{(paymentType === 'cash') ? t('Наличными') : t('Перечислением')}</span>
                                </li>
                                <li>
                                    <span>{t('Общая стоимость')}</span>
                                    <span>{numberFormat(productTotal, currency)}</span>
                                </li>
                                <li>
                                    <span>{t('Оплачено')}:</span>
                                    {(totalPaid !== zero && type) ? <span>
                                        <a onClick={transactionsDialog.handleOpenTransactionsDialog} className={classes.link}>{numberFormat(totalPaid)} {currency}</a>
                                    </span>
                                        : <span>{numberFormat(totalPaid)} {currency}</span>}
                                </li>
                                <li>
                                    <span>{t('Остаток')}:</span>
                                    <span className={totalBalance > zero ? classes.red : classes.green}>{numberFormat(totalBalance)} {currency}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>{t('Исполнение')}</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>{t('Срок запроса')}:</span>
                                    <span>{requestDeadline}</span>
                                </li>
                                <li>
                                    <span>{t('Текущий статус')}:</span>
                                    {(status === REQUESTED) ? <span className={classes.yellow}>{t('Запрос отправлен')}</span>
                                        : (status === READY) ? <span className={classes.green}>{t('Есть на складе')}</span>
                                            : (status === GIVEN)
                                                ? <span className={classes.yellow}>{t('Передан доставщику')}</span>
                                                : (status === DELIVERED)
                                                    ? <span className={classes.green}>{t('Доставлен')}</span>
                                                    : (status === CANCELED)
                                                        ? <span className={classes.red}>{t('Отменен')}</span>
                                                        : (status === NOT_CONFIRMED)
                                                            ? <span className={classes.grey}>{t('Не подтвержден')}</span> : null
                                    }
                                </li>
                                {deliveryMan ? <li>
                                    <span>{t('Доставщик')}:</span>
                                    <span>{deliveryMan}</span>
                                </li> : null}
                                <li>
                                    <span>{t('Тип передачи')}:</span>
                                    <span>{deliveryType === 'delivery' ? t('Доставка') : t('Самовывоз')}</span>
                                </li>
                                {dateDelivery ? <li>
                                    <span>{t('Дата доставки')}:</span>
                                    <span>{dateDelivery}</span>
                                </li> : null}
                            </ul>
                        </div>
                    </div>
                </div>
                {type &&
                <RightSide
                    data={data}
                    tabData={tabData}
                    returnData={returnData}
                    returnDataLoading={returnDataLoading}
                    cancelOrderReturnOpen={cancelOrderReturnDialog.handleOpenCancelOrderReturnDialog}
                />}
                {!type &&
                <StatRightSide
                    data={data}/>}
            </div>
            {type && <OrderTransactionsDialog
                open={transactionsDialog.openTransactionsDialog}
                loading={paymentData.paymentLoading}
                onClose={transactionsDialog.handleCloseTransactionsDialog}
                paymentData={paymentData}
            />}
            {type && <OrderReturnDialog
                open={returnDialog.openReturnDialog}
                loading={returnDialog.returnLoading}
                onClose={returnDialog.handleCloseReturnDialog}
                onSubmit={returnDialog.handleSubmitReturnDialog}
                orderData={data}
            />}
            {type && <ConfirmDialog
                type="cancel"
                message={t('Возврат') + ' № ' + cancelOrderReturnDialog.openCancelOrderReturnDialog}
                onClose={cancelOrderReturnDialog.handleCloseCancelOrderReturnDialog}
                onSubmit={cancelOrderReturnDialog.handleSubmitCancelOrderReturnDialog}
                open={cancelOrderReturnDialog.openCancelOrderReturnDialog > ZERO}/>
            }

        </div>
    )
})

OrderDetails.propTypes = {
    paymentData: PropTypes.object,
    returnListData: PropTypes.object,
    tabData: PropTypes.shape({
        tab: PropTypes.string,
        handleTabChange: PropTypes.func
    }),
    data: PropTypes.any.isRequired,
    returnData: PropTypes.array,
    loading: PropTypes.bool,
    returnDialog: PropTypes.shape({
        returnLoading: PropTypes.bool,
        openReturnDialog: PropTypes.bool,
        handleOpenReturnDialog: PropTypes.func,
        handleCloseReturnDialog: PropTypes.func
    }),
    handleOpenUpdateDialog: PropTypes.func,
    orderListData: PropTypes.object,
    getDocument: PropTypes.shape({
        handleGetDocument: PropTypes.func.isRequired
    }),
    returnDataLoading: PropTypes.bool,
    cancelOrderReturnDialog: PropTypes.shape({
        handleOpenCancelOrderReturnDialog: PropTypes.func,
        handleCloseCancelOrderReturnDialog: PropTypes.func,
        handleSubmitCancelOrderReturnDialog: PropTypes.func,
        openCancelOrderReturnDialog: PropTypes.number
    }),
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    })
}

export default OrderDetails
