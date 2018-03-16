import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import t from '../../../helpers/translate'
import formValidate from '../../../helpers/formValidate'
import {BORDER_STYLE, COLOR_DEFAULT} from '../../../constants/styleConstants'
import {connect} from 'react-redux'

export const RESUME_CREATE_DIALOG_OPEN = 'openCreateDialog'
export const RESUME_UPDATE_DIALOG_OPEN = 'openUpdateDialog'

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
        customLoader: {
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 0'
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
        },
        flex: {
            display: 'flex'
        },
        alignBaseline: {
            alignItems: 'baseline'
        },
        alignCenter: {
            alignItems: 'center'
        },
        flexBetween: {
            extend: 'flex',
            justifyContent: 'space-between'
        },
        halfChild: {
            flexWrap: 'wrap',
            '& > div': {
                width: '49% !important'
            }
        },
        thirdChild: {
            flexWrap: 'wrap',
            '& > div': {
                width: '32% !important'
            }
        }
    }),
    reduxForm({
        form: 'ResumeCreateForm',
        enableReinitialize: true
    }),
    connect((state) => { return null })
)

const ResumeCreateDialog = enhance((props) => {
    const {
        dispatch,
        open,
        handleSubmit,
        onClose,
        classes,
        isUpdate
    } = props
    const formNames = []
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
            contentStyle={{width: '800px', maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{isUpdate ? t('Изменение резюме') : t('Создание резюме')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent}></div>

                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Сохранить')}
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

ResumeCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

ResumeCreateDialog.defaultProps = {
    isUpdate: false
}

export default ResumeCreateDialog
