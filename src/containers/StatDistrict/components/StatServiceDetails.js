import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import * as ROUTES from '../../../constants/routes'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import LinearProgress from '../../../components/LinearProgress'
import ToolTip from '../../../components/Utils/ToolTip'
import {BORDER_STYLE, COLOR_GREY} from '../../../constants/styleConstants'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import ActivateIcon from 'material-ui/svg-icons/action/check-circle'
import BlockIcon from 'material-ui/svg-icons/content/block'
import t from '../../../helpers/translate'
import EmptyQuery from '../../../components/Utils/EmptyQuery'
import {Col, Row} from 'react-flexbox-grid'
import numberFormat from '../../../helpers/numberFormat'
import dateFormat from '../../../helpers/dateFormat'

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
      display: 'flex',
      lineHeight: '1.5',
      paddingLeft: '30px'
    },
    actionButtons: {
      display: 'flex',
      zIndex: '2'
    },
    mainBlock: {
      padding: '20px 0',
      display: 'flex',
      width: '380px',
      borderRight: '1px solid #efefef',
      paddingRight: '20px'
    },

    image: {
      width: '140px',
      height: '130px',
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
      width: 'calc(100%)'
    },
    detailsBlock: {
      width: 'calc(100% - 380px)',
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
            //            Display: 'none'
          }
        }
      }
    },
    bodyTitle: {
      fontWeight: '600',
      lineHeight: '2',
      '&:first-child': {
        marginTop: '0'
      },
      '& span': {
        fontWeight: 'normal'
      }
    },
    tab: {
      marginBottom: '0',
      width: '100%',
      '& button': {
        height: '40px'
      },
      '& > div': {
        background: 'transparent !important'
      },
      '& > div:first-child': {
        borderBottom: '1px #f2f5f8 solid'
      },
      '& > div:last-child': {
        width: '100% !important',
        padding: '0'
      }
    },
    tabBody: {
      padding: '10px 30px'
    },
    tasks: {
      '& > div:first-child': {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
    }
  }),
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
const StatServiceDetails = enhance((props) => {
  const {
    filter,
    data,
    loading,
    classes,
    onUpdateOpen,
    onDeleteOpen
  } = props

  const fullName = _.get(data, 'customer.fullName')
  const master = _.get(data, 'master.fullName')
  const services = _.get(data, 'orderService')
  const masterNumber = _.get(data, 'master.phoneNumber')
  const totalPrice = numberFormat(_.get(data, 'totalPrice'), 'сум')
  const createdDate = dateFormat(_.get(data, 'createdDate'))
  const phoneNumber = _.get(data, 'customer.phoneNumber')
  if (loading) {
    return (
      <div className={classes.loader}>
        <LinearProgress/>
      </div>
    )
  }

  const actionButtons = (
    <div className={classes.actionButtons}>
      <ToolTip position="bottom" text={t('Изменить пароль')}>
        <IconButton
          onClick={onUpdateOpen}
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}>
          <EditIcon/>
        </IconButton>
      </ToolTip>
      <ToolTip position="bottom" text={t('Удалить')}>
        <IconButton
          onClick={onDeleteOpen}
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}>
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
            pathname: ROUTES.ORDER_LIST_URL,
            query: filter.getParams()
          }} className={classes.closeDetail}/>
          <span>{fullName}</span>
          {actionButtons}
        </div>
        <div className={classes.detailContent}>
          <div className={classes.mainBlock}>
            <div className={classes.detailData}>
              <div className={classes.bodyTitle}>{t('Клиент')} <span>{fullName}</span></div>
              <div className={classes.bodyTitle}>{t('Тел. клиента')}: <span>{phoneNumber}</span></div>
              <div className={classes.bodyTitle}>{t('Мастер')} {master}</div>
              <div className={classes.bodyTitle}>{t('Тел. мастера')}: <span>{masterNumber}</span></div>
            </div>
          </div>
          <div className={classes.detailsBlock}>
            <div className={classes.tabBody}>
              <Row className={classes.bodyTitle} style={{borderBottom: '1px #efefef solid'}}>
                <Col xs={4} style={{lineHeight: '2'}}>{t('Услуга')}</Col>
                <Col xs={3} style={{lineHeight: '2', textAlign: 'right'}}>{t('Цена')}</Col>
                <Col xs={2} style={{lineHeight: '2', textAlign: 'right'}}>{t('Kol-vo')}</Col>
                <Col xs={3} style={{lineHeight: '2', textAlign: 'right'}}>{t('Дата')}</Col>
              </Row>
              <EmptyQuery size={'100'} list={services} loading={loading}/>
              {!_.isEmpty(services) &&
              <React.Fragment>
                {_.map(services, (item) => {
                  const cId = _.get(item, 'id')
                  return (
                    <Row key={cId} className={classes.tasks + ' dottedList'}>
                      <Col xs={4}>{_.get(item, 'service.name')}</Col>
                      <Col xs={3} style={{textAlign: 'right'}}>{numberFormat(item.price, 'сум')}</Col>
                      <Col xs={2} style={{textAlign: 'right'}}>{numberFormat(item.amount)}</Col>
                      <Col xs={3} style={{textAlign: 'right'}}>{createdDate}</Col>
                    </Row>
                  )
                })}
                <div style={{textAlign: 'right', fontWeight: '600', marginTop: '15px'}}>Сумма: {totalPrice}</div>
              </React.Fragment>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

StatServiceDetails.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.object
}

export default StatServiceDetails
