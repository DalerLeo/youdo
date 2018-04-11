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
import FlatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
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
    APPLICATION_ASSIGNED,
    APPLICATION_CANCELED,
    APPLICATION_COMPLETED
} from '../../../constants/backendConstants'
import {
    COLOR_GREEN,
    COLOR_BLUE_GREY,
    COLOR_WHITE,
    COLOR_YELLOW,
    COLOR_GREY
} from '../../../constants/styleConstants'
import List from 'material-ui/svg-icons/action/assignment'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import Completed from 'material-ui/svg-icons/action/done-all'
import MenuItemIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import InProcess from 'material-ui/svg-icons/av/loop'
import {getAppStatusIcon, getAppStatusName} from '../../../helpers/hrcHelpers'

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
        sorting: true,
        alignRight: true,
        xs: 1,
        name: 'status',
        title: t('Статус')
    }
]

const enhance = compose(
    injectSheet({
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '60px',
            '& h2': {
                fontWeight: '600',
                fontSize: '18px'
            }
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
    const statusIsCanceled = _.get(filter.getParams(), 'status') && _.get(filter.getParams(), 'status') === APPLICATION_CANCELED

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
        const client = _.get(item, ['contact', 'client', 'name'])
        const position = _.get(item, ['position', 'name'])
        const recruiter = _.get(item, ['recruiter'])
            ? _.get(item, ['recruiter', 'firstName']) + ' ' + _.get(item, ['recruiter', 'secondName'])
            : t('Не назначен')
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const deadline = dateFormat(_.get(item, 'deadline'))
        const status = _.get(item, 'status')
        const doing = _.get(item, 'doing')
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
                        <ToolTip position={'left'} text={getAppStatusName(status, false, doing)}>
                            <IconButton
                                style={iconStyle.button}
                                iconStyle={iconStyle.icon}>
                                {getAppStatusIcon(status, doing)}
                            </IconButton>
                        </ToolTip>
                    </Col>
                </Link>
            </Row>
        )
    })

    const popoverStyle = {
        menuItem: {
            fontSize: '13px',
            minHeight: '36px',
            lineHeight: '36px'
        },
        innerDiv: {
            padding: '0px 16px 0px 60px'
        },
        icon: {
            margin: '7px',
            width: '22px',
            height: '22px'
        }
    }

    const badgeStyle = {
        wrapper: {
            padding: 0
        },
        iconStyle: (condition) => {
            return {color: condition ? COLOR_GREEN : COLOR_BLUE_GREY}
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
    const getIconByStatus = (style) => {
        if (filter.getParam('status') === APPLICATION_ASSIGNED) {
            return <InProcess color={COLOR_YELLOW} style={style}/>
        }
        if (filter.getParam('status') === APPLICATION_COMPLETED) {
            return <Completed color={COLOR_GREEN} style={style}/>
        }
        return <MenuItemIcon color={COLOR_GREY} style={style}/>
    }

    const extraButtons = (
        <div className={classes.buttons}>
            <IconMenu
                className={classes.popover}
                iconButtonElement={
                    <FlatButton
                        label={t('Статус')}
                        style={{display: 'flex', alignItems: 'center'}}
                        backgroundColor={COLOR_WHITE}
                        hoverColor={COLOR_WHITE}
                        disableTouchRipple
                        labelStyle={{
                            textTransform: 'none',
                            verticalAlign: 'baseline',
                            fontWeight: '600'
                        }}
                        icon={getIconByStatus({verticalAlign: 'unset'})}
                    />
                }
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                {!statusIsNull &&
                <MenuItem
                    style={popoverStyle.menuItem}
                    innerDivStyle={popoverStyle.innerDiv}
                    leftIcon={<List style={popoverStyle.icon}/>}
                    onTouchTap={() => { filterByStatus(null) }}
                    primaryText={t('Все заявки')}/>}
                <MenuItem
                    style={popoverStyle.menuItem}
                    innerDivStyle={popoverStyle.innerDiv}
                    leftIcon={<InProcess style={popoverStyle.icon}/>}
                    onTouchTap={() => { filterByStatus(APPLICATION_ASSIGNED) }}
                    primaryText={t('Все активные')}/>
                <MenuItem
                    style={popoverStyle.menuItem}
                    innerDivStyle={popoverStyle.innerDiv}
                    leftIcon={<Completed style={popoverStyle.icon}/>}
                    onTouchTap={() => { filterByStatus(APPLICATION_COMPLETED) }}
                    primaryText={t('Завершенные')}/>
            </IconMenu>

            {false &&
            <ToolTip position="left" text={t('Отфильтровать по отмененным заявкам')}>
                <IconButton
                    onTouchTap={() => { filterByStatus(APPLICATION_CANCELED) }}
                    iconStyle={badgeStyle.iconStyle(statusIsCanceled)}>
                    <Canceled/>
                </IconButton>
            </ToolTip>}
        </div>
    )

    return (
        <Container>
            <div className={classes.header}>
                <h2>{t('Заявки')}</h2>
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
                initialValues={createDialog.initialValues}
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
                message={''}
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
