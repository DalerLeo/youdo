import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../../LinearProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import ToolTip from '../../Utils/ToolTip'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import t from '../../../helpers/translate'
import {getStatusName} from './ApplicationGridList'
import {PADDING_STANDART, BORDER_STYLE} from '../../../constants/styleConstants'

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
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    },
    applicationInfo: {
      borderBottom: BORDER_STYLE,
      padding: PADDING_STANDART,
      width: '100%'
    },
    block: {
      borderLeft: BORDER_STYLE,
      padding: PADDING_STANDART,
      width: '35%',
      '&:first-child': {
        border: 'none',
        width: '30%'
      }
    },
    info: {
      '& > div': {
        marginBottom: '10px',
        '&:last-child': {
          margin: '0'
        }
      }
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    skill: {
      backgroundColor: '#4db6ac',
      borderRadius: '2px',
      padding: '3px 8px',
      margin: '0 3px',
      fontWeight: '600',
      display: 'inline-block',
      color: '#fff'
    },
    titleLabel: {
      fontSize: '18px',
      color: '#333',
      fontWeight: '600',
      cursor: 'pointer'
    },
    titleButtons: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    bodyTitle: {
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
    }
  }),
  withState('openDetails', 'setOpenDetails', false)
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
withState('openDetails', 'setOpenDetails', false)

const ApplicationDetails = enhance((props) => {
  const {classes,
    loading,
    data,
    confirmDialog,
    handleOpenUpdateDialog,
    handleCloseDetail
  } = props

  const applicationId = _.get(data, 'id')
  const ageMin = _.get(data, 'ageMin')
  const ageMax = _.get(data, 'ageMax')
  const businessTrip = _.get(data, 'businessTrip') ? t('Да') : t('Нет')
  const client = _.get(data, ['client', 'name'])
  const createdDate = dateFormat(_.get(data, 'createdDate'))
  const deadline = dateFormat(_.get(data, 'deadline'), true)
  const education = _.get(data, 'education')
  const experience = _.get(data, 'experience')
  const levelPc = _.get(data, 'levelPc')
  const workSchedule = _.get(data, 'mode')
  const planningDate = dateFormat(_.get(data, 'planningDate'))
  const position = _.get(data, 'position')
  const privileges = _.get(data, 'privileges')
  const realSalaryMin = numberFormat(_.get(data, 'realSalaryMin'))
  const realSalaryMax = numberFormat(_.get(data, 'realSalaryMax'))
  const recruiter = _.get(data, ['recruiter'])
    ? _.get(data, ['recruiter', 'firstName']) + ' ' + _.get(data, ['recruiter', 'secondName'])
    : t('Не назначен')
  const responsibility = _.get(data, 'responsibility')
  const sex = _.get(data, 'sex')
  const skills = _.get(data, 'skills')
  const status = _.get(data, 'status')
  const trialSalaryMin = numberFormat(_.get(data, 'trialSalaryMin'))
  const trialSalaryMax = numberFormat(_.get(data, 'trialSalaryMax'))

  if (loading) {
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
          <ToolTip position="bottom" text={t('Изменить')}>
            <IconButton
              iconStyle={iconStyle.icon}
              style={iconStyle.button}
              touch={true}
              onClick={() => { handleOpenUpdateDialog(applicationId) }}>
              <Edit />
            </IconButton>
          </ToolTip>
          <ToolTip position="bottom" text={t('Удалить')}>
            <IconButton
              iconStyle={iconStyle.icon}
              style={iconStyle.button}
              touch={true}
              onClick={() => { confirmDialog.handleOpenConfirmDialog(applicationId) }}>
              <Delete />
            </IconButton>
          </ToolTip>
        </div>
      </div>
      <div className={classes.applicationInfo}>
        <div className={classes.bodyTitle}>{t('Общая информация о заявке')}</div>
        <div className={classes.info + ' ' + classes.flexBetween}>
          <div>{t('Дата создания')}: <strong>{createdDate}</strong></div>
          <div>{t('Рекрутер')}: <strong>{recruiter}</strong></div>
          <div>{t('Дэдлайн')}: <strong>{deadline}</strong></div>
          <div>{t('Статус')}: <strong>{getStatusName(status)}</strong></div>
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.block}>
          <div className={classes.bodyTitle}>{t('Описание компании')}</div>
          <div className={classes.info}>
            <div>{t('Клиент')}: <strong>{client}</strong></div>
            <div>{t('Контактное лицо')}: <strong>{}</strong></div>
            <div>{t('Телефон')}: <strong>{}</strong></div>
            <div>{t('Адрес')}: <strong>{}</strong></div>
            <div>{t('Email')}: <strong>{}</strong></div>
          </div>
        </div>
        <div className={classes.block}>
          <div className={classes.bodyTitle}>{t('Описание вакантной должности')}</div>
          <div className={classes.info}>
            <div>{t('Наименование должности')}: <strong>{position}</strong></div>
            <div>{t('З/п на испытательный срок')}: <strong>{trialSalaryMin} - {trialSalaryMax}</strong></div>
            <div>{t('З/п после испытательного срока')}: <strong>{realSalaryMin} - {realSalaryMax}</strong></div>
            <div>{t('Предоставляемые льготы')}: <strong>{privileges}</strong></div>
            <div>{t('Режим работы')}: <strong>{workSchedule}</strong></div>
            <div>{t('Наличие командировок')}: <strong>{businessTrip}</strong></div>
            <div>{t('Функциональные обязанности')}: <strong>{responsibility}</strong></div>
            <div>{t('Дата планируемого приема на работу')}: <strong>{planningDate}</strong></div>
          </div>
        </div>
        <div className={classes.block}>
          <div className={classes.bodyTitle}>{t('Требования к кандидату')}</div>
          <div className={classes.info}>
            <div>{t('Возраст')}: <strong>{ageMin} - {ageMax}</strong></div>
            <div>{t('Пол')}: <strong>{sex}</strong></div>
            <div>{t('Образование')}: <strong>{education}</strong></div>
            <div>{t('Знание ПК')}: <strong>{levelPc}</strong></div>
            <div>{t('Знание языков')}: <strong>{}</strong></div>
            <div>{t('Минимальный опыт работы по специальности')}: <strong>{experience}</strong></div>
            <div>{t('Профессиональные навыки')}: <strong>{_.map(skills, (item) => {
              const id = _.get(item, 'id')
              const name = _.get(item, 'name')
              return (
                <span key={id} className={classes.skill}>{name}</span>
              )
            })}</strong></div>
          </div>
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
  }).isRequired
}

export default ApplicationDetails
