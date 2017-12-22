import _ from 'lodash'
import moment from 'moment'
import filterHelper from '../../helpers/filter'
import {formattedType} from '../../constants/notificationTypes'
import {compose, withState, withHandlers, lifecycle} from 'recompose'
import React from 'react'
import injectSheet from 'react-jss'
import SideBarMenu from '../SidebarMenu'
import SnakeBar from '../Snackbar'
import {connect} from 'react-redux'
import ConfirmDialog from '../ConfirmDialog'
import ErrorDialog from '../ErrorDialog'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import Clear from 'material-ui/svg-icons/action/delete'
import SupplyAccept from 'material-ui/svg-icons/content/archive'
import OrderReady from 'material-ui/svg-icons/social/whatshot'
import OrderRequest from 'material-ui/svg-icons/device/access-time'
import GoodsDemand from 'material-ui/svg-icons/alert/warning'
import OrderDelivered from 'material-ui/svg-icons/action/assignment-turned-in'
import Loader from '../Loader'
import {
    notificationListFetchAction,
    notificationDeleteAction,
    notificationCountFetchAction
} from '../../actions/notifications'
import {openSnackbarAction} from '../../actions/snackbar'
import Notifications from '../Images/Notification.png'
import InfiniteScroll from 'react-infinite-scroller'

