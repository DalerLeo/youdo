import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import _ from 'lodash'
import {reduxForm, SubmissionError, Field} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'
import {CashboxSearchField} from '../ReduxForm'
import FlatButton from 'material-ui/FlatButton'
import numberFormat from '../../helpers/numberFormat'

const ZERO = 0

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
            display: 'flex'
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
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%'
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
        inContent: {
            maxHeight: '50vh',
            minHeight: '184px',
            padding: '0 30px',
            color: '#333',
            '& > div:first-child': {
                padding: '20px 0 10px'
            },
            '& span': {
                fontWeight: '600'
            }
        },
        bodyContent: {
            width: '100%'
        },
        returnInfo: {
            padding: '25px 0',
            borderBottom: '1px #efefef solid',
            '& span': {
                display: 'block',
                '&:first-child': {
                    fontWeight: '600'
                }
            }
        },
        flex: {
            alignItems: 'initial',
            '& > div:first-child': {
                maxWidth: '60%'
            }
        }
    }),
    reduxForm({
        form: 'AcceptClientTransactionForm',
        enableReinitialize: true
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const AcceptClientTransactionDialog = enhance((props) => {
    const {open, onClose, classes, loading, handleSubmit, data} = props
    const onSubmit = handleSubmit(() => props.onSubmit(_.get(data, ['sum'])).catch(validate))
    const user = _.get(data, ['user', 'name'])
    const currency = _.get(data, ['currency', 'name'])
    const amount = numberFormat(_.get(data, ['sum']), currency)
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '200px'} : {width: '400px', maxWidth: 'auto'}}
            open={open > ZERO}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>Принять наличные {amount}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                {loading
                    ? <div className={classes.loader}>
                        <CircularProgress size={40} thickness={4}/>
                      </div>
                    : <form onSubmit={onSubmit}>
                        <div className={classes.inContent} style={{minHeight: 'initial'}}>
                            <div>Агент: <span>{user}</span></div>
                            <div className={classes.list}>
                                <Field
                                    name="cashBox"
                                    component={CashboxSearchField}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}
                                    label="Кассы"
                                />
                            </div>
                        </div>
                        <div className={classes.bottomButton}>
                            <FlatButton
                                label="Сохранить"
                                primary={true}
                                type="submit"
                            />
                        </div>
                      </form>
                }
            </div>
        </Dialog>
    )
})
AcceptClientTransactionDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}
export default AcceptClientTransactionDialog
