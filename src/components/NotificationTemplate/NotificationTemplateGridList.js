import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import Toggle from 'material-ui/Toggle'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/cancel'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import SettingSideMenu from '../Settings/SettingsSideMenu'
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
        xs: 8,
        title: 'Пользователи'
    },
    {
        sorting: false,
        name: 'edit',
        xs: 1,
        title: 'Статус',
        alignRight: true
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
            padding: '5px 30px',
            minHeight: '50px',
            '& > div:last-child': {
                display: 'flex',
                flexDirection: 'row-reverse'
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
            alignItems: 'center',
            flexWrap: 'wrap',
            '& > div:first-child': {
                marginLeft: '0 !important'
            },
            '& > div:last-child': {
                marginLeft: '5px'
            }
        },
        person: {
            height: '28px',
            margin: '5px 10px 5px 0',
            padding: '0 10px',
            display: 'inline-flex',
            lineHeight: '1',
            alignItems: 'center',
            borderRadius: '2px',
            backgroundColor: '#e9ecef',
            position: 'relative'
        },
        deletePers: {
            position: 'absolute',
            cursor: 'pointer',
            right: '-8px',
            top: '-8px',
            '& svg': {
                width: '20px !important',
                height: '20px !important'
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

const ZERO = 0
const NotificationGridList = enhance((props) => {
    const {
        filter,
        listData,
        classes,
        changeDialog,
        notificationUser,
        userConfirm
    } = props

    const notificationDetail = (
        <span>a</span>
    )

    const styles = {
        toggle: {
            marginBottom: 16
        },
        thumbOff: {
            backgroundColor: '#f2f5f8'
        },
        trackOff: {
            backgroundColor: '#bdbdbd'
        }
    }

    const notificationList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'title')
        const status = _.get(item, 'status') === 'on'

        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={3}>{name}</Col>
                <Col xs={8}>
                    <div className={classes.personalWrap}>
                        {_.map(_.get(item, 'users'), (user) => {
                            const userId = _.get(user, 'id')
                            const username = _.get(user, 'firstName') + ' ' + _.get(user, 'secondName')

                            return (
                                <div className={classes.person}>
                                    {username}
                                    <div className={classes.deletePers}>
                                        <CloseIcon
                                            onClick={() => { userConfirm.handleOpenConfirmUser(userId, id) }}
                                            color="#5d6474"/>
                                    </div>
                                </div>
                            )
                        })}
                            <FlatButton
                                backgroundColor={'#12aaeb'}
                                hoverColor={'#12aaeb'}
                                rippleColor={'#fff'}
                                style={{height: '28px', lineHeight: '28px', minWidth: '60px'}}
                                labelStyle={{textTransform: 'none', color: '#fff', verticalAlign: 'baseline'}}
                                className={classes.addPerson}
                                label="добавить"
                                onTouchTap={() => { notificationUser.handleOpenAddUser(id) }}/>
                    </div>
                </Col>
                <Col xs={1}>
                    <Toggle
                        name="status"
                        toggled={status}
                        onTouchTap={() => { changeDialog.handelChangeStatus(item) }}
                        thumbStyle={styles.thumbOff}
                        trackStyle={styles.trackOff}
                        thumbSwitchedStyle={styles.thumbSwitched}
                        trackSwitchedStyle={styles.trackSwitched}
                        style={{width: 'auto'}}/>
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
                        flexibleRow={true}
                    />
                </div>
            </div>
            <BindAgentDialog
                open={notificationUser.open > ZERO}
                onClose={notificationUser.handleCloseAddUser}
                onSubmit={notificationUser.handleSubmitAddUser}
                notify={true}
            />
            <ConfirmDialog
                open={userConfirm.open > ZERO}
                onClose={userConfirm.handleCloseConfirmUser}
                onSubmit={userConfirm.handleSubmitConfirmUser}
                message="Удалить этого пользователя?"
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
