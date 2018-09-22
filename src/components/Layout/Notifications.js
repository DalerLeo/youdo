import _ from 'lodash'
import moment from 'moment'
import filterHelper from '../../helpers/filter'
import {formattedType} from '../../constants/notificationTypes'
import {
  compose,
  withState,
  withHandlers,
  withPropsOnChange
} from 'recompose'
import React from 'react'
import injectSheet from 'react-jss'
import {connect} from 'react-redux'
import ConfirmDialog from '../ConfirmDialog'
import IconButton from 'material-ui/IconButton'
import Drawer from 'material-ui/Drawer'
import Clear from 'material-ui/svg-icons/action/delete'
import Close from 'material-ui/svg-icons/content/clear'
import SupplyAccept from 'material-ui/svg-icons/content/archive'
import OrderReady from 'material-ui/svg-icons/social/whatshot'
import OrderRequest from 'material-ui/svg-icons/device/access-time'
import GoodsDemand from 'material-ui/svg-icons/alert/warning'
import OrderDelivered from 'material-ui/svg-icons/action/assignment-turned-in'
import DefaultNotificationIcon from 'material-ui/svg-icons/social/notifications-none'
import Loader from '../Loader'
import {
  notificationListFetchAction,
  notificationDeleteAction
} from '../../actions/notifications'
import {openSnackbarAction} from '../../actions/snackbar'
import Notifications from '../Images/Notification.png'
import InfiniteScroll from 'react-infinite-scroller'
import t from '../../helpers/translate'
import classNames from 'classnames'
import {COLOR_YELLOW} from '../../constants/styleConstants'

const iconStyle = {
  icon: {
    color: '#fff',
    width: 22,
    height: 22
  },
  button: {
    width: 48,
    height: 48,
    padding: 0,
    zIndex: 2
  },
  buttonClose: {
    width: 36,
    height: 36,
    padding: 7,
    zIndex: 2
  }
}
const moneyIcon = '#8dc572'
const balanceIcon = '#4db6ac'
const supplyIcon = '#f0ad4e'
const stockIcon = '#e57373'
const ZERO = 0
const ONE = 1
const TWO = 2

