import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader/index'
import {reduxForm, Field} from 'redux-form'
import {DateField, TextField, TimeField} from '../../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import t from '../../../helpers/translate'
import {BORDER_STYLE, COLOR_DEFAULT, PADDING_STANDART} from '../../../constants/styleConstants'
import formValidate from '../../../helpers/formValidate'
import {HR_RESUME_MEETING, HR_RESUME_REMOVED, HR_RESUME_SHORT} from '../../../constants/backendConstants'

const enhance = compose(
    injectSheet({
        dialog: {
            overflowY: 'auto'
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
            justifyContent: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
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
            color: COLOR_DEFAULT,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: BORDER_STYLE,
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
        },
        inContent: {
            padding: PADDING_STANDART
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& > div:first-child': {
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
        textFieldArea: {
            top: '-20px !important',
            lineHeight: '20px !important',
            fontSize: '13px !important',
            marginBottom: '-22px'
        },
        inputDateCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& > div:first-child': {
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
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
            borderTop: BORDER_STYLE,
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
        form: 'ResumeMoveForm',
        enableReinitialize: true
    })
)

const DateTimeCommentDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        handleSubmit,
        dispatch,
        status
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch((error) => {
            formValidate([], dispatch, error)
        }))
    const getTitle = () => {
        switch (status) {
            case HR_RESUME_MEETING: return t('Назначить собеседование')
            case HR_RESUME_SHORT: return t('Добавление в "short list"')
            case HR_RESUME_REMOVED: return t('Удаление резюме из списка')
            default: return null
        }
    }

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{width: '500px', maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{getTitle()}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>

            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    {status === HR_RESUME_MEETING &&
                    <div>
                        <Field
                            name="date"
                            component={DateField}
                            className={classes.inputDateCustom}
                            label={t('Дата')}
                            errorStyle={{bottom: 2}}
                            fullWidth={true}/>
                        <Field
                            name="time"
                            component={TimeField}
                            className={classes.inputDateCustom}
                            label={t('Время')}
                            errorStyle={{bottom: 2}}
                            fullWidth={true}/>
                    </div>}
                    <Field
                        name="comment"
                        component={TextField}
                        className={classes.textFieldArea}
                        label={t('Комментарий')}
                        fullWidth={true}
                        multiLine={true}
                        rows={1}
                        rowsMax={4}/>
                </div>
                <div className={classes.bottomButton}>
                    <FlatButton
                        label={t('Сохранить')}
                        className={classes.actionButton}
                        primary={true}
                        onTouchTap={onSubmit}
                    />
                </div>
            </div>
        </Dialog>
    )
})

DateTimeCommentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default DateTimeCommentDialog
