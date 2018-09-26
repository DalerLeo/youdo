import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {Row, Col} from 'react-flexbox-grid'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import {Field, reduxForm} from 'redux-form'
import {CheckBox} from '../../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import t from '../../../helpers/translate'
import {BORDER_STYLE, COLOR_BLUE_GREY} from '../../../constants/styleConstants'
import InputMask from 'react-input-mask'
import moment from 'moment'
import classNames from 'classnames'
import {connect} from 'react-redux'

const Input = ({input, ...defaultProps}) => {
  const props = {}
  _.map(defaultProps, (obj, index) => {
    if (index !== 'meta' && index !== 'sheet') {
      props[index] = obj
    }
  })
  return (
    <InputMask mask="99/99/9999 99:99" {...props} {...input}/>
  )
}

const enhance = compose(
  injectSheet({
    dialog: {
      overflowY: 'auto'
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
      color: '#333',
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
    inContent: {
      padding: '20px 30px',
      color: '#333'
    },
    text: {
      marginBottom: '15px'
    },
    rowItem: {
      padding: '5px 0',
      minHeight: '48px',
      '&:last-child:after': {
        display: 'none'
      }
    },
    rowItemFirst: {
      fontWeight: '600',
      '& > div:last-child': {
        textAlign: 'right'
      }
    },
    form: {
      position: 'relative'
    },
    field: {
      width: '100%'
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
    inputMaskWrapper: {
      position: 'relative',
      textAlign: 'right',
      marginLeft: 'auto',
      width: '125px',
      '&:after': {
        background: COLOR_BLUE_GREY,
        content: '""',
        position: 'absolute',
        left: '0',
        right: '0',
        bottom: '0',
        height: '2px',
        transform: 'scaleX(0)',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
      }
    },
    focused: {
      '&:after': {
        transform: 'scaleX(1)'
      }
    },
    inputFieldMask: {
      border: 'none',
      borderBottom: '1px #ccc solid',
      fontFamily: 'inherit',
      outline: 'none',
      height: '35px',
      lineHeight: '35px',
      textAlign: 'right',
      position: 'relative',
      width: '100%',
      '&:disabled': {
        background: 'inherit',
        borderBottom: '2px #ccc dotted',
        cursor: 'not-allowed'
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
    actionButton: {
      fontSize: '13px !important',
      margin: '0 !important'
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
      textAlign: 'center',
      display: ({loading}) => loading ? 'flex' : 'none'
    },
    listLoader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '25px 0',
      width: '100%'
    }
  }),
  connect((state) => {
    const fields = _.get(state, ['form', 'ApplicationMeetingForm', 'values', 'resumes'])
    return {
      fields
    }
  }),
  reduxForm({
    form: 'ApplicationMeetingForm',
    enableReinitialize: true
  }),
  withState('currentFocused', 'updateFocus', null)
)

const ApplicationMeetingDialog = enhance((props) => {
  const {
    open,
    loading,
    handleSubmit,
    onClose,
    isUpdate,
    classes,
    reportData,
    fields,
    resume,
    currentFocused,
    updateFocus
  } = props
  const onSubmit = handleSubmit(() => props.onSubmit())

  const selectedResumes = _.filter(_.map(fields, (item, index) => {
    const selected = _.get(item, 'selected')
    return selected ? _.toInteger(index) : null
  }), (item) => !_.isNull(item))

  const updatingResume = _.filter(reportData.list, {id: resume})
  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialog}
      contentStyle={loading ? {width: '600px'} : {width: '600px'}}
      bodyStyle={{minHeight: 'auto'}}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{isUpdate ? t('Изменить время собеседования') : t('Назначить собеседование')}</span>
        <IconButton onClick={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      <div className={classes.bodyContent}>
        <form onSubmit={onSubmit} className={classes.form}>
          <div className={classes.loader}>
            <Loader size={0.75}/>
          </div>
          <div className={classes.inContent}>
            <div className={classes.text}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cupiditate deleniti
                            eaque earum eum impedit natus quia, veritatis. Laborum, tenetur!</div>
            {reportData.loading
              ? <div className={classes.listLoader}>
                <Loader size={0.75}/>
              </div>
              : <div className={classes.resumeWrapper}>
                <Row className={classNames('dottedList', classes.rowItem, classes.rowItemFirst)}>
                  {!isUpdate && <Col xs={2}/>}
                  <Col xs={6}>{t('Ф.И.О.')}</Col>
                  <Col xs={isUpdate ? Number('6') : Number('4')}>{t('Дата и время')}</Col>
                </Row>
                {_.map(isUpdate ? updatingResume : _.get(reportData, 'list'), (item) => {
                  const id = _.get(item, 'id')
                  const fullName = _.get(item, 'fullName')
                  const checked = _.includes(selectedResumes, id)
                  return (
                    <Row key={id} className={classNames('dottedList', classes.rowItem)}>
                      {!isUpdate &&
                                            <Col xs={2}>
                                              <Field
                                                name={'resumes[' + id + '][selected]'}
                                                component={CheckBox}/>
                                            </Col>}
                      <Col xs={6}>{fullName}</Col>
                      <Col xs={isUpdate ? Number('6') : Number('4')}>
                        <div className={classNames(classes.inputMaskWrapper, {
                          [classes.focused]: currentFocused === id
                        })}>
                          <Field
                            name={'resumes[' + id + '][datetime]'}
                            component={Input}
                            disabled={!isUpdate && !checked}
                            className={classes.inputFieldMask}
                            onFocus={() => { updateFocus(id) }}
                            onBlur={() => { updateFocus(null) }}
                            placeholder={moment().format('DD/MM/YYYY HH:mm')}
                          />
                        </div>
                      </Col>
                    </Row>
                  )
                })}
              </div>}
          </div>
          <div className={classes.bottomButton}>
            <FlatButton
              label={t('Сохранить')}
              labelStyle={{fontSize: '13px'}}
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

ApplicationMeetingDialog.propTyeps = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

ApplicationMeetingDialog.defaultProps = {
  isUpdate: false
}

export default ApplicationMeetingDialog
