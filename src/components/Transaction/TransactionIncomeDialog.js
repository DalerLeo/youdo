import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import MainStyles from '../Styles/MainStyles'

export const TRANSACTION_INCOME_DIALOG_OPEN = 'openIncomeDialog'

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
            display: ({loading}) => loading ? 'flex' : 'none'
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
        },
        flex: {
            display: 'flex',
            alignItems: 'center'
        },
        label: {
            fontSize: '75%',
            color: '#999'
        },
        itemList: {
            marginTop: '20px'
        }
    })),
    reduxForm({
        form: 'TransactionIncomeForm',
        enableReinitialize: true
    })
)

const TransactionIncomeDialog = enhance((props) => {
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
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Приход</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: '190px'}}>
                        <div className={classes.loader}>
                            <CircularProgress size={80} thickness={5}/>
                        </div>
                        <div className={classes.field}>
                            <div className={classes.itemList}>
                                <div className={classes.label}>Касса:</div>
                                <div style={{fontWeight: '600', marginBottom: '5px'}}>{_.get(cashbox, 'name')}</div>
                            </div>
                            <div className={classes.flex} style={{alignItems: 'baseline'}}>
                                <Field
                                    name="amount"
                                    component={TextField}
                                    label="Сумма"
                                    className={classes.inputFieldCustom}
                                    style={{width: '50%'}}
                                    fullWidth={false}/>
                                <div style={{marginLeft: '20px'}}>
                                   {_.get(cashbox, ['currency', 'name'])}
                                </div>
                            </div>
                            <Field
                                name="comment"
                                style={{top: '-20px', lineHeight: '20px', fontSize: '13px'}}
                                component={TextField}
                                label="Комментарий..."
                                multiLine={true}
                                rows={1}
                                rowsMax={3}
                                fullWidth={true}/>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
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

TransactionIncomeDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    cashboxData: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default TransactionIncomeDialog
