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
                    textAlign: 'right'
                },
                '& > div:nth-child(4)': {
                    textAlign: 'right'
                }
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
    const {open, loading, onClose, classes} = props
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '300px'} : {width: '600px'}}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>Список оплат по заказу №1283</span>
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
                        <div className={classes.transactions}>
                            <Row className="dottedList">
                                <Col xs={3}>Код транзакции</Col>
                                <Col xs={3}>Касса</Col>
                                <Col xs={3}>Дата оплаты</Col>
                                <Col xs={3}>Сумма оплаты</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={3}>3123</Col>
                                <Col xs={3}>Super Cashbox</Col>
                                <Col xs={3}>22.01.2016</Col>
                                <Col xs={3}>150 000 UZS</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={3}>3123</Col>
                                <Col xs={3}>Super Cashbox</Col>
                                <Col xs={3}>22.01.2016</Col>
                                <Col xs={3}>150 000 UZS</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={3}>3123</Col>
                                <Col xs={3}>Super Cashbox</Col>
                                <Col xs={3}>22.01.2016</Col>
                                <Col xs={3}>150 000 UZS</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={3}>3123</Col>
                                <Col xs={3}>Super Cashbox</Col>
                                <Col xs={3}>22.01.2016</Col>
                                <Col xs={3}>150 000 UZS</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={3}>3123</Col>
                                <Col xs={3}>Super Cashbox</Col>
                                <Col xs={3}>22.01.2016</Col>
                                <Col xs={3}>150 000 UZS</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={3}>3123</Col>
                                <Col xs={3}>Super Cashbox</Col>
                                <Col xs={3}>22.01.2016</Col>
                                <Col xs={3}>150 000 UZS</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={3}>3123</Col>
                                <Col xs={3}>Super Cashbox</Col>
                                <Col xs={3}>22.01.2016</Col>
                                <Col xs={3}>150 000 UZS</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={3}>3123</Col>
                                <Col xs={3}>Super Cashbox</Col>
                                <Col xs={3}>22.01.2016</Col>
                                <Col xs={3}>150 000 UZS</Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})
OrderTransactionsDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default OrderTransactionsDialog
