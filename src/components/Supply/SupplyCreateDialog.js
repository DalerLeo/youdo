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
import {
    CurrencySearchField,
    ProviderSearchField,
    ProviderContactsField,
    StockSearchField,
    SupplyListProductField,
    TextField,
    DateField
} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'
import MainStyles from '../Styles/MainStyles'

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
            maxHeight: '85vh',
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
        commentFieldSupply: {
            textAlign: 'left',
            width: '100%'
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
        }
    })),
    reduxForm({
        form: 'SupplyCreateForm',
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
const SupplyCreateDialog = enhance((props) => {
    const {open, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
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
                <span>Добавление поставки</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
                    </div>
                    <div className={classes.innerWrap} style={{minHeight: '480px'}}>
                        <div className={classes.inContent} style={{minHeight: '350px', maxHeight: '60vh'}}>
                            <div className={classes.leftOrderPart}>
                                <div className={classes.subTitleOrder}>Выбор поставщика</div>
                                <div className={classes.selectContent}>
                                    <Field
                                        name="provider"
                                        component={ProviderSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Поставщик"
                                        fullWidth={true}/>
                                    <Field
                                        name="contact"
                                        component={ProviderContactsField}
                                    />
                                </div>
                                <div className={classes.condition}>
                                    <div className={classes.subTitleOrder}>Условия доставки</div>
                                    <Field
                                        name="date_delivery"
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        floatingLabelText="Дата поставки"
                                        container="inline"
                                        fullWidth={true}/>
                                    <Field
                                        name="stock"
                                        component={StockSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Склад назначения"
                                        fullWidth={true}/>
                                    <Field
                                        name="currency"
                                        component={CurrencySearchField}
                                        className={classes.inputFieldCustom}
                                        label="Валюта оплаты"
                                        fullWidth={true}/>
                                </div>
                            </div>
                            <div className={classes.rightOrderPart}>
                                <Fields
                                    names={['products', 'product', 'amount', 'cost']}
                                    component={SupplyListProductField}
                                />
                            </div>
                        </div>
                        <div className={classes.commentFieldSupply}>
                            <div style={{padding: '5px 30px'}}>
                                <div className={classes.subTitleOrder} style={{marginTop: '15px'}}>Комментарии по заказу</div>
                                <Field
                                    style={{marginTop: '-20px', lineHeight: '20px', fontSize: '13px'}}
                                    name="comment"
                                    component={TextField}
                                    label="Оставить комментарий..."

                                    multiLine={true}
                                    rows={2}
                                    rowsMax={4}
                                    fullWidth={true}/>
                            </div>
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
SupplyCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default SupplyCreateDialog
