import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field, Fields, reduxForm, SubmissionError} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {connect} from 'react-redux'
import {
    PricesListProductField,
    PricesBonusProductField,
    TextField,
    DateField,
    CustomChipField
} from '../ReduxForm'
import PromotionsRadioButton from '../ReduxForm/Promotions/PromotionsRadioButton'
import toCamelCase from '../../helpers/toCamelCase'
import t from '../../helpers/translate'

export const PRICES_CREATE_DIALOG_OPEN = 'openCreateDialog'
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
            overflowY: 'auto !important'
        },
        popUp: {
            background: '#fff',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
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
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
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
            fontWeight: 'bold',
            padding: '0 !important',
            '& span': {
                fontWeight: '600 !important'
            }
        },
        radioButton: {
            marginTop: '10px',
            '& > div > div > div': {
                marginBottom: '5px',
                '& svg': {
                    width: '22px !important',
                    height: '22px !important',
                    '&:first-child': {
                        color: '#999 !important',
                        fill: '#999 !important'
                    },
                    '&:last-child': {
                        color: '#666 !important',
                        fill: '#666 !important'
                    }
                }
            }
        },
        condition: {
            marginTop: '20px',
            '&>div:first-child': {
                marginBottom: '-20px'
            }
        },
        commentFieldPrices: {
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
            flexBasis: '30%',
            maxWidth: '30%',
            padding: '20px 30px',
            borderRight: '1px #efefef solid'
        },
        rightOrderPart: {
            flexBasis: '70%',
            maxWidth: '70%',
            padding: '20px 30px',
            maxHeight: '600px',
            minHeight: '500px',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        halfField: {
            width: '50%'
        },
        inputFieldCustom: {
            width: '100% !important',
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
        }
    }),
    reduxForm({
        form: 'PricesCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const type = _.get(state, ['form', 'PricesCreateForm', 'values', 'promotionType']) || 'bonus'
        return {
            type
        }
    })
)

const customContentStyle = {
    width: '930px',
    maxWidth: 'none'
}
const PricesCreateDialog = enhance((props) => {
    const {openDialog, handleSubmit, onClose, classes, isUpdate, type} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    let isDiscount = false
    if (type === 'discount') {
        isDiscount = true
    }

    return (
        <Dialog
            modal={true}
            className={classes.podlojkaScroll}
            contentStyle={customContentStyle}
            open={openDialog}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? t('Изменение акции') : t('Новая акция')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.innerWrap}>
                        <div className={classes.inContent} style={{minHeight: '350px'}}>
                            <div className={classes.leftOrderPart}>
                                <div className={classes.selectContent}>
                                    <Field
                                        name="name"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label={t('Название новой акции')}
                                        fullWidth={true}/>
                                    <div className={classes.radioButton}>
                                        <Field
                                            name="promotionType"
                                            style={{marginTop: '10px'}}
                                            selectedType={type}
                                            component={PromotionsRadioButton}
                                        />
                                    </div>
                                </div>
                                <div className={classes.condition}>
                                    <div className={classes.subTitleOrder}>{t('Условия акции')}</div>
                                    <Field
                                        name="beginDate"
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        floatingLabelText={t('Дата начала акции')}
                                        container="inline"
                                        fullWidth={true}/>
                                    <Field
                                        name="tillDate"
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        floatingLabelText={t('Дата завершения акции')}
                                        container="inline"
                                        fullWidth={true}/>
                                    <div className={classes.halfField}>
                                        {isDiscount
                                        ? <Field
                                            name="discount"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}
                                            label={t('Размер скидки')}
                                            hintText="10%"
                                        />
                                        : <Field
                                            name="amount"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}
                                            label={t('Кол-во')}
                                        />}
                                    </div>
                                    <Field
                                        name="marketTypes"
                                        component={CustomChipField}
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}
                                        isUpdate={isUpdate}
                                        hintText={t('Выберите тип магазинов')}
                                    />
                                </div>
                            </div>
                            <div className={classes.rightOrderPart}>
                                {isDiscount
                                    ? <Fields
                                        names={['products', 'product', 'amount', 'type']}
                                        component={PricesListProductField}/>
                                    : <Fields
                                        names={['bonusProducts', 'bonusProduct', 'bonusType', 'giftProducts', 'giftProduct', 'giftAmount', 'giftType']}
                                        component={PricesBonusProductField}/>
                                    }
                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Применить акцию')}
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
PricesCreateDialog.propTyeps = {
    isUpdate: PropTypes.bool,
    openDialog: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
PricesCreateDialog.defaultProps = {
    isUpdate: false
}
export default PricesCreateDialog
