import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {Col} from 'react-flexbox-grid'
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
    TextField,
    DateField
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
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        title: {
            paddingTop: '15px',
            fontWeight: 'bold',
            color: '#333'
        },
        titleContent: {
            display: 'flex',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            position: 'relative',
            borderBottom: '1px solid #efefef',
            marginLeft: '-24px',
            marginRight: '-24px',
            padding: '0px 30px 20px 30px',
            '& button': {
                position: 'absolute !important',
                right: '20px',
                margin: '-15px -10px 0 0 !important'
            }
        },
        left: {
            padding: '0 20px 10px 0'
        },
        underLine: {
            borderBottom: '1px solid #efefef',
            display: 'flex'
        },
        radioButton: {
            '& > div': {
                marginTop: '10px'
            }
        },
        selectContent: {
            '& > div': {
                marginTop: '-10px',
                width: '100% !important'
            }
        },
        bottom: {
            '& > div:first-child': {
                position: 'relative',
                marginTop: '20px',
                '& > button': {
                    position: 'absolute !important',
                    right: '0'
                }
            }
        },
        total: {
            '& > div': {
                padding: '15px 0',
                display: 'flex',
                '& > div:first-child': {
                    width: '75%'
                }
            },
            '& > div:first-child': {
                borderBottom: '1px dotted #efefef'
            }
        },
        checkout: {
            borderTop: '1px solid #efefef',
            position: 'relative',
            marginLeft: '-24px',
            marginRight: '-24px',
            paddingBottom: '20px',
            paddingTop: '10px',
            '& > button': {
                position: 'absolute !important',
                right: '25px'
            }
        },
        right: {
            borderLeft: '1px solid #efefef',
            padding: '0 0 10px 20px'
        },
        span: {
            '& div > span': {
                padding: '0 5px !important',
                textTransform: 'inherit !important',
                fontSize: '13px !important',
                color: '#12aaeb !important'
            }
        },
        background: {
            backgroundColor: '#f1f5f8',
            display: 'flex',
            padding: '10px',
            marginTop: '20px',
            '& > div': {
                marginTop: '-20px !important',
                marginRight: '20px',
                height: '72px !important',
                '& input': {
                    height: '75px !important'
                }
            },
            '& > button > div > span': {
                padding: '5px !important',
                textTransform: 'inherit !important',
                fontSize: '13px'
            },
            '& > div:first-child': {
                width: '100% !important'
            },
            '& button': {
                marginTop: '10px !important'
            }
        },
        width: {
            width: '120px !important'
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
            bodyClassName={classes.body}
            autoScrollBodyContent={true}>
            <form onSubmit={onSubmit} scrolling="auto">
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.titleContent}>
                    <span>Добавления заказа</span>
                    <IconButton onTouchTap={onClose}>
                        <CloseIcon2 color="#666666"/>
                    </IconButton>
                </div>
                <div className={classes.underLine}>
                    <Col xs={4}>
                        <div className={classes.left}>
                            <div className={classes.title}>Выбор поставщика</div>
                            <div className={classes.selectContent}>
                                <Field
                                    name="client"
                                    component={ClientSearchField}
                                    label="Клиент"
                                    fullWidth={true}/>
                                <RadioButtonGroup name="contact" defaultSelected="1"
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
                            <div className={classes.title}>Условия доставки</div>
                            <div>
                                <Field
                                    name="deliveryType"
                                    component={DeliveryTypeSearchField}
                                    label="Склад назначения"
                                    fullWidth={true}/>
                                <Field
                                    name="dateDelivery"
                                    component={DateField}
                                    hintText="Дата поставки "
                                    fullWidth={true}/>

                                <Field
                                    name="deliveryPrice"
                                    component={TextField}
                                    label="Стоимость"
                                    fullWidth={true}/>
                                <div>Скидка
                                    <Field
                                        name="discountPrice"
                                        component={TextField}
                                        label="Скидка"
                                        fullWidth={false}/>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={8} className={classes.right}>
                        <Fields
                            names={['products', 'product', 'amount', 'cost']}
                            component={OrderListProductField}
                        />
                    </Col>
                </div>
                <div className={classes.bottom}>
                    <div className={classes.total}>
                        <div>
                            Общая сумма заказа
                            <span>3 500 000</span>
                        </div>
                    </div>
                    <div className={classes.checkout}>
                        <FlatButton
                            label="Оформить заказ"
                            type="submit"
                            className={classes.span}/>
                    </div>
                </div>
            </form>
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
