import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import t from '../../helpers/translate'
import {TextField, ImageUploadField} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import {Tabs, Tab} from 'material-ui/Tabs'

export const TELEGRAM_NEWS_CREATE_DIALOG_OPEN = 'openCreateDialog'
export const TELEGRAM_NEWS_UPDATE_DIALOG_OPEN = 'openUpdateDialog'

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
            justifyContent: 'center',
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
            color: '#333'
        },
        bodyContent: {
            width: '100%'
        },
        field: {
            display: 'flex',
            width: '100%',
            '& > div': {
                width: '50%',
                '&:first-child': {borderRight: '1px #efefef solid'}
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
        },
        flexField: {
            display: 'flex'
        },
        tabsWrapper: {
            width: '100%'
        },
        tabsContainer: {
            padding: '10px 30px 20px'
        },
        imageUpload: {
            padding: '20px 30px',
            '& .imageDropZone': {
                margin: '0 auto',
                width: '100%'
            }
        },
        link: {
            display: 'flex',
            alignItems: 'center',
            '& > a': {
                width: '100px',
                textAlign: 'right',
                marginLeft: '20px'
            }
        }
    }),
    reduxForm({
        form: 'TelegramNewsCreateForm',
        enableReinitialize: true
    })
)

const TelegramNewsCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '500px'} : {width: '800px'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{isUpdate ? t('Редактирование новости') : t('Добавление новости')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent}>
                        <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        <div className={classes.field}>
                            <Tabs
                                inkBarStyle={{background: '#12aaeb'}}
                                className={classes.tabsWrapper}
                                contentContainerClassName={classes.tabsContainer}>
                                <Tab label={'Ру'} disableTouchRipple={true}>
                                    <Field
                                        name="[translations][ru][title]"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Заголовок"
                                        fullWidth={true}/>
                                    <Field
                                        name="[translations][ru][description]"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Описание"
                                        fullWidth={true}/>
                                    <div className={classes.link}>
                                        <Field
                                        name="[translations][ru][telegraph_link]"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Ссылка на статью"
                                        hintText="http://telegra.ph/"
                                        fullWidth={true}/>
                                        <a target="_blank" href={'http://telegra.ph'} >+ добавить</a>
                                    </div>
                                </Tab>
                                <Tab label={'Ўз'} disableTouchRipple={true}>
                                    <Field
                                        name="[translations][uz][title]"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Sarlavha"
                                        fullWidth={true}/>
                                    <Field
                                        name="[translations][uz][description]"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Tavsif"
                                        fullWidth={true}/>
                                    <div className={classes.link}>
                                        <Field
                                            name="[translations][uz][telegraph_link]"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            label="Maqolaga havola"
                                            hintText="http://telegra.ph/"
                                            fullWidth={true}/>
                                        <a target="_blank" href={'http://telegra.ph'} >+ qo'shish</a>
                                    </div>
                                </Tab>
                                <Tab label={'En'} disableTouchRipple={true}>
                                    <Field
                                        name="[translations][en][title]"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Title"
                                        fullWidth={true}/>
                                    <Field
                                        name="[translations][en][description]"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Description"
                                        fullWidth={true}/>
                                    <div className={classes.link}>
                                        <Field
                                            name="[translations][en][telegraph_link]"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            label="Telegraph link"
                                            hintText="http://telegra.ph/"
                                            fullWidth={true}/>
                                        <a target="_blank" href={'http://telegra.ph'} >+ add</a>
                                    </div>
                                </Tab>
                            </Tabs>
                            <div className={classes.imageUpload}>
                                <Field
                                    name="image"
                                    component={ImageUploadField}/>
                            </div>
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

TelegramNewsCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

TelegramNewsCreateDialog.defaultProps = {
    isUpdate: false
}

export default TelegramNewsCreateDialog
