import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, reduxForm} from 'redux-form'
import {TextField, ManufactureSearchField, ImageUploadField} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import t from '../../helpers/translate'
import formValidate from '../../helpers/formValidate'

export const EQUIPMENT_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
        equipmentPhoto: {
            '& .imageDropZone': {
                width: '160px',
                height: '160px',
                marginLeft: '30px',
                marginBottom: '30px',
                '& svg': {
                    width: '40px !important'
                }
            }
        }
    })),
    reduxForm({
        form: 'EquipmentCreateForm',
        enableReinitialize: true
    })
)

const EquipmentCreateDialog = enhance((props) => {
    const {open, loading, dispatch, handleSubmit, onClose, classes, isUpdate} = props
    const formNames = ['name', 'manufacture', 'image']
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
                <span>{isUpdate ? t('Изменить оборудование') : t('Добавить оборудование')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.inContent} style={{minHeight: '200px'}}>
                        <div className={classes.field} style={{paddingTop: '15px'}}>
                            <Field
                                name="name"
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label={t('Наименование')}
                                fullWidth={true}
                            />
                            <Field
                                name="manufacture"
                                component={ManufactureSearchField}
                                isUpdate={true}
                                className={classes.inputFieldCustom}
                                label={t('Производство')}
                                fullWidth={true}
                            />
                        </div>
                        <div className={classes.equipmentPhoto}>
                            <Field
                                name="image"
                                className={classes.imageUpload}
                                component={ImageUploadField}
                                label={t('Изображения')}
                                fullWidth={true}
                            />
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

EquipmentCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

EquipmentCreateDialog.defaultProps = {
    isUpdate: false
}

export default EquipmentCreateDialog
