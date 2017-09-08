import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field, SubmissionError} from 'redux-form'
import FlatButton from 'material-ui/FlatButton'
import {TextField} from '../ReduxForm'
import Paper from 'material-ui/Paper'
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
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
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
            height: '90px',
            padding: '0 30px',
            color: '#333'
        },
        bodyContent: {
            width: '100%'
        },
        form: {
            position: 'relative'
        },
        field: {
            width: '100%',
            padding: '10px',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between'
        },
        inputField: {
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
        inputFieldCustom: {
            width: '110px !important',
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
                marginTop: '0 !important',
                textAlign: 'right'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important',
            minWidth: '50px !important'
        },
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
            display: 'flex',
            alignItems: 'initial',
            '& > div:first-child': {
                maxWidth: '60%'
            }
        },
        returnedItems: {
            '& .dottedList': {
                padding: '20px 0 !important'
            },
            padding: '10px 0 0',
            '& .row': {
                '& > div': {
                    textAlign: 'left !important'
                },
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    position: 'static'
                },
                '& > div:nth-child(3)': {
                    textAlign: 'right !important'
                },
                '& > div:nth-child(4)': {
                    textAlign: 'right !important'
                }
            }
        },
        returnSummary: {
            borderTop: '1px #efefef solid',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'right',
            margin: '0 -30px',
            padding: '15px 30px'
        }
    }),
    reduxForm({
        form: 'OrderSetDiscountForm',
        enableReinitialize: true
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const OrderSetDiscountDialog = enhance((props) => {
    const {classes, handleSubmit, id} = props
    const onSubmit = handleSubmit(() => props.onSubmit(id).catch(validate))

    return (
        <Paper zDepth={2}>
            <form onSubmit={onSubmit} className={classes.field}>
                <div><Field
                    name="percent"
                    component={TextField}
                    label="Размер скидки"
                    className={classes.inputFieldCustom}

                /> %
                </div>
                <FlatButton
                    label="OK"
                    style={{color: '#12aaeb'}}
                    className={classes.actionButton}
                    primary={true}
                    type="submit"
                />
            </form>
        </Paper>
    )
})
OrderSetDiscountDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default OrderSetDiscountDialog
