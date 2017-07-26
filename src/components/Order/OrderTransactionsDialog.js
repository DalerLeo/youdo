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
import MainStyles from '../Styles/MainStyles'
import numberFormat from '../../helpers/numberFormat'
import moment from 'moment'
import noPayment from '../Images/noPayment.png'
import dateFormat from '../../helpers/dateFormat'
import getConfig from '../../helpers/getConfig'

export const ORDER_TRANSACTIONS_DIALOG_OPEN = 'openTransactionsDialog'
const enhance = compose(
    injectSheet(_.merge(MainStyles, {
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
            display: ({loading}) => loading ? 'flex' : 'none'
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
        noPayment: {
            background: 'url(' + noPayment + ') no-repeat center 70px',
            backgroundSize: '270px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            paddingTop: '25px',
            '& > div': {
                marginTop: '140px',
                fontSize: '15px',
                width: '50%',
                textAlign: 'center'
            }
        }
    })),
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
    console.log(paymentData)
    const data = _.get(paymentData, 'data')
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '300px'} : {width: '900px', maxWidth: 'auto'}}
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
                <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>
                <div className={classes.inContent}>
                    <div className={classes.field}>
                        {data ? <div className={classes.transactions}>
                            <Row className="dottedList">
                                <Col xs={3}>Кто</Col>
                                <Col xs={2}>Касса</Col>
                                <Col xs={2}>Дата</Col>
                                <Col xs={2}>Сумма оплаты</Col>
                                <Col xs={3}>В внутреннем валюте</Col>
                            </Row>
                            {_.map(_.get(paymentData, ['data', 'results']), (item, index) => {
                                console.log(item)
                                const cashier = _.get(item, ['transaction', 'name']) || 'Не принято'
                                const currency = _.get(item, ['currency', 'name'])

                                const payDate = dateFormat(_.get(item, 'createdDate')) + moment(_.get(item, 'createdDate')).format(' HH:MM')
                                const amount = numberFormat(_.get(item, ['amount']), currency)
                                const internal = numberFormat(_.get(item, ['internal']), getConfig('PRIMARY_CURRENCY'))

                                return (
                                    <Row key={index} className="dottedList">
                                        <Col xs={3}>{'?'}</Col>
                                        <Col xs={2}>{cashier}</Col>
                                        <Col xs={2}>{payDate}</Col>
                                        <Col xs={2}>{amount}</Col>
                                        <Col xs={3}>{internal}</Col>
                                    </Row>
                                )
                            })}
                        </div>
                        : <div className={classes.noPayment}>
                                <div>По данному заказу еще не произведено оплат</div>
                            </div>}
                    </div>
                </div>
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
