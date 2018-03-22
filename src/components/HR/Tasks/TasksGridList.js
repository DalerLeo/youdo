import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import sprintf from 'sprintf'
import GridList from '../../GridList'
import Container from '../../Container'
import TasksInfoDialog from './TasksInfoDialog'
import ConfirmDialog from '../../ConfirmDialog'
import SubMenu from '../../SubMenu'
import {Tabs, Tab} from 'material-ui/Tabs'
import Paper from 'material-ui/Paper'
import Badge from 'material-ui/Badge'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ToolTip from '../../ToolTip'
import {hashHistory, Link} from 'react-router'
import TasksDetail from '../Application/ApplicationDetails'
import dateFormat from '../../../helpers/dateFormat'
import t from '../../../helpers/translate'
import {COLOR_WHITE, LINK_COLOR} from '../../../constants/styleConstants'
import * as TAB from '../../../constants/hrTasksTab'
import {ZERO} from '../../../constants/backendConstants'

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
        xs: 3,
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
        },
        tab: {
            marginBottom: '20px',
            width: '100%',
            '& > div': {
                paddingRight: 'calc(100% - 350px)'
            },
            '& > div:first-child': {
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                borderBottom: '1px transparent solid'
            },
            '& > div:last-child': {
                width: '100% !important',
                padding: '0'
            },
            '& button > div': {
                height: '50px !important'
            }
        }
    })
)

const TasksGridList = enhance((props) => {
    const {
        filter,
        listData,
        detailData,
        classes,
        tabData
    } = props

    const tasksDetail = (
        <TasksDetail
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            loading={_.get(detailData, 'detailLoading')}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}/>
    )

    const tasksList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['contact', 'client', 'name'])
        const position = _.get(item, ['position', 'name'])
        const recruiter = _.get(item, ['recruiter'])
            ? _.get(item, ['recruiter', 'firstName']) + ' ' + _.get(item, ['recruiter', 'secondName'])
            : t('Не назначен')
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const deadline = dateFormat(_.get(item, 'deadline'), true)
        return (
            <Row key={id} className={classes.listRow} style={{alignItems: 'center'}}>
                <Link to={{
                    pathname: sprintf(ROUTES.HR_TASKS_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                    <Col xs={2}>{client}</Col>
                    <Col xs={3}>{position}</Col>
                    <Col xs={3}>{recruiter}</Col>
                    <Col xs={2}>{createdDate}</Col>
                    <Col xs={2}>{deadline}</Col>
                </Link>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: tasksList,
        loading: _.get(listData, 'listLoading')
    }

    const tabStyle = {
        button: {
            textTransform: 'none'
        }
    }

    return (
        <Container>
            <SubMenu url={ROUTES.HR_TASKS_LIST_URL}/>
            <Tabs
                value={tabData.tab}
                className={classes.tab}
                contentContainerStyle={{background: COLOR_WHITE}}
                inkBarStyle={{background: LINK_COLOR, marginTop: '-2px', height: '2px'}}
                onChange={(value) => tabData.handleTabChange(value)}>
                <Tab
                    label="Текущие"
                    value={TAB.TASKS_TAB_CURRENT}
                    buttonStyle={tabStyle.button}
                    disableTouchRipple={true}/>
                <Tab
                    label="Новые"
                    value={TAB.TASKS_TAB_NEW}
                    buttonStyle={tabStyle.button}
                    disableTouchRipple={true}/>
                <Tab
                    label="Завершенные"
                    value={TAB.TASKS_TAB_COMPLETED}
                    buttonStyle={tabStyle.button}
                    disableTouchRipple={true}/>
            </Tabs>
            <GridList
                filter={filter}
                list={list}
                detail={<div/>}/>

            <TasksInfoDialog
                open={_.get(detailData, 'id') > ZERO}
                onClose={_.get(detailData, 'handleCloseDetail')}
                loading={_.get(detailData, 'detailLoading')}
                data={_.get(detailData, 'data') || {}}
            />
        </Container>
    )
})

TasksGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default TasksGridList
