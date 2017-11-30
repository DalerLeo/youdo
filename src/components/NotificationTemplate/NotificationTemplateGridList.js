import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import Toggle from 'material-ui/Toggle'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Edit from 'material-ui/svg-icons/image/edit'
import Container from '../Container'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import SettingSideMenu from '../Settings/SettingsSideMenu'
import UpdateDialog from './NotificationTemplateCreateDialog'
import toBoolean from '../../helpers/toBoolean'
import Tooltip from '../ToolTip/index'
import Person from '../Images/person.png'
import BindAgentDialog from '../../components/Zones/ZoneBindAgentDialog'
import ConfirmDialog from '../ConfirmDialog'

const listHeader = [
    {
        sorting: false,
        name: 'name',
        xs: 3,
        title: 'Наименование'
    },
    {
        sorting: false,
        name: 'user',
        xs: 5,
        title: 'Пользователи'
    },
    {
        sorting: false,
        name: 'edit',
        xs: 2,
        title: ''
    },
    {
        sorting: false,
        name: 'action',
        xs: 2,
        title: ''
    }
]

const enhance = compose(
    injectSheet({
        addButton: {
            '& svg': {
                width: '14px !important',
                height: '14px !important'
            }
        },
        toggle: {
            marginBottom: 16
        },
        wrapper: {
            display: 'flex',
            margin: '0 -28px',
            height: 'calc(100% + 28px)'
        },
        addButtonWrapper: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '-18px'
        },
        rightPanel: {
            background: '#fff',
            flexBasis: 'calc(100% - 225px)',
            maxWidth: 'calc(100% - 225px)',
            paddingTop: '10px',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        verticalButton: {
            border: '2px #dfdfdf solid !important',
            borderRadius: '50%',
            opacity: '0',
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        iconBtn: {
            display: 'inline-flex',
            opacity: '0',
            transition: 'all 200ms ease-out'
        },
        listRow: {
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            '&:hover > div:last-child > div ': {
                opacity: '1'
            },
            '& > div': {
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        },
        personal: {
            padding: '20px 0 15px',
            borderBottom: '1px  #efefef solid',
            '& > span': {
                fontWeight: '600',
                display: 'block',
                marginBottom: '12px'
            }
        },
        personalWrap: {
            display: 'flex',
            flexWrap: 'wrap',
            '& > div': {
                width: '30px',
                height: '30px',
                display: 'inline-block',
                marginRight: '10px',
                marginBottom: '5px',
                position: 'relative',
                '& img': {
                    height: '100%',
                    width: '100%',
                    borderRadius: '50%'
                },
                '&:hover > div > div > div': {
                    display: 'flex'
                },
                '&:nth-child(10n)': {
                    margin: '0 !important'
                }
            }
        },
        addPerson: {
            boxShadow: 'none !important',
            '& button': {
                background: '#199ee0 !important',
                width: '30px !important',
                height: '30px !important',
                '& svg': {
                    width: '20px !important',
                    height: '30px !important'
                }
            }
        }
    }),
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    button: {
        width: 30,
        height: 25,
        padding: 0
    }
}
const ZERO = 0
const NotificationGridList = enhance((props) => {
    const {
        filter,
        listData,
        updateDialog,
        classes,
        changeDialog,
        notificationUser,
        userConfirm
    } = props

    const notificationDetail = (
        <span>a</span>
    )

    const notificationList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const status = _.get(item, 'status') === 'on'

        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={3}>{name}</Col>
                <Col xs={5}>
                    <div className={classes.personalWrap}>
                        {_.map(_.get(item, 'users'), (item2) => {
                            const userId = _.get(item2, 'id')
                            const username = _.get(item2, 'firstName') + ' ' + _.get(item2, 'secondName')
                            const position = _.get(item2, 'position') || 'Без должности'

                            return (
                                <Tooltip key={id} position="top" text={username + '<br>' + position}>
                                    <div className={classes.person}>
                                        <img src={Person} alt=""/>
                                        <div className={classes.deletePers}>
                                            <CloseIcon
                                                onClick={() => { notificationUser.handleOpenConfirmUser(userId, id) }}
                                                color="#fff"/>
                                        </div>
                                    </div>
                                </Tooltip>
                            )
                        })}
                        <div className={classes.person} style={{overflow: 'hidden'}}>
                            <Tooltip position="bottom" text="Добавить">
                                <FloatingActionButton
                                    mini={true}
                                    className={classes.addPerson}
                                    onTouchTap={() => { notificationUser.handleOpenAddUser(id) }}>
                                    <ContentAdd/>
                                </FloatingActionButton>
                            </Tooltip>
                        </div>
                    </div>
                </Col>
                <Col xs={2}>
                    <Toggle
                        name="status"
                        toggled={status}
                        onTouchTap={() => {
                            changeDialog.handelChangeStatus(item)
                        }}
                        style={classes.toggle}
                    />
                </Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <div className={classes.iconBtn}>
                        <Tooltip position="bottom" text="Изменить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                disableTouchRipple={true}
                                touch={true}
                                onTouchTap={() => {
                                    updateDialog.handleOpenUpdateDialog(id)
                                }}>
                                <Edit/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: notificationList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.NOTIFICATION_TEMPLATE_LIST_URL}/>
                <div className={classes.rightPanel}>
                    <GridList
                        filter={filter}
                        list={list}
                        detail={notificationDetail}
                        transparentLoading={true}
                        listShadow={false}
                    />
                </div>
            </div>
            <UpdateDialog
                initialValues={updateDialog.initialValues}
                open={_.toInteger(updateDialog.open) > ZERO ? true : toBoolean(updateDialog.open)}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />
            <BindAgentDialog
                open={notificationUser.open > ZERO}
                onClose={notificationUser.handleCloseAddUser}
                onSubmit={notificationUser.handleSubmitAddUser}
            />
            <ConfirmDialog
                open={userConfirm.open > ZERO}
                onClose={userConfirm.handleCloseConfirmUser}
                onSubmit={userConfirm.handleSubmitConfirmUser}
                message="Удалить этот пользователь?"
                type="submit"
            />
        </Container>
    )
})

NotificationGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    updateDialog: PropTypes.shape({
        open: PropTypes.number,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired
}

export default NotificationGridList
