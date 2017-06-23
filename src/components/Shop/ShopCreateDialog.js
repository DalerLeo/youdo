import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, FieldArray, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {
    TextField,
    LocationField,
    CategorySearchField,
    ClientSearchField,
    VisitFrequencySearchField
} from '../ReduxForm'
import ShopContactsListField from '../ReduxForm/Shop/ShopContactsListField'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'
import Dot from '../Images/dot.png'

export const SHOP_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
            textAlign: 'center',
            justifyContent: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        popUp: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            maxHeight: 'inherit !important'
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
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            display: 'flex',
            color: '#333',
            minHeight: '450px'
        },
        leftSide: {
            flexBasis: '50%',
            maxWidth: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        rightSide: {
            flexBasis: '50%',
            maxWidth: '50%'
        },
        bodyContent: {
            color: '#333',
            width: '100%'
        },
        form: {
            position: 'relative'
        },
        fields: {
            width: '100%',
            padding: '20px 30px',
            boxSizing: 'border-box',
            maxHeight: '622px',
            overflowY: 'auto'
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
        podlojkaScroll: {
            padding: '0 !important',
            overflowY: 'auto !important',
            '& > div > div': {
                width: 'auto !important',
                maxWidth: '900px !important'
            }
        },
        flex: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        divider: {
            paddingBottom: '20px',
            marginBottom: '20px',
            position: 'relative',
            '&:after': {
                content: '""',
                backgroundImage: 'url(' + Dot + ')',
                position: 'absolute',
                bottom: '0',
                height: '2px',
                left: '0',
                right: '0'
            }
        },
        inputHalfWrap: {
            flexBasis: '50%',
            width: '50%'
        },
        add: {
            marginTop: '5px',
            marginBottom: '-5px',
            textAlign: 'right'
        }
    }),
    reduxForm({
        form: 'ShopCreateForm',
        enableReinitialize: true
    }),
    withState('openClient', 'setOpenClient', false)
)
const isUpdate = false
const ShopCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, openClient, setOpenClient} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.podlojkaScroll}
            contentStyle={loading ? {width: '500px'} : {width: '100%'}}
            bodyClassName={classes.popUp}>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
                    </div>
                    <div className={classes.titleContent}>
                        <span>{isUpdate ? 'Изменение магазина' : 'Добавление магазина'}</span>
                        <IconButton onTouchTap={onClose}>
                            <CloseIcon2 color="#666666"/>
                        </IconButton>
                    </div>
                    <div className={classes.inContent}>
                        <div className={classes.leftSide}>
                            <div className={classes.fields}>
                                <div className={classes.divider}>
                                    <Field
                                        name="client"
                                        component={ClientSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Клиент"
                                        fullWidth={true}/>
                                    {openClient && <div>
                                        <Field
                                            name="clientPhone"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            label="Телефон"
                                            fullWidth={true}/>
                                        <Field
                                            name="clientContactName"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            label="Контактное лицо"
                                            fullWidth={true}/>
                                    </div>}
                                    <div className={classes.add}>
                                        {!openClient && <a onClick={() => { setOpenClient(true) }}>+ добавить клиента</a>}
                                    </div>
                                </div>
                                <div className={classes.divider}>
                                    <Field
                                        name="name"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Наименование"
                                        fullWidth={true}/>
                                    <Field
                                        name="category"
                                        component={CategorySearchField}
                                        className={classes.inputFieldCustom}
                                        label="Тип заведения"
                                        fullWidth={true}/>
                                    <div className={classes.flex} style={{alignItems: 'baseline'}}>
                                        <div className={classes.inputHalfWrap}>Частота посещений:</div>
                                        <div className={classes.inputHalfWrap}>
                                            <Field
                                                name="frequency"
                                                component={VisitFrequencySearchField}
                                                className={classes.inputFieldCustom}
                                                hintText="Выберите"
                                                fullWidth={true}/>
                                        </div>
                                    </div>
                                </div>

                                <div className={classes.divider}>
                                    <Field
                                        name="address"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Адрес"
                                        fullWidth={true}/>
                                    <Field
                                        name="guide"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Ориентир"
                                        fullWidth={true}/>
                                </div>
                                <FieldArray
                                    name="contacts"
                                    component={ShopContactsListField}/>
                            </div>
                        </div>
                        <div className={classes.rightSide}>
                            {/*<Field*/}
                                {/*name="latLng"*/}
                                {/*component={LocationField}*/}
                                {/*fullWidth={true}*/}
                            {/*/>*/}
                            asdasdasd
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
                            className={classes.actionButton}
                            primary={true}
                            type="submit"/>
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

ShopCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default ShopCreateDialog
