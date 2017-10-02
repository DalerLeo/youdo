import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {Field, Fields, reduxForm, SubmissionError} from 'redux-form'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import {
    StockSearchField,
    ClientBalanceReturnProductList,
    TextField,
    PaymentTypeSearchField,
    ClientBalanceReturnTotalSum,
    ClientSearchField
} from '../ReduxForm'
import MarketSearchField from '../ReduxForm/ClientBalance/MarketSearchField'
import toCamelCase from '../../helpers/toCamelCase'

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
        podlojkaScroll: {
            overflowY: 'auto !important',
            padding: '0 !important',
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            },
            '& > div': {
                height: '100% !important',
                '& > div': {
                    height: '100% !important',
                    padding: '50px 0',
                    '& > div': {
                        height: '100%'
                    }
                }
            }
        },
        popUp: {
            background: '#fff',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            minHeight: '700px',
            maxHeight: 'inherit !important',
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
            color: '#333',
            height: '100%'
        },
        innerWrap: {
            height: 'calc(100% - 57px)'
        },
        bodyContent: {
            color: '#333',
            width: '100%',
            height: 'calc(100% - 59px)'
        },
        form: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between'
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
            marginTop: '10px'
        },
        commentFieldSupply: {
            textAlign: 'left',
            width: '100%'
        },
        bottomButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px 10px 30px',
            borderTop: '1px solid #efefef',
            background: '#fff',
            '& > div:first-child': {
                textTransform: 'uppercase'
            },
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
            flexBasis: '30%',
            maxWidth: '30%',
            padding: '20px 30px',
            borderRight: '1px #efefef solid'
        },
        rightOrderPart: {
            flexBasis: '70%',
            maxWidth: '70%',
            padding: '20px 30px',
            maxHeight: '694px',
            overflow: 'auto'
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
        searchFieldCustom: {
            extend: 'inputFieldCustom',
            position: 'initial !important',
            '& label': {
                lineHeight: 'auto !important'
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
        }
    }),
    reduxForm({
        form: 'ReturnCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const clientId = _.get(state, ['form', 'ReturnCreateForm', 'values', 'client', 'value'])
        return {
            clientId
        }
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
    const {open, handleSubmit, onClose, classes, clientId, isUpdate, name} = props
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
                <span>Возврат {isUpdate ? 'от ' + name : null}</span>
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
                        <div className={classes.inContent} style={{minHeight: '350px'}}>
                            <div className={classes.leftOrderPart}>
                                <div className={classes.subTitleOrder}>Детали</div>
                                <div className={classes.condition}>
                                    <Field
                                        name="client"
                                        component={ClientSearchField}
                                        className={classes.searchFieldCustom}
                                        label="Клиент"
                                        fullWidth={true}/>
                                </div>
                                <div className={classes.condition}>
                                    <Field
                                        name="stock"
                                        component={StockSearchField}
                                        className={classes.searchFieldCustom}
                                        label="Склад"
                                        fullWidth={true}/>
                                </div>
                                <div className={classes.condition}>
                                    <Field
                                        name="market"
                                        style={{lineHeight: '20px', fontSize: '13px'}}
                                        component={MarketSearchField}
                                        className={classes.searchFieldCustom}
                                        label="Магазин"
                                        clientId={clientId}
                                        disabled={!clientId}
                                        fullWidth={true}/>
                                </div>
                                <div className={classes.condition}>
                                    <Field
                                        name="paymentType"
                                        style={{lineHeight: '20px', fontSize: '13px'}}
                                        component={PaymentTypeSearchField}
                                        className={classes.searchFieldCustom}
                                        label="Тип оплаты"
                                        fullWidth={true}/>
                                </div>
                                <div>
                                    <Field
                                        style={{lineHeight: '20px', fontSize: '13px'}}
                                        name="comment"
                                        component={TextField}
                                        label="Оставить комментарий..."

                                        multiLine={true}
                                        rows={1}
                                        rowsMax={6}
                                        fullWidth={true}/>
                                </div>
                            </div>
                            <div className={classes.rightOrderPart}>
                                <Fields
                                    isUpdate={isUpdate}
                                    names={['products', 'product', 'amount', 'cost', 'editAmount', 'editCost', 'type']}
                                    component={ClientBalanceReturnProductList}
                                />

                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                    <div>Общая сумма возврата: <ClientBalanceReturnTotalSum/></div>
                        <FlatButton
                            label="Оформить возврат"
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