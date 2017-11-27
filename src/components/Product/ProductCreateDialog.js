import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {
    TextField,
    ProductTypeParentSearchField,
    ProductTypeChildSearchField,
    MeasurementSearchField,
    ImageUploadField
} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

export const PRODUCT_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
        }
    })),
    reduxForm({
        form: 'ProductCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const type = _.get(state, ['form', 'ProductCreateForm', 'values', 'productTypeParent', 'value'])
        return {
            type
        }
    }),
)

const ProductCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate, type} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? 'Изменить продукт' : 'Добавить продукт'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: '250px'}}>
                        <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        <div className={classes.field} style={{marginTop: '10px'}}>
                            <Field
                                name="name"
                                className={classes.inputFieldCustom}
                                component={TextField}
                                label="Наименование"
                                fullWidth={true}
                            />
                            <Field
                                name="code"
                                className={classes.inputFieldCustom}
                                component={TextField}
                                label="Код товара"
                                fullWidth={true}
                            />
                            <Field
                                name="productTypeParent"
                                className={classes.inputFieldCustom}
                                component={ProductTypeParentSearchField}
                                label="Тип продукта"
                                fullWidth={true}
                            />
                            {type && <Field
                                name="type"
                                className={classes.inputFieldCustom}
                                component={ProductTypeChildSearchField}
                                parentType={type}
                                label="Подкатегория"
                                fullWidth={true}
                            />}
                            <Field
                                name="priority"
                                className={classes.inputFieldCustom}
                                component={TextField}
                                label="Порядок"
                                fullWidth={true}
                            />
                            <Field
                                name="measurement"
                                className={classes.inputFieldCustom}
                                component={MeasurementSearchField}
                                label="Мера"
                                fullWidth={true}
                            />
                        </div>
                        <div className={classes.field} style={{maxWidth: '224px'}}>
                            <Field
                                name="image"
                                component={ImageUploadField}
                                label="Изображения"
                                fullWidth={true}
                            />
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
                            labelStyle={{fontSize: '13px'}}
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

ProductCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default ProductCreateDialog
