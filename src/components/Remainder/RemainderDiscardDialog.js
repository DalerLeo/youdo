import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, Fields, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import TextField from '../ReduxForm/Basic/TextField'
import RemainderListProductField from '../ReduxForm/Remainder/RemainderListProductField'
import {StockSearchField} from '../ReduxForm'

export const REMAINDER_DISCARD_DIALOG_OPEN = 'openDiscardDialog'

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
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            background: '#fff'
        },
        wrapper: {
            position: 'relative',
            padding: '0 30px',
            marginBottom: '5px',
            '& .row': {
                alignItems: 'center',
                '& div': {
                    lineHeight: '55px'
                }
            }
        },
        title: {
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
        dialogBody: {
            display: 'flex',
            '& tbody:last-child': {
                borderBottom: '1px #efefef solid'

            }
        },
        noPadding: {
            padding: '0! important',
            maxHeight: 'none !important',
            color: '#333 !important'
        },
        subTitle: {
            fontWeight: '600'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            width: '100% !important',
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
            height: '45px !important',
            '& input': {
                marginTop: '0 !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& div': {
                fontSize: '13px !important',
                height: '45px !important',
                width: '100% !important'
            }
        },
        bottomButton: {
            position: 'relative',
            padding: '10px',
            borderTop: '1px solid #efefef',
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
            margin: '0 !important',
            position: 'absolute'
        },
        comment: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 30px'
        },
        commentText: {
            fontSize: '14px',
            fontWeight: '600'
        },
        commentField: {
            maxHeight: '70px',
            '& > div:first-child': {
                padding: '3px 7px',
                top: '12px',
                bottom: 'auto !important'
            },
            '& hr': {
                opacity: '0'
            },
            '& textarea': {
                border: 'solid 1px #999999 !important',
                margin: 'auto',
                padding: '3px 7px !important'
            }
        },
        leftSide: {
            flexBasis: '25%',
            maxWidth: '25%',
            height: '280px',
            borderRight: '1px #efefef solid',
            padding: '20px 30px',
            '&  > div > div:first-child': {
                width: '100% !important'
            }

        },
        rightSide: {
            flexBasis: '75%',
            maxWidth: '75%'
        }
    }),
    reduxForm({
        form: 'RemainderDiscardForm',
        enableReinitialize: true
    })
)

const RemainderDiscardDialog = enhance((props) => {
    const {open, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    const iconStyle = {
        icon: {
            color: '#666',
            width: 25,
            height: 25
        },
        button: {
            width: 40,
            height: 40,
            padding: '0'
        }
    }

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{maxWidth: 'none', width: '1000px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.noPadding}>
            <div className={classes.title}>
                <span>Списание товара</span>
                <IconButton
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}
                    touch={true}
                    onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <form onSubmit={onSubmit} className={classes.form} style={{minHeight: 'auto'}}>
                <div className={classes.dialogBody}>
                    <div className={classes.leftSide}>
                        <Field
                            className={classes.inputFieldCustom}
                            name="fromStock"
                            component={StockSearchField}
                            label="С какого склада"
                        />
                        <Field
                            style={{marginTop: '-20px', lineHeight: '20px', fontSize: '13px'}}
                            name="comment"
                            component={TextField}
                            label="Оставить комментарий..."

                            multiLine={true}
                            rows={4}
                            rowsMax={6}
                            fullWidth={true}/>
                    </div>
                    <div className={classes.rightSide}>
                        <Fields
                            names={['products', 'productType', 'product', 'amount']}
                            component={RemainderListProductField}
                        />
                    </div>
                </div>
                <div className={classes.bottomButton}>
                    <FlatButton
                        label="СПИСАТЬ"
                        className={classes.actionButton}
                        primary={true}
                        type="submit"
                    />
                </div>
            </form>
        </Dialog>
    )
})

RemainderDiscardDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

RemainderDiscardDialog.defaultProps = {
    isUpdate: false
}

export default RemainderDiscardDialog
