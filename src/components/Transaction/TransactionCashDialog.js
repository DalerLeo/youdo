import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'
import LinearProgress from '../LinearProgress'
import numberFormat from '../../helpers/numberFormat'
import AcceptClientTransactionDialog from './AcceptClientTransactionDialog'
import PaymentIcon from 'material-ui/svg-icons/action/payment'
import Tooltip from '../ToolTip'
import getConfig from '../../helpers/getConfig'

const ONE = 1
const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex'
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            maxHeight: 'none !important'
        },
        dialog: {
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            display: 'flex',
            maxHeight: '86vh',
            minHeight: '184px',
            overflow: 'auto',
            padding: '0 30px',
            color: '#333'
        },
        bodyContent: {
            width: '100%'
        },
        returnInfo: {
            padding: '25px 0',
            borderBottom: '1px #efefef solid',
            '& span': {
                display: 'block',
                '&:first-child': {
                    fontWeight: '600'
                }
            }
        },
        flex: {
            alignItems: 'initial',
            '& > div:first-child': {
                maxWidth: '60%'
            }
        },
        list: {
            width: '100%',
            padding: '10px 0',
            '& .row': {
                padding: '0',
                height: '45px',
                alignItems: 'center',
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                },
                '& > div:last-child': {
                    textAlign: 'right'
                }
            }
        },
        details: {
            background: '#f2f5f8',
            margin: '0 -30px',
            padding: '0 30px',
            boxSizing: 'content-box',
            '& .row': {
                margin: '0',
                '&:first-child': {
                    color: '#333',
                    borderBottom: '1px #dedede solid'
                },
                '& > div:first-child': {
                    paddingLeft: '0'
                },
                '& > div:last-child': {
                    paddingRight: '0'
                }
            }
        },
        semibold: {
            fontWeight: '600'
        },
        detailsRow: {
            margin: '0 10px !important',
            color: '#666 !important',
            '&:last-child': {
                borderBottom: 'none'
            },
            '& > div:last-child': {
                textAlign: 'right'
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
        noData: {
            textAlign: 'center',
            padding: '20px'
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const TransactionCashDialog = enhance((props) => {
    const {
        open,
        loading,
        onClose,
        classes,
        paymentData,
        cashBoxDialog,
        acceptCashDialog
    } = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    const detailRow = (
        _.get(paymentData, 'paymentLoading') ? <LinearProgress/>
            : _.map(_.get(paymentData, 'data'), (item) => {
                const clientName = _.get(item, ['client', 'name'])
                const marketName = _.get(item, ['market', 'name'])

                const customRate = !_.get(item, ['customRate']) ? _.toNumber(_.get(item, ['amount'])) / (_.toNumber(_.get(item, ['internal'])) || ONE) : _.get(item, ['customRate'])
                const currency = _.get(item, ['currency', 'name'])
                const internal = _.toNumber(_.get(item, ['internal']))
                const order = _.get(item, ['order'])
                const amount = numberFormat(_.get(item, ['amount']), currency)
                return (
                    <Row key={_.get(item, 'id')} className={classes.detailsRow}>
                        <Col xs={4}>{clientName}</Col>
                        <Col xs={3}>{marketName}</Col>
                        <Col xs={2}>{order}</Col>
                        <Col xs={3}>{amount} <div>{currency !== primaryCurrency ? (internal + ' ' + primaryCurrency + ' (' + _.toInteger(customRate) + ')') : null}</div></Col>
                    </Row>

                )
            })

    )
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '300px'} : {width: '900px', maxWidth: 'auto'}}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>Принять наличные</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                {loading && <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>}
                <div className={classes.inContent} style={{minHeight: 'initial'}}>
                    <div className={classes.list}>
                        <Row className="dottedList">
                            <Col xs={10}>Агент</Col>
                            <Col xs={2}>Сумма</Col>
                        </Row>
                        {_.map(_.get(acceptCashDialog, ['data']), (item, index) => {
                            const currency = _.get(item, ['currency', 'name'])
                            const user = _.get(item, ['user', 'name'])
                            const amount = numberFormat(_.get(item, ['sum']), currency)
                            const userId = _.toNumber(_.get(item, ['user', 'id']))
                            const currencyId = _.toNumber(_.get(item, ['currency', 'id']))
                            if (acceptCashDialog.openAcceptCashDetail === userId + '_' + currencyId) {
                                return (
                                    <div key={index} className={classes.details}>
                                        <Row style={{position: 'relative'}}>
                                            <div
                                                className={classes.closeDetail}
                                                onClick={() => {
                                                    acceptCashDialog.handleCloseAcceptCashDetail()
                                                }}>
                                            </div>
                                            <Col xs={6}>{user}</Col>
                                            <Col xs={5} style={{textAlign: 'right'}}>{amount}</Col>
                                            <Col xs={1}>
                                                <div style={{marginRight: '-4px'}}>
                                                    <Tooltip position="bottom" text="Оплатить">
                                                        <IconButton
                                                            onTouchTap={() => {
                                                                cashBoxDialog.handleOpenCashBoxDialog(userId, currencyId)
                                                            }}>
                                                            <PaymentIcon color="#666666"/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div>
                                            <Row className={classes.detailsRow}>
                                                <Col xs={4}>Клиент</Col>
                                                <Col xs={3}>Магазин</Col>
                                                <Col xs={2}>№ заказа</Col>
                                                <Col xs={3}>Сумма</Col>
                                            </Row>
                                            {detailRow}
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <Row
                                    key={index}
                                    className="dottedList"
                                    style={{position: 'relative'}}>
                                    <div
                                        className={classes.closeDetail}
                                        onClick={() => {
                                            acceptCashDialog.handleOpenAcceptCashDetail(userId, currencyId)
                                        }}>
                                    </div>
                                    <Col xs={6}>{user}</Col>
                                    <Col xs={5} style={{textAlign: 'right'}}>{amount}</Col>
                                    <Col xs={1}>
                                        <Tooltip position="bottom" text="Оплатить">
                                            <IconButton
                                                onTouchTap={() => {
                                                    cashBoxDialog.handleOpenCashBoxDialog(userId, currencyId)
                                                }}>
                                                <PaymentIcon color="#666666"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Col>
                                </Row>
                            )
                        })}
                        {_.isEmpty(_.get(acceptCashDialog, ['data'])) &&
                        <div className={classes.noData}><h3>Никакой платеж не произведен</h3></div>}
                    </div>
                </div>
            </div>
            <AcceptClientTransactionDialog
                open={cashBoxDialog.openCashBoxDialog}
                onClose={cashBoxDialog.handleCloseCashBoxDialog}
                onSubmit={cashBoxDialog.handleSubmitCashBoxDialog}
                data={paymentData.currentCashBoxDetails}
                currency={paymentData.currencyId}
                loading={paymentData.paymentLoading}/>

        </Dialog>
    )
})
TransactionCashDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    returnListData: PropTypes.object,
    cashBoxDialog: PropTypes.shape({
        openCashBoxDialog: PropTypes.number.isRequired,
        handleOpenCashBoxDialog: PropTypes.func.isRequired,
        handleCloseCashBoxDialog: PropTypes.func.isRequired,
        handleSubmitCashBoxDialog: PropTypes.func.isRequired
    }).isRequired
}
export default TransactionCashDialog
