import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import LinearProgress from '../../LinearProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import ApplicationDetailProgress from './ApplicationDetailProgress'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import Delete from 'material-ui/svg-icons/action/delete'
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert'
import Info from 'material-ui/svg-icons/action/info-outline'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import {getBackendNames, getYearText} from '../../../helpers/hrcHelpers'
import t from '../../../helpers/translate'
import {
  PADDING_STANDART,
  BORDER_STYLE,
  COLOR_GREY_LIGHTEN,
  COLOR_GREY,
  LINK_COLOR, COLOR_WHITE, BORDER_COLOR
} from '../../../constants/styleConstants'
import {
  SUM_CURRENCY,
  HR_WORK_SCHEDULE,
  HR_EDUCATION,
  HR_GENDER,
  HR_LEVEL_PC, HR_LANG_LEVELS
} from '../../../constants/backendConstants'
import {genderFormat} from '../../../constants/gender'

const enhance = compose(
  injectSheet({
    loader: {
      width: '100%',
      background: '#fff',
      height: '100px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    wrapper: {
      color: '#333 !important',
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      '& a': {
        color: LINK_COLOR
      }
    },
    title: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '65px',
      padding: '0 30px',
      borderBottom: '1px #efefef solid',
      position: 'relative'
    },
    createdDate: {
      fontSize: '12px',
      color: '#999'
    },
    tab: {
      height: '100%',
      width: '100%'
    },
    container: {
      display: 'flex',
      position: 'relative',
      width: '100%'
    },
    block: {
      borderLeft: BORDER_STYLE,
      padding: PADDING_STANDART,
      '&:first-child': {
        borderLeft: 'none',
        width: '25%'
      },
      '&:nth-child(2)': {
        width: '35%'
      },
      '&:nth-child(3)': {
        width: '40%'
      }
    },
    info: {
      lineHeight: '20px',
      '& > div': {
        marginBottom: '5px',
        position: 'relative',
        paddingRight: '25px',
        '&:last-child': {
          margin: '0'
        }
      }
    },
    moreInfo: {
      marginTop: '25px'
    },
    skillsWrapper: {
      display: 'inline',
      marginLeft: '5px'
    },
    skill: {
      display: 'inline-block',
      fontWeight: '600',
      marginRight: '5px',
      '&:after': {
        content: '","'
      },
      '&:last-child:after': {
        display: 'none'
      },
      '& strong': {
        color: COLOR_GREY_LIGHTEN
      }
    },
    lowercase: {
      textTransform: 'lowercase'
    },
    titleLabel: {
      fontSize: '18px',
      color: '#333',
      fontWeight: '600',
      cursor: 'pointer'
    },
    titleButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      zIndex: '2'
    },
    titleExtra: {
      fontSize: '13px',
      color: COLOR_GREY,
      margin: '0 10px',
      '& span': {
        fontWeight: '550'
      }
    },
    bodyTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '15px',
      marginTop: '20px',
      '&:first-child': {
        marginTop: '0'
      }
    },
    closeDetail: {
      position: 'absolute',
      left: '0',
      top: '0',
      right: '0',
      bottom: '0',
      cursor: 'pointer',
      zIndex: '1'
    },
    subTitle: {
      display: 'flex',
      borderBottom: BORDER_STYLE,
      padding: '0 30px',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '55px',
      width: '100%'
    },
    status: {
      fontWeight: '600'
    },
    buttons: {
      display: 'flex',
      alignItems: 'center'
    },
    button: {
      fontWeight: '600',
      fontSize: '14px',
      marginRight: '20px'
    },
    moreDetails: {
      textAlign: 'right',
      marginTop: '10px'
    },
    description: {
      minHeight: '300px'
    },
    progress: {
      backgroundColor: '#efefef',
      overflowY: 'auto',
      position: 'absolute',
      right: '0',
      top: '0',
      bottom: '0'
    },

    logsWrapper: {
      position: 'absolute',
      right: '0',
      top: '0',
      height: '22px',
      width: '22px',
      '&:hover > div:last-child': {
        opacity: '1',
        zIndex: '2 !important'
      },
      '& > svg': {
        width: '22px !important',
        height: '22px !important',
        color: COLOR_GREY_LIGHTEN + '!important'
      }
    },
    changelog: {
      background: COLOR_WHITE,
      boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
      position: 'absolute',
      padding: '10px 15px',
      left: 'calc(100% + 10px)',
      right: '-240px',
      top: '-11px',
      opacity: '0',
      zIndex: '-999',
      transition: 'opacity 200ms ease'
    },
    log: {
      marginBottom: '15px',
      '&:last-child': {
        marginBottom: '0'
      }
    },
    logDate: {
      fontSize: '12px',
      fontWeight: '600',
      color: COLOR_GREY_LIGHTEN
    },
    logLang: {
      fontWeight: 'normal'
    }
  }),
  withState('moreDetails', 'setMoreDetails', true)
)

