import _ from 'lodash'
import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import classNames from 'classnames'
import Done from 'material-ui/svg-icons/action/done'
import FlatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import DownLoadIcon from 'material-ui/svg-icons/file/file-download'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import t from '../../../helpers/translate'
import {
  PADDING_STANDART,
  BORDER_STYLE,
  LINK_COLOR,
  COLOR_WHITE,
  COLOR_GREEN,
  COLOR_YELLOW,
  COLOR_GREY
} from '../../../constants/styleConstants'
import getDocument from '../../../helpers/getDocument'
import ToolTip from '../../Utils/ToolTip'
import Loader from '../../Loader'
import ConfirmDialog from '../../ConfirmDialog'
import ApplicationSendReportDialog from './ApplicationSendReportDialog'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert'
import DoneIcon from 'material-ui/svg-icons/action/done-all'
import InProgressIcon from 'material-ui/svg-icons/alert/warning'
import ApprovedIcon from 'material-ui/svg-icons/action/check-circle'
import NotApprovedIcon from 'material-ui/svg-icons/alert/error-outline'
import {reduxForm, Field} from 'redux-form'
import {CheckBox} from '../../ReduxForm'
import {APPLICATION_COMPLETED} from '../../../constants/backendConstants'

const boxShadow = 'rgba(0, 0, 0, 0.12) 0px 1px 6px 0px, rgba(0, 0, 0, 0.12) 0px 3px 4px 0px'

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
      width: '100%'
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      '& span': {
        backgroundColor: '#bec6c9',
        padding: '8px 10px',
        color: COLOR_WHITE,
        marginRight: '10px',
        fontWeight: '600'
      }
    },
    block: {
      borderLeft: BORDER_STYLE,
      padding: PADDING_STANDART,
      '&:first-child': {
        borderLeft: 'none'
      }
    },
    badge: {
      padding: '7px 5px 4px 0 !important',
      '& span': {
        backgroundColor: '#ef5350 !important',
        fontSize: '11px !important',
        width: '18px !important',
        height: '18px !important'
      }
    },
    cardWrapper: {
      borderLeft: 'solid 2px #bec6c9',
      display: 'flex',
      flexDirection: 'column-reverse',
      marginLeft: '20px'
    },
    reverse: {
      display: 'flex',
      flexDirection: 'column-reverse'
    },
    cardItem: {
      cursor: 'pointer',
      display: 'flex',
      marginLeft: '-9px',
      paddingTop: '15px',
      '& > span': {
        borderRadius: '50%',
        width: '17px',
        height: '16px',
        backgroundColor: '#7abd7d',
        marginTop: '10px'
      },
      '& > div': {
        backgroundColor: '#fff',
        boxShadow,
        borderRadius: '2px',
        marginLeft: '20px',
        minHeight: '35px',
        maxHeight: '100px',
        transition: 'max-height 1s, min-height 1s',
        padding: '10px'
      },
      '& i': {
        fontSize: '11px',
        color: '#999'
      }
    },
    cardContent: {

    },
    actionBtn: {
      backgroundColor: '#fff',
      boxShadow,
      padding: '15px 20px',
      marginTop: '15px',
      marginLeft: '-22px'
    },
    buttons: {
      display: 'flex',
      '& > button': {
        marginLeft: '5px !important',
        '&:first-child': {
          marginLeft: '0 !important'
        }
      }
    },
    download: {
      display: 'flex',
      alignItems: 'center',
      '& > a': {
        fontSize: '12px',
        display: 'flex',
        fontWeight: '600',
        alignItems: 'center',
        marginLeft: '5px'
      }
    },
    meetingWrapper: {
      extend: 'actionBtn',
      padding: '0',
      '& header': {
        borderBottom: BORDER_STYLE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        padding: '15px',
        '& svg': {
          height: '20px !important',
          width: '20px !important'
        }
      }
    },
    meetings: {
      padding: '5px 0'
    },
    meeting: {
      alignItems: 'center',
      padding: '10px 15px',
      position: 'relative',
      '& svg': {
        marginLeft: '10px',
        height: '16px !important',
        width: '16px !important'
      }
    },
    status: {

    },
    popover: {
      position: 'absolute !important',
      height: '20px',
      right: '25px',
      '& svg': {
        margin: '0 !important',
        height: '20px !important',
        width: '20px !important'
      }
    },
    completeDialog: {
      marginTop: '15px',
      '& h2': {
        fontSize: '13px'
      },
      '& > div': {
        margin: '0'
      }
    },
    completeWrapper: {
      background: COLOR_WHITE,
      boxShadow,
      padding: '15px',
      position: 'relative'
    },
    closeComplete: {
      cursor: 'pointer',
      position: 'absolute',
      top: '7px',
      right: '10px',
      height: '30px',
      width: '30px',
      padding: '5px',
      '& > svg': {
        height: '20px !important',
        width: '20px !important'
      }
    },
    candidates: {
      borderTop: BORDER_STYLE,
      borderBottom: BORDER_STYLE,
      margin: '20px 0'
    },
    candidate: {
      alignItems: 'center',
      padding: '10px 0'
    }
  }),
  reduxForm({
    form: 'ApplicationProgressForm',
    enableReinitialize: true
  }),
  withState('openLogs', 'setOpenLogs', false),
  withState('openCompleteDialog', 'setOpenCompleteDialog', false),

  // CONFIRM MODALS
  withState('openConfirmSendToClientDialog', 'setOpenConfirmSendToClientDialog', false),
  withState('openConfirmMeetingDialog', 'setOpenConfirmMeetingDialog', false),
  withState('openConfirmCompleteDialog', 'setOpenConfirmCompleteDialog', false),
)

