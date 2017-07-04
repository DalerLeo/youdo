import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import {
    ProductSearchField,
    TextField,
    DateField,
    CheckBox
} from '../ReduxForm'
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
            color: '#333'
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
        leftSide: {
            borderRight: '1px #efefef solid',
            flexBasis: '35%',
            maxWidth: '35%',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            '& > div:first-child': {
                height: '100%',
                padding: '20px 30px'
            }
        },
        half: {
            display: 'flex',
            alignItems: 'baseline',
            width: '50%'
        },
        link: {
            color: '#12aaeb !important',
            borderBottom: '1px dashed',
            fontWeight: '400 !important'
        },
        rightSide: {
            padding: '0 30px',
            flexBasis: '65%',
            maxWidth: '65%'
        },
        inputFieldCustom: {
            flexBasis: '200px',
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
            },
            '& div:first-child div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
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
        form: 'StockReceiveCreateForm',
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
        isUpdate
    } = props
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
                <span>{isUpdate ? 'Изменение заказа' : 'Добавление заказа'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
                    </div>
                    <div className={classes.inContent}>
                        <div className={classes.leftSide}>
                            <div>
                                <Field
                                    name="name"
                                    component={ProductSearchField}
                                    className={classes.inputFieldCustom}
                                    label="Наименование товара"
                                    fullWidth={true}
                                />
                                <div className={classes.half}>
                                    <Field
                                        name="amount"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Кол-во товара"
                                        fullWidth={true}
                                    />
                                    <div>шт</div>
                                </div>
                                <div className={classes.half}>
                                    <Field
                                        name="amount"
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        label="Срок годности"
                                        fullWidth={true}
                                    />
                                </div>
                                <Field
                                    name="isDefect"
                                    component={CheckBox}
                                    label="Отметить как бракованный"
                                    fullWidth={true}
                                />
                                <div style={{marginTop: '20px'}}><strong>Введите / <a className={classes.link}>отсканируйте</a> штрихкод</strong></div>
                                <Field
                                    name="barcode"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    hintText="XXXX - XXXX - XXXX"
                                    fullWidth={true}
                                />
                            </div>
                            <div className={classes.bottomButton}>
                                <FlatButton
                                    label="Принять товар"
                                    className={classes.actionButton}
                                    primary={true}
                                    type="submit"/>
                            </div>
                        </div>
                        <div className={classes.rightSide}>

                        </div>
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
