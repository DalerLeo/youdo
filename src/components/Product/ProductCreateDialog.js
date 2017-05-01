import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, ProductTypeSearchField, BrandSearchField, MeasurementSearchField, ImageUploadField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'

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
    injectSheet({
        loader: {
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
        },
        fieldsWrap: {
            display: ({loading}) => !loading ? 'flex' : 'none',
            width: '100%'
        },
        field: {
            width: '100%'
        },
        body: {
            maxHeight: '600px !important',
            overflow: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '20px !important'
        },

        title: {
            paddingTop: '15px',
            fontWeight: 'bold',
            color: '#333'
        },
        titleContent: {
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            position: 'relative',
            borderBottom: '1px solid #efefef',
            marginLeft: '-24px',
            marginRight: '-24px',
            padding: '0px 30px 20px 30px',
            '& button': {
                position: 'absolute !important',
                right: '20px',
                margin: '-15px -10px 0 0 !important'
            }
        },

        form: {
            display: 'flex'
        },
        inputField: {
            fontSize: '13px !important'
        },
        imageUpload: {
            width: '100px'
        },
        bottomButton: {
            margin: '20px -20px 0',
            bottom: '-5px',
            padding: '20px 20px 0 0',
            position: 'relative',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        }
    }),
    reduxForm({
        form: 'ProductCreateForm',
        enableReinitialize: true
    })
)

const ProductCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {}}
            bodyClassName={classes.body}>
            <div className={classes.titleContent}>
                <span>Добавить продукт</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.fieldsWrap}>
                    <div className={classes.field}>
                        <Field
                            name="name"
                            className={classes.inputField}
                            component={TextField}
                            label="Наимование"
                            fullWidth={true}
                        />
                        <Field
                            name="type"
                            className={classes.inputField}
                            component={ProductTypeSearchField}
                            label="Тип продукта"
                            fullWidth={true}
                        />
                        <Field
                            name="brand"
                            className={classes.inputField}
                            component={BrandSearchField}
                            label="Бренд"
                            fullWidth={true}
                        />
                        <Field
                            name="measurement"
                            className={classes.inputField}
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
            </form>
            <div className={classes.bottomButton}>
                <FlatButton
                    label="Сохранить"
                    className={classes.actionButton}
                    primary={true}
                    type="submit"
                    keyboardFocused={true}
                />
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