const downIcon = {
  height: '15px',
  width: '15px',
  color: LINK_COLOR,
  fill: 'currentColor'
}
const doneIcon = {
  width: '16px',
  height: '15px'
}

const actButton = {
  label: {
    fontSize: '13px',
    color: COLOR_WHITE,
    textTransform: 'none',
    padding: '5px'
  }
}

const flatButtonStyle = {
  width: '50%',
  lineHeight: 'unset',
  height: 'unset',
  minHeight: '30px'
}

const popoverStyle = {
  menuItem: {
    fontSize: '13px',
    minHeight: '36px',
    lineHeight: '36px'
  },
  innerDiv: {
    padding: '0px 30px'
  },
  icon: {
    margin: '7px',
    width: '22px',
    height: '22px'
  }
}

const buttonStyle = {
  button: {
    padding: 0,
    height: 20,
    width: 20
  },
  icon: {
    color: COLOR_GREY,
    height: 20,
    width: 20
  }
}

const ApplicationDetailProgress = enhance((props) => {
  const {
    email,
    status,
    isRecruiter,
    classes,
    logsData,
    reportUri,
    handleChangeApplicationAction,
    meetingDialog,
    updateMeetingDialog,
    meetingData,
    confirmData,
    openCompleteDialog,
    setOpenCompleteDialog,

    // CONFIRM MODALS
    openConfirmSendToClientDialog,
    setOpenConfirmSendToClientDialog,
    openConfirmMeetingDialog,
    setOpenConfirmMeetingDialog,
    openConfirmCompleteDialog,
    setOpenConfirmCompleteDialog
  } = props

  const logsList = _.get(logsData, 'list')
  const lastLogId = _.get(_.last(logsList), 'id')
  const lastLogAction = _.get(_.last(logsList), 'action')
  const hasMeetings = !_.isEmpty(_.get(meetingData, 'list'))
  const isApprovedMeetings = !_.includes(_.map(_.get(meetingData, 'list'), item => _.get(item, 'isApprove')), false) &&
        !_.isEmpty(_.get(meetingData, 'list'))

  const getCardContainer = (content, key) => {
    return (
      <div key={key} className={classes.cardItem}>
        <span><Done color={COLOR_WHITE} style={doneIcon}/></span>
        <div className={classNames(classes.cardContent)}>
          {content}
        </div>
      </div>
    )
  }
  const getActionContainer = (content, buttons, key) => {
    const isSingle = _.get(buttons, 'single')
    return (
      <div key={key} className={classes.actionBtn}>
        {!_.isEmpty(content) &&
                <div style={{marginBottom: 10}}>{content}</div>}
        {isSingle
          ? <div className={classes.buttons}>
            <FlatButton
              label={buttons.single.text}
              backgroundColor={COLOR_GREEN}
              hoverColor={COLOR_GREEN}
              rippleColor={COLOR_WHITE}
              style={flatButtonStyle}
              labelStyle={actButton.label}
              onClick={buttons.single.action}
              fullWidth
            />
          </div>
          : <div className={classes.buttons}>
            <FlatButton
              label={buttons.left.text}
              backgroundColor={COLOR_GREEN}
              hoverColor={COLOR_GREEN}
              rippleColor={COLOR_WHITE}
              style={flatButtonStyle}
              labelStyle={actButton.label}
              onClick={buttons.left.action}
            />
            <FlatButton
              label={buttons.right.text}
              backgroundColor={LINK_COLOR}
              hoverColor={LINK_COLOR}
              rippleColor={COLOR_WHITE}
              style={flatButtonStyle}
              labelStyle={actButton.label}
              onClick={buttons.right.action}
            />
          </div>}
      </div>
    )
  }

  const getActionContent = (action, logId) => {
    switch (action) {
      case 'update': return (
        <div key={logId} className={classes.reverse}>
          {getCardContainer('В заявку внесены изменения')}
          {getCardContainer(isRecruiter ? 'Формирование отчета' : 'Ожидание отчета')}
        </div>
      )
      case 'report_sent_to_manager': return lastLogId === logId && !isRecruiter
        ? getActionContainer(
          <div className={classes.download}>
            <span>Отчет сформирован</span>
            <a onClick={() => getDocument(reportUri)}>(<DownLoadIcon style={downIcon}/>скачать)</a>
          </div>,
          {
            left: {
              text: 'Отправить клиенту',
              action: () => setOpenConfirmSendToClientDialog(true)
            },
            right: {
              text: 'Отклонить',
              action: () => handleChangeApplicationAction('rejected_by_manager')
            }
          }, logId)
        : getCardContainer((
          <div className={classes.download}>
            <span>Отчет сформирован</span>
            <a onClick={() => getDocument(reportUri)}>(<DownLoadIcon style={downIcon}/>скачать)</a>
          </div>
        ), logId)
      case 'sent_to_client': return (
        <div key={logId} className={classes.reverse}>
          {getCardContainer('Отчет отправлен клиенту')}
          {lastLogId === logId && !isRecruiter
            ? getActionContainer('Ожидание ответа от клиента по отчету', {
              left: {
                text: 'Отчет одобрен',
                action: () => handleChangeApplicationAction('approval')
              },
              right: {
                text: 'Отчет отклонен',
                action: () => handleChangeApplicationAction('rejected_by_client')
              }
            })
            : null}
        </div>
      )
      case 'rejected_by_manager': return (
        <div key={logId} className={classes.reverse}>
          {getCardContainer('Отчет отклонен менеджером')}
          {getCardContainer('Ожидание отчета')}
        </div>
      )
      case 'rejected_by_client': return (
        <div key={logId} className={classes.reverse}>
          {getCardContainer('Отчет отклонен клиентом')}
          {getCardContainer('Ожидание отчета')}
        </div>
      )
      case 'approval': return (
        <div key={logId} className={classes.reverse}>
          {getCardContainer('Отчет одобрен клиентом')}
          {hasMeetings
            ? <div className={classes.meetingWrapper}>
              <header>
                <h4>{t('Собеседование с клиентом')}</h4>
                <div className={classes.status}>
                  {isApprovedMeetings
                    ? <DoneIcon color={COLOR_GREEN}/>
                    : <InProgressIcon color={COLOR_YELLOW}/>}
                </div>
              </header>
              {meetingData.loading
                ? <div className={classes.loader}>
                  <Loader size={0.75}/>
                </div>
                : <div className={classes.meetings}>
                  {_.map(_.get(meetingData, 'list'), (item, index) => {
                    const meetingId = _.get(item, 'id')
                    const resumeId = _.get(item, ['resume', 'id'])
                    const fullName = _.get(item, ['resume', 'fullName'])
                    const meetingWasPostponed = !_.isNil(_.get(item, ['brokenMeetingTime']))
                    const brokenMeetingTime = meetingWasPostponed
                      ? moment(_.get(item, ['brokenMeetingTime'])).format('DD MMM | HH:mm') : null
                    const meetingTime = moment(_.get(item, ['meetingTime'])).format('DD MMM | HH:mm')
                    const isApprove = _.get(item, ['isApprove'])
                    const random = _.random(Number('100'), true)

                    return (
                      <Row key={`${meetingId}_${resumeId}_${index}_${random}`} className={classes.meeting}>
                        <Col xs={6}>{fullName}</Col>
                        <div>{meetingTime}</div>
                        {isApprove
                          ? <ToolTip text={t('Время собеседования утверждено')} position={'left'}>
                            <ApprovedIcon color={COLOR_GREEN}/>
                          </ToolTip>
                          : meetingWasPostponed
                            ? <ToolTip text={brokenMeetingTime} position={'left'}>
                              <NotApprovedIcon color={COLOR_YELLOW}/>
                            </ToolTip>
                            : null}
                        {(isRecruiter && isApprove) || status === APPLICATION_COMPLETED
                          ? null
                          : <IconMenu
                            className={classes.popover}
                            iconButtonElement={
                              <IconButton
                                disableTouchRipple
                                style={buttonStyle.button}
                                iconStyle={buttonStyle.icon}>
                                <MoreIcon/>
                              </IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                            <MenuItem
                              style={popoverStyle.menuItem}
                              innerDivStyle={popoverStyle.innerDiv}
                              primaryText={t('Изменить')}
                              onClick={() => {
                                updateMeetingDialog.handleOpen(resumeId, meetingId)
                              }}/>
                            {!isApprove &&
                                                        <MenuItem
                                                          style={popoverStyle.menuItem}
                                                          innerDivStyle={popoverStyle.innerDiv}
                                                          primaryText={t('Подтвердить время')}
                                                          onClick={() => {
                                                            setOpenConfirmMeetingDialog({
                                                              resumeId,
                                                              meetingId,
                                                              fullName,
                                                              meetingTime: _.get(item, ['meetingTime'])
                                                            })
                                                          }}/>}
                          </IconMenu>}
                      </Row>
                    )
                  })}
                </div>}
            </div>
            : isRecruiter
              ? getCardContainer('Согласовать время для собеседования с клиентом')
              : getActionContainer('Собеседование с клиентом', {
                single: {
                  text: 'Указать кандидатов для собеседования',
                  action: () => meetingDialog.handleOpen()
                }
              })}
        </div>
      )
      default: return null
    }
  }

  if (_.get(logsData, 'loading')) {
    return <div className={classes.loader}>
      <Loader size={0.75}/>
    </div>
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.title}>
        <span>{t('Прогресс')}</span>
      </div>
      {status === APPLICATION_COMPLETED &&
            <div className={classNames(classes.completeWrapper, classes.completeDialog)}>
              <span>{t('Заявка закрыта')}</span>
            </div>}
      {isApprovedMeetings && status !== APPLICATION_COMPLETED && !isRecruiter && lastLogAction === 'approval' &&
            <div className={classes.completeDialog}>
              {openCompleteDialog
                ? <div className={classes.completeWrapper}>
                  <h2>{t('Выберите кандидатов')}</h2>
                  <div className={classes.closeComplete} onClick={() => { setOpenCompleteDialog(false) }}>
                    <CloseIcon color={COLOR_GREY}/>
                  </div>
                  <form className={classes.candidates}>
                    {_.map(_.filter(meetingData.list, 'isApprove'), (item) => {
                      const resume = _.get(item, ['resume', 'id'])
                      const fullName = _.get(item, ['resume', 'fullName'])
                      return (
                        <Row key={resume} className={classes.candidate}>
                          <Col xs={2}>
                            <Field
                              name={'candidates[' + resume + '][selected]'}
                              style={{margin: '0'}}
                              component={CheckBox}/>
                          </Col>
                          <Col xs={10}>{fullName}</Col>
                        </Row>
                      )
                    })}
                  </form>
                  <FlatButton
                    label={t('Завершить')}
                    backgroundColor={COLOR_GREEN}
                    hoverColor={COLOR_GREEN}
                    rippleColor={COLOR_WHITE}
                    style={flatButtonStyle}
                    labelStyle={actButton.label}
                    onClick={() => { setOpenConfirmCompleteDialog(true) }}
                    fullWidth
                  />
                </div>
                : getActionContainer('', {
                  single: {
                    text: 'Завершить',
                    action: () => { setOpenCompleteDialog(true) }
                  }
                })}
            </div>}
      <div className={classes.cardWrapper}>
        {getCardContainer('Ожидание отчета')}
        {_.map(logsList, (item) => {
          const id = _.get(item, 'id')
          const action = _.get(item, 'action')
          return getActionContent(action, id)
        })}
      </div>

      <ConfirmDialog
        type={'submit'}
        open={_.isObject(openConfirmMeetingDialog)}
        onClose={() => { setOpenConfirmMeetingDialog(false) }}
        onSubmit={() => {
          return updateMeetingDialog.handleConfirm(openConfirmMeetingDialog)
            .then(() => {
              return setOpenConfirmMeetingDialog(false)
            })
        }}
        message={'Подтвердить время для ' + openConfirmMeetingDialog.fullName + '?'}/>

      <ConfirmDialog
        type={'submit'}
        message={t('Вы уверены, что хотите завершить задание?')}
        open={openConfirmCompleteDialog}
        onClose={() => { setOpenConfirmCompleteDialog(false) }}
        onSubmit={() => {
          return confirmData.handleComplete()
            .then(() => {
              return setOpenConfirmCompleteDialog(false)
            })
        }}/>

      <ApplicationSendReportDialog
        open={openConfirmSendToClientDialog}
        onClose={() => { setOpenConfirmSendToClientDialog(false) }}
        onSubmit={() => {
          return handleChangeApplicationAction('sent_to_client')
            .then(() => {
              return setOpenConfirmSendToClientDialog(false)
            })
        }}
        initialValues={{email}}
      />
    </div>
  )
})

ApplicationDetailProgress.propTypes = {
  logsData: PropTypes.object.isRequired
}

ApplicationDetailProgress.defaultProps = {
  isRecruiter: false
}

export default ApplicationDetailProgress
