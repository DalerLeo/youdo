import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, FieldArray, reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import t from '../../../helpers/translate'
import formValidate from '../../../helpers/formValidate'
import {
    BORDER_STYLE,
    COLOR_WHITE,
    COLOR_DEFAULT,
    LINK_COLOR,
    BORDER_COLOR,
    COLOR_GREY
} from '../../../constants/styleConstants'
import {ZERO, HR_WORK_SCHEDULE} from '../../../constants/backendConstants'
import {connect} from 'react-redux'
import {TextField, DateField, CheckBox} from '../../ReduxForm'
import ToolTip from '../../ToolTip'
import MaritalStatusSearchField from '../../ReduxForm/HR/Resume/MaritalStatusSearchField'
import GenderSearchField from '../../ReduxForm/HR/GenderSearchField'
import ComputerLevelSearchField from '../../ReduxForm/HR/ComputerLevelSearchField'
import LanguageField from '../../ReduxForm/HR/LanguageField'
import PositionSearchField from '../../ReduxForm/HR/Position/PositionSearchField'
import ExperiencesField from '../../ReduxForm/HR/Resume/ExperiencesField'
import EducationsField from '../../ReduxForm/HR/Resume/EducationsField'
import DriverLicenceCheck from '../../ReduxForm/HR/Resume/DriverLicenceCheck'
import CountrySearchField from '../../ReduxForm/HR/CountrySearchField'
import CitySearchField from '../../ReduxForm/HR/CitySearchField'
import {
    Step,
    Stepper,
    StepButton,
    StepLabel
} from 'material-ui/Stepper'
import Person from 'material-ui/svg-icons/social/person'
import Experience from 'material-ui/svg-icons/places/business-center'
import Education from 'material-ui/svg-icons/social/school'
import Skills from 'material-ui/svg-icons/action/loyalty'
import Expectations from 'material-ui/svg-icons/action/trending-up'
import normalizeNumber from '../../ReduxForm/normalizers/normalizeNumber'

export const RESUME_CREATE_DIALOG_OPEN = 'openCreateDialog'
export const RESUME_UPDATE_DIALOG_OPEN = 'openUpdateDialog'

const enhance = compose(
    injectSheet({
        dialog: {
            overflowY: 'auto',
            paddingTop: '0 !important'
        },
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: COLOR_WHITE,
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        customLoader: {
            background: COLOR_WHITE,
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
            background: COLOR_WHITE,
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
            background: COLOR_WHITE,
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
        },
        container: {
            padding: '10px 30px 15px',
            borderTop: BORDER_STYLE,
            '&:first-child': {
                border: 'none'
            },
            '& h4': {
                fontSize: '13px',
                fontWeight: '600',
                padding: '10px 0'
            }
        },
        subTitle: {
            paddingBottom: '10px'
        },
        stepper: {
            borderBottom: BORDER_STYLE,
            '& button': {
                background: 'transparent !important'
            }
        },
        connector: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '72px',
            position: 'relative',
            width: '100%',
            '&:before': {
                position: 'absolute',
                left: 'calc(50% - 9px)',
                content: '""',
                borderLeft: '15px solid ' + COLOR_WHITE,
                borderTop: '36px solid transparent',
                borderBottom: '36px solid transparent',
                zIndex: '2'
            },
            '&:after': {
                position: 'absolute',
                content: '""',
                borderLeft: '15px solid ' + BORDER_COLOR,
                borderTop: '37px solid transparent',
                borderBottom: '37px solid transparent'
            }
        },
        readyFor: {
            borderTop: BORDER_STYLE,
            borderBottom: BORDER_STYLE,
            padding: '5px 0',
            margin: '15px 0'
        }
    }),
    reduxForm({
        form: 'ResumeCreateForm',
        enableReinitialize: true
    }),
    withState('openExpDialog', 'setOpenExpDialog', false),
    withState('stepIndex', 'setStepIndex', ZERO),
    connect((state) => {
        const country = _.get(state, ['form', 'ResumeCreateForm', 'values', 'country', 'value'])
        return {
            country
        }
    })
)

