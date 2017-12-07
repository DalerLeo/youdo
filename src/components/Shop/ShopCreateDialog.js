import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {
    TextField,
    MarketTypeSearchField,
    ClientSearchField,
    VisitFrequencySearchField,
    ShopStatusSearchField
} from '../ReduxForm'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Place from '../CustomIcons/AddPlace'
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
            overflow: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            maxHeight: 'inherit !important',
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
        padding: {
            padding: '20px 30px'
        },
        leftSide: {
            flexBasis: '50%',
            maxWidth: '50%',
            borderRight: '1px solid #efefef',
            extend: 'padding'
        },
        rightSide: {
            flexBasis: '50%',
            maxWidth: '50%',
            extend: 'padding'
        },
        bodyContent: {
            color: '#333',
            width: '100%'
        },
        form: {
            position: 'relative'
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
                maxWidth: '820px !important'
            }
        },
        flex: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
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
        },
        addPlace: {
            extend: 'add',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            '& a': {
                display: 'flex',
                alignItems: 'center',
                '& svg': {
                    marginRight: '5px',
                    width: '16px !important'
                }
            },
            '& div': {
                display: 'flex',
                alignItems: 'center',
                '& span': {
                    marginRight: '5px',
                    fontSize: '12px !important'
                },
                '& svg': {
                    marginRight: '5px',
                    width: '16px !important'
                }
            }
        }
    }),
    reduxForm({
        form: 'ShopCreateForm',
        enableReinitialize: true
    }),
    withState('openClient', 'setOpenClient', false),
    withState('openAddition', 'setOpenAddition', false)
)
const ShopCreateDialog = enhance((props) => {
    const {
        open,
        loading,
        handleSubmit,
        onClose,
        classes,
        isUpdate,
        openClient,
        setOpenClient,
        mapDialog,
        updateMapDialog,
        mapLocation,
        openAddition,
        setOpenAddition
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit(openClient).catch(validate))
    const lat = _.get(mapLocation, 'lat')
    const lng = _.get(mapLocation, 'lng')

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
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.titleContent}>
                        <span>{isUpdate ? 'Изменение магазина' : 'Добавление магазина'}</span>
                        <IconButton onTouchTap={onClose}>
                            <CloseIcon color="#666666"/>
                        </IconButton>
                    </div>
                    <div className={classes.inContent}>
                        <div className={classes.leftSide}>
                            <div className={classes.divider}>
                                {!isUpdate ? (!openClient ? <Field
                                    name="client"
                                    component={ClientSearchField}
                                    className={classes.inputFieldCustom}
                                    label="Клиент"
                                    fullWidth={true}/>
                                    : <Field
                                        name="newClientName"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Наименование фирмы"
                                        fullWidth={true}/>)
                                    : <Field
                                        name="client"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Имя клиента"
                                        fullWidth={true}/>}
                                <div className={classes.add}>
                                    {!openClient && !isUpdate && <a onClick={() => {
                                        setOpenClient(true)
                                    }}>+ добавить клиента</a>}
                                    {openClient && !isUpdate && <a onClick={() => {
                                        setOpenClient(false)
                                    }}>+ выбрать клиента</a>}
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
                                    name="marketType"
                                    component={MarketTypeSearchField}
                                    className={classes.inputFieldCustom}
                                    label="Тип заведения"
                                    fullWidth={true}/>
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
                                <div className={classes.addPlace}>
                                    {!(lat && lng)
                                        ? <a onClick={mapDialog.handleOpenMapDialog}><Place color="#129fdd"/> отметить
                                            местоположение на карте</a>
                                        : <div className={classes.flex}>
                                            <div>
                                                <Place color="#999"/> <span>{lat}</span> <span>{lng}</span>
                                            </div>
                                            <a onClick={updateMapDialog.handleOpenMapUpdateDialog}>Изменить</a>
                                        </div>}
                                </div>
                            </div>
                            <div className={classes.flex} style={{alignItems: 'baseline'}}>
                                <div className={classes.inputHalfWrap}>Частота посещений:</div>
                                <div className={classes.inputHalfWrap}>
                                    <Field
                                        name="frequency"
                                        label="Выберите"
                                        component={VisitFrequencySearchField}
                                        className={classes.inputFieldCustom}
                                        hintText="Ежедневно"
                                        fullWidth={true}/>
                                </div>
                            </div>
                            <div className={classes.flex} style={{alignItems: 'baseline'}}>
                                <div className={classes.inputHalfWrap}>Статус объекта:</div>
                                <div className={classes.inputHalfWrap}>
                                    <Field
                                        name="status"
                                        label="Выберите"
                                        component={ShopStatusSearchField}
                                        className={classes.inputFieldCustom}
                                        hintText="Активен"
                                        fullWidth={true}/>
                                </div>
                            </div>
                        </div>
                        <div className={classes.rightSide}>
                            <Field
                                name="phone"
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label="Телефон"
                                fullWidth={true}/>
                            <Field
                                name="contactName"
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label="Контактное лицо"
                                fullWidth={true}/>
                            <div>
                                <div style={{textAlign: 'right'}}>
                                    <FlatButton
                                        label="дополнительно"
                                        className={classes.actionButton}
                                        primary={true}
                                        labelStyle={{textTransform: 'unset', color: '#129fdd'}}
                                        onClick={() => setOpenAddition(!openAddition)}/>
                                </div>
                                {openAddition && <div>
                                    <Field
                                        name="mfo"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="МФО"
                                        fullWidth={true}/>
                                    <Field
                                        name="inn"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="ИНН"
                                        fullWidth={true}/>
                                    <Field
                                        name="okad"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="ОКАД"
                                        fullWidth={true}/>
                                    <Field
                                        name="bankAddress"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Адрес банка"
                                        fullWidth={true}/>
                                    <Field
                                        name="checkingAccount"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Р/с"
                                        fullWidth={true}/>
                                </div>}
                            </div>

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
    loading: PropTypes.bool.isRequired,
    mapLocation: PropTypes.object,
    mapDialog: PropTypes.shape({
        openMapDialog: PropTypes.bool.isRequired,
        handleOpenMapDialog: PropTypes.func.isRequired,
        handleCloseMapDialog: PropTypes.func.isRequired,
        handleSubmitMapDialog: PropTypes.func.isRequired
    }).isRequired,
    updateMapDialog: PropTypes.shape({
        openUpdateMapDialog: PropTypes.bool.isRequired,
        handleOpenMapUpdateDialog: PropTypes.func.isRequired,
        handleCloseMapUpdateDialog: PropTypes.func.isRequired,
        handleSubmitMapUpdateDialog: PropTypes.func.isRequired
    }).isRequired
}
ShopCreateDialog.defaultProps = {
    isUpdate: false
}
export default ShopCreateDialog
