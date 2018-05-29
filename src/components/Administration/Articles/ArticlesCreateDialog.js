import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import {Field, reduxForm} from 'redux-form'
import {ImageUploadField, TextField} from '../../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import t from '../../../helpers/translate'
import formValidate from '../../../helpers/formValidate'

export const ARTICLES_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
            padding: '0 30px 20px',
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
        textFieldArea: {
            top: '-20px !important',
            lineHeight: '20px !important',
            fontSize: '13px !important',
            '& textarea': {
                overflow: 'hidden'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        imageField: {
            '& .imageDropZone': {
                margin: '0 auto 10px 0'
            }
        }
    }),
    reduxForm({
        form: 'ArticlesCreateForm',
        enableReinitialize: true
    })
)

const ArticlesCreateDialog = enhance((props) => {
    const {open, loading, dispatch, handleSubmit, onClose, classes, isUpdate} = props
    const formNames = ['title', 'text']
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
                <span>{isUpdate ? t('Изменить статью') : t('Добавить статью')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form} style={{minHeight: 'auto'}}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.inContent} style={{minHeight: '100px', paddingTop: '15px'}}>
                        <div className={classes.field}>
                            <div className={classes.imageField}>
                                <Field
                                    name="image"
                                    component={ImageUploadField}
                                    fullWidth={true}/>
                            </div>
                            <Field
                                name="title"
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label={t('Заголовок')}
                                fullWidth={true}/>
                            <Field
                                name="text"
                                component={TextField}
                                className={classes.textFieldArea}
                                label={t('Текст статьи')}
                                fullWidth
                                multiLine
                                rows={1}/>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Сохранить')}
                            className={classes.actionButton}
                            labelStyle={{fontSize: '13px'}}
                            primary={true}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

ArticlesCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

ArticlesCreateDialog.defaultProps = {
    isUpdate: false
}

export default ArticlesCreateDialog
