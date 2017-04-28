import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
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
    CurrencySearchField,
    ProviderSearchField,
    StockSearchField,
    SupplyListProductField,
    TextField,
    DateField
} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'

export const SUPPLY_CREATE_DIALOG_OPEN = 'openCreateDialog'
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
        dialog: {
            width: '1200px !important'
        },
        loader: {
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
        },
        fields: {
            display: ({loading}) => !loading ? 'flex' : 'none'
        },
        flex: {
            display: 'flex',
            '& > div:first-child': {
                padding: '0 !important',
                borderBottom: '1px solid #efefef'
            }
        },
        title: {
            paddingTop: '15px',
            fontWeight: 'bold',
            color: 'black !important'
        },
        titleContent: {
            display: 'flex',
            color: 'black',
            fontWeight: 'bold',
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
            display: 'flex',
            '& > div:last-child > div:first-child': {
                display: 'flex',
                position: 'relative',
                '& button': {
                    position: 'absolute !important',
                    right: '0 !important',
                    marginTop: '15px !important'
                }
            }
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
                fontSize: '16px !important',
                color: '#12aaeb !important'
            }
        }
    }),
    reduxForm({
        form: 'SupplyCreateForm',
        enableReinitialize: true
    })
)

const customContentStyle = {
    width: '1000px',
    maxWidth: 'none'
}
const SupplyCreateDialog = enhance((props) => {
    const {open, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            contentStyle={customContentStyle}
            open={open}
            onRequestClose={onClose}
            autoScrollBodyContent={true}>
            <form onSubmit={onSubmit} scrolling="auto">
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.titleContent}>
                    <span>Добавления заказа</span>
                    <IconButton>
                        <CloseIcon2 color="#666666"/>
                    </IconButton>
                </div>
                <div className={classes.underLine}>
                    <Col xs={4}>
                        <div className={classes.left}>
                            <div className={classes.title}>Выбор поставщика</div>
                            <div className={classes.selectContent}>
                                <Field
                                    name="provider"
                                    component={ProviderSearchField}
                                    label="Поставщик"
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
                                    name="stock"
                                    component={StockSearchField}
                                    label="Склад назначения"
                                    fullWidth={true}/>
                                <Field
                                    name="date_delivery"
                                    component={DateField}
                                    hintText="Дата поставки "
                                    fullWidth={true}/>
                                <Field
                                    name="currency"
                                    component={CurrencySearchField}
                                    label="Валюта оплаты"
                                    fullWidth={true}/>
                            </div>
                        </div>
                    </Col>
                    <Col md={8} className={classes.right}>
                        <Fields
                            names={['products', 'product', 'amount', 'cost']}
                            component={SupplyListProductField}
                        />
                    </Col>
                </div>
                <div className={classes.bottom}>
                    <div>
                        <span className={classes.title}>Дополнительные раскоды по поставке</span>
                        <FlatButton
                            label="+ Добавить расход"
                            style={{color: '#12aaeb'}}
                            className={classes.span}/>
                    </div>
                    <div className={classes.background}>
                        <Field
                            name="additionalDescription"
                            component={TextField}
                            label="Описания раскода"/>
                        <Field
                            name="additionalCost"
                            component={TextField}
                            label="Сумма"/>
                        <Field
                            name="additionalCurrency"
                            component={CurrencySearchField}
                            label="Валюта"/>
                        <FlatButton
                            label="Применить"
                            style={{color: '#12aaeb'}}
                            className={classes.span}/>
                    </div>
                    <div className={classes.total}>
                        <div>
                            <div className={classes.title}>Описание</div>
                            <span className={classes.title}>Сумма</span>
                        </div>
                        <div>
                            <div>asjdlakj lkjslj asdas das da asd</div>
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
SupplyCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default SupplyCreateDialog
