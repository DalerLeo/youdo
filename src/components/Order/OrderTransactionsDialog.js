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
import dateFormat from '../../helpers/dateFormat'
import getConfig from '../../helpers/getConfig'

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
            height: '100%'
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
            background: 'url(' + noPayment + ') no-repeat center 70px',
            backgroundSize: '270px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
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
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '500px'} : {width: '900px', maxWidth: 'none'}}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>Список оплат по заказу №{orderId}</span>
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
                            {data ? <div className={classes.transactions}>
                                <Row className="dottedList">
                                    <Col xs={3}>Кто</Col>
                                    <Col xs={2}>Касса</Col>
                                    <Col xs={2}>Дата</Col>
                                    <Col xs={3}>Сумма оплаты</Col>
                                    <Col xs={2}>На заказ</Col>
                                </Row>
                                {_.map(data, (item, index) => {
                                    const whoFirst = _.get(item, ['clientTransaction', 'user', 'firstName'])
                                    const whoSecond = _.get(item, ['clientTransaction', 'user', 'secondName'])
                                    const who = whoFirst + ' ' + whoSecond
                                    const currency = _.get(item, ['clientTransaction', 'currency', 'name'])
                                    const currentCurrency = getConfig('PRIMARY_CURRENCY')
                                    const cashbox = _.get(item, ['clientTransaction', 'transaction']) || 'Не принято'

                                    const payDate = dateFormat(_.get(item, ['clientTransaction', 'createdDate'])) + moment(_.get(item, ['clientTransaction', 'createdDate'])).format(' HH:MM')
                                    const amount = _.toNumber(_.get(item, ['clientTransaction', 'amount']))
                                    const orderSum = numberFormat(_.get(item, 'amount'), currentCurrency)
                                    const internal = _.toNumber(_.get(item, ['clientTransaction', 'internal']))
                                    const pp = '(' + numberFormat(internal, currentCurrency) + ')'

                                    return (
                                        <Row key={index} className="dottedList">
                                            <Col xs={3}>{(whoFirst && whoSecond) ? who : 'Списано со счета'}</Col>
                                            <Col xs={2}>{cashbox}</Col>
                                            <Col xs={2}>{payDate}</Col>
                                            <Col xs={3}>{numberFormat(amount, currency)} {!(amount === internal) && pp}</Col>
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
