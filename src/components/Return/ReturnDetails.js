import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import {Row, Col} from 'react-flexbox-grid'
import Delete from 'material-ui/svg-icons/action/delete'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import IconButton from 'material-ui/IconButton'
import PrintIcon from 'material-ui/svg-icons/action/print'
import ConfirmDialog from '../ConfirmDialog'
import Tooltip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import getConfig from '../../helpers/getConfig'

const ZERO = 0

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
            width: '100%'
        },
        padding: {
            padding: '20px 30px'
        },
        leftSide: {
            width: '320px',
            borderRight: '1px #efefef solid'
        },
        rightSide: {
            padding: '0 30px',
            width: 'calc(100% - 320px)'
        },
        list: {
            maxHeight: '384px',
            overflowX: 'hidden',
            overflowY: 'auto',
            paddingRight: '20px',
            '& .row': {
                padding: '15px 0',
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
const ONE = 1
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
        isAdmin
    } = props

    const id = _.get(data, 'id')
    const user = _.get(data, ['createdBy', 'firstName']) + ' ' + _.get(data, ['createdBy', 'secondName'])
    const createdDate = dateTimeFormat(_.get(data, 'createdDate'))
    const finishedTime = _.get(data, 'acceptedTime') ? dateTimeFormat(_.get(data, 'finishedTime'), true) : 'Не установлена'
    const acceptedBy = _.get(data, ['acceptedBy', 'firstName'])
    const acceptedDate = _.get(data, 'acceptedTime') ? dateTimeFormat(_.get(data, 'acceptedTime')) : 'Не установлена'
    const comment = _.get(data, 'comment')
    const stock = _.get(data, ['stock', 'name'])
    const order = _.get(data, 'order')
    const client = _.get(data, ['client', 'name'])
    const market = _.get(data, 'market')
    const status = _.toInteger(_.get(data, 'status'))
    const PENDING = 0
    const IN_PROGRESS = 1
    const COMPLETED = 2
    const CANCELLED = 3
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const totalPrice = numberFormat(_.get(data, 'totalPrice'), primaryCurrency)
    const edit = status === PENDING || status === IN_PROGRESS

    const products = _.get(data, 'returnedProducts')
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
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>Возврат №{id}</div>
                <div className={classes.closeDetail}
                     onClick={handleCloseDetail}>
                </div>
                <div className={classes.titleButtons}>
                    {getDocument && !stat && <Tooltip position="bottom" text="Распечатать накладную">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { getDocument.handleGetDocument(id) }}>
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>}
                    {isAdmin && <Tooltip position="bottom" text="Изменить">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            disabled={!edit}
                            touch={true}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                            <Edit />
                        </IconButton>
                    </Tooltip>}
                    {confirmDialog && !stat && <Tooltip position="bottom" text="Отменить">
                        <IconButton
                            disabled={!(status === IN_PROGRESS || status === PENDING)}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                            <Delete />
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
                                    <span>Добавил:</span>
                                    <span>{user}</span>
                                </li>
                                {order && <li>
                                    <span>Заказ №:</span>
                                    <span>{order}</span>
                                </li>}
                                <li>
                                    <span>Склад:</span>
                                    <span>{stock}</span>
                                </li>
                                <li>
                                    <span>Начало приемки:</span>
                                    <span>{acceptedDate}</span>
                                </li>
                                <li>
                                    <span>Конец приемки:</span>
                                    <span>{finishedTime}</span>
                                </li>
                                <li>
                                    <span>Принял:</span>
                                    <span>{acceptedBy}</span>
                                </li>
                                <li>
                                    <span>Дата возврата:</span>
                                    <span>{createdDate}</span>
                                </li>
                                {client && <li>
                                    <span>Клиент:</span>
                                    <span>{client}</span>
                                </li>}
                                {market && <li>
                                    <span>Магазин:</span>
                                    <span>{_.get(market, 'name')}</span>
                                </li>}
                                <li>
                                    <span>Статус:</span>
                                    <span>
                                        {(status === PENDING || status === IN_PROGRESS)
                                            ? 'Ожидает'
                                            : (status === COMPLETED)
                                                ? 'Завершен'
                                                : (status === CANCELLED)
                                                    ? 'Отменен' : null}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={classes.subBlock}>
                        <div className={classes.dataBox}>
                            <ul>
                                <li style={{display: 'block'}}>Причина возврата:&nbsp;<strong>{comment}</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.list}>
                        <Row className="dottedList">
                            <Col xs={4}>Товар</Col>
                            <Col xs={2}>Код товара</Col>
                            <Col xs={2}>Количество</Col>
                            <Col xs={2}>Цена ({primaryCurrency})</Col>
                            <Col xs={2}>Сумма ({primaryCurrency})</Col>
                        </Row>
                        {_.map(products, (item) => {
                            const product = _.get(item, ['product', 'name'])
                            const measurement = _.get(item, ['product', 'measurement', 'name'])
                            const code = _.get(item, ['product', 'code'])
                            const amount = _.toNumber(_.get(item, 'amount'))
                            const returnId = _.get(item, 'id')
                            const cost = _.toNumber(_.get(item, 'price'))
                            const summmary = amount * cost
                            return (
                                <Row key={returnId} className="dottedList">
                                    <Col xs={4}>{product}</Col>
                                    <Col xs={2}>{code}</Col>
                                    <Col xs={2}>{numberFormat(amount, measurement)}</Col>
                                    <Col xs={2}>{numberFormat(cost)}</Col>
                                    <Col xs={2}>{numberFormat(summmary)}</Col>
                                </Row>
                            )
                        })}
                    </div>
                    <div className={classes.total}>Итого: {totalPrice}</div>
                </div>
            </div>
            {type && <ConfirmDialog
                type="cancel"
                message={'Возврат № ' + cancelReturnDialog.openCancelDialog}
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