const ResumeCreateDialog = enhance((props) => {
    const {
        dispatch,
        open,
        handleSubmit,
        onClose,
        classes,
        isUpdate,
        stepIndex,
        setStepIndex,
        country
    } = props

    const EXPERIENCE = 1
    const EDUCATION = 2
    const SKILLS = 3
    const EXPECTATIONS = 4

    const formNames = [
        'fullName',
        'dateOfBirth',
        'familyStatus',
        'address',
        'phone',
        'email'
    ]
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch((error) => {
            formValidate(formNames, dispatch, error)
        }))
    const getIconColor = (index) => {
        return index === stepIndex ? LINK_COLOR : COLOR_GREY
    }
    const getIcon = (index, icon) => {
        switch (icon) {
            case 'person': return <Person color={getIconColor(index)}/>
            case 'experience': return <Experience color={getIconColor(index)}/>
            case 'education': return <Education color={getIconColor(index)}/>
            case 'skills': return <Skills color={getIconColor(index)}/>
            case 'expectations': return <Expectations color={getIconColor(index)}/>
            default: return null
        }
    }

    const stepButtons = [
        {label: t('Личные данные'), icon: 'person'},
        {label: t('Опыт работы'), icon: 'experience'},
        {label: t('Образование'), icon: 'education'},
        {label: t('Навыки и умения'), icon: 'skills'},
        {label: t('Профессиональные ожидания'), icon: 'expectations'}
    ]

    const getStepperContent = () => {
        switch (stepIndex) {
            case ZERO: return (
                <div className={classes.container}>
                    <h4>{t('Личные данные')}</h4>
                    <Field
                        name="fullName"
                        label={t('Ф.И.О')}
                        component={TextField}
                        className={classes.inputFieldCustom}
                        fullWidth={true}/>
                    <Field
                        name="dateOfBirth"
                        label={t('Дата рождения')}
                        component={DateField}
                        className={classes.inputDateCustom}
                        errorStyle={{bottom: 2}}
                        fullWidth={true}/>
                    <Field
                        name="sex"
                        label={t('Пол')}
                        component={GenderSearchField}
                        className={classes.inputFieldCustom}
                        removeNoMatter={true}
                        fullWidth={true}/>
                    <Field
                        name="familyStatus"
                        label={t('Семейное положение')}
                        component={MaritalStatusSearchField}
                        className={classes.inputFieldCustom}
                        fullWidth={true}/>
                    <Field
                        name="address"
                        label={t('Адрес проживания')}
                        component={TextField}
                        className={classes.inputFieldCustom}
                        fullWidth={true}/>
                    <Field
                        name="phone"
                        label={t('Телефонный номер')}
                        component={TextField}
                        className={classes.inputFieldCustom}
                        fullWidth={true}/>
                    <Field
                        name="email"
                        label={t('Email адрес')}
                        component={TextField}
                        className={classes.inputFieldCustom}
                        fullWidth={true}/>
                    <Field
                        name="country"
                        label={t('Страна проживания')}
                        component={CountrySearchField}
                        className={classes.inputFieldCustom}
                        fullWidth={true}/>
                    {country &&
                    <Field
                        name="city"
                        label={t('Город')}
                        component={CitySearchField}
                        params={{country: country}}
                        className={classes.inputFieldCustom}
                        fullWidth={true}/>}
                    <Field
                        name="position"
                        label={t('Желаемая должность')}
                        component={PositionSearchField}
                        className={classes.inputFieldCustom}
                        fullWidth={true}/>
                </div>
            )
            case EXPERIENCE: return (
                <div className={classes.container}>
                    <FieldArray
                        name="experiences"
                        component={ExperiencesField}
                    />
                </div>
            )
            case EDUCATION: return (
                <div className={classes.container}>
                    <FieldArray
                        name="educations"
                        component={EducationsField}
                    />
                </div>
            )
            case SKILLS: return (
                <div className={classes.container}>
                    <h4>{t('Навыки и умения')}</h4>
                    <Field
                        name="driverLicense"
                        component={DriverLicenceCheck}/>
                    <FieldArray
                        name="languagesLevel"
                        component={LanguageField}/>
                    <Field
                        name="levelPc"
                        component={ComputerLevelSearchField}
                        className={classes.inputFieldCustom}
                        label={t('Уровень владения ПК')}
                        fullWidth={true}/>
                    <Field
                        name="hobby"
                        component={TextField}
                        className={classes.textFieldArea}
                        label={t('Интересы и хобби')}
                        fullWidth={true}
                        multiLine={true}
                        rows={1}
                        rowsMax={4}/>
                </div>
            )
            case EXPECTATIONS: return (
                <div className={classes.container}>
                    <h4>{t('Профессиональные ожидания')}</h4>
                    <div>
                        <div className={classes.subTitle}>{t('График работы')}</div>
                        <div className={classes.flex + ' ' + classes.halfChild}>
                            {_.map(HR_WORK_SCHEDULE, (item, index) => {
                                return (
                                    <Field
                                        key={item.id}
                                        name={'modes[' + index + '][selected]'}
                                        label={item.name}
                                        component={CheckBox}/>
                                )
                            })}
                        </div>
                    </div>
                    <div className={classes.readyFor}>
                        <div className={classes.flex + ' ' + classes.halfChild}>
                            <Field
                                name="relocation"
                                label={t('Готовность к переезду')}
                                component={CheckBox}/>
                            <Field
                                name="businessTrip"
                                label={t('Готовность к командировкам')}
                                component={CheckBox}/>
                        </div>
                    </div>
                    <div>
                        <div className={classes.subTitle}>{t('Желаемая заработная плата')}</div>
                        <div className={classes.flexBetween + ' ' + classes.halfChild}>
                            <div>
                                <Field
                                    name="salary[min]"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    normalize={normalizeNumber}
                                    label={t('Мин') + '.'}
                                    fullWidth={true}/>
                            </div>
                            <div>
                                <Field
                                    name="salary[max]"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    normalize={normalizeNumber}
                                    label={t('Макс') + '.'}
                                    fullWidth={true}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
            default: return null
        }
    }

    const stepLabelStyle = {
        fontSize: '13px',
        padding: '0 30px'
    }

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{width: '600px', maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{isUpdate ? t('Изменение анкеты') : t('Создание анкеты')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.stepper}>
                    <Stepper
                        linear={false}
                        activeStep={stepIndex}
                        connector={<div className={classes.connector}/>}>
                        {_.map(stepButtons, (item, index) => {
                            return (
                                <Step key={index}>
                                    <ToolTip text={item.label} position={'bottom'}>
                                        <StepButton
                                            icon={getIcon(index, item.icon)}
                                            iconContainerStyle={{padding: 0}}
                                            disableTouchRipple={true}
                                            onClick={() => setStepIndex(index)}>
                                            <StepLabel style={stepLabelStyle}/>
                                        </StepButton>
                                    </ToolTip>
                                </Step>
                            )
                        })}
                    </Stepper>
                </div>
                <form onSubmit={onSubmit} className={classes.form}>
                    {getStepperContent()}
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
