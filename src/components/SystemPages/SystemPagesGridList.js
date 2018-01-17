import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import sprintf from 'sprintf'
import GridList from '../GridList'
import Container from '../Container'
import SystemPagesCreateDialog from './SystemPagesCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import {Link} from 'react-router'
import SystemPagesDetail from './SystemPagesDetails'
import dateFormat from '../../helpers/dateFormat'
import t from '../../helpers/translate'

const listHeader = [
    {
        sorting: false,
        xs: 3,
        name: 'key_name',
        title: t('Ключ')
    },
    {
        sorting: true,
        name: 'title',
        xs: 3,
        title: t('Заголовок')
    },
    {
        sorting: true,
        name: 'description',
        xs: 3,
        title: t('Описание')
    },
    {
        sorting: true,
        xs: 3,
        name: 'created_date',
        title: t('Дата создания')
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
    }),
    withState('dialogTab', 'setDialogTab', 'ru')
)

const SystemPagesGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        confirmDialog,
        listData,
        detailData,
        classes,
        dialogTab,
        setDialogTab
    } = props

    const systemPagesDetail = (
        <SystemPagesDetail
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            loading={_.get(detailData, 'detailLoading')}
            handleOpenUpdateDialog={updateDialog.handleOpenUpdateDialog}
            setDialogTab={setDialogTab}
            confirmDialog={confirmDialog}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}/>
    )

    const systemPagesList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const title = _.get(item, 'title')
        const keyName = _.get(item, 'keyName')
        const description = _.get(item, 'description')
        const createdDate = dateFormat(_.get(item, 'createdDate'), true)
        return (
            <Row key={id} className={classes.listRow} style={{alignItems: 'center'}}>
                <Link to={{
                    pathname: sprintf(ROUTES.SYSTEM_PAGES_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                    <Col xs={3}>{keyName}</Col>
                    <Col xs={3}>{title}</Col>
                    <Col xs={3}>{description}</Col>
                    <Col xs={3}>{createdDate}</Col>
                </Link>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: systemPagesList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.SYSTEM_PAGES_LIST_URL}/>
            <GridList
                filter={filter}
                list={list}
                detail={systemPagesDetail}
            />

            <SystemPagesCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                dialogTab={dialogTab}
                setDialogTab={setDialogTab}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <SystemPagesCreateDialog
                isUpdate={true}
                dialogTab={dialogTab}
                setDialogTab={setDialogTab}
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

SystemPagesGridList.propTypes = {
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

export default SystemPagesGridList
