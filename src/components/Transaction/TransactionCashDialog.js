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
import Accept from 'material-ui/svg-icons/av/playlist-add-check'
import numberFormat from '../../helpers/numberFormat'
import AcceptClientTransactionDialog from './AcceptClientTransactionDialog'

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
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const TransactionCashDialog = enhance((props) => {
    const {open, loading, onClose, classes, paymentData, cashBoxDialog} = props

    const buttonStyle = {
        button: {
            width: 40,
            height: 40,
            padding: 0
        },
        icon: {
            color: '#12aaeb',
            width: 22,
            height: 22
        }
    }

    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '300px'} : {width: '900px', maxWidth: 'auto'}}
            open={open}
            onRequestClose={onClose}
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
                            <Col xs={3}>Агент</Col>
                            <Col xs={3}>Клиент</Col>
                            <Col xs={2}>Магазин</Col>
                            <Col xs={1}>Заказ</Col>
                            <Col xs={2}>Сумма</Col>
                        </Row>
                        {_.map(_.get(paymentData, ['data', 'results']), (item) => {
                            const clientName = _.get(item, ['client', 'name'])
                            const marketName = _.get(item, ['market', 'name'])
                            const currency = _.get(item, ['currency', 'name'])
                            const amount = numberFormat(_.get(item, ['amount']), currency)
                            const order = _.get(item, ['order'])
                            const id = _.get(item, ['id'])
                            return (
                                <Row key={id} className="dottedList">
                                    <Col xs={3}>Имя Фамилия Агента</Col>
                                    <Col xs={3}>{clientName}</Col>
                                    <Col xs={2}>{marketName}</Col>
                                    <Col xs={1}>{order}</Col>
                                    <Col xs={2} style={{textAlign: 'right'}}>{amount}</Col>
                                    <Col xs={1}>
                                        <IconButton
                                            style={buttonStyle.button}
                                            iconStyle={buttonStyle.icon}
                                            onTouchTap={() => { cashBoxDialog.handleOpenCashBoxDialog(id) }}>
                                            <Accept/>
                                        </IconButton>
                                    </Col>
                                </Row>
                            )
                        })}
                    </div>
                </div>
            </div>
            <AcceptClientTransactionDialog
                open={cashBoxDialog.openCashBoxDialog}
                onClose={cashBoxDialog.handleCloseCashBoxDialog}
                onSubmit={cashBoxDialog.handleSubmitCashBoxDialog}
                data={paymentData.currentCashBoxDetails}/>

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
