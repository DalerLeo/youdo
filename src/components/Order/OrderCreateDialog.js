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
import {PRIMARY_CURRENCY_NAME} from '../../constants/primaryCurrency'
import CloseIcon2 from '../CloseIcon2'
import normalizeNumber from '../ReduxForm/normalizers/normalizeNumber'
import {
    ClientSearchField,
    DeliveryTypeSearchField,
    OrderListProductField,
    ClientContactsField,
    TextField,
    DateField
} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'
import MainStyles from '../Styles/MainStyles'

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
        popUp: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            maxHeight: 'inherit !important'
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
            borderBottom: '1px #efefef solid',
            minHeight: '450px'
        },
        innerWrap: {
            maxHeight: '100vh',
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
        subTitleOrder: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px !important',
            justifyContent: 'space-between',
            fontWeight: '600',
            padding: '0 !important',
            '& span': {
                fontWeight: '600 !important'
            }
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
            padding: '5px 20px',
            fonSsize: '16px !important',
            textAlign: 'left',
            width: '50%',
            float: 'left'
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
        },
        leftOrderPart: {
            flexBasis: '35%',
            padding: '20px 30px 20px 0',
            borderRight: '1px #efefef solid'
        },
        rightOrderPart: {
            flexBasis: '65%',
            maxWidth: '65%',
            padding: '20px 0 20px 30px'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
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
        inputDateCustom: {
            fontSize: '13px !important',
            height: '45px !important',
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
            },
            '& div:first-child': {
                height: '45px !important'
            }
        },
        inputFieldDis: {
            fontSize: '13px !important',
            paddingTop: '24px',
            '& div': {
                color: 'rgb(229, 115, 115) !important'
            }
        },
        podlojkaScroll: {
            overflowY: 'auto !important',
            '& div:first-child div:first-child': {
                transform: 'translate(0px, 0px) !important'
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

const customContentStyle = {
    width: '1000px',
    maxWidth: 'none'
}
const OrderCreateDialog = enhance((props) => {
    const {open, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const stockMin = false
    return (
        <Dialog
            modal={true}
            className={classes.podlojkaScroll}
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
                        <div style={{minHeight: '470px', maxHeight: '75vh'}} className={classes.inContent}>
                            <div className={classes.leftOrderPart}>

                                <div className={classes.subTitleOrder}>
                                    <span>Выбор клиента</span>
                                    <a style={{color: '#12aaeb'}}
                                    >+ добавить</a>
                                </div>
                                <div>
                                    <Field
                                        name="client"
                                        component={ClientSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Клиент"
                                        fullWidth={true}/>
                                    <Field
                                        name="contact"
                                        component={ClientContactsField}
                                    />
                                </div>

                                <div className={classes.condition}>
                                    <div className={classes.subTitleOrder} style={{padding: '0 !important'}}>Условия доставки</div>
                                    <Field
                                        name="deliveryType"
                                        component={DeliveryTypeSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Тип доставки"
                                        fullWidth={true}/>
                                    <Field
                                        name="deliveryPrice"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label={'Стоимость доставки (' + PRIMARY_CURRENCY_NAME + ')'}
                                        fullWidth={true}
                                        normalize={normalizeNumber}/>
                                    {(!stockMin) ? <Field
                                            name="deliveryDate"
                                            component={DateField}
                                            className={classes.inputDateCustom}
                                            floatingLabelText="Дата доставки"
                                            container="inline"
                                            fullWidth={true}/>
                                        : <Field
                                            name="deliveryDate"
                                            component={TextField}
                                            className={classes.inputFieldDis}
                                            floatingLabelText="Дата доставки"
                                            defaultDate="Не достаточно товарв на складе"
                                            disabled={true}
                                            fullWidth={true}/>
                                    }
                                </div>

                                <div className={classes.condition}>
                                    <div className={classes.subTitleOrder} style={{padding: '0 !important'}}>Оплата</div>
                                    <Field
                                        name="discountPrice"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Скидка (%)"
                                        style={{width: '50%'}}/>
                                    <Field
                                        name="paymentDate"
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        floatingLabelText="Дата оплаты"
                                        container="inline"
                                        fullWidth={true}/>
                                </div>
                            </div>
                            <div className={classes.rightOrderPart}>
                                <div className={classes.productListModal}>
                                    <Fields
                                        names={['products', 'product', 'amount', 'cost']}
                                        component={OrderListProductField}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <div className={classes.commentField}>
                            Общая сумма заказа: <b>0</b>
                        </div>
                        {(stockMin) ? <FlatButton
                                label="Далее"
                                className={classes.actionButton}
                                primary={true}
                                type="submit"
                            />
                            : <FlatButton
                                label="Оформить заказ"
                                className={classes.actionButton}
                                primary={true}
                                type="submit"
                            />
                        }
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
