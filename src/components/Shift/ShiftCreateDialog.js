import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm} from 'redux-form'
import {TextField, TimeField} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
import t from '../../helpers/translate'
import formValidate from '../../helpers/formValidate'

export const SHIFT_CREATE_DIALOG_OPEN = 'openCreateDialog'

const enhance = compose(
    injectSheet({
        buttonSub: {
            textAlign: 'right',
            marginTop: '10px',
            '& span': {
                color: '#129fdd !important'
            }
        },
        timePick: {
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                flexBasis: '49%'
            }
        },
        inputFieldShift: {
            fontSize: '13px !important',
            marginRight: '20px',
            height: '50px !important',
            '& input': {
                top: '-10px'
            },
            '& label': {
                top: '20px !important'
            }
        },
        inputFieldTime: {
            fontSize: '13px !important',
            height: '50px !important',
            '& input': {
                top: '-10px'
            },
            '& label': {
                top: '20px !important'
            }
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'unset !important',
            overflowX: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            maxHeight: 'none !important',
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
            minHeight: '184px',
            overflow: 'unset',
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
            width: '100%'
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
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        loader: {
            height: '70px',
            width: '100%',
            background: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
        }
    }),
    reduxForm({
        form: 'ShiftCreateForm',
        enableReinitialize: true
    })
)

const ShiftCreateDialog = enhance((props) => {
    const {open, loading, dispatch, handleSubmit, onClose, classes, isUpdate} = props
    const formNames = ['name', 'beginTime', 'endTime']
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch((error) => {
            formValidate(formNames, dispatch, error)
        }))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? t('Редактирование смены') : t('Добавить смену')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit}>
                    { loading
                    ? <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    : <div className={classes.inContent} style={{minHeight: '150px'}}>
                        <div className={classes.field} style={{paddingTop: '15px'}}>
                            <Field
                                name="name"
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label={t('Наименование')}
                                fullWidth={true}/>
                            <div className={classes.timePick}>
                                <Field
                                    name="beginTime"
                                    component={TimeField}
                                    className={classes.inputFieldTime}
                                    label={t('Начало')}
                                    fullWidth={true}/>
                                <Field
                                    name="endTime"
                                    component={TimeField}
                                    className={classes.inputFieldTime}
                                    label={t('Конец')}
                                    fullWidth={true}/>
                            </div>
                        </div>
                    </div>}
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Применить')}
                            className={classes.actionButton}
                            labelStyle={{fontSize: '13px'}}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

ShiftCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

ShiftCreateDialog.defaultProps = {
    isUpdate: false
}

export default ShiftCreateDialog
