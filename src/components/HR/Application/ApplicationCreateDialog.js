import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import {Field, FieldArray, reduxForm, change} from 'redux-form'
import {TextField, CheckBox, DateField} from '../../ReduxForm'
import WorkScheduleSearchField from '../../ReduxForm/HR/Application/WorkScheduleSearchField'
import SexSearchField from '../../ReduxForm/HR/Application/SexSearchField'
import EducationSearchField from '../../ReduxForm/HR/Application/EducationSearchField'
import ComputerLevelSearchField from '../../ReduxForm/HR/Application/ComputerLevelSearchField'
import LanguageField from '../../ReduxForm/HR/Application/LanguageField'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import AddPerson from 'material-ui/svg-icons/social/person-add'
import PersonIcon from 'material-ui/svg-icons/social/person'
import IconButton from 'material-ui/IconButton'
import t from '../../../helpers/translate'
import formValidate from '../../../helpers/formValidate'
import normalizeNumber from '../../ReduxForm/normalizers/normalizeNumber'
import {BORDER_STYLE, COLOR_DEFAULT} from '../../../constants/styleConstants'
import {connect} from 'react-redux'
import Chip from 'material-ui/Chip'
import Popover from 'material-ui/Popover/Popover'

export const APPLICATION_CREATE_DIALOG_OPEN = 'openCreateDialog'
export const APPLICATION_UPDATE_DIALOG_OPEN = 'openUpdateDialog'

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
        usersLoader: {
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 0'
        },
        recruiter: {
            padding: '15px 30px',
            fontWeight: '600',
            borderBottom: BORDER_STYLE,
            '& div': {
                display: 'flex',
                alignItems: 'center'
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
            color: COLOR_DEFAULT,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: BORDER_STYLE,
            padding: '0 10px',
            height: '60px',
            zIndex: '999'
        },
        addRecruiter: {
            fontWeight: 'normal',
            textTransform: 'none'
        },
        usersWrapper: {
            minWidth: '200px',
            maxHeight: 'calc(50vh + 100px)'
        },
        user: {
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '12px 30px 12px 15px',
            transition: 'all 300ms ease',
            '&:hover': {
                background: '#f2f5f8'
            }
        },
        avatar: {
            background: '#ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            marginRight: '10px',
            '& svg': {
                color: '#fff !important',
                width: '18px !important',
                height: '18px !important'
            },
            '& img': {
                width: '100%'
            }
        },
        inContent: {
            display: 'flex',
            borderTop: BORDER_STYLE,
            '&:first-child': {
                border: 'none'
            }
        },
        sidePaddings: {
            padding: '10px 30px 15px'
        },
        leftSide: {
            width: '50%',
            extend: 'sidePaddings',
            borderRight: BORDER_STYLE
        },
        rightSide: {
            width: '50%',
            extend: 'sidePaddings'
        },
        block: {
            '& h4': {
                fontWeight: '600',
                fontSize: '13px',
                padding: '10px 0'
            }
        },
        salaryField: {
            display: 'flex',
            alignItems: 'baseline',
            '& > div': {
                marginLeft: '10px',
                width: '100px !important'
            }
        },
        skills: {
            display: 'flex'
        },
        chip: {
            background: '#efefef !important',
            margin: '0 5px 5px 0 !important',
            '& svg': {
                width: '20px !important'
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
        flex: {
            display: 'flex'
        },
        alignBaseline: {
            alignItems: 'baseline'
        },
        flexBetween: {
            extend: 'flex',
            justifyContent: 'space-between'
        },
        halfChild: {
            '& > div': {
                width: '49% !important'
            }
        },
        thirdChild: {
            '& > div': {
                width: '32% !important'
            }
        }
    }),
    reduxForm({
        form: 'ApplicationCreateForm',
        enableReinitialize: true
    }),
    withState('anchorEl', 'setAnchorEl', null),
    withState('chosenRecruiter', 'chooseRecruiter', false),
    connect((state) => {
        const skills = _.map(_.split(_.get(state, ['form', 'ApplicationCreateForm', 'values', 'skills']), ', '), _.trim)
        return {
            skills
        }
    })
)

