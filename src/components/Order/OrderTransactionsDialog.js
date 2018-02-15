import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import numberFormat from '../../helpers/numberFormat'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import noPayment from '../Images/noPayment.png'
import NotFound from '../Images/not-found.png'
import ClientBalanceFormat from '../Statistics/ClientTransactions/ClientBalanceFormat'
import getConfig from '../../helpers/getConfig'
import t from '../../helpers/translate'

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
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    position: 'static'
                }
            }
        },
        rightAlign: {
            textAlign: 'right !important'
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
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
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
                fontSize: '13px',
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
const ZERO = 0
const OrderTransactionsDialog = enhance((props) => {
    const {open, loading, onClose, classes, paymentData} = props
    const orderId = _.get(paymentData, 'id')
    const data = _.get(paymentData, ['data', 'results'])
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '500px'} : {width: '900px', maxWidth: 'none'}}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>{t('Список оплат по заказу')} № {orderId}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>

            <div className={classes.bodyContent}>
                {loading ? <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    : <div className={classes.inContent}>
                        <div className={classes.field}>
                            {!_.isEmpty(data) ? <div className={classes.transactions}>
                                    <Row className="dottedList">
                                        <Col xs={2}>{t('Дата')}</Col>
                                        <Col xs={2}>{t('Клиент')}</Col>
                                        <Col xs={2}>{t('Пользователь')}</Col>
                                        <Col xs={2}>{t('Описание')}</Col>
                                        <Col xs={2} className={classes.rightAlign}>{t('Сумма')}</Col>
                                        <Col xs={2} className={classes.rightAlign}>{t('На заказ')}</Col>
                                    </Row>
                                    {_.map(data, (item, index) => {
                                        const user = _.get(item, ['fromTransaction', 'user'])
                                        const comment = _.get(item, ['fromTransaction', 'comment'])
                                        const client = _.get(item, ['fromTransaction', 'client', 'name'])
                                        const currency = _.get(item, ['fromTransaction', 'currency', 'name'])
                                        const fromCurrency = _.get(item, ['fromTransaction', 'currency', 'name'])
                                        const toCurrency = _.get(item, ['toTransaction', 'currency', 'name'])
                                        const userName = !_.isNull(user) ? user.firstName + ' ' + user.secondName : t('Не известно')
                                        const date = dateTimeFormat(_.get(item, ['fromTransaction', 'createdDate']))
                                        const amount = _.toNumber(_.get(item, ['fromTransaction', 'amount']))
                                        const fromAmount = _.toNumber(_.get(item, 'fromAmount'))
                                        const toAmount = _.toNumber(_.get(item, 'toAmount'))
                                        const internal = _.toNumber(_.get(item, ['fromTransaction', 'internal']))
                                        const customRate = _.get(item, ['fromTransaction', 'customRate']) ? _.toInteger(_.get(item, ['fromTransaction', 'customRate'])) : _.toInteger(amount / internal)
                                        const type = _.get(item, ['fromTransaction', 'type'])
                                        const orderIdItem = _.get(item, ['fromTransaction', 'order'])
                                        const orderReturnId = _.get(item, ['fromTransaction', 'orderReturn'])
                                        return (
                                            <Row key={index} className="dottedList">
                                                <Col xs={2}>{date}</Col>
                                                <Col xs={2}>{client}</Col>
                                                <Col xs={2}>{userName}</Col>
                                                <Col xs={2}>
                                                    {type && <div>
                                                        <ClientBalanceFormat
                                                            type={type}
                                                            order={orderIdItem}
                                                            orderReturn={orderReturnId}/>
                                                    </div>}
                                                    {comment && <div><strong>{t('Комментарий')}:</strong> {comment}</div>}
                                                </Col>
                                                <Col xs={2} className={classes.rightAlign}>
                                                    <div
                                                        className={amount > ZERO ? 'greenFont' : (amount === ZERO ? '' : 'redFont')}>
                                                        <span>{numberFormat(amount, currency)}</span>
                                                        {primaryCurrency !== currency &&
                                                        <div>{numberFormat(internal, primaryCurrency)} <span
                                                            style={{
                                                                fontSize: 11,
                                                                color: '#666',
                                                                fontWeight: 600
                                                            }}>({customRate})</span></div>}
                                                    </div>
                                                </Col>
                                                <Col xs={2} className={classes.rightAlign}>
                                                    { fromCurrency !== toCurrency
                                                        ? <div>
                                                            <p>{numberFormat(fromAmount, fromCurrency)}</p>
                                                        </div>
                                                        : <div>
                                                            <p>{numberFormat(toAmount, toCurrency)}</p>
                                                        </div>
                                                }
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                </div>
                                : <div className={classes.noPayment}>
                                    <div>{t('По данному заказу еще не произведено оплат')}</div>
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