const enhance = compose(
  connect((state, props) => {
    const query = _.get(props, ['location', 'query'])
    const pathname = _.get(props, ['location', 'pathname'])
    const filter = filterHelper(pathname, query)
    const notificationsList = _.get(state, ['notifications', 'list', 'data'])
    const notificationsLoading = _.get(state, ['notifications', 'list', 'loading'])

    return {
      filter,
      notificationsList,
      notificationsLoading
    }
  }),
  withState('openConfirmDialog', 'setOpenConfirmDialog', false),
  withState('notificationId', 'setNotificationId', null),
  withState('clickNotifications', 'setClickNotifications', null),
  withState('defaultPage', 'updateDefaultPage', TWO),
  withState('list', 'updateList', null),

  withPropsOnChange((props, nextProps) => {
    const prevLoading = _.get(props, 'notificationsLoading')
    const nextLoading = _.get(nextProps, 'notificationsLoading')
    return prevLoading !== nextLoading && nextLoading === false
  }, ({list, notificationsList, updateList}) => {
    Promise.resolve('aaa')
      .then(() => {
        updateList(_.union(list, _.get(notificationsList, 'results')))
      })
  }),

  withHandlers({
    handleOpenConfirmDialog: props => (id) => {
      const {setOpenConfirmDialog, setNotificationId} = props
      setOpenConfirmDialog(true)
      setNotificationId(id)
    },
    handleCloseConfirmDialog: props => () => {
      const {setOpenConfirmDialog} = props
      setOpenConfirmDialog(false)
    },
    handleSendConfirmDialog: props => () => {
      const {dispatch, setOpenConfirmDialog, notificationId, list, updateList} = props
      dispatch(notificationDeleteAction(notificationId))
        .then(() => {
          setOpenConfirmDialog(false)
          const removedList = _.remove(list, (item) => {
            return _.get(item, 'id') === notificationId
          })
          updateList(_.differenceBy(list, removedList, 'id'))
        })
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
        })
        .catch(() => {
          return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
        })
    }
  }),
  injectSheet({
    loader: {
      padding: '100px 0'
    },
    header: {
      borderBottom: '1px #efefef solid',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 15px 10px 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    notifBody: {
      overflowY: 'auto',
      height: 'calc(100% - 65px)'
    },
    notif: {
      color: '#333 !important',
      padding: '10px 10px 10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px #efefef solid',
      cursor: 'pointer',
      position: 'relative',
      '&:hover': {
        opacity: '1 !important'
      }
    },
    link: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0'
    },
    notifIcon: {
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '20.78px',
      backgroundColor: COLOR_YELLOW,
      margin: '10.39px 0',
      '&:before': {
        content: '""',
        position: 'absolute',
        width: '0',
        borderLeft: '18px solid transparent',
        borderRight: '18px solid transparent',
        bottom: '100%',
        left: '0',
        borderBottom: '10.39px solid ' + COLOR_YELLOW
      },
      '&:after': {
        content: '""',
        position: 'absolute',
        width: '0',
        borderLeft: '18px solid transparent',
        borderRight: '18px solid transparent',
        top: '100%',
        left: '0',
        borderTop: '10.39px solid ' + COLOR_YELLOW
      },
      '& svg': {
        width: '17px !important',
        height: '17px !important',
        color: '#fff !important'
      }
    },
    order: {
      backgroundColor: moneyIcon,
      '&:before': {
        borderBottomColor: moneyIcon
      },
      '&:after': {
        borderTopColor: moneyIcon
      }
    },
    balance: {
      backgroundColor: balanceIcon,
      '&:before': {
        borderBottomColor: balanceIcon
      },
      '&:after': {
        borderTopColor: balanceIcon
      }
    },
    supply: {
      backgroundColor: supplyIcon,
      '&:before': {
        borderBottomColor: supplyIcon
      },
      '&:after': {
        borderTopColor: supplyIcon
      }
    },
    stock: {
      backgroundColor: stockIcon,
      '&:before': {
        borderBottomColor: stockIcon
      },
      '&:after': {
        borderTopColor: stockIcon
      }
    },
    notifContent: {
      flexBasis: '250px'
    },
    notificationText: {
      display: '-webkit-box',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    notificationTextExpanded: {
      display: 'block'
    },
    notifTitle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontWeight: '600',
      marginBottom: '5px',
      '& span': {
        fontSize: '11px !important',
        fontWeight: 'normal',
        color: '#999'
      }
    },
    loading: {
      textAlign: 'center !important',
      top: '40% !important',
      position: 'relative !important'
    },
    listLoader: {
      alignItems: 'baseline',
      position: 'absolute',
      top: '65px',
      bottom: '0',
      padding: '100px 0',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      background: '#fff',
      zIndex: '5'
    },
    emptyQuery: {
      background: 'url(' + Notifications + ') no-repeat center 30px',
      backgroundSize: '105px',
      padding: '160px 0 20px',
      textAlign: 'center',
      color: '#999',
      fontWeight: 'bold'
    },
    overlay: {
      position: 'fixed',
      height: '100%',
      width: '100%',
      top: '0',
      left: '0',
      opacity: '1',
      backgroundColor: 'rgba(0, 0, 0, 0.54)',
      willChange: 'opacity',
      transform: 'translateZ(0px)',
      transition: 'left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      zIndex: '1200',
      pointerEvents: 'auto'
    }
  })
)

