import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import sprintf from 'sprintf'
import GridList from '../../GridList'
import Container from '../../Container'
import ApplicationCreateDialog from './ApplicationCreateDialog'
import ConfirmDialog from '../../ConfirmDialog'
import SubMenu from '../../SubMenu'
import Badge from 'material-ui/Badge'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ToolTip from '../../ToolTip'
import {hashHistory, Link} from 'react-router'
import ApplicationDetail from './ApplicationDetails'
import ApplicationFilterForm from './ApplicationFilterForm'
import dateFormat from '../../../helpers/dateFormat'
import t from '../../../helpers/translate'
import {
    APPLICATION_NOT_ASSIGNED,
    APPLICATION_ASSIGNED,
    APPLICATION_CANCELED,
    APPLICATION_COMPLETED
} from '../../../constants/backendConstants'
import {
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
    COLOR_BLUE_GREY,
    COLOR_WHITE
} from '../../../constants/styleConstants'
import Done from 'material-ui/svg-icons/action/check-circle'
import List from 'material-ui/svg-icons/action/list'
import NotAssigned from 'material-ui/svg-icons/social/person-outline'
import Assigned from 'material-ui/svg-icons/action/schedule'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import Completed from 'material-ui/svg-icons/action/done-all'

export const getStatusName = (status) => {
    switch (status) {
        case APPLICATION_NOT_ASSIGNED: return t('Неприсвоен')
        case APPLICATION_ASSIGNED: return t('Присвоен рекрутеру')
        case APPLICATION_CANCELED: return t('Отменен')
        case APPLICATION_COMPLETED: return t('Выполнен')
        default: return null
    }
}

const listHeader = [
    {
        sorting: true,
        name: 'client',
        xs: 2,
        title: t('Клиент')
    },
    {
        sorting: true,
        name: 'position',
        xs: 3,
        title: t('Вакантная должность')
    },
    {
        sorting: true,
        xs: 2,
        name: 'recruiter',
        title: t('Рекрутер')
    },
    {
        sorting: true,
        xs: 2,
        name: 'createdDate',
        title: t('Дата создания')
    },
    {
        sorting: true,
        xs: 2,
        name: 'deadline',
        title: t('Дэдлайн')
    },
    {
        sorting: false,
        alignRight: true,
        xs: 1,
        name: 'status',
        title: t('Статус')
    }
]

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
        listRow: {
            position: 'relative',
            '& > a': {
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                top: '0',
                left: '-30px',
                right: '-30px',
                bottom: '0',
                padding: '0 30px',
                '& > div:first-child': {
                    paddingLeft: '0'
                },
                '& > div:last-child': {
                    paddingRight: '0'
                }
            }
        },
        buttons: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
        }
    })
)

