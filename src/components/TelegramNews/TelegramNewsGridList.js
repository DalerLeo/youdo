import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import sprintf from 'sprintf'
import GridList from '../GridList'
import Container from '../Container'
import TelegramNewsCreateDialog from './TelegramNewsCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ToolTip from '../ToolTip'
import {Link} from 'react-router'
import TelegramNewsDetail from './TelegramNewsDetails'
import dateFormat from '../../helpers/dateFormat'

const listHeader = [
    {
        sorting: true,
        name: 'title',
        xs: 3,
        title: 'Заголовок'
    },
    {
        sorting: true,
        name: 'description',
        xs: 3,
        title: 'Описание'
    },
    {
        sorting: true,
        xs: 3,
        name: 'created_date',
        title: 'Дата создания'
    },
    {
        sorting: true,
        xs: 3,
        name: 'modified_date',
        title: 'Дата изменения'
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
        }
    })
)

const TelegramNewsGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        confirmDialog,
        listData,
        detailData,
        classes
    } = props

    const telegramNewsDetail = (
        <TelegramNewsDetail
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            loading={_.get(detailData, 'detailLoading')}
            handleOpenUpdateDialog={updateDialog.handleOpenUpdateDialog}
            confirmDialog={confirmDialog}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}/>
    )

    const telegramNewsList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const title = _.get(item, 'title')
        const description = _.get(item, 'description')
        const createdDate = dateFormat(_.get(item, 'createdDate'), true)
        const modifiedDate = dateFormat(_.get(item, 'modifiedDate'), true)
        return (
            <Row key={id} className={classes.listRow} style={{alignItems: 'center'}}>
                <Link to={{
                    pathname: sprintf(ROUTES.TELEGRAM_NEWS_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                    <Col xs={3}>{title}</Col>
                    <Col xs={3}>{description}</Col>
                    <Col xs={3}>{createdDate}</Col>
                    <Col xs={3}>{modifiedDate}</Col>
                </Link>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: telegramNewsList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.TELEGRAM_NEWS_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <ToolTip position="left" text="Добавить новость">
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
                detail={telegramNewsDetail}
            />

            <TelegramNewsCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <TelegramNewsCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message={_.get(detailData, ['data', 'title'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

TelegramNewsGridList.propTypes = {
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

export default TelegramNewsGridList