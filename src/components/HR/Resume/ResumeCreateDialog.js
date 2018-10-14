import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {FieldArray, reduxForm} from 'redux-form'
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
  COLOR_GREY,
  COLOR_GREY_LIGHTEN
} from '../../../constants/styleConstants'
import {ZERO} from '../../../constants/backendConstants'
import ToolTip from '../../Utils/ToolTip'
import ExperiencesField from '../../ReduxForm/Resume/ExperiencesField'
import ExperienceForm from '../../ReduxForm/Resume/ExperienceForm'
import EducationForm from '../../ReduxForm/Resume/EducationForm'
import EducationsField from '../../ReduxForm/Resume/EducationsField'
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
import ResumeCreatePersonal from './ResumeCreatePersonal'
import ResumeCreateSkills from './ResumeCreateSkills'
import ResumeCreateExpectations from './ResumeCreateExpectations'

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
      margin: '20px -30px -20px',
      '& span': {
        fontSize: '13px !important',
        fontWeight: '600 !important',
        color: '#129fdd',
        verticalAlign: 'inherit !important'
      }
    },
    disabledButton: {
      extend: 'bottomButton',
      '& span': {
        color: COLOR_GREY_LIGHTEN
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

  withState('personalError', 'updatePersonalError', false),
  withState('experienceError', 'updateExperienceError', false),
  withState('educationError', 'updateEducationError', false),
  withState('skillsError', 'updateSkillsError', false)
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
    initialValues,

    // ERRORS
    personalError,
    updatePersonalError,
    experienceError,
    updateExperienceError,
    educationError,
    updateEducationError,
    skillsError,
    updateSkillsError
  } = props

  const ONE = 1
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
  const getIconColor = (index, error) => {
    return index === stepIndex
      ? LINK_COLOR
      : error
        ? COLOR_GREY
        : COLOR_GREY
  }
  const getIcon = (index, icon) => {
    switch (icon) {
      case 'person': return <Person color={getIconColor(index, personalError)}/>
      case 'experience': return <Experience color={getIconColor(index, experienceError)}/>
      case 'education': return <Education color={getIconColor(index, educationError)}/>
      case 'skills': return <Skills color={getIconColor(index, skillsError)}/>
      case 'expectations': return <Expectations color={getIconColor(index, false)}/>
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

  const invalidForm = _.includes([personalError, experienceError, educationError, skillsError], true)
  const nextButton = (error, isSave) => {
    return (
      <div className={error ? classes.disabledButton : classes.bottomButton}>
        {isSave
          ? <FlatButton
            label={t('Сохранить')}
            disabled={error}
            className={classes.actionButton}
            type={'submit'}
          />
          : <FlatButton
            label={t('Далее')}
            disabled={error}
            className={classes.actionButton}
            onClick={() => { setStepIndex(stepIndex + ONE) }}
          />}
      </div>
    )
  }

  /* Const getStepperContent = () => {
        switch (stepIndex) {
            case ZERO: return (
                <div className={classes.container}>
                    <ResumeCreatePersonal
                        classes={classes}
                        initialValues={initialValues}
                        updatePersonalError={updatePersonalError}
                        nextButton={nextButton(personalError)}/>
                </div>
            )
            case EXPERIENCE: return (
                <div className={classes.container}>
                    <ExperienceForm initialValues={{experiences: _.get(initialValues, ['experiences'])}}>
                    <FieldArray
                        name="experiences"
                        component={ExperiencesField}
                        updateExperienceError={updateExperienceError}
                        nextButton={nextButton(experienceError)}/>
                    </ExperienceForm>
                </div>
            )
            case EDUCATION: return (
                <div className={classes.container}>
                    <EducationForm initialValues={{educations: _.get(initialValues, 'educations')}}>
                        <FieldArray
                            name="educations"
                            component={EducationsField}
                            updateEducationError={updateEducationError}
                            nextButton={nextButton(educationError)}/>
                    </EducationForm>
                </div>
            )
            case SKILLS: return (
                <div className={classes.container}>
                    <ResumeCreateSkills
                        classes={classes}
                        initialValues={initialValues}
                        skillsError={skillsError}
                        updateSkillsError={updateSkillsError}
                        nextButton={nextButton(skillsError)}/>
                </div>
            )
            case EXPECTATIONS: return (
                <div className={classes.container}>
                    <ResumeCreateExpectations
                        classes={classes}
                        initialValues={initialValues}
                        nextButton={nextButton(invalidForm, true)}/>
                </div>
            )
            default: return null
        }
    } */

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
        <IconButton onClick={onClose}>
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
          <div style={{display: stepIndex === ZERO ? 'block' : 'none'}} className={classes.container}>
            <ResumeCreatePersonal
              classes={classes}
              initialValues={initialValues}
              updatePersonalError={updatePersonalError}
              nextButton={nextButton(personalError)}/>
          </div>
          <div style={{display: stepIndex === EXPERIENCE ? 'block' : 'none'}} className={classes.container}>
            <ExperienceForm initialValues={{experiences: _.get(initialValues, ['experiences'])}}>
              <FieldArray
                name="experiences"
                component={ExperiencesField}
                updateExperienceError={updateExperienceError}
                nextButton={nextButton(experienceError)}/>
            </ExperienceForm>
          </div>
          <div style={{display: stepIndex === EDUCATION ? 'block' : 'none'}} className={classes.container}>
            <EducationForm initialValues={{educations: _.get(initialValues, 'educations')}}>
              <FieldArray
                name="educations"
                component={EducationsField}
                updateEducationError={updateEducationError}
                nextButton={nextButton(educationError)}/>
            </EducationForm>
          </div>
          <div style={{display: stepIndex === SKILLS ? 'block' : 'none'}} className={classes.container}>
            <ResumeCreateSkills
              classes={classes}
              initialValues={initialValues}
              skillsError={skillsError}
              updateSkillsError={updateSkillsError}
              nextButton={nextButton(skillsError)}/>
          </div>
          <div style={{display: stepIndex === EXPECTATIONS ? 'block' : 'none'}} className={classes.container}>
            <ResumeCreateExpectations
              classes={classes}
              initialValues={initialValues}
              nextButton={nextButton(invalidForm, true)}/>
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
