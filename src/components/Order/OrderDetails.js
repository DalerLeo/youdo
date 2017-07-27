import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'
import OrderTransactionsDialog from './OrderTransactionsDialog'
import OrderReturnDialog from './OrderReturnDialog'
import OrderItemReturnDialog from './OrderItemReturnDialog'
import RightSide from './OrderDetailsRightSideTabs'
import IconButton from 'material-ui/IconButton'
import Return from 'material-ui/svg-icons/content/reply'
import File from 'material-ui/svg-icons/editor/insert-drive-file'
import Tooltip from '../ToolTip'
import moment from 'moment'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import StatRightSide from './OrderStatDetailsRightSide'
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
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: '3'
        },
        content: {
            display: 'flex',
            width: '100%',
            '& > div': {
                boxSizing: 'border-box'
            }
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
                border: 'none'
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
        }
    }),
    withState('openInfo', 'setOpenInfo', false)
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

const OrderDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        setOpenInfo,
        openInfo,
        transactionsDialog,
        returnDialog,
        returnListData,
        returnDataLoading,
        itemReturnDialog,
        confirmDialog,
        handleOpenUpdateDialog,
        type,
        tabData,
        paymentData,
        getDocument,
        returnData,
        handleCloseDetail
    } = props

    const id = _.get(data, 'id')
    const contactName = _.get(data, ['contact', 'name'])
    const contactEmail = _.get(data, ['contact', 'email']) || 'N/A'
    const contactPhone = _.get(data, ['contact', 'telephone']) || 'N/A'
    const market = _.get(data, ['market', 'name'])
    const agent = _.get(data, ['user', 'firstName']) + ' ' + _.get(data, ['user', 'secondName'])
    const dealType = _.get(data, 'dealType')

    const client = _.get(data, ['client', 'name'])
    const deliveryType = _.get(data, 'deliveryType')
    const dateDelivery = moment(_.get(data, 'dateDelivery')).format('DD.MM.YYYY')
    const createdDate = moment(_.get(data, 'createdDate')).format('DD.MM.YYYY')
    const paymentDate = moment(_.get(data, 'paymentDate')).format('DD.MM.YYYY')

    const REQUESTED = 0
    const READY = 1
    const GIVEN = 2
    const DELIVERED = 3
    const status = _.toInteger(_.get(data, 'status'))

    const percent = 100
    const zero = 0
    const deliveryPrice = _.toNumber(_.get(data, 'deliveryPrice'))
    const discountPrice = _.toNumber(_.get(data, 'discountPrice'))
    const totalPrice = _.toNumber(_.get(data, 'totalPrice'))
    const totalPaid = _.get(data, 'totalPaid')
    const paymentType = _.get(data, 'paymentType')
    const totalBalance = _.get(data, 'totalBalance')
    const discount = (discountPrice / (discountPrice + totalPrice)) * percent

    let productTotal = _.toNumber(zero)
    _.map(_.get(data, 'products'), (item) => {
        productTotal += _.toNumber(_.get(item, 'totalPrice'))
    })
    if (loading) {
        return (
            <div className={classes.wrapper} style={loading && {maxHeight: '200px'}}>
                <div className={classes.loader}>
                    <div>
                        <CircularProgress size={40} thickness={4}/>
                    </div>
                </div>
            </div>
        )
    }
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    return (
        <div className={classes.wrapper}>
            {type && <div className={classes.title}>
                <div className={classes.titleLabel}>Заказ №{id}</div>
                <div className={classes.closeDetail}
                     onClick={handleCloseDetail}>
                </div>
                <div className={classes.titleButtons}>
                    <Tooltip position="bottom" text="Добавить возврат">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={returnDialog.handleOpenReturnDialog}>
                            <Return />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text="Скачать договор">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { getDocument.handleGetDocument(id) }}>
                            <File />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text="Изменить">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={handleOpenUpdateDialog}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text="Отменить">
                        <IconButton
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
                                <li onMouseEnter={() => { setOpenInfo(true) }}
                                    onMouseLeave={() => {
                                        if (openInfo) {
                                            setOpenInfo(false)
                                        }
                                    }}>
                                    <span>Клиент:</span>
                                    <a><strong>{client}</strong></a>

                                    <Paper zDepth={1} style={openInfo && {opacity: '1', zIndex: '2', top: '0'}}>
                                        <li>
                                            <span>Контактное лицо:</span>
                                            <span>{contactName}</span>
                                        </li>
                                        <li>
                                            <span>Телефон:</span>
                                            <span>{contactPhone}</span>
                                        </li>
                                        <li>
                                            <span>Email:</span>
                                            <span>{contactEmail}</span>
                                        </li>
                                    </Paper>
                                </li>

                                <li>
                                    <span>Магазин:</span>
                                    <span>{market}</span>
                                </li>
                                <li>
                                    <span>Инициатор:</span>
                                    <span>{agent}</span>
                                </li>
                                <li>
                                    <span>Дата создания</span>
                                    <span>{createdDate}</span>
                                </li>

                                <li>
                                    <span>Тип сделки:</span>
                                    <span>{(dealType === '0') ? 'Стандартная' : 'Консигнация'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>Баланс</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>Дата ожидаемой оплаты:</span>
                                    <span>{paymentDate}</span>
                                </li>
                                <li>
                                    <span>Тип оплаты:</span>
                                    <span>{(paymentType === '0') ? 'Наличными' : 'Перечислением'}</span>
                                </li>
                                <li>
                                    <span>Стоимость товаров</span>
                                    <span>{numberFormat(productTotal, primaryCurrency)}</span>
                                </li>
                                <li>
                                    <span>Стоимость доставки:</span>
                                    <span>{numberFormat(deliveryPrice)} {primaryCurrency}</span>
                                </li>
                                <li>
                                    <span>Скидка({discount}%):</span>
                                    <span>{numberFormat(discountPrice)} {primaryCurrency}</span>
                                </li>
                                <li>
                                    <span>ИТОГО</span>
                                    <span>{numberFormat(totalPrice, primaryCurrency)}</span>
                                </li>
                                <li>
                                    <span>Оплачено:</span>
                                    {(totalPaid !== zero && type) ? <span>
                                        <a onClick={transactionsDialog.handleOpenTransactionsDialog} className={classes.link}>{numberFormat(totalPaid)} {primaryCurrency}</a>
                                    </span>
                                        : <span>{totalPaid} {primaryCurrency}</span>}
                                </li>
                                <li>
                                    <span>Остаток:</span>
                                    <span className={totalBalance > zero ? classes.red : classes.green}>{numberFormat(totalBalance)} {primaryCurrency}</span>
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
                                        : (status === READY) ? <span className={classes.green}>Готов</span>
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
                                    <span>Дата передачи:</span>
                                    <span>{dateDelivery}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {type &&
                <RightSide
                    data={data}
                    tabData={tabData}
                    itemReturnDialog={itemReturnDialog}
                    returnData={returnData}
                    returnDataLoading={returnDataLoading}
                />}
                {!type &&
                <StatRightSide
                    data={data}/>}
            </div>
            {type && <OrderTransactionsDialog
                open={transactionsDialog.openTransactionsDialog}
                loading={transactionsDialog.transactionsLoading}
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
            {type && <OrderItemReturnDialog
                returnListData={returnListData}
                open={itemReturnDialog.openOrderItemReturnDialog}
                loading={itemReturnDialog.returnDialogLoading}
                onClose={itemReturnDialog.handleCloseItemReturnDialog}
            />}
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
    data: PropTypes.object.isRequired,
    returnData: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    returnDialog: PropTypes.shape({
        returnLoading: PropTypes.bool,
        openReturnDialog: PropTypes.bool,
        handleOpenReturnDialog: PropTypes.func,
        handleCloseReturnDialog: PropTypes.func
    }),
    itemReturnDialog: PropTypes.shape({
        returnDialogLoading: PropTypes.bool,
        openOrderItemReturnDialog: PropTypes.bool,
        handleOpenItemReturnDialog: PropTypes.func,
        handleCloseItemReturnDialog: PropTypes.func
    }),
    handleOpenUpdateDialog: PropTypes.func,
    orderListData: PropTypes.object,
    getDocument: PropTypes.shape({
        handleGetDocument: PropTypes.func.isRequired
    }),
    returnDataLoading: PropTypes.bool
}

export default OrderDetails