const Layout = enhance((props) => {
  const {
    classes,
    dispatch,
    notificationId,
    openNotifications,
    clickNotifications,
    setClickNotifications,
    notificationsList,
    defaultPage,
    updateDefaultPage,
    loading,
    notificationsLoading,
    list
  } = props

  const notificationData = {
    open: props.openConfirmDialog,
    notificationsId: props.notificationsId,
    handleOpenConfirmDialog: props.handleOpenConfirmDialog,
    handleCloseConfirmDialog: props.handleCloseConfirmDialog,
    handleSendConfirmDialog: props.handleSendConfirmDialog,
    handleOpenNotificationBar: props.handleOpenNotificationBar
  }
  const uniqList = _.uniqBy(list, 'id')
  const notificationsCount = _.get(notificationsList, 'count')
  const currentListCount = _.get(uniqList, 'length')
  const notificationListExp = _.map(uniqList, (item) => {
    const id = _.get(item, 'id')
    const title = formattedType[_.get(item, ['template', 'name'])]
    const text = _.get(item, 'text')
    const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY HH:mm')
    const viewed = _.get(item, 'viewed')
    const template = _.get(item, ['template', 'name'])
    const getIcon = () => {
      switch (template) {
        case 'supply_accepted': return <div className={classNames(classes.notifIcon, classes.supply)}><SupplyAccept/></div>
        case 'order_ready': return <div className={classNames(classes.notifIcon, classes.order)}><OrderReady/></div>
        case 'order_delivered': return <div className={classNames(classes.notifIcon, classes.order)}><OrderDelivered/></div>
        case 'order_request': return <div className={classNames(classes.notifIcon, classes.order)}><OrderRequest/></div>
        case 'goods_on_demand': return <div className={classNames(classes.notifIcon, classes.stock)}><GoodsDemand/></div>
        default: return <div className={classes.notifIcon}><DefaultNotificationIcon/></div>
      }
    }

    return (
      <div key={id} className={classes.notif}
        onMouseEnter={() => {
          setClickNotifications(id)
        }}
        onMouseLeave={() => {
          setClickNotifications(null)
        }}
        style={viewed ? {opacity: '0.5'} : {opacity: '1'}}>
        {getIcon()}
        <div className={classes.notifContent}>
          <div className={classes.notifTitle}>
            <div>{title}</div>
            <span>{createdDate}</span>
          </div>
          <div className={id === clickNotifications
            ? classes.notificationTextExpanded
            : classes.notificationText}>
            {text}
          </div>
        </div>
        <IconButton
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          onClick={() => {
            notificationData.handleOpenConfirmDialog(id)
          }}>
          <Clear color="#dadada"/>
        </IconButton>
      </div>
    )
  })
  const loadMore = () => {
    if (openNotifications && !loading && !notificationsLoading) {
      return dispatch(notificationListFetchAction(defaultPage))
        .then(() => {
          updateDefaultPage(defaultPage + ONE)
        })
    }
    return false
  }
  return (
    <div className={classes.wrapper}>
      {openNotifications && <div className={classes.overlay}/>}
      <Drawer
        open={openNotifications}
        docked={true}
        onRequestChange={() => {
          notificationData.handleOpenNotificationBar(false)
          props.setLoading(false)
        }}
        width={400}>
        {loading && <div className={classes.listLoader}>
          <Loader size={0.75}/>
        </div>}
        <div className={classes.header}>
          <div>{t('Уведомления')}</div>
          <IconButton
            iconStyle={iconStyle.icon}
            style={iconStyle.buttonClose}
            onClick={() => {
              notificationData.handleOpenNotificationBar(false)
            }}>
            <Close color="#968c8c"/>
          </IconButton>
        </div>
        <div className={classes.notifBody}>
          <InfiniteScroll
            loadMore={loadMore}
            hasMore={notificationsCount > currentListCount}
            loader={<div><Loader size={0.5}/></div>}
            initialLoad={loading}
            useWindow={false}
            threshold={10}>
            {(notificationListExp.length > ZERO
              ? notificationListExp
              : <div className={classes.emptyQuery}>
                <div>{t('Нет уведомлений')}</div>
              </div>)}
          </InfiniteScroll>
        </div>
      </Drawer>

      {notificationsList &&
            <ConfirmDialog
              type="delete"
              message={_.get(_.find(list, {'id': notificationId}), 'text') || ''}
              onClose={notificationData.handleCloseConfirmDialog}
              onSubmit={notificationData.handleSendConfirmDialog}
              open={notificationData.open}
            />}
    </div>
  )
})

export default Layout
