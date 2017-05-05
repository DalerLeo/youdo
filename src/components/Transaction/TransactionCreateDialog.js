import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Col} from 'react-flexbox-grid'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import TextFieldMU from 'material-ui/TextField'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, CurrencySearchField, ExpensiveCategorySearchField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'

export const TRANSACTION_CREATE_DIALOG_OPEN = 'openCreateDialog'

const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    const latLng = (_.get(errors, 'lat') || _.get(errors, 'lon')) && 'Location is required.'

    throw new SubmissionError({
        ...errors,
        latLng,
        _error: nonFieldErrors
    })
}

const enhance = compose(
    injectSheet({
        dialog: {
            '& div:last-child': {
                textAlign: 'le !important',
                '& button': {
                    marginLeft: '50px !important',
                    marginBottom: '5px !important',
                    color: '#12aaeb !important'
                }
            }
        },
        body: {
            padding: '0 !important'
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
            display: ({loading}) => !loading ? 'block' : 'none',
            width: '100%',
            '& > div:nth-child(2)': {
                padding: '20px',
                borderBottom: '1px solid #efefef'
            }
        },

        label: {
            fontWeight: 'bold',
            color: 'black',
            padding: '15px 0 0 0 !important'
        },

        form: {
            display: 'flex',
            '& > div:nth-child(2) > button': {
                float: 'right',
                margin: '10px !important'
            }
        },
        flex: {
            display: 'flex',
            '& > div:first-child': {
                marginRight: '20px'
            }
        },
        nav: {
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '20px',
            color: 'black',
            borderBottom: '1px solid #efefef',
            '& button': {
                float: 'right',
                marginTop: '-5px !important'
            }
        }
    }),
    reduxForm({
        form: 'TransactionCreateForm',
        enableReinitialize: true
    })
)

const TransactionCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, cashboxData} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const cashbox = _.find(_.get(cashboxData, 'data'), {'id': _.get(cashboxData, 'cashboxId')})

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '400px'}}
            bodyClassName={classes.body}>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.fields}>
                    <div className={classes.nav}>
                        Расход
                        <IconButton onTouchTap={onClose}>
                            <CloseIcon2 />
                        </IconButton>
                    </div>
                    <div>
                        <div>Касса:</div>
                        <div className={classes.label} name="cashbox" value={cashbox}>{_.get(cashbox, 'name')}</div>
                        <Field
                            name="categoryId"
                            component={ExpensiveCategorySearchField}
                            label="Категория расхода"
                            fullWidth={true}/>
                        <div className={classes.flex}>
                            <Col xs={6}>
                                <Field
                                    name="amount"
                                    component={TextField}
                                    label="Сумма"
                                    fullWidth={true}/>
                            </Col>
                            <Col xs={4}>
                                <Field
                                    name="typePayment"
                                    component={CurrencySearchField}
                                    label="Валята"
                                    fullWidth={true}/>
                            </Col>
                        </div>
                        <TextFieldMU
                            name="comment"
                            floatingLabelFocusStyle={{borderBottom: 'none'}}
                            className={classes.border}
                            floatingLabelText="Комментары"
                            multiLine={true}
                            rows={3}
                            rowsMax={3}
                            fullWidth={true}/>
                    </div>
                    <FlatButton
                        label="Сохранмть"
                        primary={true}
                        type="submit"
                    />
                </div>
            </form>
        </Dialog>
    )
})

TransactionCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    cashboxData: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default TransactionCreateDialog
