import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import Edit from 'material-ui/svg-icons/image/edit'
import LinearProgress from 'material-ui/LinearProgress'
import FlatButton from 'material-ui/FlatButton'
import Delete from 'material-ui/svg-icons/action/delete'
import RightSide from './SupplyDetailsRightSideTabs'
import IconButton from 'material-ui/IconButton'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import Tooltip from '../ToolTip'
import moment from 'moment'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import SupplySetDiscountDialog from './SupplySetDiscountDialog'

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
            maxHeight: '615px',
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
            height: '200px',
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
    withState('openDiscountDialog', 'setOpenDiscountDialog', false)
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
        transactionsDialog,
        handleSupplyExpenseOpenCreateDialog,
        returnDataLoading,
        supplyListData,
        itemReturnDialog,
        confirmDialog,
        updateDialog,
        type,
        tabData,
        returnData,
        handleCloseDetail,
        openDiscountDialog,
        setOpenDiscountDialog,
        handleSubmitDiscountDialog,
        handleSubmitSetZeroDiscountDialog,
        confirmExpenseDialog
    } = props
    const id = _.get(data, 'id')
    const agent = _.get(data, ['user', 'firstName']) + ' ' + _.get(data, ['user', 'secondName'])

    const provider = _.get(data, ['provider', 'name'])
    const phone = _.get(data, ['contact', 'phone'])
    const email = _.get(data, ['contact', 'email'])
    const deliveryType = _.get(data, 'deliveryType')
    const dateDelivery = moment(_.get(data, 'dateDelivery')).format('DD.MM.YYYY')
    const acceptedTime = (_.get(data, 'acceptedTime')) ? dateTimeFormat(_.get(data, 'acceptedTime')) : 'Не началась'
    const finishedTime = (_.get(data, 'finishedTime')) ? dateTimeFormat(_.get(data, 'finishedTime')) : 'Не закончилась'
    const contract = _.get(data, 'contract') || 'Не указана'

    const REQUESTED = 0
    const READY = 1
    const GIVEN = 2
    const DELIVERED = 3
    const CANCELED = 4
    const status = _.toInteger(_.get(data, 'status'))

    const zero = 0
    const totalPaid = _.toNumber(_.get(data, 'totalPaid'))
    const comment = _.get(data, 'comment')
    const totalBalance = _.get(data, 'totalBalance')
    const totalCost = _.toNumber(_.get(data, 'totalCost'))
    const discountPrice = _.toNumber(_.get(data, 'discountPrice'))
    const price = (discountPrice * hundred) / (totalCost + discountPrice)

    if (loading) {
        return (
            <div className={classes.wrapper} style={loading && {maxHeight: '200px'}}>
                <div className={classes.loader}>
                    <div>
                        <LinearProgress/>
                    </div>
                </div>
            </div>
        )
    }

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>Поставка №: {id}</div>
                <div className={classes.closeDetail}
                     onClick={handleCloseDetail}>
                </div>
                <div className={classes.discountPop}
                     style={openDiscountDialog ? {transform: 'scale(1)'} : {transform: 'scale(0)'}}>
                    <SupplySetDiscountDialog
                        id={id}
                        percent={price}
                        handleSubmitSetZeroDiscountDialog={handleSubmitSetZeroDiscountDialog}
                        setOpenDiscountDialog={setOpenDiscountDialog}
                        onSubmit={handleSubmitDiscountDialog}/>
                    <div className={classes.arrow}></div>
                    <div className={classes.arrowShadow}></div>
                </div>
                <div style={{textAlign: 'center'}}>
                    <FlatButton
                        onTouchTap={() => { handleSupplyExpenseOpenCreateDialog(id) }}
                        labelStyle={{fontSize: '13px'}}
                        className="expenseButton"
                        label="+ добавить доп. расход"/>
                </div>
                <div className={classes.titleButtons}>
                    {updateDialog && <Tooltip position="bottom" text="Изменить">
                        <IconButton
                            disabled={(status === CANCELED)}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={updateDialog.handleOpenUpdateDialog}>
                            <Edit/>
                        </IconButton>
                    </Tooltip>}
                    {confirmDialog && <Tooltip position="bottom" text="Отменить">
                        <IconButton
                            disabled={(status === CANCELED || status === GIVEN || status === DELIVERED)}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                            <Delete/>
                        </IconButton>
                    </Tooltip>}
                </div>
            </div>
            <div className={classes.content}>
                <div className={classes.leftSide}>
                    <div className={classes.subBlock}>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>Номер договора №:</span>
                                    <span>{contract}</span>
                                </li>
                                <li>
                                    <span>Поставщик:</span>
                                    <span>{provider}</span>
                                </li>
                                <li>
                                    <span>Телефон:</span>
                                    <span>{phone}</span>
                                </li>
                                <li>
                                    <span>E-mail:</span>
                                    <span>{email}</span>
                                </li>
                                <li>
                                    <span>Инициатор:</span>
                                    <span>{agent}</span>
                                </li>
                                <li>
                                    <span>Дата доставки</span>
                                    <span>{dateDelivery}</span>
                                </li>

                                <li>
                                    <span>Комментарии:</span>
                                    <span>{comment}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>Баланс</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>Общая стоимость</span>
                                    <span>{numberFormat(totalCost, primaryCurrency)}</span>
                                </li>
                                <li>
                                    <span>Оплачено:</span>
                                    {(totalPaid !== zero && type) ? <span>
                                        <a onClick={transactionsDialog.handleOpenTransactionsDialog}
                                           className={classes.link}>{numberFormat(totalPaid)} {primaryCurrency}</a>
                                    </span>
                                        : <span>{numberFormat(totalPaid)} {primaryCurrency}</span>}
                                </li>
                                <li>
                                    <span>Остаток:</span>
                                    <span
                                        className={totalBalance > zero ? classes.red : classes.green}>{numberFormat(totalBalance)} {primaryCurrency}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>Исполнение</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>Текущий статус:</span>
                                    {(status === REQUESTED) ? <span className={classes.yellow}>Запрос отправлен</span>
                                        : (status === READY) ? <span className={classes.green}>Есть на складе</span>
                                            : (status === GIVEN) ? <span className={classes.yellow}>Передан доставщику</span>
                                                : (status === DELIVERED) ? <span className={classes.green}>Доставлен</span>
                                                    : <span className={classes.red}>Отменен</span>
                                    }
                                </li>
                                <li>
                                    <span>Тип передачи:</span>
                                    <span>{deliveryType > zero ? 'Доставка' : 'Самовывоз'}</span>
                                </li>
                                <li>
                                    <span>Начало приемки:</span>
                                    <span>{acceptedTime}</span>
                                </li>
                                <li>
                                    <span>Конец приемки:</span>
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
    }),
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
    }).isRequired
}

export default SupplyDetails
