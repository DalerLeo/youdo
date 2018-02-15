import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../LinearProgress'
import {Row, Col} from 'react-flexbox-grid'
import Delete from 'material-ui/svg-icons/action/delete'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import IconButton from 'material-ui/IconButton'
import PrintIcon from 'material-ui/svg-icons/action/print'
import ConfirmDialog from '../ConfirmDialog'
import ToolTip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import t from '../../helpers/translate'
import checkPermission from '../../helpers/checkPermission'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import * as ROUTES from '../../constants/routes'
import {
    ZERO,
    ORDER_RETURN_PENDING,
    ORDER_RETURN_IN_PROGRESS,
    ORDER_RETURN_COMPLETED,
    ORDER_RETURN_CANCELED
} from '../../constants/backendConstants'

// CHECKING PERMISSIONS
const canEditOrderReturn = checkPermission('change_orderreturn')
const canCancelOrderReturn = checkPermission('delete_orderreturn')

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
            width: '100%'
        },
        padding: {
            padding: '20px 30px'
        },
        leftSide: {
            width: '350px',
            borderRight: '1px #efefef solid'
        },
        rightSide: {
            padding: '0 30px',
            width: 'calc(100% - 350px)'
        },
        list: {
            maxHeight: '384px',
            overflowX: 'hidden',
            overflowY: 'auto',
            paddingRight: '20px',
            '& .row': {
                padding: '15px',
                margin: '0',
                '&:first-child': {
                    fontWeight: '600'
                },
                '& > div:first-child': {
                    paddingLeft: '0'
                },
                '& > div:last-child': {
                    textAlign: 'right',
                    paddingRight: '0'
                },
                '& > div:nth-child(4)': {
                    textAlign: 'right'
                },
                '&:first-child:hover': {
                    backgroundColor: 'unset'
                },
                '&:hover': {
                    backgroundColor: '#f2f5f8'
                }
            }
        },
        total: {
            textTransform: 'uppercase',
            fontWeight: '600',
            textAlign: 'right',
            padding: '15px 20px 20px 0'
        },
        subBlock: {
            padding: '15px 30px',
            borderBottom: '1px #efefef solid',
            '&:last-child': {
                borderBottom: 'none',
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
const RETURN_TYPE_CLIENT = 2
const ReturnDetails = enhance((props) => {
    const {
        classes,
        loading,
        data,
        cancelReturnDialog,
        confirmDialog,
        updateDialog,
        type,
        getDocument,
        handleCloseDetail,
        stat,
        hasMarket
    } = props

    const id = _.get(data, 'id')
    const user = _.get(data, ['createdBy', 'firstName']) + ' ' + _.get(data, ['createdBy', 'secondName'])
    const createdDate = dateTimeFormat(_.get(data, 'createdDate'))
    const finishedTime = _.get(data, 'acceptedTime') ? dateTimeFormat(_.get(data, 'finishedTime'), true) : t('Не установлен')
    const acceptedBy = _.get(data, ['acceptedBy'])
        ? _.get(data, ['acceptedBy', 'firstName']) + ' ' + _.get(data, ['acceptedBy', 'secondName'])
        : t('Не принят')
    const acceptedDate = _.get(data, 'acceptedTime') ? dateTimeFormat(_.get(data, 'acceptedTime')) : t('Не установлено')
    const comment = _.get(data, 'comment')
    const stock = _.get(data, ['stock', 'name'])
    const order = _.get(data, 'order')
    const client = _.get(data, ['client', 'name'])
    const currency = _.get(data, ['currency', 'name'])
    const priceList = _.get(data, ['priceList', 'name'])
    const market = _.get(data, 'market')
    const status = _.toInteger(_.get(data, 'status'))
    const paymentType = _.get(data, 'paymentType') === 'cash' ? t('Наличными') : t('Перечислением')
    const totalPrice = numberFormat(_.get(data, 'totalPrice'), currency)
    const typeClient = _.toInteger(_.get(data, 'type'))

    const products = _.get(data, 'returnedProducts')
    if (loading) {
        return (
            <div className={classes.wrapper} style={loading ? {maxHeight: '100px'} : {}}>
                <div className={classes.loader}>
                    <LinearProgress/>
                </div>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{t('Возврат')} №{id}</div>
                <div className={classes.closeDetail}
                     onClick={handleCloseDetail}>
                </div>
                <div className={classes.titleButtons}>
                    {getDocument && !stat &&
                    <ToolTip position="bottom" text={t('Распечатать накладную')}>
                        <IconButton
                            disabled={status === ORDER_RETURN_CANCELED}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { getDocument.handleGetDocument(id) }}>
                            <PrintIcon />
                        </IconButton>
                    </ToolTip>}
                    {!stat && canEditOrderReturn &&
                    <ToolTip position="bottom" text={!canEditOrderReturn && typeClient === RETURN_TYPE_CLIENT ? t('У вас нет доступа') : t('Изменить')}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            disabled={status === ORDER_RETURN_CANCELED || (order && status === ORDER_RETURN_COMPLETED) || (!canEditOrderReturn && typeClient === RETURN_TYPE_CLIENT)}
                            touch={true}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog() }}>
                            <Edit />
                        </IconButton>
                    </ToolTip>}
                    {confirmDialog && canCancelOrderReturn && !stat &&
                    <ToolTip position="bottom" text={!canEditOrderReturn && typeClient === RETURN_TYPE_CLIENT ? t('У вас нет доступа') : t('Отменить')}>
                        <IconButton
                            disabled={!(status === ORDER_RETURN_IN_PROGRESS || status === ORDER_RETURN_PENDING) || (!canEditOrderReturn && typeClient === RETURN_TYPE_CLIENT)}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                            <Delete />
                        </IconButton>
                    </ToolTip>}
                </div>
            </div>
            <div className={classes.content}>
                <div className={classes.leftSide}>
                    <div className={classes.subBlock}>
                        <div className={classes.dataBox}>
                            <ul>
                                {order && <li>
                                    <Link to={{
                                        pathname: sprintf(ROUTES.ORDER_ITEM_PATH, order),
                                        query: {search: order, exclude: false}
                                    }}><strong>{t('Заказ')} №{order}</strong></Link>
                                </li>}
                                <li>
                                    <span>{t('Добавил')}:</span>
                                    <span>{user}</span>
                                </li>
                                {client && <li>
                                    <span>{t('Клиент')}:</span>
                                    <span>{client}</span>
                                </li>}
                                {market && hasMarket && <li>
                                    <span>{t('Магазин')}:</span>
                                    <span>{_.get(market, 'name')}</span>
                                </li>}
                                <li>
                                    <span>{t('Дата возврата')}:</span>
                                    <span>{createdDate}</span>
                                </li>
                                <li>
                                    <span>{t('Валюта')}:</span>
                                    <span>{currency}</span>
                                </li>
                                <li>
                                    <span>{t('Прайс-лист')}:</span>
                                    <span>{priceList}</span>
                                </li>
                                <li>
                                    <span>{t('Тип оплаты')}</span>
                                    <span>{paymentType}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>{t('Склад')}</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>{t('Склад')}:</span>
                                    <span>{stock}</span>
                                </li>
                                <li>
                                    <span>{t('Начало приемки')}:</span>
                                    <span>{acceptedDate}</span>
                                </li>
                                <li>
                                    <span>{t('Конец приемки')}:</span>
                                    <span>{finishedTime}</span>
                                </li>
                                <li>
                                    <span>{t('Принял')}:</span>
                                    <span>{acceptedBy}</span>
                                </li>
                                <li>
                                    <span>{t('Статус')}:</span>
                                    <span>
                                        {(status === ORDER_RETURN_PENDING || status === ORDER_RETURN_IN_PROGRESS)
                                            ? <span className={classes.yellow}>{t('Ожидает')}</span>
                                            : (status === ORDER_RETURN_COMPLETED)
                                                ? <span className={classes.green}>{t('Завершен')}</span>
                                                : (status === ORDER_RETURN_CANCELED)
                                                    ? <span className={classes.red}>{t('Отменен')}</span> : null}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={classes.subBlock}>
                        <div className={classes.dataBox}>
                            <ul>
                                <li style={{display: 'block'}}>{t('Причина возврата')}:&nbsp;<strong>{comment}</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.list}>
                        <Row className="dottedList">
                            <Col xs={1}>{t('Заказ')}</Col>
                            <Col xs={3}>{t('Товар')}</Col>
                            <Col xs={2}>{t('Код товара')}</Col>
                            <Col xs={2}>{t('Количество')}</Col>
                            <Col xs={2}>{t('Цена')} ({currency})</Col>
                            <Col xs={2}>{t('Сумма')} ({currency})</Col>
                        </Row>
                        {_.map(products, (item) => {
                            const productOrder = _.get(item, 'order')
                            const product = _.get(item, ['product', 'name'])
                            const measurement = _.get(item, ['product', 'measurement', 'name'])
                            const code = _.get(item, ['product', 'code'])
                            const amount = _.toNumber(_.get(item, 'amount'))
                            const returnId = _.get(item, 'id')
                            const cost = _.toNumber(_.get(item, 'price'))
                            const summmary = amount * cost
                            return (
                                <Row key={returnId} className="dottedList">
                                    <Col xs={1}>{productOrder}</Col>
                                    <Col xs={3}>{product}</Col>
                                    <Col xs={2}>{code}</Col>
                                    <Col xs={2}>{numberFormat(amount, measurement)}</Col>
                                    <Col xs={2}>{numberFormat(cost)}</Col>
                                    <Col xs={2}>{numberFormat(summmary)}</Col>
                                </Row>
                            )
                        })}
                    </div>
                    <div className={classes.total}>{t('Итого')}: {totalPrice}</div>
                </div>
            </div>
            {type &&
            <ConfirmDialog
                type="cancel"
                message={t('Возврат') + ' №' + cancelReturnDialog.openCancelDialog}
                onClose={cancelReturnDialog.handleCloseCancelReturnDialog}
                onSubmit={cancelReturnDialog.handleSubmitCancelReturnDialog}
                open={cancelReturnDialog.openCancelDialog > ZERO}/>
            }
        </div>
    )
})

ReturnDetails.propTypes = {
    data: PropTypes.object.isRequired,
    returnData: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    orderListData: PropTypes.object,
    getDocument: PropTypes.shape({
        handleGetDocument: PropTypes.func.isRequired
    }),
    cancelReturnDialog: PropTypes.shape({
        openCancelDialog: PropTypes.number.isRequired,
        handleOpenCancelReturnDialog: PropTypes.func.isRequired,
        handleCloseCancelReturnDialog: PropTypes.func.isRequired,
        handleSubmitCancelReturnDialog: PropTypes.func.isRequired
    })
}

export default ReturnDetails
