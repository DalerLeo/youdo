import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../../constants/routes'
import {reduxForm, Field} from 'redux-form'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import LinearProgress from '../../LinearProgress'
import ToolTip from '../../Utils/ToolTip'
import {
  TextFieldCustom,
  StaticUniversalSearchField,
  SphereSearchField,
  GenderSearchField
} from '../../ReduxForm'
import {Link} from 'react-router'
import {BORDER_STYLE, COLOR_GREY} from '../../../constants/styleConstants'
import {PROFILE_LANG, ACTIVITY_STATUS} from '../../../constants/backendConstants'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import AnnounceIcon from 'material-ui/svg-icons/action/announcement'
import ActivateIcon from 'material-ui/svg-icons/action/check-circle'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import BalanceIcon from 'material-ui/svg-icons/editor/attach-money'
import BlockIcon from 'material-ui/svg-icons/content/block'
import t from '../../../helpers/translate'
import NotFound from '../../Images/not-found.png'
import InlineCustomField from './InlineCustomField'

const enhance = compose(
  injectSheet({
    // DETAILS
    loader: {
      display: 'flex',
      alignItems: 'center',
      height: '100px',
      position: 'relative',
      width: '100%'
    },
    details: {
      boxShadow: '0 0 6px rgba(0, 0, 0, 0.15)',
      width: '100%'
    },
    detailTitle: {
      alignItems: 'center',
      borderBottom: BORDER_STYLE,
      display: 'flex',
      fontSize: '16px',
      fontWeight: '600',
      height: '65px',
      justifyContent: 'space-between',
      padding: '0 30px',
      position: 'relative'
    },
    closeDetail: {
      cursor: 'pointer',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '1'
    },
    detailContent: {
      lineHeight: '1.5',
      padding: '20px 30px'
    },
    actionButtons: {
      display: 'flex',
      zIndex: '2'
    },
    emptyQuery: {
      background: 'url(' + NotFound + ') no-repeat center 1px',
      backgroundSize: '155px',
      padding: '100px 40px 0px',
      textAlign: 'center',
      fontSize: '13px',
      color: '#666'
    },
    mainBlock: {
      display: 'flex'
    },

    image: {
      width: '230px',
      height: '165px',
      marginRight: '30px !important',
      position: 'relative',
      '& span:nth-child(4)': {
        position: 'relative',
        zIndex: '1'
      },
      '& span:nth-child(4):after': {
        background: 'rgba(0,0,0,0.35)',
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0'
      }
    },
    noImage: {
      background: '#f2f5f8',
      border: '1px #ccc dashed',
      color: '#999',
      fontSize: '11px !important',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      '& span': {
        fontSize: '11px !important',
        display: 'block',
        position: 'relative',
        height: 'auto !important',
        width: '90px !important',
        margin: '0 0 20px !important',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: '40px',
          left: '50%',
          background: '#999',
          width: '64px',
          height: '1px',
          marginLeft: '-32px'
        }
      }
    },
    detailData: {
      width: 'calc(100% - 230px)'
    },
    inputFieldCustom: {
      fontSize: '13px !important',
      height: '45px !important',
      width: '100% !important',
      marginTop: '7px',
      '& div': {
        fontSize: '13px !important'
      },
      '& label': {
        top: '20px !important',
        lineHeight: '5px !important'
      },
      '& input': {
        marginTop: '0 !important',
        width: '100% !important'
      }
    },
    nameTitle: {
      'display': 'flex',
      width: '240px',
      justifyContent: 'space-between',
      '& > div:first-child': {
        marginRight: '10px'
      }
    },
    labelName: {
      fontSize: '16px',
      zIndex: '2'
    }
  }),
  reduxForm({
    form: 'PlanUpdateForm',
    enableReinitialize: true
  })
)
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
const JobSearchDetails = enhance((props) => {
  const {
    filter,
    data,
    loading,
    classes,
    updateLoading,
    handleSubmitUpdateDialog,
    onDeleteOpen,
    onUpdateOpen
  } = props

  const lastName = _.get(data, 'lastName')
  const photo = _.get(data, ['photo', 'file'])
  const firstName = _.get(data, 'manager.fullName')

  const interestLevel = _.get(data, ['interestLevel'])
  const martialStatus = _.get(data, ['martialStatus'])
  const activityField = _.get(data, ['activityField', 'name'])
  const gender = _.get(data, ['gender'])
  const lang = _.get(data, ['profileLanguage'])
  if (loading) {
    return (
      <div className={classes.loader}>
        <LinearProgress/>
      </div>
    )
  }

  const actionButtons = (
    <div className={classes.actionButtons}>
      <ToolTip position="bottom" text={t('Отправить комментарии и отложить модерацию')}>
        <IconButton
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}>
          <AnnounceIcon />
        </IconButton>
      </ToolTip>
      <ToolTip position="bottom" text={t('Пополнить баланс')}>
        <IconButton
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}>
          <BalanceIcon />
        </IconButton>
      </ToolTip>
      <ToolTip position="bottom" text={t('Изменить')}>
        <IconButton
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          onClick={onUpdateOpen}
          touch={true}>
          <Edit />
        </IconButton>
      </ToolTip>
      <ToolTip position="bottom" text={t('Удалить')}>
        <IconButton
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}
          onClick={onDeleteOpen}>
          <DeleteIcon />
        </IconButton>
      </ToolTip>
      {_.get(data, 'status') === 'active' &&
      <ToolTip position="bottom" text={t('Заблокировать')}>
        <IconButton
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}>
          <BlockIcon />
        </IconButton>
      </ToolTip>}
      {_.get(data, 'status') === 'blocked' &&
      <ToolTip position="bottom" text={t('Активировать')}>
        <IconButton
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}>
          <ActivateIcon />
        </IconButton>
      </ToolTip>}
    </div>
  )
  return (
    <div
      className={classes.details}>
      <div className={classes.content}>
        <div className={classes.detailTitle}>
          <Link to={{
            pathname: ROUTES.PLAN_LIST_URL,
            query: filter.getParams()
          }} className={classes.closeDetail}/>
          <span>{firstName} {lastName}</span>
          {actionButtons}
        </div>
        <div className={classes.detailContent}>
          <div className={classes.mainBlock}>
            <div className={classes.image}>
              {!photo ? <div className={classes.noImage}>
                <div>
                  <span>{t('Фото не отсутствует')}</span>
                  <a
                    onClick={() => {
                    // .updateDialog.handleOpenUpdateDialog(detId)
                    }}
                  >{t('добавить фото')}</a>
                </div>
              </div>
                : <div className={classes.imageWrapper}>
                  <span className={classes.firstImage}>
                    <img src={photo} alt=""/>
                  </span>
                </div>}
            </div>
            <div className={classes.detailData}>
              <div>
                <InlineCustomField
                  loading={updateLoading}
                  label={<span>{firstName} {lastName}</span>}
                  wrapperClass={classes.nameTitle}
                  labelClass={classes.labelName}
                  updateAction={handleSubmitUpdateDialog}>
                  <Field
                    name={'firstName'}
                    className={classes.inputFieldCustom}
                    component={TextFieldCustom}
                    defaultValue={firstName}
                    label={t('Имя')}
                    fullWidth
                  />
                  <Field
                    name={'lastName'}
                    className={classes.inputFieldCustom}
                    component={TextFieldCustom}
                    defaultValue={lastName}
                    label={t('Фамилия')}
                    fullWidth
                  />
                </InlineCustomField>
              </div>
              <div>
                <InlineCustomField
                  loading={updateLoading}
                  label={activityField}
                  updateAction={handleSubmitUpdateDialog}>
                  <Field
                    name={'activityField'}
                    className={classes.inputFieldCustom}
                    component={SphereSearchField}
                    defaultValue={activityField}
                    label={t('Сфера')}
                    fullWidth
                  />
                </InlineCustomField>
                <InlineCustomField
                  loading={updateLoading}
                  label={martialStatus}
                  updateAction={handleSubmitUpdateDialog}>
                  <Field
                    name={'activityField'}
                    className={classes.inputFieldCustom}
                    component={SphereSearchField}
                    defaultValue={activityField}
                    label={t('Сфера')}
                    fullWidth
                  />
                </InlineCustomField>
                <InlineCustomField
                  loading={updateLoading}
                  label={gender}
                  updateAction={handleSubmitUpdateDialog}>
                  <Field
                    name={'gender'}
                    className={classes.inputFieldCustom}
                    component={GenderSearchField}
                    defaultValue={gender}
                    label={t('Пол')}
                    fullWidth
                  />
                </InlineCustomField>
                <InlineCustomField
                  loading={updateLoading}
                  label={interestLevel}
                  updateAction={handleSubmitUpdateDialog}>
                  <Field
                    name='interestLevel'
                    className={classes.inputFieldCustom}
                    component={StaticUniversalSearchField}
                    items={ACTIVITY_STATUS}
                    defaultValue={interestLevel}
                    label={t('Заинтерисованность')}
                    fullWidth
                  />
                </InlineCustomField>
                <InlineCustomField
                  loading={updateLoading}
                  label={lang}
                  updateAction={handleSubmitUpdateDialog}>
                  <Field
                    name={'profileLanguage'}
                    defaultValue={{value: lang}}
                    className={classes.inputFieldCustom}
                    component={StaticUniversalSearchField}
                    items={PROFILE_LANG}
                    label={t('Язык профиля')}
                    fullWidth
                  />
                </InlineCustomField>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

JobSearchDetails.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.object
}

export default JobSearchDetails
