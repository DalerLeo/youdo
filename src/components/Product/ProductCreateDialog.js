import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, reduxForm} from 'redux-form'
import {
    TextField,
    ProductTypeSearchField,
    ProductTypeChildSearchField,
    ImageUploadField
} from '../ReduxForm'
import MeasurementAllValuesSearchField from '../ReduxForm/Measurement/MeasurementAllValuesSearchField'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import t from '../../helpers/translate'
import formValidate from '../../helpers/formValidate'

export const PRODUCT_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
        childMeasurement: {
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                width: 'calc((100% / 3) - 10px) !important'
            }
        }
    })),
    reduxForm({
        form: 'ProductCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const typeParent = _.get(state, ['form', 'ProductCreateForm', 'values', 'type', 'value'])
        const measurementParent = _.get(state, ['form', 'ProductCreateForm', 'values', 'measurement', 'value'])
        const boxes = _.get(state, ['form', 'ProductCreateForm', 'values', 'boxes'])
        return {
            typeParent,
            measurementParent,
            boxes
        }
    })
)

const ProductCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate, typeParent, measurementParent, dispatch} = props
    const formNames = ['name', 'type', 'measurement']
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch((error) => {
            formValidate(formNames, dispatch, error)
        }))
    const measurementChilds = _.get(measurementParent, 'children')
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
                <span>{isUpdate ? t('Изменить продукт') : t('Добавить продукт')}</span>
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
                        <div className={classes.field} style={{margin: '10px 0'}}>
                            <Field
                                name="name"
                                className={classes.inputFieldCustom}
                                component={TextField}
                                label={t('Наименование')}
                                fullWidth={true}
                            />
                            <Field
                                name="code"
                                className={classes.inputFieldCustom}
                                component={TextField}
                                label={t('Код товара')}
                                fullWidth={true}
                            />
                            <Field
                                name="type"
                                className={classes.inputFieldCustom}
                                component={ProductTypeSearchField}
                                params={{parent: 0}}
                                label={t('Тип продукта')}
                                fullWidth={true}
                            />
                            {typeParent && <Field
                                name="typeChild"
                                className={classes.inputFieldCustom}
                                component={ProductTypeChildSearchField}
                                params={{parent: typeParent}}
                                label={t('Подкатегория')}
                                fullWidth={true}
                            />}
                            <Field
                                name="priority"
                                className={classes.inputFieldCustom}
                                component={TextField}
                                label={t('Порядок')}
                                fullWidth={true}
                            />
                            <Field
                                name="measurement"
                                className={classes.inputFieldCustom}
                                component={MeasurementAllValuesSearchField}
                                params={{parent: 0}}
                                label={t('Мера')}
                                fullWidth={true}
                            />
                            {!_.isEmpty(measurementParent) &&
                            <div className={classes.childMeasurement}>
                                {_.map(measurementChilds, (item) => {
                                    const id = _.get(item, 'id')
                                    const name = _.get(item, 'name')
                                    return (
                                        <Field
                                            name={'[boxes][' + id + ']amount'}
                                            className={classes.inputFieldCustom}
                                            component={TextField}
                                            label={name}
                                            fullWidth={true}
                                            key={id}/>
                                    )
                                })}
                            </div>}
                        </div>
                        <div className={classes.field} style={{maxWidth: '224px'}}>
                            <Field
                                name="image"
                                component={ImageUploadField}
                                label={t('Изображения')}
                                fullWidth={true}
                            />
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Сохранить')}
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
