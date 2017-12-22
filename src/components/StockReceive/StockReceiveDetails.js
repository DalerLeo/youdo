import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import LinearProgress from '../LinearProgress'
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle'
import RemoveCircleIcon from 'material-ui/svg-icons/content/remove-circle'
import EditIcon from 'material-ui/svg-icons/image/edit'
import numberFormat from '../../helpers/numberFormat'
import {Row, Col} from 'react-flexbox-grid'
import NotFound from '../Images/not-found.png'
import stockTypeFormat from '../../helpers/stockTypeFormat'
import dateFormat from '../../helpers/dateFormat'
import toBoolean from '../../helpers/toBoolean'
import Tooltip from '../ToolTip'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import getConfig from '../../helpers/getConfig'

const RETURN = 3
const APPROVE = 1
const CANCEL = 2
const DELIVERY = 4
const ONE = 1
const TWO = 2
const THREE = 3

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet({
        wrapper: {
            color: '#333 !important',
            display: 'flex',
            width: '100%',
            flexWrap: 'wrap',
            height: 'auto',
            transition: 'max-height 500ms ease !important',
            overflowY: 'auto',
            '& a': {
                color: colorBlue
            }
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '150px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        content: {
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            borderTop: '1px #efefef solid'

        },
        leftSide: {
            flexBasis: '70%',
            maxWidth: '70%',
            padding: '0 30px 5px',
            '& > .row': {
                padding: '15px 0',
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        rightSide: {
            flexBasis: '30%',
            maxWidth: '30%',
            padding: '20px 30px',
            borderLeft: '1px #efefef solid',
            '& > div:last-child': {
                marginTop: '5px'
            }
        },
        subtitle: {
            marginTop: '10px',
            fontWeight: '600'
        },
        titleButtons: {
            display: 'flex',
            zIndex: '3',
            justifyContent: 'flex-end',
            '& button > div': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center 25px',
            backgroundSize: '200px',
            padding: '170px 0 30px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#999',
            width: '100%',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        },
        header: {
            position: 'relative',
            height: '48px',
            padding: '0 30px',
            width: '100%',
            '& .row': {
                alignItems: 'center'
            }
        },
        semibold: {
            lineHeight: '48px',
            height: 'inherit',
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative',
            '& > div': {
                height: '48px'
            }
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
        details: {
            display: 'flex',
            justifyContent: 'space-between',
            '& span': {
                fontWeight: '600'
            }
        }
    }),
    withState('openDetails', 'setOpenDetails', false)
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    button: {
        width: 48,
        height: 48,
        padding: 0,
        color: '#e57373'
    }
}
const iconStyleCheck = {
    icon: {
        color: '#12AAEB',
        width: 22,
        height: 22
    },
    button: {
        width: 48,
        height: 48,
        padding: 0,
        color: '#e57373'
    }
}
const iconStyleCancell = {
    icon: {
        color: '#e57373',
        width: 22,
        height: 22
    },
    button: {
        width: 48,
        height: 48,
        padding: 0,
        color: '#e57373'
    }
}

const ZERO = 0
const TransferDetail = enhance((props) => {
    const {
        classes,
        detailData,
        handleCloseDetail,
        confirmDialog,
        createDialog,
        updateDialog,
        repealDialog,
        history,
        transferHistory,
        popover
    } = props

    let count = 0
    const currentBy = _.get(detailData, ['currentDetail', 'by']) ||
        (_.get(detailData, ['data', 'acceptedBy']) ? _.get(detailData, ['data', 'acceptedBy', 'firstName']) + ' ' + _.get(detailData, ['data', 'acceptedBy', 'secondName']) : false) || 'Не найдено'
    const currentDate = dateFormat(_.get(detailData, ['currentDetail', 'date']))
    const currentStock = _.get(detailData, ['currentDetail', 'stock', 'name'])

    const currentRequestDate = dateFormat(_.get(detailData, ['currentDetail', 'dateRequest']))
    const currentReceiver = _.get(detailData, ['currentDetail', 'receiver'])

    const useBarcode = toBoolean(getConfig('USE_BARCODE'))
    const onClose = _.get(detailData, 'onClose')
    const type = _.get(detailData, 'type')

    const formattedType = stockTypeFormat(type)
    const finishedTime = dateFormat(_.get(detailData, ['data', 'finishedTime']), true)
    const acceptedTime = dateFormat(_.get(detailData, ['data', 'acceptedTime']), true)
    const acceptedBy = _.get(detailData, ['data', 'acceptedBy']) && (_.get(detailData, ['data', 'acceptedBy', 'firstName']) + ' ' + _.get(detailData, ['data', 'acceptedBy', 'firstName']))
    const date = (_.get(detailData, ['data', 'createdDate']) ? dateFormat(_.get(detailData, ['data', 'createdDate'])) : dateFormat(_.get(detailData, ['currentDetail', 'date'])))
    const stockName = _.get(detailData, ['data', 'toStock', 'name']) || _.get(detailData, ['currentDetail', 'stock', 'name'])
    const id = _.get(detailData, 'id') || _.get(detailData, ['data', 'id'])
    const tooltipText = 'Подтвердить Запрос №' + id
    const tooltipCancelText = 'Отменить Запрос №' + id
    const tooltipUpdateText = 'Изменить Запрос №' + id
    const detailLoading = _.get(detailData, 'detailLoading')
    const products = (type === 'order_return') ? _.get(detailData, ['data', 'returnedProducts']) : _.get(detailData, ['data', 'products'])
    let showCount = true
    const showCountChange = _.get(_.head(products), ['product', 'measurement', 'name'])
    const comment = _.get(detailData, ['data', 'comment']) || 'Комментарий отсутствует'

    if (_.isEmpty(products) && !detailLoading) {
        return (
            <div className={classes.wrapper}
                 style={detailLoading ? {padding: '0 30px', border: 'none', maxHeight: '2px'} : {
                     maxHeight: '250px',
                     overflowY: 'hidden'
                 }}>
                <div className={classes.emptyQuery}>
                    <div>Товаров не найдено</div>
                </div>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            {detailLoading
                ? <LinearProgress/>
                : <div style={{width: '100%'}}>
                    <div className={classes.header}>
                        <div className={classes.closeDetail}
                             onClick={handleCloseDetail}>
                        </div>
                        <Row className={classes.semibold} style={history ? {lineHeight: '48px'} : {}}>
                            <Col xs={2}>{id}</Col>
                            <Col xs={(history && transferHistory) ? TWO : THREE}>{currentBy}</Col>
                            <Col xs={2}>{(history && transferHistory) ? currentStock : formattedType}</Col>
                            <Col
                                xs={2}>{(history && transferHistory) ? formattedType : (history ? currentDate : date)}</Col>
                            <Col
                                xs={2}>{(history && transferHistory) ? currentReceiver : (history ? currentStock : stockName)}</Col>
                            <Col xs={(history && transferHistory) ? TWO : ONE} style={{textAlign: 'right'}}>
                                {(history && transferHistory) && currentRequestDate}
                                <div className={classes.titleButtons}>
                                    {!history && (type === 'transfer')
                                        ? <Tooltip position="right" text={tooltipText} style={{color: '#e57373'}}>
                                            <IconButton
                                                iconStyle={iconStyleCheck.icon}
                                                style={iconStyleCheck.button}
                                                touch={true}
                                                onTouchTap={() => {
                                                    confirmDialog.handleOpenConfirmDialog(APPROVE)
                                                }}>
                                                <CheckCircleIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        : (!history && type === 'delivery_return')
                                            ? <Tooltip position="right" text={tooltipText}>
                                                <IconButton
                                                    iconStyle={iconStyleCheck.icon}
                                                    style={iconStyleCheck.button}
                                                    touch={true}
                                                    onTouchTap={() => {
                                                        confirmDialog.handleOpenConfirmDialog(DELIVERY)
                                                    }}>
                                                    <CheckCircleIcon/>
                                                </IconButton>
                                            </Tooltip>
                                            : (!history && type === 'order_return')
                                                ? <Tooltip position="right" text={tooltipText}>
                                                    <IconButton
                                                        iconStyle={iconStyleCheck.icon}
                                                        style={iconStyleCheck.button}
                                                        touch={true}
                                                        onTouchTap={() => {
                                                            confirmDialog.handleOpenConfirmDialog(RETURN)
                                                        }}>
                                                        <CheckCircleIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                                : (type === 'supply')
                                                    ? (!history
                                                        ? <Tooltip position="right" text={tooltipText}>
                                                            <IconButton
                                                                iconStyle={iconStyleCheck.icon}
                                                                style={iconStyleCheck.button}
                                                                touch={true}
                                                                onTouchTap={() => {
                                                                    createDialog.handleOpenCreateDialog()
                                                                }}>
                                                                <CheckCircleIcon/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        : <Tooltip position="right" text={tooltipUpdateText}>
                                                            <IconButton
                                                                iconStyle={iconStyle.icon}
                                                                style={iconStyle.button}
                                                                touch={true}
                                                                disabled={history}
                                                                onTouchTap={() => {
                                                                    updateDialog.handleOpenUpdateDialog()
                                                                }}>
                                                                <EditIcon/>
                                                            </IconButton>
                                                        </Tooltip>)
                                                    : null
                                    }

                                    {!history && type === 'transfer' &&
                                    <Tooltip position="right" text={tooltipCancelText}>
                                        <IconButton
                                            iconStyle={iconStyleCancell.icon}
                                            style={iconStyleCancell.button}
                                            onTouchTap={() => {
                                                confirmDialog.handleOpenConfirmDialog(CANCEL)
                                            }}
                                            touch={true}>
                                            <RemoveCircleIcon/>
                                        </IconButton>
                                    </Tooltip>}
                                    {!history && type === 'delivery_return' &&
                                    <Tooltip position="right" text={tooltipCancelText}>
                                        <IconButton
                                            iconStyle={iconStyleCancell.icon}
                                            style={iconStyleCancell.button}
                                            onTouchTap={() => {
                                                confirmDialog.handleOpenConfirmDialog(DELIVERY)
                                            }}
                                            touch={true}>
                                            <RemoveCircleIcon/>
                                        </IconButton>
                                    </Tooltip>}
                                    {history && type !== 'transfer' && type !== 'delivery_return' &&
                                    <Tooltip position="right" text={tooltipCancelText}>
                                        <IconButton
                                            iconStyle={iconStyleCancell.icon}
                                            style={iconStyleCancell.button}
                                            onTouchTap={() => {
                                                repealDialog.handleOpenRepealDialog(id)
                                            }}
                                            touch={true}>
                                            <RemoveCircleIcon/>
                                        </IconButton>
                                    </Tooltip>}
                                    {popover && !history && <IconButton onTouchTap={onClose}>
                                        <CloseIcon color="#666666"/>
                                    </IconButton>}
                                </div>
                            </Col>

                        </Row>
                    </div>
                    <div className={classes.content}>
                        {history && <div className={classes.leftSide}>
                            <Row className='dottedList'>
                                <Col xs={4}>Товар</Col>
                                <Col xs={4}>Тип товара</Col>
                                <Col xs={1}>Кол-во</Col>
                                <Col xs={1}>Принято</Col>
                                <Col xs={1}>Брак</Col>
                                <Col xs={1}>Недостача</Col>

                            </Row>
                            {_.map(products, (item) => {
                                const productId = _.get(item, 'id')
                                const name = _.get(item, ['product', 'name'])
                                const measurement = _.get(item, ['product', 'measurement', 'name'])
                                const productType = _.get(item, ['product', 'type', 'name'])
                                const amount = _.get(item, 'amount')
                                const postedAmount = _.get(item, 'postedAmount')
                                const defectAmount = _.get(item, 'defectAmount')
                                const notAccepted = postedAmount + defectAmount < amount ? numberFormat(amount - defectAmount - postedAmount, measurement) : numberFormat(ZERO, measurement)

                                return (
                                    <Row key={productId} className='dottedList'>
                                        <Col xs={4}>{name}</Col>
                                        <Col xs={4}>{productType}</Col>
                                        <Col xs={1}>{numberFormat(amount, measurement)}</Col>
                                        <Col xs={1}>{numberFormat(postedAmount, measurement)}</Col>
                                        <Col xs={1}>
                                            {(defectAmount > ZERO) ? <span
                                                    className={classes.defect}>{numberFormat(defectAmount, measurement)}</span>
                                                : <span>{numberFormat(defectAmount, measurement)}</span>}
                                        </Col>
                                        <Col xs={1}>{notAccepted}</Col>
                                    </Row>
                                )
                            })}
                        </div>}
                        {!history && <div className={classes.leftSide}>
                            <Row className='dottedList'>
                                <Col xs={4}>Товар</Col>
                                <Col xs={4}>Тип товара</Col>
                                <Col xs={2}>Кол-во</Col>
                                <Col xs={2}>Статус</Col>
                            </Row>
                            {_.map(products, (item) => {
                                const productId = _.get(item, 'id')
                                const name = _.get(item, ['product', 'name'])
                                const measurement = _.get(item, ['product', 'measurement', 'name'])
                                const productType = _.get(item, ['product', 'type', 'name'])
                                const isDefect = toBoolean(_.get(item, 'isDefect')) ? 'Брак' : 'ОК'
                                const amount = numberFormat(_.get(item, 'amount'), measurement)
                                count += _.toNumber(_.get(item, 'amount'))
                                if (measurement !== showCountChange) {
                                    showCount = false
                                }
                                return (
                                    <Row key={productId} className='dottedList'>
                                        <Col xs={4}>{name}</Col>
                                        <Col xs={4}>{productType}</Col>
                                        <Col xs={2}>{amount}</Col>
                                        <Col xs={2}>{isDefect}</Col>
                                    </Row>
                                )
                            })}
                            {showCount && <Row className='dottedList'>
                                <b>Общий количество {count} {showCountChange}</b>
                            </Row>}
                        </div>
                        }
                        <div className={classes.rightSide}>
                            {history && useBarcode &&
                            <div>
                                <div className={classes.details}>Начало приемки: <span>{acceptedTime}</span></div>
                                <div className={classes.details}>Конец приемки: <span>{finishedTime}</span></div>
                                <div className={classes.details}>Принял: <span>{acceptedBy}</span></div>
                            </div>
                            }
                            {history && !useBarcode &&
                            <div>
                                <div className={classes.details}>Дата приемки: <span>{acceptedTime}</span></div>
                                <div className={classes.details}>Принял: <span>{acceptedBy}</span></div>
                            </div>}
                            <div className={classes.subtitle}>Комментарий:</div>
                            <div>{comment}</div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
})

TransferDetail.propTypes = {
    detailData: PropTypes.object.isRequired
}

export default TransferDetail
