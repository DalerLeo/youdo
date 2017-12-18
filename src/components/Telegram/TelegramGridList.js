import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Cancel from 'material-ui/svg-icons/content/remove-circle'
import TelegramCreateDialog from './TelegramCreateDialog'
import TelegramFilterForm from './TelegramFilterForm'
import TelegramLinkDialog from './TelegramLinkDialog'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import Tooltip from '../ToolTip'
import dateFormat from '../../helpers/dateFormat'
import IconButton from 'material-ui/IconButton'

const listHeader = [
    {
        sorting: true,
        name: 'market',
        xs: 3,
        title: 'Магазин'
    },
    {
        sorting: false,
        name: 'createBy',
        xs: 3,
        title: 'Создал'
    },
    {
        sorting: false,
        name: 'username',
        xs: 3,
        title: 'Пользователи'
    },
    {
        sorting: false,
        xs: 2,
        name: 'activated_date',
        title: 'Дата активации'
    },
    {
        sorting: false,
        xs: 1,
        name: '',
        title: ''
    }
]

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet({
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        actionBtn: {
            height: '48px'
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
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '65px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid'
        },
        container: {
            display: 'flex',
            width: '100%'
        },
        sides: {
            flexBasis: '27%'
        },
        leftSide: {
            extend: 'sides',
            borderRight: '1px #efefef solid',
            padding: '20px 30px'
        },
        rightSide: {
            extend: 'sides',
            borderLeft: '1px #efefef solid',
            padding: '20px 30px'
        },
        body: {
            flexBasis: '66%',
            padding: '20px 30px',
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
            color: '#333',
            fontWeight: '700'
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        listRow: {
            position: 'relative',
            '& > div:last-child': {
                '& > div': {
                    opacity: '0'
                }
            },
            '&:hover': {
                '& > div:last-child > div': {
                    opacity: '1',
                    '& > div': {
                        justifyContent: 'flex-end'
                    }
                }
            },

            '& > a': {
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                top: '0',
                left: '-30px',
                right: '-30px',
                bottom: '0',
                fontWeight: '500',
                padding: '0 30px',
                '& > div': {
                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        paddingRight: '0'
                    }
                }
            }
        }
    })
)

const iconStyle = {
    icon: {
        width: 22,
        height: 22
    },
    button: {
        width: 30,
        height: 30,
        padding: 4
    }
}
const TelegramGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        confirmDialog,
        listData,
        detailData,
        classes,
        linkDialog,
        createDetails,
        copyToClipBoard,
        filterDialog
    } = props
    const telegramDetail = (
        <span>sd</span>
    )

    const telegramFilterDialog = (
        <TelegramFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )
    const telegramList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const token = _.get(item, 'token')
        const fullName = _.get(item, 'lastName') ? _.get(item, 'lastName') + ' ' + _.get(item, 'firstName') : 'Неизвестно'
        const username = _.get(item, 'username') || 'Неизвестно'
        const createdBy = _.get(item, ['createdBy', 'firstName']) + ' ' + _.get(item, ['createdBy', 'secondName']) || ''
        const createdDate = _.get(item, 'createdDate') ? dateFormat(_.get(item, 'createdDate'), true) : ''
        const activatedDate = _.get(item, 'activatedDate') ? dateFormat(_.get(item, 'activatedDate')) : false
        const market = _.get(item, ['market', 'name']) || 'Неизвестно'
        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={3}>{market}</Col>
                <Col xs={3}><div style={{fontWeight: '600'}}>{createdBy}</div><div>{createdDate}</div></Col>
                <Col xs={3}><div>{username}</div><div>{fullName}</div></Col>
                <Col xs={2}>{activatedDate || <Tooltip position="left" text="Скопироват ссылку">
                                                <span
                                                    style={{color: '#12aaeb', cursor: 'pointer'}}
                                                    onClick={() => copyToClipBoard.handleCopyLinkInList(token)}>
                                                    Не активирован
                                                </span>
                                              </Tooltip>}
                </Col>
                <Col xs={1}>
                    <Tooltip position="left" text="Деактивировать">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}>
                            <Cancel color='#ff584b'/>
                        </IconButton>
                    </Tooltip>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: telegramList,
        loading: _.get(listData, 'listLoading')
    }
    return (
        <Container>
            <SubMenu url={ROUTES.TELEGRAM_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить клиента">
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb"
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <GridList
                filter={filter}
                list={list}
                detail={telegramDetail}
                filterDialog={telegramFilterDialog}
            />

            <TelegramCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />
            <TelegramLinkDialog
                open={linkDialog.openLinkDialog}
                loading={createDetails.createLoading}
                onClose={linkDialog.handleCloseLinkDialog}
                data={createDetails.createData}
                copyToClipBoard={copyToClipBoard.handleCopyToken}
                initialValues={{link: 't.me/markets_bot?start=' + createDetails.createData.token}}
            />

            <TelegramCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message={_.get(detailData, ['data', 'name'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

TelegramGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    tabData: PropTypes.object.isRequired,
    createDetails: PropTypes.object.isRequired,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    linkDialog: PropTypes.shape({
        openLinkDialog: PropTypes.bool.isRequired,
        handleOpenLinkDialog: PropTypes.func.isRequired,
        handleCloseLinkDialog: PropTypes.func.isRequired
    }).isRequired
}

export default TelegramGridList
