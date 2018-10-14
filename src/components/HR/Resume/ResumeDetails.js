import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState, lifecycle} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../../LinearProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import ToolTip from '../../Utils/ToolTip'
import dateFormat from '../../../helpers/dateFormat'
import {getBackendNames, getResumeStatus} from '../../../helpers/hrcHelpers'
import {genderFormat} from '../../../constants/gender'
import {HardwareKeyboardArrowDown} from 'material-ui/svg-icons'
import t from '../../../helpers/translate'
import {
  PADDING_STANDART,
  BORDER_STYLE, LINK_COLOR
} from '../../../constants/styleConstants'
import {FlatButton, IconMenu, MenuItem} from 'material-ui'
import {resumeChangeStatusAction} from '../../../actions/HR/resume'
import {openErrorAction} from '../../../actions/error'
import {openSnackbarAction} from '../../../actions/snackbar'
import {HR_LANG_LEVELS, HR_LEVEL_PC} from '../../../constants/backendConstants'

const colorBlue = '#12aaeb !important'
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
        color: colorBlue
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
      marginLeft: '10px',
      color: '#999'
    },
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: BORDER_STYLE,
      width: '100%',
      '&:last-child': {
        borderBottom: 'none'
      },
      '& > div': {
        borderLeft: BORDER_STYLE,
        width: '50%',
        '&:first-child': {
          borderLeft: 'none'
        }
      }
    },
    containerBlock: {
      extend: 'container',
      display: 'block',
      '& > div': {
        border: 'none',
        width: '100%'
      }
    },
    block: {
      padding: PADDING_STANDART
    },
    innerBlock: {
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: BORDER_STYLE,
      '&:last-child': {
        marginBottom: '0',
        paddingBottom: '0',
        borderBottom: 'none'
      }
    },
    info: {
      display: 'flex',
      '& > ul': {
        marginRight: '40px',
        lineHeight: '22px',
        minWidth: '160px',
        '&:last-child': {
          margin: '0'
        }
      }
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    skills: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    skill: {
      margin: '0 8px 8px 0',
      padding: '3px 10px',
      background: '#e8e8e8'
    },
    lang: {
      listStyle: 'disc inside',
      lineHeight: '25px'
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
    lowercase: {
      textTransform: 'lowercase'
    },
    bodyTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '10px'
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
    experience: {
      marginBottom: '25px',
      '&:last-child': {
        marginBottom: '0'
      }
    },
    condition: {
      marginBottom: '10px',
      '&:last-child': {
        marginBottom: '0'
      },
      '& h3': {
        fontSize: '15px',
        fontWeight: '600'
      },
      '& h4': {
        fontWeight: '600'
      }
    },
    overflowText: {
      display: '-webkit-box',
      WebkitLineClamp: '3',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    statusButton: {
      position: 'absolute',
      top: '0',
      right: '135px'
    }
  }),
  withState('openDetails', 'setOpenDetails', false),
  withState('detailStatus', 'setDetailStatus', null),

  lifecycle({
    componentWillReceiveProps (nextProps) {
      const props = this.props
      const loading = _.get(props, ['loading'])
      const nextLoading = _.get(nextProps, ['loading'])
      const status = _.get(props, ['detailStatus', 'id'])
      const nextStatus = _.get(nextProps, ['detailStatus', 'id'])

      const setDetailStatus = _.get(nextProps, 'setDetailStatus')
      if (loading !== nextLoading && nextLoading === false) {
        const detailStatus = _.get(nextProps, ['data', 'status'])
        setDetailStatus({
          id: detailStatus,
          text: getBackendNames(getResumeStatus(), detailStatus)
        })
      }

      if (status !== nextStatus && !_.isNil(status)) {
        const dispatch = _.get(nextProps, 'dispatch')
        const resumeId = _.get(nextProps, ['data', 'id'])
        const prevStatus = _.get(props, ['detailStatus', 'id'])
        const updatedStatus = _.get(nextProps, ['detailStatus', 'id'])
        return dispatch(resumeChangeStatusAction(resumeId, updatedStatus))
          .then(() => {
            return setDetailStatus({
              id: updatedStatus,
              text: getBackendNames(getResumeStatus(), updatedStatus)
            })
          })
          .then(() => {
            return dispatch(openSnackbarAction({message: t('Статус изменен')}))
          })
          .catch((error) => {
            dispatch(openErrorAction({
              message: error
            }))
            return setDetailStatus({
              id: prevStatus,
              text: getBackendNames(getResumeStatus(), prevStatus)
            })
          })
      }
      return null
    }
  })
)

const iconStyle = {
  icon: {
    color: '#666',
    width: 20,
    height: 20
  },
  button: {
    width: 48,
    height: 48,
    padding: 0
  }
}

const popoverStyle = {
  menuItem: {
    fontSize: '13px',
    minHeight: '36px',
    lineHeight: '36px'
  },
  innerDiv: {
    padding: '10px',
    'text-align': 'center'
  },
  icon: {
    margin: '7px',
    width: '22px',
    height: '22px'
  }
}

