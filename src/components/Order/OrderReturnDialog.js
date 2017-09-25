import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {Field, Fields, reduxForm, SubmissionError} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import {TextField, OrderListReturnField, StockSearchField} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'
import OrderReturnTotalSum from '../ReduxForm/Order/OrderReturnTotalSum'

export const ORDER_RETURN_DIALOG_OPEN = 'openReturnDialog'
const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    throw new SubmissionError({
        ...errors,
        _error: nonFieldErrors
    })
}
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
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        popUp: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            minHeight: '600px',
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
            color: '#333'
        },
        innerWrap: {
            overflow: 'auto'
        },
        bodyContent: {
            color: '#333',
            width: '100%'
        },
        form: {
            position: 'relative'
        },
        field: {
            maxWidth: '70%',
            flexBasis: '30%'

        },
        left: {
            flexBasis: '30%',
            padding: '15px 30px',
            borderRight: '1px #efefef solid'
        },
        title: {
            display: 'flex',
            alignItems: 'center',
            height: '40px',
            fontWeight: '600'
        },
        right: {
            flexBasis: '65%',
            maxWidth: '55%',
            padding: '15px 30px'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            width: '100%',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        selectContent: {
            marginTop: '-15px'
        },
        radioButton: {
            marginTop: '10px',
            '&>div': {
                marginBottom: '10px'
            }
        },
        condition: {
            marginTop: '20px',
            '&>div:first-child': {
                marginBottom: '-20px'
            }
        },
        commentField: {
            fontSize: '16px',
            padding: '20px 30px',
            textAlign: 'right',
            borderTop: '1px #efefef solid'
        },
        returnComment: {
            fontSize: '13px !important',
            margin: '-20px 0 20px',
            position: 'relative',
            '& label': {
                left: '0'
            }
        },
        bottomButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px 10px 20px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        podlojkaScroll: {
            overflowY: 'auto !important',
            padding: '0 !important'
        },
        rightOrderPart: {
            flexBasis: '70%',
            maxWidth: '70%',
            padding: '20px 30px',
            minHeight: '485px'
        },
        leftOrderPart: {
            flexBasis: '30%',
            padding: '20px 30px',
            borderRight: '1px #efefef solid'
        }
    }),
    reduxForm({
        form: 'OrderReturnForm',
        enableReinitialize: true
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false})
)

const OrderReturnDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, orderData, isUpdate} = props
    const returnId = _.get(orderData, 'id')

    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '500px'} : {width: '900px', maxWidth: 'none'}}
            className={classes.podlojkaScroll}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? 'Изменение возврата №' + returnId : 'Возврат товаров заказа №' + returnId}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={40} thickness={4}/>
                    </div>
                    <div className={classes.innerWrap}>
                        <div className={classes.inContent}>
                            <div className={classes.leftOrderPart}>
                                <Field
                                    component={StockSearchField}
                                    className={classes.inputFieldCustom}
                                    label="Cклад"
                                    fullWidth={true}
                                    name="stock"/>
                                <Field
                                    name="comment"
                                    component={TextField}
                                    className={classes.returnComment}
                                    label="Комментарий к возврату"
                                    fullWidth={true}
                                    multiLine={true}
                                    rows={1}
                                    rowsMax={3}/>
                            </div>
                            <div className={classes.rightOrderPart}>
                                <Fields
                                    names={['products', 'product', 'amount', 'cost', 'editAmount']}
                                    component={OrderListReturnField}
                                    orderData={orderData}
                                    isUpdate={isUpdate}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <div className={classes.summary}>Общая сумма возврата: <OrderReturnTotalSum/></div>
                        <FlatButton
                            label="Возврат"
                            className={classes.actionButton}
                            primary={true}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})
OrderReturnDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    orderData: PropTypes.object.isRequired
}
export default OrderReturnDialog
