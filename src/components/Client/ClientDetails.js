import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../LinearProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import {Row, Col} from 'react-flexbox-grid'
import ToolTip from '../Utils/ToolTip'
import dateFormat from '../../helpers/dateFormat'
import Blacklist from 'material-ui/svg-icons/alert/warning'
import t from '../../helpers/translate'
import {BORDER_STYLE, PADDING_STANDART} from '../../constants/styleConstants'
const colorBlue = '#12aaeb !important'
const enhance = compose(
  injectSheet({
    dottedList: {
      padding: '20px 0'
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
    loader: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '65px',
      padding: '0 30px',
      borderBottom: BORDER_STYLE,
      position: 'relative'
    },
    blacklistTitle: {
      extend: 'title',
      borderLeft: '3px #ff4747 solid'
    },
    container: {
      display: 'flex',
      width: '100%'
    },
    sphere: {
      borderTop: BORDER_STYLE,
      padding: PADDING_STANDART,
      width: '100%'
    },
    sides: {
      flexBasis: '27%'
    },
    leftSide: {
      extend: 'sides',
      borderRight: BORDER_STYLE,
      padding: '20px 30px'
    },
    rightSide: {
      extend: 'sides',
      borderLeft: BORDER_STYLE,
      padding: '20px 30px'
    },
    body: {
      flexBasis: '66%',
      padding: PADDING_STANDART,
      '& .dottedList': {
        padding: '10px 0',
        '&:after': {
          left: '0.5rem',
          right: '0.5rem'
        },
        '&:first-child': {
          padding: '0 0 10px'
        },
        '&:last-child': {
          padding: '10px 0 0',
          '&:after': {
            display: 'none'
          }
        }
      }
    },
    titleLabel: {
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer'
    },
    titleButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      position: 'absolute',
      right: '30px'
    },
    bodyTitle: {
      fontWeight: '600',
      marginTop: '5px',
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
    }
  }),
  withState('openDetails', 'setOpenDetails', false)
)

const ClientDetails = enhance((props) => {
  const {classes,
    loading,
    data,
    updateDialog,
    confirmDialog,
    handleCloseDetail
  } = props
  const detId = _.get(data, 'id')
  const contacts = _.get(data, 'contacts')
  const date = dateFormat(_.get(data, 'createdDate'))
  const inBlacklist = _.get(data, 'inBlacklist')
  const address = _.get(data, 'address') || 'Не указан'
  const sphere = _.get(data, 'sphere')
  const providerName = _.get(data, 'name')

  if (loading) {
    return (
      <div className={classes.loader}>
        <div>
          <LinearProgress/>
        </div>
      </div>
    )
  }

  const iconStyle = {
    icon: {
      color: '#666',
      width: 22,
      height: 22
    },
    blacklist: {
      color: '#ff4747',
      width: 22,
      height: 22,
      position: 'relative',
      top: '2px'
    },
    button: {
      width: 48,
      height: 48,
      padding: 0,
      zIndex: 2
    }
  }

  return (
    <div className={classes.wrapper} key={detId}>
      <div className={inBlacklist ? classes.blacklistTitle : classes.title}>
        <div className={classes.titleLabel}>{providerName}</div>
        {inBlacklist &&
                <ToolTip position="right" text={t('Клиент в черном списке')}>
                  <IconButton
                    disableTouchRipple={true}
                    iconStyle={iconStyle.blacklist}
                    style={iconStyle.button}
                    touch={true}>
                    <Blacklist/>
                  </IconButton>
                </ToolTip>}
        <div className={classes.closeDetail}
          onClick={handleCloseDetail}>
        </div>
        <div className={classes.titleButtons}>
          <ToolTip position="bottom" text={t('Изменить')}>
            <IconButton
              iconStyle={iconStyle.icon}
              style={iconStyle.button}
              touch={true}
              onClick={ () => { updateDialog.handleOpenUpdateDialog(detId) }}>
              <Edit />
            </IconButton>
          </ToolTip>
          <ToolTip position="bottom" text={t('Удалить')}>
            <IconButton
              iconStyle={iconStyle.icon}
              style={iconStyle.button}
              touch={true}
              onClick={confirmDialog.handleOpenConfirmDialog}>
              <Delete />
            </IconButton>
          </ToolTip>
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.leftSide}>
          <div className={classes.bodyTitle}>{t('Адрес')}:</div>
          <div>{address}</div>
        </div>
        <div className={classes.body}>
          <div className={classes.bodyTitle}>{t('Контакты')}</div>
          <div>
            {_.map(contacts, (item) => {
              const name = _.get(item, 'name')
              const phone = _.get(item, 'telephone') || t('Не указан')
              const email = _.get(item, 'email') || t('Не указан')
              return (
                <Row key={item.id} className="dottedList">
                  <Col xs={4}><span>{t('Имя')}:</span> <br/>{name}</Col>
                  <Col xs={4}><span>{t('Email')}:</span> <br/>{email}</Col>
                  <Col xs={4}><span>{t('Телефон')}:</span> <br/>{phone}</Col>
                </Row>
              )
            })}
          </div>
        </div>
        <div className={classes.rightSide}>
          <div className={classes.bodyTitle}>{t('Дата добавления')}</div>
          <div>{date}</div>
        </div>
      </div>
      {sphere &&
            <div className={classes.container}>
              <div className={classes.sphere}>
                <div className={classes.bodyTitle}>{t('Сфера деятельности')}</div>
                <div>{sphere}</div>
              </div>
            </div>}
    </div>
  )
})

ClientDetails.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  detailData: PropTypes.object,
  updateDialog: PropTypes.shape({
    updateLoading: PropTypes.bool.isRequired,
    openUpdateDialog: PropTypes.bool.isRequired,
    handleOpenUpdateDialog: PropTypes.func.isRequired,
    handleCloseUpdateDialog: PropTypes.func.isRequired,
    handleSubmitUpdateDialog: PropTypes.func.isRequired
  }).isRequired,
  confirmDialog: PropTypes.shape({
    openConfirmDialog: PropTypes.bool.isRequired,
    handleOpenConfirmDialog: PropTypes.func.isRequired,
    handleCloseConfirmDialog: PropTypes.func.isRequired,
    handleSendConfirmDialog: PropTypes.func.isRequired
  }).isRequired
}

export default ClientDetails
