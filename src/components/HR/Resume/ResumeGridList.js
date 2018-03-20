import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import sprintf from 'sprintf'
import GridList from '../../GridList'
import Container from '../../Container'
import ResumeCreateDialog from './ResumeCreateDialog'
import ConfirmDialog from '../../ConfirmDialog'
import SubMenu from '../../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ToolTip from '../../ToolTip'
import {Link} from 'react-router'
import ResumeDetail from './ResumeDetails'
import ResumeFilterForm from './ResumeFilterForm'
import dateFormat from '../../../helpers/dateFormat'
import t from '../../../helpers/translate'

const listHeader = [
    {
        sorting: true,
        name: 'position',
        xs: 3,
        title: t('Должность')
    },
    {
        sorting: true,
        name: 'experience',
        xs: 2,
        title: t('Опыт работы')
    },
    {
        sorting: true,
        xs: 3,
        name: 'fullName',
        title: t('Ф.И.О.')
    },
    {
        sorting: true,
        xs: 2,
        name: 'createdDate',
        title: t('Дата добавления')
    },
    {
        sorting: true,
        alignRight: true,
        xs: 2,
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

const ResumeGridList = enhance((props) => {
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

    const resumefilterDialog = (
        <ResumeFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const resumeDetail = (
        <ResumeDetail
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            loading={_.get(detailData, 'detailLoading')}
            handleOpenUpdateDialog={updateDialog.handleOpenUpdateDialog}
            confirmDialog={confirmDialog}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}/>
    )

    const resumeList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const position = _.get(item, ['position', 'name'])
        const experience = _.get(item, ['experience'])
        const fullName = _.get(item, ['fullName'])
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        return (
            <Row key={id} className={classes.listRow} style={{alignItems: 'center'}}>
                <Link to={{
                    pathname: sprintf(ROUTES.HR_RESUME_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                    <Col xs={3}>{position}</Col>
                    <Col xs={2}>{experience}</Col>
                    <Col xs={3}>{fullName}</Col>
                    <Col xs={2}>{createdDate}</Col>
                    <Col xs={2} className={classes.buttons}>
                    </Col>
                </Link>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: resumeList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.HR_RESUME_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <ToolTip position="left" text={t('Добавить резюме')}>
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
                filterDialog={resumefilterDialog}
                detail={resumeDetail}
            />

            <ResumeCreateDialog
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

            <ResumeCreateDialog
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

ResumeGridList.propTypes = {
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

export default ResumeGridList
