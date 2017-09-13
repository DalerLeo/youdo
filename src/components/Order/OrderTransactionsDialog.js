import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'
import numberFormat from '../../helpers/numberFormat'
import moment from 'moment'
import noPayment from '../Images/noPayment.png'
import getConfig from '../../helpers/getConfig'
import NotFound from '../Images/not-found.png'

export const ORDER_TRANSACTIONS_DIALOG_OPEN = 'openTransactionsDialog'
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '100px',
            display: 'flex',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center'
        },
        transactions: {
            padding: '10px 0 0',
            '& .row': {
                '& > div': {
                    textAlign: 'left !important'
                },
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    position: 'static'
                },
                '& > div:nth-child(3)': {
                    textAlign: 'right !important'
                },
                '& > div:nth-child(4)': {
                    textAlign: 'right !important'
                },
                '& > div:nth-child(5)': {
                    textAlign: 'right !important'
                }
            }
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            marginBottom: '64px'
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
            maxHeight: '50vh',
            overflow: 'auto',
            padding: '0 30px',
            color: '#333'
        },
        noPayment: {
            background: 'url(' + noPayment + ') no-repeat center 15px',
            backgroundSize: '270px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            minHeight: '270px',
            justifyContent: 'center',
            paddingTop: '25px',
            '& > div': {
                marginTop: '140px',
                fontSize: '15px',
                width: '50%',
                textAlign: 'center'
            }
        },
        field: {
            width: '100%'
        },
        bodyContent: {
            width: '100%'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    }),
    reduxForm({
        form: 'OrderCreateForm',
        enableReinitialize: true
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const OrderTransactionsDialog = enhance((props) => {
    const {open, loading, onClose, classes, paymentData} = props
    const orderId = _.get(paymentData, 'id')
    const data = _.get(paymentData, ['data', 'results'])
    const dateTimeFormat = (date, defaultText) => {
        return (date) ? moment(date).locale('ru').format('DD MMM YYYY, HH:mm') : defaultText
    }
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '500px'} : {width: '900px', maxWidth: 'none'}}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>Список оплат по заказу № {orderId}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>

            <div className={classes.bodyContent}>
                {loading ? <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>
                    : <div className={classes.inContent}>
                        <div className={classes.field}>
                            {!_.isEmpty(data) ? <div className={classes.transactions}>
                                <Row className="dottedList">
                                    <Col xs={3}>Описание</Col>
                                    <Col xs={2}>Касса</Col>
                                    <Col xs={2}>Дата</Col>
                                    <Col xs={3}>Сумма оплаты</Col>
                                    <Col xs={2}>На заказ</Col>
                                </Row>
                                {_.map(data, (item, index) => {
                                    const PAYMENT = 1
                                    const BALANCE = 2

                                    const whoFirst = _.get(item, ['clientTransaction', 'user', 'firstName'])
                                    const whoSecond = _.get(item, ['clientTransaction', 'user', 'secondName'])
                                    const who = _.get(item, 'clientTransaction') ? (whoFirst + ' ' + whoSecond) : 'Не указано'
                                    const currency = _.get(item, ['clientTransaction', 'currency', 'name'])
                                    const currentCurrency = getConfig('PRIMARY_CURRENCY')
                                    const cashbox = _.get(item, ['clientTransaction', 'transaction']) || 'Не принято'
                                    const type = _.toInteger(_.get(item, 'type'))

                                    const payDate = _.get(item, 'clientTransaction') ? dateTimeFormat(_.get(item, ['clientTransaction', 'createdDate'])) : dateTimeFormat(_.get(item, 'createdDate'))
                                    const orderSum = numberFormat(_.get(item, 'amount'), currentCurrency)
                                    const amount = type === BALANCE ? _.get(item, 'amount') : _.toNumber(_.get(item, ['clientTransaction', 'amount']))
                                    const internal = _.toNumber(_.get(item, ['clientTransaction', 'internal']))
                                    const pp = '(' + numberFormat(internal, currentCurrency) + ')'

                                    let trText = ''
                                    if (type === PAYMENT) {
                                        trText = (<span>Оплатил <strong>{who}</strong></span>)
                                    } else if (type === BALANCE) {
                                        trText = 'Списано со счета'
                                    } else {
                                        trText = (<span>Возврат оформил <strong>{who}</strong></span>)
                                    }

                                    return (
                                        <Row key={index} className="dottedList">
                                            <Col xs={3}>{trText}</Col>
                                            <Col xs={2}>{cashbox}</Col>
                                            <Col xs={2}>{payDate}</Col>
                                            <Col
                                                xs={3}>{numberFormat(amount, currency)} {!(amount === internal) && pp}</Col>
                                            <Col xs={2}>{orderSum}</Col>
                                        </Row>
                                    )
                                })}
                            </div>
                                : <div className={classes.noPayment}>
                                    <div>По данному заказу еще не произведено оплат</div>
                                </div>}
                        </div>
                    </div>
                }
            </div>
        </Dialog>
    )
})
OrderTransactionsDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    paymentData: PropTypes.object
}
export default OrderTransactionsDialog
