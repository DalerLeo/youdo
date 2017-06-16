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
import {PRIMARY_CURRENCY_NAME} from '../../constants/primaryCurrency'

export const ORDER_ITEM_RETURN_DIALOG_OPEN = 'openOrderItemReturnDialog'
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
        returnedItems: {
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

const OrderItemReturnDialog = enhance((props) => {
    const {open, loading, onClose, classes} = props
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '300px'} : {width: '700px'}}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>Возврат №312</span>
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
                        <div className={classes.returnInfo}>
                            <div className={classes.flex} style={{justifyContent: 'space-between'}}>
                                <div>
                                    <span>Причина возврата</span>
                                    <span>Клиент не доволен результатом</span>
                                </div>
                                <div>Экспедитор: <span style={{fontWeight: '600'}}>Егор Вячеславович</span></div>
                            </div>
                            <div style={{marginTop: '20px'}}>
                                <span>Дата возврата</span>
                                <span>22.05.2015</span>
                            </div>
                        </div>
                        <div className={classes.returnedItems}>
                            <Row className="dottedList">
                                <Col xs={3}>Товар</Col>
                                <Col xs={3}>Количество</Col>
                                <Col xs={3}>Цена ({PRIMARY_CURRENCY_NAME})</Col>
                                <Col xs={3}>Сумма ({PRIMARY_CURRENCY_NAME})</Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})
OrderItemReturnDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default OrderItemReturnDialog
