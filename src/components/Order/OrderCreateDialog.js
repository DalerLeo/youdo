import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field, Fields, reduxForm, SubmissionError} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import normalizeNumber from '../ReduxForm/normalizers/normalizeNumber'
import {
    ClientSearchField,
    DeliveryTypeSearchField,
    OrderListProductField,
    ClientContactsField,
    TextField,
    DateField,
    MarketSearchField,
    DealTypeSearchField,
    normalizeDiscount
} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'
import MainStyles from '../Styles/MainStyles'
import OrderTotalSum from '../ReduxForm/Order/OrderTotalSum'
import getConfig from '../../helpers/getConfig'

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
            fontSize: '16px !important',
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
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
        },
        notEnough: {
            padding: '20px 30px',
            color: '#ff2626',
            margin: '0 -30px',
            background: '#ffecec'
        }
    })),
    reduxForm({
        form: 'OrderCreateForm',
        enableReinitialize: true
    })
)

const customContentStyle = {
    width: '1000px',
    maxWidth: 'none'
}
const OrderCreateDialog = enhance((props) => {
    const {
        open,
        handleSubmit,
        onClose,
        classes,
        shortageDialog,
        isUpdate,
        createClientDialog,
        products
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    let notEnough = false
    _.map(products, (item) => {
        const amount = _.toNumber(_.get(item, 'amount'))
        const balance = _.toNumber(_.get(item, ['extra', 'balance']))
        if (amount > balance) {
            notEnough = true
        }
    })

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
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
                <span>{isUpdate ? 'Изменение заказа' : 'Добавление заказа'}</span>
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
                        <div style={{minHeight: '470px', maxHeight: '75vh'}} className={classes.inContent}>
                            <div className={classes.leftOrderPart}>

                                <div className={classes.subTitleOrder}>
                                    <span>Выбор клиента</span>
                                    {!isUpdate && <a style={{color: '#12aaeb'}} onClick={createClientDialog.handleOpenCreateClientDialog}>+ добавить</a>}
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
                                    <Field
                                        name="market"
                                        component={MarketSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Название магазина"
                                        fullWidth={true}/>
                                </div>

                                {(!notEnough) ? <div className={classes.condition}>
                                    <div className={classes.subTitleOrder} style={{padding: '0 !important'}}>Условия доставки</div>
                                    <Field
                                        name="deliveryType"
                                        component={DeliveryTypeSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Тип доставки"
                                        fullWidth={true}/>
                                    <Field
                                        name="dealType"
                                        component={DealTypeSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Тип сделки"
                                        fullWidth={true}/>
                                    <Field
                                        name="deliveryPrice"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label={'Стоимость доставки (' + primaryCurrency + ')'}
                                        fullWidth={true}
                                        normalize={normalizeNumber}
                                        />
                                    <Field
                                            name="deliveryDate"
                                            component={DateField}
                                            className={classes.inputDateCustom}
                                            floatingLabelText="Дата доставки"
                                            container="inline"
                                            fullWidth={true}/>
                                </div>
                                : <div className={classes.notEnough}>Недостаточно товаров на складе</div>}

                                <div className={classes.condition}>
                                    <div className={classes.subTitleOrder} style={{padding: '0 !important'}}>Оплата</div>
                                    <Field
                                        name="discountPrice"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Скидка (%)"
                                        style={{width: '50%'}}
                                        normalize={normalizeDiscount}/>
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
                                <Fields
                                    names={['products', 'product', 'amount', 'cost', 'type', 'editAmount', 'editCost']}
                                    component={OrderListProductField}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <div className={classes.commentField}>
                            Общая сумма заказа: <OrderTotalSum/>
                        </div>
                        {(notEnough) ? <FlatButton
                            label="Далее"
                            className={classes.actionButton}
                            primary={true}
                            onTouchTap={shortageDialog.handleOpenShortageDialog}/>

                        : <FlatButton
                            label="Оформить заказ"
                            className={classes.actionButton}
                            primary={true}
                            type="submit"/>
                        }
                    </div>
                </form>
            </div>
        </Dialog>
    )
})
OrderCreateDialog.propTyeps = {
    products: PropTypes.array,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    shortageDialog: PropTypes.shape({
        shortageLoading: PropTypes.bool.isRequired,
        openShortageDialog: PropTypes.bool.isRequired,
        handleOpenShortageDialog: PropTypes.func.isRequired,
        handleCloseShortageDialog: PropTypes.func.isRequired
    }).isRequired,
    createClientDialog: PropTypes.shape({
        createClientLoading: PropTypes.bool.isRequired,
        openCreateClientDialog: PropTypes.bool.isRequired,
        handleOpenCreateClientDialog: PropTypes.func.isRequired,
        handleCloseCreateClientDialog: PropTypes.func.isRequired,
        handleSubmitCreateClientDialog: PropTypes.func.isRequired
    }).isRequired
}
OrderCreateDialog.defaultProps = {
    isUpdate: false
}
export default OrderCreateDialog
