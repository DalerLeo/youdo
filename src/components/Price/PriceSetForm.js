import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, BrandSearchField, MeasurementSearchField, ImageUploadField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

export const PRICE_SET_FORM_OPEN = 'openSetForm'

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
        form: 'PriceCreateForm',
        enableReinitialize: true
    })
)

const PriceSetForm = enhance((props) => {
    const {handleSubmit, onClose, classes, isUpdate} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
     <div>
            <div className={classes.titleContent}>
                <span>{isUpdate ? 'Изменить продукт' : 'Добавить продукт'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: '250px'}}>
                        <div className={classes.loader}>
                            <CircularProgress size={80} thickness={5}/>
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
                                name="brand"
                                className={classes.inputFieldCustom}
                                component={BrandSearchField}
                                label="Бренд"
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
                                className={classes.imageUpload}
                                component={ImageUploadField}
                                label="Изображения"
                                fullWidth={true}
                            />
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
                            className={classes.actionButton}
                            primary={true}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
})

PriceSetForm.propTyeps = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default PriceSetForm