const familyStatusText = (gender, status) => {
  if (gender === 'male') {
    switch (status) {
      case 'single': return t('Не женат')
      case 'married': return t('Женат')
      default: return t('Не указано')
    }
  }
  if (gender === 'female') {
    switch (status) {
      case 'single': return t('Не замужем')
      case 'married': return t('Замужем')
      default: return t('Не указано')
    }
  }
  return t('Не указано')
}

const ResumeDetails = enhance((props) => {
  const {classes,
    loading,
    data,
    confirmDialog,
    handleOpenUpdateDialog,
    handleCloseDetail,
    setDetailStatus,
    detailStatus
  } = props

  // PERSONAL INFO
  const resumeId = _.get(data, ['id'])
  const fullName = _.get(data, ['fullName'])
  const address = _.get(data, ['address'])
  const sex = _.get(data, ['sex'])
  const dateOfBirth = dateFormat(_.get(data, ['dateOfBirth']))
  const phone = _.get(data, ['phone'])
  const email = _.get(data, ['email'])
  const familyStatus = _.get(data, ['familyStatus'])
  // .    const status = _.get(data, ['status'])
  const country = _.get(data, ['country', 'name'])
  const city = _.get(data, ['city', 'name'])

  const experiences = _.get(data, 'experiences')
  const educations = _.get(data, 'educations')

  const languagesLevel = _.get(data, 'languages')
  const levelPc = getBackendNames(HR_LEVEL_PC, _.get(data, 'levelPc'))
  const hobby = _.get(data, 'hobby') || t('Не указано')
  const driverLicense = _.join(_.map(_.get(data, 'driverLicense'), item => {
    return _.get(item, 'name')
  }), ', ') || t('нет водительских прав')

  if (loading) {
    return (
      <div className={classes.loader}>
        <LinearProgress/>
      </div>
    )
  }

  const skills = _.isEmpty(_.get(data, 'skills'))
    ? <span> {t('Не указаны')}</span>
    : _.map(_.get(data, 'skills'), (item) => {
      const id = _.get(item, 'id')
      const name = _.get(item, 'name')
      return (
        <span key={id} className={classes.skill}>{name}</span>
      )
    })
  const statusButton = (
    <div className={classes.statusButton}>
      <IconMenu
        className={classes.popover}
        iconButtonElement={
          <FlatButton
            label={(
              <span>{t('Статус')}: <br/><span style={{color: LINK_COLOR}}>{_.get(detailStatus, 'text')}</span></span>
            )}
            style={{display: 'flex', alignItems: 'center', height: '50px', textAlign: 'left'}}
            backgroundColor={'#efefef'}
            hoverColor={'#efefef'}
            disableTouchRipple
            labelPosition="before"
            labelStyle={{
              color: '#777',
              lineHeight: '18px',
              textTransform: 'none',
              verticalAlign: 'baseline',
              fontWeight: '600'
            }}
            icon={<HardwareKeyboardArrowDown/>}
          />
        }
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
        {_.map(_.filter(getResumeStatus(), item => item.id !== 'on_guarantee'), item => {
          return (
            <MenuItem
              key={item.id}
              style={popoverStyle.menuItem}
              onClick={() => {
                setDetailStatus({
                  id: item.id,
                  text: item.name
                })
              }}
              primaryText={item.name}/>
          )
        })}
      </IconMenu>

      {false &&
            <ToolTip position="left" text={t('Отфильтровать по отмененным заявкам')}>
              <IconButton>
                <Canceled/>
              </IconButton>
            </ToolTip>}
    </div>
  )
  return (
    <div className={classes.wrapper} key={_.get(data, 'id')}>
      <div className={classes.title}>
        <div className={classes.titleLabel}>{fullName}</div>
        <div className={classes.closeDetail} onClick={handleCloseDetail}/>
        <div className={classes.titleButtons}>
          {statusButton}
          <ToolTip position="bottom" text={t('Изменить')}>
            <IconButton
              iconStyle={iconStyle.icon}
              style={iconStyle.button}
              touch={true}
              onClick={() => { handleOpenUpdateDialog(resumeId) }}>
              <Edit />
            </IconButton>
          </ToolTip>
          <ToolTip position="bottom" text={t('Удалить')}>
            <IconButton
              iconStyle={iconStyle.icon}
              style={iconStyle.button}
              touch={true}
              onClick={() => { confirmDialog.handleOpenConfirmDialog(resumeId) }}>
              <Delete />
            </IconButton>
          </ToolTip>
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.block}>
          <div className={classes.innerBlock}>
            <div className={classes.bodyTitle}>{t('Личные данные')}</div>
            <div className={classes.info}>
              <ul>
                <li>{t('Дата рождения')}:</li>
                <li>{t('Пол')}:</li>
                <li>{t('Семейное положение')}:</li>
                <li>{t('Телефон')}:</li>
                <li>{t('Email')}:</li>
                <li>{t('Страна проживания')}:</li>
                <li>{t('Адрес')}:</li>
              </ul>
              <ul>
                <li>{dateOfBirth}</li>
                <li><span className={classes.lowercase}>{genderFormat[sex]}</span></li>
                <li><span className={classes.lowercase}>{familyStatusText(sex, familyStatus)}</span></li>
                <li>{phone}</li>
                <li>{email}</li>
                <li>{(country && city) ? <span>{country}, {city}</span> : <span>{t('Не указана')}</span>}</li>
                <li>{address}</li>
              </ul>
            </div>
          </div>
          <div className={classes.innerBlock}>
            <div className={classes.bodyTitle}>{t('Навыки и умения')}</div>
            <div className={classes.skills}>{skills}</div>
          </div>
          <div className={classes.innerBlock}>
            <div className={classes.bodyTitle}>{t('Знание языков')}</div>
            {_.isEmpty(languagesLevel)
              ? <div>{t('Не указано')}</div>
              : <ul>
                {_.map(languagesLevel, (item) => {
                  const id = _.get(item, ['id'])
                  const name = _.get(item, ['language', 'name'])
                  const level = getBackendNames(HR_LANG_LEVELS, _.get(item, ['level']))
                  return <li key={id} className={classes.lang}>{name} {level && <span className={classes.lowercase}>({level})</span>}</li>
                })}
              </ul>}
          </div>
          <div className={classes.innerBlock}>
            <div className={classes.bodyTitle}>{t('Дополнительная информация')}</div>
            <div className={classes.info}>
              <ul>
                <li>{t('Водительские права')}:</li>
                <li>{t('Уровень владения ПК')}:</li>
              </ul>
              <ul>
                <li>{driverLicense}</li>
                <li>{levelPc}</li>
              </ul>
            </div>
          </div>
          <div className={classes.innerBlock}>
            <div className={classes.bodyTitle}>{t('Интересы и хобби')}</div>
            <div>{hobby}</div>
          </div>
        </div>
        <div className={classes.block}>
          <div className={classes.innerBlock}>
            <div className={classes.bodyTitle}>{t('Опыт работы')}</div>
            {_.isEmpty(experiences)
              ? t('Нет опыта работы')
              : _.map(experiences, (item, index) => {
                const workStart = dateFormat(_.get(item, 'workStart'))
                const workTillNow = _.get(item, 'workTillNow')
                const workEnd = workTillNow
                  ? t('По сегодняшний день')
                  : dateFormat(_.get(item, 'workEnd'))
                const organization = _.get(item, 'organization')
                const expPosition = _.get(item, ['position', 'name'])
                const responsibility = _.get(item, 'responsibility')
                return (
                  <div key={index} className={classes.experience}>
                    <div className={classes.condition}>
                      <h3>{expPosition}</h3>
                    </div>
                    <div className={classes.condition}>
                      <h4>{organization}</h4>
                    </div>
                    <div className={classes.condition}>
                      <div>{t('Период')}: {workStart} - {workEnd}</div>
                    </div>
                    <div className={classes.condition}>
                      <h4>{t('Должностные обязанности')}</h4>
                      <div className={classes.overflowText}>{responsibility}</div>
                    </div>
                  </div>
                )
              })}
          </div>
          <div className={classes.innerBlock}>
            <div className={classes.bodyTitle}>{t('Образование')}</div>
            {_.isEmpty(educations)
              ? t('Нет образования')
              : _.map(educations, (item, index) => {
                const studyStart = dateFormat(_.get(item, 'studyStart'))
                const studyTillNow = _.get(item, 'studyTillNow')
                const studyEnd = studyTillNow
                  ? t('По сегодняшний день')
                  : dateFormat(_.get(item, 'studyEnd'))
                const institution = _.get(item, 'institution')
                const speciality = _.get(item, 'speciality')
                const eduCountry = _.get(item, ['country', 'name'])
                const eduCity = _.get(item, ['city', 'name'])
                return (
                  <div key={index} className={classes.experience}>
                    <div className={classes.condition}>
                      <h4>{t('Учебное заведение')}</h4>
                      <div>{institution}</div>
                    </div>
                    <div className={classes.condition}>
                      <h4>{t('Специальность')}</h4>
                      <div>{speciality}</div>
                    </div>
                    <div className={classes.condition}>
                      <div>{t('Период')}: {studyStart} - {studyEnd}</div>
                    </div>
                    <div className={classes.condition}>
                      <h4>{t('Страна обучения')}</h4>
                      <div>{eduCountry}, {eduCity}</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
})

ResumeDetails.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  confirmDialog: PropTypes.shape({
    openConfirmDialog: PropTypes.bool.isRequired,
    handleOpenConfirmDialog: PropTypes.func.isRequired,
    handleCloseConfirmDialog: PropTypes.func.isRequired,
    handleSendConfirmDialog: PropTypes.func.isRequired
  })
}

export default ResumeDetails
