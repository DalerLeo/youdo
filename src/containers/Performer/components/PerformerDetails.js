import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import * as ROUTES from '../../../constants/routes'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import LinearProgress from '../../../components/LinearProgress'
import ToolTip from '../../../components/Utils/ToolTip'
import {Tab, Tabs} from 'material-ui/Tabs'
import {BORDER_STYLE, COLOR_GREY} from '../../../constants/styleConstants'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import AnnounceIcon from 'material-ui/svg-icons/action/announcement'
import EditPasswordIcon from 'material-ui/svg-icons/editor/mode-edit'
import BalanceIcon from 'material-ui/svg-icons/editor/attach-money'
import t from '../../../helpers/translate'
import numberFormat from '../../../helpers/numberFormat'
import EmptyQuery from '../../../components/Utils/EmptyQuery'
import {Col, Row} from 'react-flexbox-grid'

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
      width: '400px',
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
      width: 'calc(100% - 230px)'
    },
    detailsBlock: {
      width: 'calc(100% - 400px)',
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
  withState('tab', 'setTab', 'info')
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
const order = [1, 2]
const PerformerDetails = enhance((props) => {
  const {
    filter,
    data,
    loading,
    classes,
    updateLoading,
    onUpdateOpen,
    onDeleteOpen,
    tab,
    setTab
  } = props

  const photo = _.get(data, ['photo', 'file'])
  const fullName = _.get(data, 'fullName')

  const city = _.get(data, 'city')
  const numberPassport = _.get(data, 'numberPassport')
  const email = _.get(data, 'email')
  const phoneNumber = _.get(data, 'phoneNumber')
  const district = _.get(data, 'livingPlace.name')
  const balance = numberFormat(_.get(data, 'balance'))
  if (loading) {
    return (
      <div className={classes.loader}>
        <LinearProgress/>
      </div>
    )
  }

  const actionButtons = (
    <div className={classes.actionButtons}>
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
          onClick={onUpdateOpen}
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}>
          <EditPasswordIcon />
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
    </div>
  )
  return (
    <div
      className={classes.details}>
      <div className={classes.content}>
        <div className={classes.detailTitle}>
          <Link to={{
            pathname: ROUTES.APPLICANT_LIST_URL,
            query: filter.getParams()
          }} className={classes.closeDetail}/>
          <span>{fullName}</span>
          {actionButtons}
        </div>
        <div className={classes.detailContent}>
          <div className={classes.mainBlock}>
            <div className={classes.image}>
              {!photo ? <div className={classes.noImage}>
                <div>
                  <span>{t('Фото не отсутствует')}</span>
                </div>
              </div>
                : <div className={classes.imageWrapper}>
                  <span className={classes.firstImage}>
                    <img src={photo} alt=""/>
                  </span>
                </div>}
            </div>
            <div className={classes.detailData}>
              <div className={classes.bodyTitle}>{t('Тель')}: <span>{phoneNumber}</span></div>
              <div className={classes.bodyTitle}>{t('Email')}: <span>{email}</span></div>
              <div className={classes.bodyTitle}>{t('Пасспорт №')}: <span>{numberPassport}</span></div>
              <div className={classes.bodyTitle}>{t('Район')}: <span>{district}</span></div>
              <div className={classes.bodyTitle}>{t('Балансе')}: <span>{balance}</span></div>
            </div>
          </div>
          <div className={classes.detailsBlock}>
            <Tabs
              value={tab}
              className={classes.tab}
              inkBarStyle={{background: '#12aaeb', marginTop: '-2px', height: '2px'}}
              onChange={(value) => setTab(value)}>
              <Tab label="О себе" value="info">
                <div className={classes.tabBody}>
                  <div>
                    Lorem Ipsum is simply dummy text of the printing
                    and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic
                  </div>
                </div>
              </Tab>
              <Tab value={'docs'} label={'Задачи'}>
                <div className={classes.tabBody}>
                  <Row className={classes.bodyTitle} style={{borderBottom: '1px #efefef solid'}}>
                    <Col xs={7} style={{lineHeight: '2'}}>{t('Задача')}</Col>
                    <Col xs={3} style={{lineHeight: '2', textAlign: 'right'}}>{t('Дата')}</Col>
                    <Col xs={2} style={{lineHeight: '2', textAlign: 'right'}}>{t('Статус')}</Col>
                  </Row>
                  <EmptyQuery list={order} />
                  {!_.isEmpty(order) && _.map(order, (item) => {
                    const cId = _.get(item, 'id')
                    return (
                      <Row key={cId} className={classes.tasks + ' dottedList'}>
                        <Col xs={7}>
                          Lorem Ipsum is simply dummy text of the printing and typeset
                          <Link to={{pathname: 'order/' + cId, query: {ids: cId}}}>
                          </Link>
                        </Col>
                        <Col xs={3} style={{textAlign: 'right'}}>Dec 16 2018</Col>
                        <Col xs={2} style={{textAlign: 'right'}}>cancelled</Col>
                      </Row>
                    )
                  })}
                </div>
              </Tab>
              <Tab value={'history'} label={'Баланс'}>
                <div className={classes.tabBody}>
                  <Row className={classes.bodyTitle} style={{borderBottom: '1px #efefef solid'}}>
                    <Col xs={8} style={{lineHeight: '2'}}>{t('Сумма')}</Col>
                    <Col xs={4} style={{lineHeight: '2', textAlign: 'right'}}>{t('Дата')}</Col>
                  </Row>
                  <EmptyQuery list={order} />
                  {!_.isEmpty(order) && _.map(order, (item) => {
                    const cId = _.get(item, 'id')
                    return (
                      <Row key={cId} className={classes.tasks + ' dottedList'}>
                        <Col xs={8}>
                          200 000 UZS
                          <Link to={{pathname: 'order/' + cId, query: {ids: cId}}}>
                          </Link>
                        </Col>
                        <Col xs={4} style={{textAlign: 'right'}}>Dec 16 2018</Col>
                      </Row>
                    )
                  })}
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
})

PerformerDetails.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.object
}

export default PerformerDetails
