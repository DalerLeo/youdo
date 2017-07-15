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
import StockSearchField from '../ReduxForm/Stock/StockSearchField'
import DateField from '../ReduxForm/Basic/DateField'
import TextField from '../ReduxForm/Basic/TextField'
import RemainderListProductField from '../ReduxForm/Remainder/RemainderListProductField'

export const REMAINDER_TRANSFER_DIALOG_OPEN = 'openTransferDialog'

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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '20px',
            padding: '15px 30px 20px',
            fontWeight: '600',
            borderBottom: '1px #efefef solid',
            textTransform: 'uppercase'

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
        },
        dialog: {
            width: '1000px important'
        },
        dialogBody: {
            display: 'flex'
        },
        noPadding: {
            padding: '0! important'
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
        form: 'RemainderTransferForm',
        enableReinitialize: true
    })
)

const RemainderTransferDialog = enhance((props) => {
    const {open, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

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
                <span>передача товаров</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <form onSubmit={onSubmit} className={classes.form} style={{minHeight: 'auto'}}>
            <div className={classes.dialogBody}>
                <div className={classes.leftSide}>
                    <span className={classes.subTitle}>Условия передачи товара</span>
                        <Field
                            className={classes.inputFieldCustom}
                            name="stock"
                            component={StockSearchField}
                            label="Склад"
                        />
                        <Field
                            className={classes.inputDateCustom}
                            name="deliveryDate"
                            component={DateField}
                            label="Дата доставки"
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
                    label="ПЕРЕДАТЬ"
                    className={classes.actionButton}
                    primary={true}
                    type="submit"
                />
            </div>
            </form>
        </Dialog>
    )
})

RemainderTransferDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

RemainderTransferDialog.defaultProps = {
    isUpdate: false
}

export default RemainderTransferDialog