const ApplicationCreateDialog = enhance((props) => {
    const {
        dispatch,
        open,
        handleSubmit,
        onClose,
        classes,
        isUpdate,
        skills,
        openRecruiterList,
        setOpenRecruiterList,
        anchorEl,
        setAnchorEl,
        usersData,
        chosenRecruiter,
        chooseRecruiter
    } = props
    const formNames = ['name', 'address']
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch((error) => {
            formValidate(formNames, dispatch, error)
        }))
    const chosenRecruiterName = _.get(chosenRecruiter, 'firstName') + ' ' + _.get(chosenRecruiter, 'secondName')
    const chosenRecruiterPhoto = _.get(chosenRecruiter, ['photo', 'file'])

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{width: '950px', maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <div className={classes.addRecruiter}>
                    <ToolTip text={chosenRecruiter ? t('Изменить рекрутера') : t('Назначить рекрутера')} position={'right'}>
                        <IconButton
                            onTouchTap={(event) => {
                                setAnchorEl(event.currentTarget)
                                setOpenRecruiterList(true)
                            }}>
                            <AddPerson color="#666666"/>
                        </IconButton>
                    </ToolTip>
                </div>
                <span>{isUpdate ? t('Изменение заявки') : t('Заявка на подбор персонала')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <Popover
                open={openRecruiterList}
                anchorEl={anchorEl}
                anchorOrigin={{'horizontal': 'right', 'vertical': 'bottom'}}
                targetOrigin={{'horizontal': 'left', 'vertical': 'top'}}
                onRequestClose={() => { setOpenRecruiterList(false) }}
                zDepth={2}>
                <div className={classes.usersWrapper}>
                    {usersData.loading
                        ? <div className={classes.usersLoader}>
                            <Loader size={0.6}/>
                        </div>
                        : _.map(usersData.list, (item) => {
                            const firstName = _.get(item, 'firstName')
                            const secondName = _.get(item, 'secondName')
                            const name = firstName + ' ' + secondName
                            const file = _.get(item, ['photo', 'file'])
                            const job = _.get(item, ['job', 'name'])
                            const photo = _.get(item, 'photo') ? <img src={file} alt=""/> : <PersonIcon/>
                            const id = _.get(item, 'id')
                            return (
                                <div
                                    key={id}
                                    className={classes.user}
                                    onClick={() => {
                                        chooseRecruiter(item)
                                        dispatch(change('ApplicationCreateForm', 'recruiter', id))
                                        setOpenRecruiterList(false)
                                    }}><div className={classes.avatar}>{photo}</div>{name} ({job}) 3 / 2</div>
                            )
                        })}
                </div>
            </Popover>
            <div className={classes.bodyContent}>
                {chosenRecruiter &&
                <div className={classes.recruiter}>
                    <div>{t('Рекрутер')}: <div>
                        <div style={{margin: '0 5px'}} className={classes.avatar}>{chosenRecruiterPhoto
                            ? <img src={chosenRecruiterPhoto} alt=""/>
                            : <PersonIcon/>}
                        </div>
                        <b>{chosenRecruiterName}</b>
                    </div></div>
                </div>}
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent}>
                        <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        <div className={classes.leftSide}>
                            <div className={classes.block}>
                                <h4>1. {t('Описание компании')}</h4>
                                <Field
                                    name="companyName"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    label={t('Наименование компании')}
                                    fullWidth={true}/>
                                <Field
                                    name="companyDescription"
                                    component={TextField}
                                    className={classes.textFieldArea}
                                    label={t('Описание деятельности компании')}
                                    fullWidth={true}
                                    multiLine={true}
                                    rows={1}
                                    rowsMax={4}/>
                                <Field
                                    name="responsibleFullName"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    label={t('Ф.И.О. ответственного за подбор персонала')}
                                    fullWidth={true}/>
                                <Field
                                    name="responsiblePosition"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    label={t('Должность ответственного за подбор персонала')}
                                    fullWidth={true}/>
                                <Field
                                    name="phone"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    label={t('Контактный телефон')}
                                    fullWidth={true}/>
                                <Field
                                    name="address"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    label={t('Адрес')}
                                    fullWidth={true}/>
                                <Field
                                    name="email"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    label={t('E-mail')}
                                    fullWidth={true}/>
                            </div>
                        </div>
                        <div className={classes.rightSide}>
                            <div className={classes.block}>
                                <h4>2. {t('Описание вакантной должности')}</h4>
                                <Field
                                    name="positionName"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    label={t('Наименование вакантной должности')}
                                    fullWidth={true}/>
                                <div className={classes.flexBetween + ' ' + classes.alignBaseline}>
                                    <span>{t('З/п на испытательный срок')}:</span>
                                    <div className={classes.salaryField}>
                                        <Field
                                            name="trialSalary[min]"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            normalize={normalizeNumber}
                                            label={t('Мин') + '.'}/>
                                        <Field
                                            name="trialSalary[max]"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            normalize={normalizeNumber}
                                            label={t('Макс') + '.'}/>
                                    </div>
                                </div>
                                <div className={classes.flexBetween + ' ' + classes.alignBaseline}>
                                    <span>{t('З/п после испытательного срока')}:</span>
                                    <div className={classes.salaryField}>
                                        <Field
                                            name="realSalary[min]"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            normalize={normalizeNumber}
                                            label={t('Мин') + '.'}/>
                                        <Field
                                            name="realSalary[max]"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            normalize={normalizeNumber}
                                            label={t('Макс') + '.'}/>
                                    </div>
                                </div>
                                <Field
                                    name="schedule"
                                    component={WorkScheduleSearchField}
                                    className={classes.inputFieldCustom}
                                    label={t('График работы')}/>
                                <Field
                                    name="responsibilities"
                                    component={TextField}
                                    className={classes.textFieldArea}
                                    label={t('Функциональные обязанности')}
                                    fullWidth={true}
                                    multiLine={true}
                                    rows={1}
                                    rowsMax={4}/>
                                <Field
                                    name="plannedEmploymentDate"
                                    component={DateField}
                                    className={classes.inputDateCustom}
                                    floatingLabelText={t('Дата планируемого приема на работу')}
                                    errorStyle={{bottom: 2}}
                                    container="inline"
                                    fullWidth={true}/>
                                <Field
                                    name="businessTrip"
                                    component={CheckBox}
                                    className={classes.inputFieldCustom}
                                    label={t('Предусматриваются ли командировки')}/>
                            </div>
                        </div>
                    </div>
                    <div className={classes.inContent}>
                        <div style={{width: '100%', padding: '10px 30px 15px'}}>
                            <div className={classes.block}>
                                <h4>3. {t('Требования к кандидату')}</h4>
                                <div className={classes.flexBetween + ' ' + classes.halfChild}>
                                    <div className={classes.flex + ' ' + classes.alignBaseline}>
                                        <span>{t('Возраст')}:</span>
                                        <div className={classes.salaryField}>
                                            <Field
                                                name="age[min]"
                                                component={TextField}
                                                className={classes.inputFieldCustom}
                                                inputStyle={{textAlign: 'center'}}
                                                normalize={normalizeNumber}/>
                                            <span>-</span>
                                            <Field
                                                name="age[max]"
                                                component={TextField}
                                                className={classes.inputFieldCustom}
                                                inputStyle={{textAlign: 'center'}}
                                                normalize={normalizeNumber}/>
                                        </div>
                                    </div>
                                    <Field
                                        name="sex"
                                        component={SexSearchField}
                                        className={classes.inputFieldCustom}
                                        label={t('Пол')}
                                        fullWidth={true}/>
                                </div>
                                <div className={classes.flexBetween + ' ' + classes.thirdChild}>
                                    <Field
                                        name="education"
                                        component={EducationSearchField}
                                        className={classes.inputFieldCustom}
                                        label={t('Образование')}
                                        fullWidth={true}/>
                                    <Field
                                        name="computerLevel"
                                        component={ComputerLevelSearchField}
                                        className={classes.inputFieldCustom}
                                        label={t('Уровень владения ПК')}
                                        fullWidth={true}/>
                                    <Field
                                        name="experience"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label={t('Минимальный опыт работы')}
                                        normalize={normalizeNumber}
                                        fullWidth={true}/>
                                </div>
                                <FieldArray name={'languages'} component={LanguageField}/>
                                <Field
                                    name="skills"
                                    component={TextField}
                                    label={t('Необходимые профессиональные навыки')}
                                    hintText={t('Перечислите через запятую')}
                                    fullWidth={true}
                                    hintStyle={{bottom: 16}}
                                    className={classes.textFieldArea}
                                    multiLine={true}
                                    rows={1}
                                    rowsMax={4}/>
                                <div className={classes.skills}>
                                    {_.map(_.filter(skills, item => item), (item, index) => {
                                        const skill = _.trim(item, ',')
                                        return (
                                            <Chip key={index} className={classes.chip}>
                                                {skill}
                                            </Chip>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
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

ApplicationCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

ApplicationCreateDialog.defaultProps = {
    isUpdate: false
}

export default ApplicationCreateDialog
