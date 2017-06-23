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
    const data = _.get(paymentData, 'data')
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '300px'} : {width: '600px'}}
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
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.inContent}>
                    <div className={classes.field}>
                        {data ? <div className={classes.transactions}>
                            <Row className="dottedList">
                                <Col xs={3}>Код оплаты</Col>
                                <Col xs={3}>Касса</Col>
                                <Col xs={3}>Дата оплаты</Col>
                                <Col xs={3}>Сумма оплаты</Col>
                            </Row>
                            {_.map(_.get(paymentData, 'data'), (item) => {
                                const id = _.get(item, ['transaction', 'id'])
                                const cashbox = _.get(item, ['transaction', 'cashbox', 'name'])
                                const payDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
                                const amount = numberFormat(_.get(item, ['transaction', 'amount']))

                                return (
                                    <Row key={id} className="dottedList">
                                        <Col xs={3}>{id}</Col>
                                        <Col xs={3}>{cashbox}</Col>
                                        <Col xs={3}>{payDate}</Col>
                                        <Col xs={3}>{amount}</Col>
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
