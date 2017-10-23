import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import Toggle from 'material-ui/Toggle'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Edit from 'material-ui/svg-icons/image/edit'
import Container from '../Container'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import SettingSideMenu from '../Setting/SettingSideMenu'
import UpdateDialog from './NotificationTemplateCreateDialog'
import toBoolean from '../../helpers/toBoolean'
import Tooltip from '../ToolTip/index'

const listHeader = [
    {
        sorting: false,
        name: 'name',
        xs: 6,
        title: 'Наименование'
    },
    {
        sorting: false,
        name: 'edit',
        xs: 3,
        title: ''
    },
    {
        sorting: false,
        name: 'action',
        xs: 3,
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
        changeDialog
    } = props

    const notificationDetail = (
        <span>a</span>
    )

    const notificationList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const status = _.get(item, 'status') === 'on'

        return (
            <Row key={name} className={classes.listRow}>
                <Col xs={6}>{name}</Col>
                <Col xs={3}>
                    <Toggle
                        name="status"
                        toggled={status}
                        onTouchTap={() => {
                            changeDialog.handelChangeStatus(item)
                        }}
                        style={classes.toggle}
                    />
                </Col>
                <Col xs={3} style={{textAlign: 'right'}}>
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