const iconStyle = {
    icon: {
        color: '#fff',
        width: 22,
        height: 22
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
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
    withState('openNotifications', 'setOpenNotifications', false),
    withState('clickNotifications', 'setClickNotifications', null),
    withState('defaultPage', 'updateDefaultPage', TWO),
    withState('loading', 'setLoading', false),
    withState('list', 'updateList', null),

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
            const {dispatch, setOpenConfirmDialog, notificationId} = props
            dispatch(notificationDeleteAction(notificationId))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(notificationListFetchAction())
                })
        },

        handleOpenNotificationBar: props => (status) => {
            const {setOpenNotifications, dispatch, setLoading, updateList} = props
            setOpenNotifications(status)
            setLoading(true)
            if (status) {
                dispatch(notificationListFetchAction())
                    .then((data) => {
                        const list = _.get(data, ['value', 'results'])
                        setLoading(false)
                        updateList(list)
                        dispatch(notificationCountFetchAction())
                    })
            }
        }

    }),
    injectSheet({
        wrapper: {
            height: '100%',
            width: '100%',
            display: 'flex'
        },
        loader: {
            padding: '100px 0'
        },
        sidenav: {
            position: 'fixed',
            width: '84px',
            top: '0',
            left: '0',
            bottom: '0',
            zIndex: '100'
        },
        content: {
            position: 'relative',
            background: '#f2f5f8',
            width: 'calc(100% - 84px)',
            marginLeft: '84px',
            padding: '0 28px 28px',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        notifications: {
            background: 'rgba(0,0,0,0.3)',
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            transition: 'all 300ms ease'
        },
        notificationsWrapper: {
            background: '#fff',
            color: '#333 !important',
            position: 'absolute',
            top: '0',
            bottom: '0',
            width: '400px'
        },
        header: {
            background: '#495061',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '600',
            padding: '0 10px 0 20px',
            height: '65px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        notifBody: {
            overflowY: 'auto',
            height: 'calc(100% - 65px)'
        },
        notif: {
            padding: '10px 10px 10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px #efefef solid',
            cursor: 'pointer',
            '&:hover': {
                opacity: '1 !important'
            }
        },
        notifIcon: {
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '20.78px',
            backgroundColor: '#dadada',
            margin: '10.39px 0',
            '&:before': {
                content: '""',
                position: 'absolute',
                width: '0',
                borderLeft: '18px solid transparent',
                borderRight: '18px solid transparent',
                bottom: '100%',
                left: '0',
                borderBottom: '10.39px solid #dadada'
            },
            '&:after': {
                content: '""',
                position: 'absolute',
                width: '0',
                borderLeft: '18px solid transparent',
                borderRight: '18px solid transparent',
                top: '100%',
                left: '0',
                borderTop: '10.39px solid #dadada'
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
        emptyQuery: {
            background: 'url(' + Notifications + ') no-repeat center center',
            backgroundSize: '115px',
            padding: '200px 0 20px',
            textAlign: 'center',
            color: '#999',
            fontWeight: 'bold'
        }
    }),
    lifecycle({
        componentDidMount () {
            const content = this.refs.content
            const updateScrollValue = _.get(this, ['props', 'updateScrollValue'])
            const THRESHOLD = 110
            if (updateScrollValue) {
                let fixed = false
                content.addEventListener('scroll', () => {
                    const value = content.scrollTop
                    const newValue = value >= THRESHOLD
                    if (fixed !== newValue) {
                        updateScrollValue(newValue)
                        fixed = newValue
                    }
                })
            }
        }
    })
)

const Layout = enhance((props) => {
    const {
        classes,
        handleSignOut,
        children,
        dispatch,
        notificationId,
        openNotifications,
        clickNotifications,
        setClickNotifications,
        notificationsList,
        defaultPage,
        updateDefaultPage,
        loading,
        list,
        updateList
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
    const currentListCount = _.get(notificationsList, ['results', 'length'])
    const notificationListExp = _.map(uniqList, (item) => {
        const id = _.get(item, 'id')
        const title = formattedType[_.get(item, ['template', 'name'])]
        const text = _.get(item, 'text')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY HH:mm')
        const viewed = _.get(item, 'viewed')
        const template = _.get(item, ['template', 'name'])
        let icon = null
        switch (template) {
            case 'supply_accepted': icon = <div className={classes.notifIcon + ' ' + classes.supply}><SupplyAccept/></div>
                break
            case 'order_ready': icon = <div className={classes.notifIcon + ' ' + classes.order}><OrderReady/></div>
                break
            case 'order_delivered': icon = <div className={classes.notifIcon + ' ' + classes.order}><OrderDelivered/></div>
                break
            case 'order_request': icon = <div className={classes.notifIcon + ' ' + classes.order}><OrderRequest/></div>
                break
            case 'goods_on_demand': icon = <div className={classes.notifIcon + ' ' + classes.stock}><GoodsDemand/></div>
                break
            default: icon = null
        }

        return (
            <div key={id} className={classes.notif}
                 onClick={() => {
                     id === clickNotifications
                         ? setClickNotifications(null)
                         : setClickNotifications(id)
                 }}
                 style={viewed ? {opacity: '0.5'} : {opacity: '1'}}>
                {icon}
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
                    onTouchTap={() => {
                        notificationData.handleOpenConfirmDialog(id)
                    }}>
                    <Clear color="#dadada"/>
                </IconButton>
            </div>
        )
    })
    const wrapperStyle = {
        containerOpen: {
            opacity: 1,
            zIndex: 100
        },
        containerClose: {
            opacity: 0,
            zIndex: -99
        },
        wrapperOpen: {
            left: 84
        },
        wrapperClose: {
            left: '-100%'
        }
    }
    const loadMore = () => {
        if (openNotifications && !loading) {
            return dispatch(notificationListFetchAction(defaultPage))
                .then(() => {
                    updateList(_.union(list, _.get(notificationsList, 'results')))
                    updateDefaultPage(defaultPage + ONE)
                })
        }
        return false
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.notifications} style={openNotifications ? wrapperStyle.containerOpen : wrapperStyle.containerClose}>
                <Paper className={classes.notificationsWrapper} zDepth={4} style={openNotifications ? wrapperStyle.wrapperOpen : wrapperStyle.wrapperClose}>
                    <div className={classes.header}>
                        <div>Уведомления</div>
                        <div>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                onTouchTap={() => {
                                    notificationData.handleOpenNotificationBar(false)
                                    props.setLoading(false)
                                }}>
                                <CloseIcon color="#fff"/>
                            </IconButton>
                        </div>
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
                                        <div>Нет уведомлений</div>
                                    </div>)}
                            </InfiniteScroll>
                    </div>
                </Paper>
            </div>
            <div className={classes.sidenav}>
                <SideBarMenu handleSignOut={handleSignOut}
                             handleOpenNotificationBar={notificationData.handleOpenNotificationBar}/>
            </div>
            <div className={classes.content} ref="content">
                {children}
            </div>

            <SnakeBar />
            <ErrorDialog />
            {notificationsList && <ConfirmDialog
                type="delete"
                message={_.get(_.find(notificationsList, {'id': notificationId}), 'title') || ''}
                onClose={notificationData.handleCloseConfirmDialog}
                onSubmit={notificationData.handleSendConfirmDialog}
                open={notificationData.open}
            />}
        </div>
    )
})

export default Layout
