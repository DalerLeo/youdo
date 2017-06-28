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
import {
    ProviderContactsField,
    PricesListProductField,
    TextField,
    DateField
} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'

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
            height: '100%',
            padding: '0 30px'
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
            flexBasis: '35%',
            padding: '20px 30px 20px 0',
            borderRight: '1px #efefef solid'
        },
        rightOrderPart: {
            flexBasis: '65%',
            maxWidth: '65%',
            padding: '20px 1px 20px 30px',
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
    })
)

const customContentStyle = {
    width: '1000px',
    maxWidth: 'none'
}
const PricesCreateDialog = enhance((props) => {
    const {openDialog, handleSubmit, onClose, classes, isUpdate} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

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
                <span>{isUpdate ? 'Изменение поставки' : 'Добавление поставки'}</span>
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
                        <div className={classes.inContent} style={{minHeight: '350px'}}>
                            <div className={classes.leftOrderPart}>
                                <div className={classes.subTitleOrder}>Выбор поставщика</div>
                                <div className={classes.selectContent}>
                                    <Field
                                        name="name"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Наименование"
                                        fullWidth={true}/>
                                    <Field
                                        name="contact"
                                        component={ProviderContactsField}
                                    />
                                </div>
                                <div className={classes.condition}>
                                    <div className={classes.subTitleOrder}>Условия акции </div>
                                    <Field
                                        name="beginDate"
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        floatingLabelText="Дата начала акции"
                                        container="inline"
                                        fullWidth={true}/>
                                    <Field
                                        name="tillDate"
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        floatingLabelText="Дата завершения акции"
                                        container="inline"
                                        fullWidth={true}/>
                                    <Field
                                        name="discount"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Размер акции"
                                        /> %
                                </div>
                            </div>
                            <div className={classes.rightOrderPart}>
                                <Fields
                                    names={['products', 'productType', 'product', 'amount']}
                                    component={PricesListProductField}
                                />
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
