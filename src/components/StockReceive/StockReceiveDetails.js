import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../LinearProgress'
import numberFormat from '../../helpers/numberFormat'
import {Row, Col} from 'react-flexbox-grid'
import NotFound from '../Images/not-found.png'
import stockTypeFormat from '../../helpers/stockTypeFormat'
import dateFormat from '../../helpers/dateFormat'
import Tooltip from '../ToolTip'
import PrintIcon from 'material-ui/svg-icons/action/print'
import IconButton from 'material-ui/IconButton'
import CheckCircleIcon from 'material-ui/svg-icons/toggle/check-box'

const RETURN = 3
const APPROVE = 1
const CANCEL = 2

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
            fontWeight: '600'
        },
        titleButtons: {
            display: 'flex',
            zIndex: '3',
            justifyContent: 'flex-end'
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
            lineHeight: '48px',
            padding: '0 30px',
            width: '100%',
            '& .row': {
                alignItems: 'center'
            }
        },
        semibold: {
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative'
        }

    }),
    withState('openDetails', 'setOpenDetails', false)
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 25,
        height: 25
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}

const StockReceiveDetails = enhance((props) => {
    const {
        classes,
        detailData,
        handleCloseDetail,
        confirmDialog,
        createDialog,
        history
    } = props
    const type = _.get(detailData, 'type')
    const by = _.get(detailData, ['currentDetail', 'by'])
    const formattedType = stockTypeFormat(type)
    const date = _.get(detailData, ['currentDetail', 'date']) ? dateFormat(_.get(detailData, ['currentDetail', 'date'])) : 'Не указана'
    const status = _.toInteger(_.get(detailData, ['currentDetail', 'status']))
    const PENDING = 0
    const IN_PROGRESS = 1
    const COMPLETED = 2
    const id = _.get(detailData, 'id')
    const tooltipText = 'Подтвердить Запрос № ' + id
    const detailLoading = _.get(detailData, 'detailLoading')
    const products = (type === 'order_return') ? _.get(detailData, ['data', 'returnedProducts']) : _.get(detailData, ['data', 'products'])
    const comment = _.get(detailData, ['data', 'comment']) || 'Комментарий отсутствует'
    if (_.isEmpty(products)) {
        return (
            <div className={classes.wrapper} style={detailLoading ? {padding: '0 30px', border: 'none', maxHeight: '2px'} : {maxHeight: '250px', overflowY: 'hidden'}}>
                {detailLoading && <LinearProgress/>}
                <div className={classes.emptyQuery}>
                    <div>Товаров не найдено</div>
                </div>
            </div>
        )
    }

    return (
        <div className={classes.wrapper} style={detailLoading ? {padding: '0 30px', border: 'none', maxHeight: '2px'} : {maxHeight: 'unset'}}>
            {detailLoading ? <LinearProgress/>
            : <div style={{width: '100%'}}>
                <div className={classes.header}>
                    <Row className={classes.semibold}>
                        <Col xs={1}>{id}</Col>
                        <Col xs={3} onClick={handleCloseDetail}>{by}</Col>
                        <Col xs={2}>{formattedType}</Col>
                        <Col xs={2}>{date}</Col>
                        <Col xs={2}>
                            {status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
                                : ((status === IN_PROGRESS) ? (
                                    <span className={classes.begin}>В процессе</span>)
                                    : (status === COMPLETED) ? (<span className={classes.success}>Принят</span>)
                                        : (<span className={classes.error}>Отменен</span>))}
                        </Col>
                        <Col xs={2}>
                            {!history && <div className={classes.titleButtons}>
                                {type === 'transfer'
                                    ? <Tooltip position="right" text={tooltipText}>
                                            <IconButton
                                                iconStyle={iconStyle.icon}
                                                style={iconStyle.button}
                                                touch={true}
                                                onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(APPROVE) }}>
                                                <CheckCircleIcon />
                                            </IconButton>
                                        </Tooltip>
                                        : (type === 'order_return')
                                            ? <Tooltip position="right" text={tooltipText}>
                                                <IconButton
                                                    iconStyle={iconStyle.icon}
                                                    style={iconStyle.button}
                                                    touch={true}
                                                    onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(RETURN) }}>
                                                    <CheckCircleIcon />
                                                </IconButton>
                                            </Tooltip>
                                        : <Tooltip position="right" text={tooltipText}>
                                            <IconButton
                                                iconStyle={iconStyle.icon}
                                                style={iconStyle.button}
                                                touch={true}
                                                onTouchTap={() => { createDialog.handleOpenCreateDialog() }}>
                                                <CheckCircleIcon />
                                            </IconButton>
                                        </Tooltip>
                                }

                                {type === 'transfer' &&
                                    <Tooltip position="right" text="Распечатать накладную">
                                        <IconButton
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(CANCEL) }}
                                            touch={true}>
                                            <PrintIcon />
                                        </IconButton>
                                    </Tooltip>
                            }
                            </div>}
                        </Col>
                    </Row>
                </div>
                <div className={classes.content}>
                    <div className={classes.leftSide}>
                        <Row className='dottedList'>
                            <Col xs={6}>Товар</Col>
                            <Col xs={4}>Тип товара</Col>
                            <Col xs={2}>Кол-во</Col>
                        </Row>
                        {_.map(products, (item) => {
                            const productId = _.get(item, 'id')
                            const name = (type === 'order_return') ? _.get(item, ['product']) : _.get(item, ['product', 'name'])
                            const measurement = _.get(item, ['product', 'measurement', 'name'])
                            const amount = numberFormat(_.get(item, 'amount'), measurement)
                            return (
                                <Row key={productId} className='dottedList'>
                                    <Col xs={6}>{name}</Col>
                                    <Col xs={4}>Стиральный порошек</Col>
                                    <Col xs={2}>{amount}</Col>
                                </Row>
                            )
                        })}
                    </div>
                    <div className={classes.rightSide}>
                        <div className={classes.subtitle}>Комментарий:</div>
                        <div>{comment}</div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
})

StockReceiveDetails.propTypes = {
    detailData: PropTypes.object.isRequired
}

export default StockReceiveDetails
