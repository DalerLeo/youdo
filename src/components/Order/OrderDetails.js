import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
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
import Dot from '../Images/dot.png'
import moment from 'moment'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'

const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            color: '#333 !important',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap'
        },
        dropdown: {
            position: 'relative',
            paddingRight: '18px',
            zIndex: '4',
            '&:after': {
                top: '10px',
                right: '0',
                content: '""',
                position: 'absolute',
                borderTop: '5px solid',
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent'
            }
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
            height: '400px',
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
            padding: '0 30px'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600',
            cursor: 'pointer'
        },
        titleSupplier: {
            fontSize: '18px',
            position: 'relative',
            '& .supplierDetails': {
                background: '#fff',
                boxShadow: '0 2px 5px 0px rgba(0, 0, 0, 0.16)',
                fontSize: '13px',
                position: 'absolute',
                padding: '64px 28px 20px',
                top: '-21px',
                left: '50%',
                zIndex: '3',
                minWidth: '300px',
                transform: 'translate(-50%, 0)',
                '& .detailsWrap': {
                    position: 'relative',
                    paddingTop: '10px',
                    '&:before': {
                        content: '""',
                        background: 'url(' + Dot + ')',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        height: '2px'
                    }
                },
                '& .detailsList': {
                    padding: '10px 0',
                    '& > div': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    },
                    '&:last-child': {
                        paddingBottom: '0'
                    },
                    '& div:first-child': {
                        color: '#666'
                    }
                }
            }
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        content: {
            display: 'flex',
            width: '100%'
        },
        padding: {
            padding: '20px 30px'
        },
        leftSide: {
            flexBasis: '30%',
            maxWidth: '30%',
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
                justifyContent: 'space-between',
                lineHeight: '25px',
                width: '100%',
                '& span:last-child': {
                    fontWeight: '600',
                    textAlign: 'right'
                }
            },
            '& .lineDote': {
                margin: '10px 0'
            }
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

const OrderDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        transactionsDialog,
        returnDialog,
        returnListData,
        returnDataLoading,
        itemReturnDialog,
        confirmDialog,
        handleOpenUpdateDialog,
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

    const client = _.get(data, ['client', 'name'])
    const deliveryType = _.get(data, 'deliveryType')
    const dateDelivery = moment(_.get(data, 'dateDelivery')).format('DD.MM.YYYY')

    const REQUESTED = 0
    const READY = 1
    const DELIVERED = 2
    const status = _.toInteger(_.get(data, 'status'))

    const percent = 100
    const zero = 0
    const deliveryPrice = _.toNumber(_.get(data, 'deliveryPrice'))
    const discountPrice = _.toNumber(_.get(data, 'discountPrice'))
    const totalPrice = _.toNumber(_.get(data, 'totalPrice'))
    const totalPaid = _.get(data, 'totalPaid')
    const totalBalance = _.get(data, 'totalBalance')
    const discount = (discountPrice / (discountPrice + totalPrice)) * percent

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={40} thickness={4}/>
                </div>
            </div>
        )
    }
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}
                     onClick={handleCloseDetail}>Заказ №{id}</div>
                <div className={classes.titleSupplier}>
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
            </div>
            <div className={classes.content}>
                <div className={classes.leftSide}>
                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>Информация</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>Клиент:</span>
                                    <span>{client}</span>
                                </li>
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

                                <hr className="lineDote"/>

                                <li>
                                    <span>Магазин:</span>
                                    <span>{market}</span>
                                </li>
                                <li>
                                    <span>Инициатор:</span>
                                    <span>{agent}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>Баланс</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>Дата оплаты:</span>
                                    <span>22.05.2017</span>
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
                                    <span>Оплачено:</span>
                                    {(totalPaid !== zero) ? <span>
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
                <RightSide
                    data={data}
                    tabData={tabData}
                    itemReturnDialog={itemReturnDialog}
                    returnData={returnData}
                    returnDataLoading={returnDataLoading}
                />
            </div>
            <OrderTransactionsDialog
                open={transactionsDialog.openTransactionsDialog}
                loading={transactionsDialog.transactionsLoading}
                onClose={transactionsDialog.handleCloseTransactionsDialog}
                paymentData={paymentData}
            />
            <OrderReturnDialog
                open={returnDialog.openReturnDialog}
                loading={returnDialog.returnLoading}
                onClose={returnDialog.handleCloseReturnDialog}
                onSubmit={returnDialog.handleSubmitReturnDialog}
                orderData={data}
            />
            <OrderItemReturnDialog
                returnListData={returnListData}
                open={itemReturnDialog.openOrderItemReturnDialog}
                loading={itemReturnDialog.returnDialogLoading}
                onClose={itemReturnDialog.handleCloseItemReturnDialog}
            />
        </div>
    )
})

OrderDetails.propTypes = {
    paymentData: PropTypes.object,
    returnListData: PropTypes.object,
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    }).isRequired,
    data: PropTypes.object.isRequired,
    returnData: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    returnDialog: PropTypes.shape({
        returnLoading: PropTypes.bool.isRequired,
        openReturnDialog: PropTypes.bool.isRequired,
        handleOpenReturnDialog: PropTypes.func.isRequired,
        handleCloseReturnDialog: PropTypes.func.isRequired
    }).isRequired,
    itemReturnDialog: PropTypes.shape({
        returnDialogLoading: PropTypes.bool.isRequired,
        openOrderItemReturnDialog: PropTypes.bool.isRequired,
        handleOpenItemReturnDialog: PropTypes.func.isRequired,
        handleCloseItemReturnDialog: PropTypes.func.isRequired
    }).isRequired,
    handleOpenUpdateDialog: PropTypes.func.isRequired,
    orderListData: PropTypes.object,
    getDocument: PropTypes.shape({
        handleGetDocument: PropTypes.func.isRequired
    }),
    returnDataLoading: PropTypes.bool
}

export default OrderDetails