const ApplicationGridList = enhance((props) => {
    const {
        filter,
        filterDialog,
        createDialog,
        updateDialog,
        confirmDialog,
        listData,
        detailData,
        classes,
        openRecruiterList,
        setOpenRecruiterList,
        usersData,
        privilegeData
    } = props

    const statusIsNull = _.isNil(_.get(filter.getParams(), 'status'))
    const statusIsNotAssigned = _.get(filter.getParams(), 'status') && _.get(filter.getParams(), 'status') === APPLICATION_NOT_ASSIGNED
    const statusIsAssigned = _.get(filter.getParams(), 'status') && _.get(filter.getParams(), 'status') === APPLICATION_ASSIGNED
    const statusIsCanceled = _.get(filter.getParams(), 'status') && _.get(filter.getParams(), 'status') === APPLICATION_CANCELED
    const statusIsCompleted = _.get(filter.getParams(), 'status') && _.get(filter.getParams(), 'status') === APPLICATION_COMPLETED
    const notAssignedCount = 3
    const assignedCount = 1
    const canceledCount = 5
    const completedCount = 2

    const applicationfilterDialog = (
        <ApplicationFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const applicationDetail = (
        <ApplicationDetail
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            loading={_.get(detailData, 'detailLoading')}
            handleOpenUpdateDialog={updateDialog.handleOpenUpdateDialog}
            confirmDialog={confirmDialog}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}/>
    )

    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 30,
            height: 30,
            padding: 5
        }
    }

    const applicationList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name'])
        const position = _.get(item, ['position', 'name'])
        const recruiter = _.get(item, ['recruiter'])
            ? _.get(item, ['recruiter', 'firstName']) + ' ' + _.get(item, ['recruiter', 'secondName'])
            : t('Не назначен')
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const deadline = dateFormat(_.get(item, 'deadline'), true)
        const status = _.get(item, 'status')
        const getStatusIcon = () => {
            switch (status) {
                case APPLICATION_NOT_ASSIGNED: return <NotAssigned color={COLOR_BLUE_GREY}/>
                case APPLICATION_ASSIGNED: return <Assigned color={COLOR_YELLOW}/>
                case APPLICATION_CANCELED: return <Canceled color={COLOR_RED}/>
                case APPLICATION_COMPLETED: return <Completed color={COLOR_GREEN}/>
                default: return null
            }
        }
        return (
            <Row key={id} className={classes.listRow} style={{alignItems: 'center'}}>
                <Link to={{
                    pathname: sprintf(ROUTES.HR_APPLICATION_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                    <Col xs={2}>{client}</Col>
                    <Col xs={3}>{position}</Col>
                    <Col xs={2}>{recruiter}</Col>
                    <Col xs={2}>{createdDate}</Col>
                    <Col xs={2}>{deadline}</Col>
                    <Col xs={1} className={classes.buttons}>
                        <ToolTip position={'left'} text={getStatusName(status)}>
                            <IconButton
                                style={iconStyle.button}
                                iconStyle={iconStyle.icon}>
                                {getStatusIcon()}
                            </IconButton>
                        </ToolTip>
                    </Col>
                </Link>
            </Row>
        )
    })

    const badgeTransition = 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
    const badgeStyle = {
        wrapper: {
            padding: 0
        },
        badgeIsNull: {
            top: 4,
            right: 4,
            width: 18,
            height: 18,
            fontSize: 9,
            fontWeight: 600,
            border: statusIsNull ? 'none' : '1px #fff solid',
            background: statusIsNull ? COLOR_WHITE : COLOR_RED,
            transition: badgeTransition,
            zIndex: 1
        },
        iconNull: {
            color: statusIsNull ? COLOR_GREEN : COLOR_BLUE_GREY
        },
        badgeNotAssigned: {
            top: 4,
            right: 4,
            width: 18,
            height: 18,
            fontSize: 9,
            fontWeight: 600,
            border: statusIsNotAssigned ? 'none' : '1px #fff solid',
            background: statusIsNotAssigned ? COLOR_WHITE : COLOR_RED,
            transition: badgeTransition,
            zIndex: 1
        },
        iconNotAssigned: {
            color: statusIsNotAssigned ? COLOR_GREEN : COLOR_BLUE_GREY
        },
        badgeAssigned: {
            top: 4,
            right: 4,
            width: 18,
            height: 18,
            fontSize: 9,
            fontWeight: 600,
            border: statusIsAssigned ? 'none' : '1px #fff solid',
            background: statusIsAssigned ? COLOR_WHITE : COLOR_RED,
            transition: badgeTransition,
            zIndex: 1
        },
        iconAssigned: {
            color: statusIsAssigned ? COLOR_GREEN : COLOR_BLUE_GREY
        },
        badgeCanceled: {
            top: 4,
            right: 4,
            width: 18,
            height: 18,
            fontSize: 9,
            fontWeight: 600,
            border: statusIsCanceled ? 'none' : '1px #fff solid',
            background: statusIsCanceled ? COLOR_WHITE : COLOR_RED,
            transition: badgeTransition,
            zIndex: 1
        },
        iconCanceled: {
            color: statusIsCanceled ? COLOR_GREEN : COLOR_BLUE_GREY
        },
        badgeCompleted: {
            top: 4,
            right: 4,
            width: 18,
            height: 18,
            fontSize: 9,
            fontWeight: 600,
            border: statusIsCompleted ? 'none' : '1px #fff solid',
            background: statusIsCompleted ? COLOR_WHITE : COLOR_RED,
            transition: badgeTransition,
            zIndex: 1
        },
        iconCompleted: {
            color: statusIsCompleted ? COLOR_GREEN : COLOR_BLUE_GREY
        }
    }

    const list = {
        header: listHeader,
        list: applicationList,
        loading: _.get(listData, 'listLoading')
    }

    const filterByStatus = (status) => {
        return hashHistory.push(filter.createURL({status: status}))
    }

    const extraButtons = (
        <div className={classes.buttons}>
            {statusIsNull
                ? null
                : <ToolTip position="left" text={t('Показать все заявки')}>
                    <IconButton
                        onTouchTap={() => { filterByStatus(null) }}
                        iconStyle={badgeStyle.iconNull}>
                        <List/>
                    </IconButton>
                </ToolTip>}
            <ToolTip position="left" text={t('Отфильтровать по неприсвоенным заявкам')}>
                <Badge
                    primary={true}
                    badgeContent={statusIsNotAssigned ? <Done style={badgeStyle.iconNotAssigned}/> : notAssignedCount}
                    style={badgeStyle.wrapper}
                    badgeStyle={badgeStyle.badgeNotAssigned}>
                    <IconButton
                        onTouchTap={() => { filterByStatus(APPLICATION_NOT_ASSIGNED) }}
                        iconStyle={badgeStyle.iconNotAssigned}>
                        <NotAssigned/>
                    </IconButton>
                </Badge>
            </ToolTip>
            <ToolTip position="left" text={t('Отфильтровать по присвоенным заявкам')}>
                <Badge
                    primary={true}
                    badgeContent={statusIsAssigned ? <Done style={badgeStyle.iconAssigned}/> : assignedCount}
                    style={badgeStyle.wrapper}
                    badgeStyle={badgeStyle.badgeAssigned}>
                    <IconButton
                        onTouchTap={() => { filterByStatus(APPLICATION_ASSIGNED) }}
                        iconStyle={badgeStyle.iconAssigned}>
                        <Assigned/>
                    </IconButton>
                </Badge>
            </ToolTip>
            <ToolTip position="left" text={t('Отфильтровать по отмененным заявкам')}>
                <Badge
                    primary={true}
                    badgeContent={statusIsCanceled ? <Done style={badgeStyle.iconCanceled}/> : canceledCount}
                    style={badgeStyle.wrapper}
                    badgeStyle={badgeStyle.badgeCanceled}>
                    <IconButton
                        onTouchTap={() => { filterByStatus(APPLICATION_CANCELED) }}
                        iconStyle={badgeStyle.iconCanceled}>
                        <Canceled/>
                    </IconButton>
                </Badge>
            </ToolTip>
            <ToolTip position="left" text={t('Отфильтровать по завершенным заявкам')}>
                <Badge
                    primary={true}
                    badgeContent={statusIsCompleted ? <Done style={badgeStyle.iconCompleted}/> : completedCount}
                    style={badgeStyle.wrapper}
                    badgeStyle={badgeStyle.badgeCompleted}>
                    <IconButton
                        onTouchTap={() => { filterByStatus(APPLICATION_COMPLETED) }}
                        iconStyle={badgeStyle.iconCompleted}>
                        <Completed/>
                    </IconButton>
                </Badge>
            </ToolTip>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.HR_APPLICATION_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <ToolTip position="left" text={t('Добавить заявку')}>
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb"
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </ToolTip>
            </div>

            <GridList
                filter={filter}
                list={list}
                filterDialog={applicationfilterDialog}
                detail={applicationDetail}
                extraButtons={extraButtons}
            />

            <ApplicationCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
                openRecruiterList={openRecruiterList}
                setOpenRecruiterList={setOpenRecruiterList}
                usersData={usersData}
                privilegeData={privilegeData}
            />

            <ApplicationCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
                openRecruiterList={openRecruiterList}
                setOpenRecruiterList={setOpenRecruiterList}
                usersData={usersData}
                privilegeData={privilegeData}
            />

            {detailData.data &&
            <ConfirmDialog
                type="delete"
                message={_.get(detailData, ['data', 'name'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

ApplicationGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
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
    }).isRequired
}

export default ApplicationGridList
