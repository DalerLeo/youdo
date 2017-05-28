import _ from 'lodash'
import moment from 'moment'
import filterHelper from '../../helpers/filter'
import {compose, withState, withHandlers} from 'recompose'
import React from 'react'
import injectSheet from 'react-jss'
import SideBarMenu from '../SidebarMenu'
import SnakeBar from '../Snackbar'
import {connect} from 'react-redux'
import ConfirmDialog from '../ConfirmDialog'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import Money from 'material-ui/svg-icons/editor/attach-money'
import Clear from 'material-ui/svg-icons/action/delete'
import Storehouse from 'material-ui/svg-icons/action/home'
import Balance from 'material-ui/svg-icons/action/account-balance-wallet'
import {
    notificationListFetchAction,
    notificationDeleteAction
} from '../../actions/notifications'
import {openSnackbarAction} from '../../actions/snackbar'

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
const moneyIcon = '#64b5f6'
const balanceIcon = '#4db6ac'
const storeIcon = '#f06292'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const filter = filterHelper(pathname, query)
        const notificationsList = _.get(state, ['notifications', 'list', 'data', 'results'])
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
    withState('clickNotifications', 'setClickNotifications', false),

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
            const {setOpenNotifications, dispatch} = props
            setOpenNotifications(status)
            dispatch(notificationListFetchAction())
        }

    }),
    injectSheet({
        wrapper: {
            height: '100%',
            width: '100%',
            display: 'flex'
        },
        sidenav: {
            width: '84px',
            zIndex: '6'
        },
        content: {
            background: '#fefefe',
            width: 'calc(100% - 140px)',
            padding: '28px',
            overflow: 'auto'
        },
        notifications: {
            background: 'rgba(0,0,0,0.3)',
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '5'
        },
        notificationsWrapper: {
            background: '#fff',
            color: '#333 !important',
            position: 'absolute',
            left: '84px',
            top: '0',
            bottom: '0',
            width: '400px'
        },
        header: {
            background: '#495061',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '600',
            padding: '0 20px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        notifBody: {
            overflowY: 'auto',
            height: 'calc(100% - 70px)'
        },
        notif: {
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px #efefef solid',
            cursor: 'pointer',
            '& .notifIcon': {
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
            '& .notifIcon.money': {
                backgroundColor: moneyIcon,
                '&:before': {
                    borderBottomColor: moneyIcon
                },
                '&:after': {
                    borderTopColor: moneyIcon
                }
            },
            '& .notifIcon.balance': {
                backgroundColor: balanceIcon,
                '&:before': {
                    borderBottomColor: balanceIcon
                },
                '&:after': {
                    borderTopColor: balanceIcon
                }
            },
            '& .notifIcon.store': {
                backgroundColor: storeIcon,
                '&:before': {
                    borderBottomColor: storeIcon
                },
                '&:after': {
                    borderTopColor: storeIcon
                }
            }
        },
        notifContent: {
            flexBasis: '250px'
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
        }
    })
)
const Layout = enhance((props) => {
    const {
        classes,
        handleSignOut,
        children,
        notificationId,
        openNotifications,
        clickNotifications,
        setClickNotifications,
        notificationsList,
        notificationsLoading
    } = props

    const notificationData = {
        open: props.openConfirmDialog,
        notificationsId: props.notificationsId,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog,
        handleOpenNotificationBar: props.handleOpenNotificationBar
    }
    const notificationListExp = _.map(notificationsList, (item) => {
        const id = _.get(item, 'id')
        const title = _.get(item, 'title')
        const text = _.get(item, 'text')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const viewed = _.get(item, 'viewed')
        const template = _.get(item, ['template', 'name']) === 'accountant'
            ? <div className="notifIcon balance"><Balance/></div>
            : (_.get(item, ['template', 'name']) === 'order'
                    ? <div className="notifIcon money"><Money/></div>
                    : (_.get(item, ['template', 'name']) === 'supply'
                        ? <div className="notifIcon store"><Storehouse/></div>
                        : <div></div>)
            )

        return (
            <div key={id} className={classes.notif} onClick={() => {
                setClickNotifications(true)
            }} style={viewed ? {opacity: '0.5'} : {opacity: '1'}}>
                {template}
                <div className={classes.notifContent}>
                    <div className={classes.notifTitle}>
                        <div>{title}</div>
                        <span>{createdDate}</span>
                    </div>
                    <div className="notificationText">
                        {text}
                    </div>
                </div>
                <IconButton
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}
                    onTouchTap={ () => {
                        notificationData.handleOpenConfirmDialog(id)
                    }}
                >
                    <Clear color="#dadada"/>
                </IconButton>
            </div>
        )
    })
    return (
        <div className={classes.wrapper}>
            <div className={classes.notifications} style={openNotifications ? {} : {display: 'none'}}>
                <Paper className={classes.notificationsWrapper} zDepth={4}>
                    <div className={classes.header}>
                        <div>Уведомления</div>
                        <div>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                onTouchTap={() => {
                                    notificationData.handleOpenNotificationBar(false)
                                }}>
                                <CloseIcon2 color="#fff"/>
                            </IconButton>
                        </div>
                    </div>
                    <div className={classes.notifBody}>
                        {
                            notificationsLoading ? <div></div>
                                : notificationListExp
                        }
                        <div className={classes.notif} onClick={() => {
                            setClickNotifications(true)
                        }} style={clickNotifications ? {opacity: '0.5'} : {opacity: '1'}}>
                            <div className="notifIcon money">
                                <Money/>
                            </div>
                            <div className={classes.notifContent}>
                                <div className={classes.notifTitle}>
                                    <div>Заказы</div>
                                    <span>час назад</span>
                                </div>
                                <div className="notificationText">
                                    Оплачено 9 000 000 UZS на 1231 заказ
                                </div>
                            </div>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                <Clear color="#dadada"/>
                            </IconButton>
                        </div>
                        <div className={classes.notif}>
                            <div className="notifIcon store">
                                <Storehouse/>
                            </div>
                            <div className={classes.notifContent}>
                                <div className={classes.notifTitle}>
                                    <div>Поставки</div>
                                    <span>час назад</span>
                                </div>
                                <div className="notificationText">
                                    Начало приемки по поставке 123123
                                </div>
                            </div>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                <Clear color="#dadada"/>
                            </IconButton>
                        </div>
                        <div className={classes.notif}>
                            <div className="notifIcon balance">
                                <Balance/>
                            </div>
                            <div className={classes.notifContent}>
                                <div className={classes.notifTitle}>
                                    <div>Бухгалтеру</div>
                                    <span>час назад</span>
                                </div>
                                <div className="notificationText">
                                    Клиент Закир Ахмедов должен оплатить 3 000 000 UZS за 4412 заказ
                                </div>
                            </div>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                <Clear color="#dadada"/>
                            </IconButton>
                        </div>
                        <div className={classes.notif}>
                            <div className="notifIcon store">
                                <Storehouse/>
                            </div>
                            <div className={classes.notifContent}>
                                <div className={classes.notifTitle}>
                                    <div>Поставки</div>
                                    <span>час назад</span>
                                </div>
                                <div className="notificationText">
                                    Конец приемки по поставке 123123
                                </div>
                            </div>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                <Clear color="#dadada"/>
                            </IconButton>
                        </div>
                        <div className={classes.notif}>
                            <div className="notifIcon balance">
                                <Balance/>
                            </div>
                            <div className={classes.notifContent}>
                                <div className={classes.notifTitle}>
                                    <div>Бухгалтеру</div>
                                    <span>час назад</span>
                                </div>
                                <div className="notificationText">
                                    Поступление ожидаемого расхода на сумму 100 USD по поставке 412
                                </div>
                            </div>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                <Clear color="#dadada"/>
                            </IconButton>
                        </div>
                    </div>
                </Paper>
            </div>
            <div className={classes.sidenav}>
                <SideBarMenu handleSignOut={handleSignOut}
                             handleOpenNotificationBar={notificationData.handleOpenNotificationBar}/>
            </div>
            <div className={classes.content}>
                {children}
            </div>

            <SnakeBar />
            <ConfirmDialog
                type="delete"
                message={_.get(_.find(notificationsList, {'id': notificationId}), 'title')}
                onClose={notificationData.handleCloseConfirmDialog}
                onSubmit={notificationData.handleSendConfirmDialog}
                open={notificationData.open}
            />
        </div>
    )
})

export default Layout
