import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import ToolTip from '../../Utils/ToolTip'
import {Field, FieldArray, reduxForm, change} from 'redux-form'
import {TextField, CheckBox, DateField, ClientContactsField} from '../../ReduxForm'
import WorkScheduleSearchField from '../../ReduxForm/HR/WorkScheduleSearchField'
import SexSearchField from '../../ReduxForm/GenderSearchField'
import EducationSearchField from '../../ReduxForm/HR/EducationSearchField'
import ComputerLevelSearchField from '../../ReduxForm/HR/ComputerLevelSearchField'
import SkillsTagSearchField from '../../ReduxForm/HR/SkillsTagSearchField'
import LanguageField from '../../ReduxForm/HR/LanguageField'
import ClientSearchField from '../../ReduxForm/HR/Application/ClientSearchField'
import RequirementsField from '../../ReduxForm/HR/Application/RequirementsField'
import SphereSearchField from '../../ReduxForm/HR/Sphere/SphereSearchField'
import PositionSearchField from '../../ReduxForm/HR/Sphere/PositionSearchField'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import AddPerson from 'material-ui/svg-icons/social/person-add'
import PersonIcon from 'material-ui/svg-icons/social/person'
import IconButton from 'material-ui/IconButton'
import t from '../../../helpers/translate'
import * as ROUTES from '../../../constants/routes'
import formValidate from '../../../helpers/formValidate'
import normalizeNumber from '../../ReduxForm/normalizers/normalizeNumber'
import {
  BORDER_STYLE,
  COLOR_DEFAULT
} from '../../../constants/styleConstants'
import {connect} from 'react-redux'
import {Link} from 'react-router'
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
    customLoader: {
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0'
    },
    recruiter: {
      padding: '15px 30px',
      fontWeight: '600',
      '& > div:first-child': {
        display: 'flex',
        alignItems: 'center',
        '& div': {
          display: 'flex',
          alignItems: 'center'
        }
      }
    },
    deadline: {
      marginTop: '10px'
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
    sidePaddings: {
      padding: '10px 30px 15px'
    },
    inContent: {
      borderTop: BORDER_STYLE,
      extend: 'sidePaddings',
      '&:first-child': {
        border: 'none'
      }
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
    privileges: {
      marginTop: '10px',
      '& > div:first-child': {
        fontWeight: '600',
        marginBottom: '5px'
      }
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
    required: {
      display: 'flex',
      alignItems: 'center'
    },
    customCheckbox: {
      margin: '0 10px 0 15px',
      '& div': {
        margin: '0 !important'
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
    const recruiter = _.get(state, ['form', 'ApplicationCreateForm', 'values', 'recruiter']) || false
    const sphere = _.get(state, ['form', 'ApplicationCreateForm', 'values', 'sphere', 'value'])
    return {
      recruiter,
      sphere
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
    openRecruiterList,
    setOpenRecruiterList,
    anchorEl,
    setAnchorEl,
    usersData,
    privilegeData,
    recruiter,
    chooseRecruiter,
    sphere
  } = props
  const formNames = []
  const onSubmit = handleSubmit(() => props.onSubmit()
    .catch((error) => {
      formValidate(formNames, dispatch, error)
    }))
  const chosenRecruiterName = _.get(recruiter, 'firstName') + ' ' + _.get(recruiter, 'secondName')
  const chosenRecruiterPhoto = _.get(recruiter, ['photo', 'file'])

  const requiredCheckbox = (field, name) => {
    return (
      <div className={classes.required}>
        {field}
        <ToolTip position={'left'} text={t('Обязательное требование')}>
          <div className={classes.customCheckbox}>
            <Field
              name={'required[' + name + ']'}
              component={CheckBox}/>
          </div>
        </ToolTip>
      </div>
    )
  }

  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialog}
      contentStyle={{width: '500px', maxWidth: 'none'}}
      bodyClassName={classes.popUp}>

      <div className={classes.titleContent}>
        <div className={classes.addRecruiter}>
          <ToolTip text={recruiter ? t('Изменить рекрутера') : t('Назначить рекрутера')} position={'right'}>
            <IconButton
              onClick={(event) => {
                setAnchorEl(event.currentTarget)
                setOpenRecruiterList(true)
              }}>
              <AddPerson color="#666666"/>
            </IconButton>
          </ToolTip>
        </div>
        <span>{isUpdate ? t('Изменение заявки') : t('Заявка на подбор персонала')}</span>
        <IconButton onClick={onClose}>
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
            ? <div className={classes.customLoader}>
              <Loader size={0.6}/>
            </div>
            : _.map(usersData.list, (item) => {
              const firstName = _.get(item, 'firstName')
              const secondName = _.get(item, 'secondName')
              const appCount = _.get(item, 'applicationCount')
              const appCountDoing = _.get(item, 'applicationDoingCount')
              const name = firstName + ' ' + secondName
              const file = _.get(item, ['photo', 'file'])
              const photo = _.get(item, 'photo') ? <img src={file} alt=""/> : <PersonIcon/>
              const id = _.get(item, 'id')
              return (
                <div
                  key={id}
                  className={classes.user}
                  onClick={() => {
                    chooseRecruiter(item)
                    dispatch(change('ApplicationCreateForm', 'recruiter', item))
                    setOpenRecruiterList(false)
                  }}><div className={classes.avatar}>{photo}</div>{name} &nbsp;&nbsp; {appCountDoing + ' / ' + appCount}</div>
              )
            })}
        </div>
      </Popover>
      <div className={classes.bodyContent}>
        <form onSubmit={onSubmit} className={classes.form}>
          {recruiter &&
                    <div className={classes.recruiter}>
                      <div>{t('Рекрутер')}: <div>
                        <div style={{margin: '0 5px'}} className={classes.avatar}>{chosenRecruiterPhoto
                          ? <img src={chosenRecruiterPhoto} alt=""/>
                          : <PersonIcon/>}
                        </div>
                        <b>{chosenRecruiterName}</b>
                      </div></div>
                      <div className={classes.deadline}>
                        <Field
                          name="deadline"
                          component={DateField}
                          className={classes.inputDateCustom}
                          floatingLabelText={t('Дэдлайн')}
                          errorStyle={{bottom: 2}}
                          fullWidth={true}/>
                      </div>
                    </div>}
          <div className={classes.inContent}>
            <div className={classes.loader}>
              <Loader size={0.75}/>
            </div>
            <div className={classes.block}>
              <h4>1. {t('Клиент')}</h4>
              <div className={classes.flex + ' ' + classes.alignCenter}>
                <Field
                  name="client"
                  component={ClientSearchField}
                  className={classes.inputFieldCustom}
                  label={t('Наименование')}
                  fullWidth={true}/>
                <Link style={{marginLeft: '5px', whiteSpace: 'nowrap'}} target={'_blank'} to={{
                  pathname: ROUTES.CLIENT_LIST_URL,
                  query: {openCreateDialog: true}
                }}>{t('добавить клиента')}</Link>
              </div>
              <Field
                name="contact"
                extraText={t('Контактное лицо')}
                component={ClientContactsField}/>
            </div>
          </div>
          <div className={classes.inContent}>
            <div className={classes.block}>
              <h4>2. {t('Гарантия на сотрудника')}</h4>
              <Field
                name="guaranteedDate"
                component={DateField}
                className={classes.inputDateCustom}
                label={t('Укажите дату гарантии')}
                fullWidth={true}/>
            </div>
          </div>
          <div className={classes.inContent}>
            <div className={classes.block}>
              <h4>3. {t('Описание вакантной должности')}</h4>
              <Field
                name="sphere"
                component={SphereSearchField}
                className={classes.inputFieldCustom}
                label={t('Сфера')}
                params={{only_parent: true, ordering: 'name'}}
                fullWidth={true}/>
              {sphere &&
                            <Field
                              name="position"
                              component={PositionSearchField}
                              className={classes.inputFieldCustom}
                              label={t('Должность')}
                              params={{child: sphere, ordering: 'name'}}
                              fullWidth={true}/>}
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
              <div className={classes.privileges}>
                <div>{t('Предоставляемые льготы')}</div>
                {privilegeData.loading && <Loader size={0.6}/>}
                <div className={classes.flex + ' ' + classes.halfChild}>
                  {_.map(privilegeData.list, (item, index) => {
                    const id = _.get(item, 'id')
                    const label = _.get(item, 'name')
                    return (
                      <Field
                        key={id}
                        name={'privileges[' + index + '][selected]'}
                        label={label}
                        component={CheckBox}
                      />
                    )
                  })}
                </div>
              </div>
              <Field
                name="schedule"
                component={WorkScheduleSearchField}
                className={classes.inputFieldCustom}
                label={t('График работы')}/>
              <Field
                name="responsibility"
                component={TextField}
                className={classes.textFieldArea}
                label={t('Функциональные обязанности')}
                fullWidth={true}
                multiLine={true}
                rows={1}/>
              <Field
                name="planningDate"
                component={DateField}
                className={classes.inputDateCustom}
                floatingLabelText={t('Дата планируемого приема на работу')}
                errorStyle={{bottom: 2}}
                container="inline"
                fullWidth={true}/>
              <Field
                name="businessTrip"
                component={CheckBox}
                label={t('Предусматриваются ли командировки')}/>
            </div>
          </div>
          <div className={classes.inContent}>
            <div className={classes.block}>
              <h4>4. {t('Требования к кандидату')}</h4>
              <div className={classes.flex + ' ' + classes.alignBaseline}>
                <span>{t('Возраст')}:</span>
                {requiredCheckbox(
                  (<div className={classes.salaryField}>
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
                  </div>), 'age')}
              </div>
              {requiredCheckbox((
                <Field
                  name="sex"
                  component={SexSearchField}
                  className={classes.inputFieldCustom}
                  label={t('Пол')}
                  fullWidth={true}/>
              ), 'sex')}
              {requiredCheckbox((
                <Field
                  name="education"
                  component={EducationSearchField}
                  className={classes.inputFieldCustom}
                  label={t('Образование')}
                  fullWidth={true}/>
              ), 'education')}
              {requiredCheckbox((
                <Field
                  name="levelPc"
                  component={ComputerLevelSearchField}
                  className={classes.inputFieldCustom}
                  label={t('Уровень владения ПК')}
                  fullWidth={true}/>
              ), 'level_pc')}
              {requiredCheckbox((
                <Field
                  name="experience"
                  component={TextField}
                  className={classes.inputFieldCustom}
                  label={t('Минимальный опыт работы')}
                  normalize={normalizeNumber}
                  fullWidth={true}/>
              ), 'experience')}
              <FieldArray name={'languages'} component={LanguageField} required/>
              <Field
                name="skills"
                component={SkillsTagSearchField}
                label={t('Необходимые профессиональные навыки')}
                fullWidth={true}/>
              <FieldArray name={'requirements'} component={RequirementsField}/>
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
