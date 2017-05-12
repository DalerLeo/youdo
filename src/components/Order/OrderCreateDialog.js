import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {Field, Fields, reduxForm, SubmissionError} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import {
    ClientSearchField,
    DeliveryTypeSearchField,
    OrderListProductField,
    TextField
} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'

export const ORDER_CREATE_DIALOG_OPEN = 'openCreateDialog'
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
            minHeight: '300px !important'
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
            color: '#333',
            borderBottom: '1px #efefef solid'
        },
        innerWrap: {
            maxHeight: '50vh',
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
            width: '100%'
        },
        left: {
            flexBasis: '35%',
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
        inputField: {
            fontSize: '13px !important',
            '& div': {
                fontSize: '13px !important'
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
            fontSize: '24px',
            padding: '20px 30px',
            textAlign: 'right'
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
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

const customContentStyle = {
    width: '1000px',
    maxWidth: 'none'
}
const OrderCreateDialog = enhance((props) => {
    const {open, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            contentStyle={customContentStyle}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>Добавление заказа</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
                    </div>
                    <div className={classes.innerWrap}>
                        <div className={classes.inContent}>
                            <div className={classes.left}>
                                <div className={classes.title}>Выбор клиента</div>
                                <div className={classes.selectContent}>
                                    <Field
                                        name="client"
                                        component={ClientSearchField}
                                        className={classes.inputField}
                                        label="Клиент"
                                        fullWidth={true}/>
                                    <RadioButtonGroup
                                        name="contact" defaultSelected="1"
                                        className={classes.radioButton}>
                                        <RadioButton
                                            value="1"
                                            label="Tursunov Bohodir"
                                        />
                                        <RadioButton
                                            value="2"
                                            label="Ashurov Anvar"
                                        />
                                    </RadioButtonGroup>
                                </div>
                                <div className={classes.condition}>
                                    <div className={classes.title}>Условия поставки</div>
                                    <Field
                                        name="deliveryType"
                                        component={DeliveryTypeSearchField}
                                        className={classes.inputField}
                                        label="Тип поставки"
                                        fullWidth={true}/>
                                    <Field
                                        name="deliveryPrice"
                                        component={TextField}
                                        className={classes.inputField}
                                        label="Стоимость"
                                        fullWidth={true}/>
                                    <Field
                                        name="discountPrice"
                                        component={TextField}
                                        className={classes.inputField}
                                        label="Скидка (%)"
                                        style={{width: '50%'}}/>
                                </div>
                            </div>
                            <div className={classes.right}>
                                <Fields
                                    names={['products', 'product', 'amount', 'cost']}
                                    component={OrderListProductField}
                                />
                            </div>
                        </div>
                        <div className={classes.commentField}>
                            Общая сумма заказа: <b>350000</b>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Оформить заказ"
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
OrderCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default OrderCreateDialog