const flatButtonStyle = {
  label: {
    textTransform: 'none',
    verticalAlign: 'middle',
    fontWeight: '600'
  }
}
const iconStyle = {
  icon: {
    color: COLOR_GREY,
    width: 24,
    height: 24
  },
  button: {
    width: 48,
    height: 48,
    padding: 12
  }
}
const popoverStyle = {
  menuItem: {
    fontSize: '13px',
    minHeight: '36px',
    lineHeight: '36px'
  },
  innerDiv: {
    padding: '0px 16px 0px 60px'
  },
  icon: {
    margin: '7px',
    width: '22px',
    height: '22px'
  }
}

const ApplicationDetails = enhance((props) => {
  const {classes,
    loading,
    data,
    confirmDialog,
    handleOpenUpdateDialog,
    handleCloseDetail,
    logsData,
    moreDetails,
    setMoreDetails,
    handleChangeApplicationAction,
    meetingDialog,
    updateMeetingDialog,
    meetingData,
    confirmData
  } = props
  const getChangesLog = (key) => {
    const changelog = []
    _.map(logsData.list, (item) => {
      const createdDate = _.get(item, 'createdDate')
      _.map(_.get(item, 'log'), (value, keyname) => {
        if (key === keyname) {
          changelog.push({keyname, value, createdDate})
        }
      })
    })
    if (_.isEmpty(changelog)) {
      return null
    }
    return (
      <div className={classes.logsWrapper}>
        <Info/>
        <div className={classes.changelog}>
          {_.map(changelog, (item, index) => {
            const value = _.get(item, 'value')
            const getChangedValue = () => {
              const languages = _.map(value, (obj) => {
                const language = _.get(obj, 'language')
                const level = getBackendNames(HR_LANG_LEVELS, _.get(obj, 'level'))
                return (
                  <div className={classes.logLang}>{language} ({level})</div>
                )
              })
              switch (key) {
                case 'education': return getBackendNames(HR_EDUCATION, value)
                case 'languagesLevel': return languages
                case 'levelPc': return getBackendNames(HR_LEVEL_PC, value)
                case 'mode': return getBackendNames(HR_WORK_SCHEDULE, value)
                case 'sex': return genderFormat[value]
                case 'skills': return _.join(value, ', ')
                default: return (_.isEmpty(value)) ? 'Новое добавление' : value
              }
            }
            const date = dateFormat(_.get(item, 'createdDate'))
            const valueIsDate = _.includes(['deadline', 'planningDate'], key)
            const output = valueIsDate ? dateFormat(value) : getChangedValue()
            return (
              <div key={index} className={classes.log}>
                <div className={classes.logDate}>изменено: {date}</div>
                <div>{output}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const applicationId = _.get(data, 'id')
  const ageMin = _.toNumber(_.get(data, 'ageMin'))
  const ageMax = _.toNumber(_.get(data, 'ageMax'))
  const businessTrip = _.get(data, 'businessTrip') ? t('Да') : t('Нет')
  const client = _.get(data, ['contact', 'client', 'name'])
  const sphere = _.get(data, ['contact', 'client', 'sphere']) || t('Не указана')
  const contact = _.get(data, ['contact', 'name'])
  const email = _.get(data, ['contact', 'email']) || t('Не указан')
  const phone = _.get(data, ['contact', 'telephone']) || t('Не указан')
  const address = _.get(data, ['contact', 'address']) || t('Не указан')
  const deadline = dateFormat(_.get(data, 'deadline'))
  const education = getBackendNames(HR_EDUCATION, _.get(data, 'education'))
  const experience = _.toNumber(_.get(data, 'experience'))
  const levelPc = getBackendNames(HR_LEVEL_PC, _.get(data, 'levelPc'))
  const workSchedule = getBackendNames(HR_WORK_SCHEDULE, _.get(data, 'mode'))
  const planningDate = dateFormat(_.get(data, 'planningDate'))
  const position = _.get(data, ['position', 'name'])
  const privileges = _.get(data, 'privileges')
  const realSalaryMin = numberFormat(_.get(data, 'realSalaryMin'))
  const realSalaryMax = numberFormat(_.get(data, 'realSalaryMax'))
  const recruiter = _.get(data, ['recruiter'])
    ? _.get(data, ['recruiter', 'firstName']) + ' ' + _.get(data, ['recruiter', 'secondName'])
    : t('Не назначен')
  const responsibility = _.get(data, 'responsibility')
  const sex = getBackendNames(HR_GENDER, _.get(data, 'sex'))
  const skills = _.get(data, 'skills')
  const status = _.get(data, 'status')
  const languages = _.get(data, 'languages')
  const trialSalaryMin = numberFormat(_.get(data, 'trialSalaryMin'))
  const trialSalaryMax = numberFormat(_.get(data, 'trialSalaryMax'))
  const requirements = _.map(_.get(data, 'requirements'), (item) => {
    const id = _.get(item, 'id')
    const text = _.get(item, 'text')
    const required = _.get(item, 'required')
    return (
      <div key={id}>{text} {required && <strong>- обязатеьлно</strong>}</div>
    )
  })

  const reportUri = `/${_.trimStart(_.get(data, 'downloadReport'), 'ru/api/v1')}`

  if (loading || logsData.loading) {
    return (
      <div className={classes.loader}>
        <LinearProgress/>
      </div>
    )
  }

  return (
    <div className={classes.wrapper} key={_.get(data, 'id')}>
      <div className={classes.title}>
        <div className={classes.titleLabel}>{t('Заявка')} №{applicationId}</div>
        <div className={classes.closeDetail}
          onClick={handleCloseDetail}>
        </div>
        <div className={classes.titleButtons}>
          <div className={classes.titleExtra}>{t('Дэдлайн')}: <span>{deadline}</span></div>
          <div className={classes.titleExtra}>{t('Рекрутер')}: <span>{recruiter}</span></div>

          <IconMenu
            className={classes.popover}
            iconButtonElement={
              <IconButton iconStyle={iconStyle.icon} style={iconStyle.button}>
                <MoreIcon/>
              </IconButton>
            }
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
            {status !== 'frozen' &&
                        <MenuItem
                          style={popoverStyle.menuItem}
                          innerDivStyle={popoverStyle.innerDiv}
                          leftIcon={<Edit style={popoverStyle.icon}/>}
                          onClick={() => { handleOpenUpdateDialog(applicationId) }}
                          primaryText={t('Изменить')}/>}
            <MenuItem
              style={popoverStyle.menuItem}
              innerDivStyle={popoverStyle.innerDiv}
              leftIcon={<Delete style={popoverStyle.icon}/>}
              onClick={() => { confirmDialog.handleOpenConfirmDialog(applicationId) }}
              primaryText={t('Удалить')}/>
          </IconMenu>
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.block}>
          <div className={classes.bodyTitle}>{t('Описание компании')}</div>
          <div className={classes.info}>
            <div>{t('Клиент')}: <strong>{client}</strong>{getChangesLog('client')}</div>
            <div>{t('Контактное лицо')}: <strong>{contact}</strong>{getChangesLog('contact')}</div>
            <div>{t('Телефон')}: <strong>{phone}</strong></div>
            <div>{t('Адрес')}: <strong>{address}</strong></div>
            <div>{t('Email')}: <strong>{email}</strong></div>
          </div>
          <div className={classes.bodyTitle}>{t('Деятельность компании')}</div>
          <div className={classes.info}>{sphere}</div>
        </div>
        <div className={classNames(classes.block, classes.description)}>
          <div className={classes.bodyTitle}>{t('Описание вакантной должности')}</div>
          <div className={classes.info}>
            <div>{t('Наименование должности')}: <strong>{position}</strong>{getChangesLog('position')}</div>
            <div>{t('З/п на испытательный срок')}: <strong>{trialSalaryMin} - {trialSalaryMax} {SUM_CURRENCY}</strong></div>
            <div>{t('З/п после испытательного срока')}: <strong>{realSalaryMin} - {realSalaryMax} {SUM_CURRENCY}</strong></div>
            <div>{t('Предоставляемые льготы')}:
              <div className={classes.skillsWrapper}>
                {_.map(privileges, (item) => {
                  const id = _.get(item, 'id')
                  const name = _.get(item, 'name')
                  return (
                    <span key={id} className={classes.skill}>{name}</span>
                  )
                })}
              </div>
              {getChangesLog('privileges')}
            </div>
            <div>{t('Режим работы')}: <strong>{workSchedule}</strong>{getChangesLog('mode')}</div>
            <div>{t('Наличие командировок')}: <strong>{businessTrip}</strong>{getChangesLog('businessTrip')}</div>
            <div>{t('Дата планируемого приема на работу')}: <strong>{planningDate}</strong>{getChangesLog('planningDate')}</div>
          </div>
          {moreDetails &&
                    <div className={classNames(classes.moreInfo)}>
                      <div className={classes.bodyTitle}>{t('Требования к кандидату')}</div>
                      <div className={classes.info}>
                        <div>{t('Возраст')}: <strong>{ageMin} - {getYearText(ageMax)}</strong></div>
                        <div>{t('Пол')}: <strong>{sex}</strong>{getChangesLog('sex')}</div>
                        <div>{t('Образование')}: <strong>{education}</strong>{getChangesLog('education')}</div>
                        <div>{t('Знание ПК')}: <strong>{levelPc}</strong>{getChangesLog('levelPc')}</div>
                        <div>{t('Знание языков')}:
                          <div className={classes.skillsWrapper}>
                            {_.isEmpty(languages)
                              ? <strong> {t('Не указано')}</strong>
                              : _.map(languages, (item) => {
                                const id = _.get(item, 'id')
                                const name = _.get(item, ['language', 'name'])
                                const level = getBackendNames(HR_LANG_LEVELS, _.get(item, ['level']))
                                return (
                                  <span key={id} className={classes.skill}>{name} <strong className={classes.lowercase}>({level})</strong></span>
                                )
                              })}
                          </div>
                          {getChangesLog('languagesLevel')}
                        </div>
                        <div>{t('Минимальный опыт работы по специальности')}: <strong>{getYearText(experience)}</strong></div>
                        <div>{t('Профессиональные навыки')}:
                          <div className={classes.skillsWrapper}>
                            {_.isEmpty(skills)
                              ? <strong> {t('Не указаны')}</strong>
                              : _.map(skills, (item) => {
                                const id = _.get(item, 'id')
                                const name = _.get(item, 'name')
                                return (
                                  <span key={id} className={classes.skill}>{name}</span>
                                )
                              })}
                          </div>
                          {getChangesLog('skills')}
                        </div>
                        {requirements}
                        <div className={classes.bodyTitle}>{t('Функциональные обязанности')}</div>
                        <div>{responsibility}{getChangesLog('responsibility')}</div>
                      </div>
                    </div>}
          {false &&
                    <div className={classes.moreDetails}>
                      <FlatButton
                        label={moreDetails ? 'Cкрыть' : 'Больше'}
                        labelStyle={flatButtonStyle.label}
                        primary={true}
                        backgroundColor={COLOR_WHITE}
                        hoverColor={BORDER_COLOR}
                        rippleColor={COLOR_WHITE}
                        onClick={() => setMoreDetails(!moreDetails)}
                        fullWidth/>
                    </div>}
        </div>
        <div className={classNames(classes.block, classes.progress)}>
          <ApplicationDetailProgress
            status={status}
            email={_.get(data, ['contact', 'email'])}
            showNotify={true}
            logsData={logsData}
            reportUri={reportUri}
            handleChangeApplicationAction={handleChangeApplicationAction}
            meetingDialog={meetingDialog}
            updateMeetingDialog={updateMeetingDialog}
            meetingData={meetingData}
            confirmData={confirmData}
          />
        </div>
      </div>
    </div>
  )
})

ApplicationDetails.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  confirmDialog: PropTypes.shape({
    openConfirmDialog: PropTypes.bool.isRequired,
    handleOpenConfirmDialog: PropTypes.func.isRequired,
    handleCloseConfirmDialog: PropTypes.func.isRequired,
    handleSendConfirmDialog: PropTypes.func.isRequired
  })
}

export default ApplicationDetails
