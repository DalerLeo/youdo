import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import CategoryCreateDialog from './CategoryCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Edit from 'material-ui/svg-icons/image/edit'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        xs: 2,
        title: 'Id'
    },
    {
        sorting: true,
        name: 'name',
        xs: 6,
        title: 'Наименование'
    },
    {
        sorting: true,
        xs: 3,
        name: 'created_date',
        title: 'Дата создания'
    },
    {
        sorting: false,
        xs: 1,
        name: 'actions',
        title: ''
    }
]

const enhance = compose(
    injectSheet({
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        }
    })
)

const CategoryGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        confirmDialog,
        listData,
        detailData,
        classes
    } = props

    const actions = (
        <div>

        </div>
    )

    const categoryDetail = (
        <span>a</span>
    )

    const categoryList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id} style={{alignItems: 'center'}}>
                <Col xs={2}>{id}</Col>
                <Col xs={6}>{name}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText="Изменить"
                            leftIcon={<Edit />}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}
                        />
                        <MenuItem
                            primaryText="Удалить "
                            leftIcon={<DeleteIcon />}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                        />
                    </IconMenu>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: categoryList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.CATEGORY_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить категорию">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <GridList
                filter={filter}
                list={list}
                detail={categoryDetail}
                actionsDialog={actions}
            />

            <CategoryCreateDialog
                initialValues={{}}
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <CategoryCreateDialog
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

CategoryGridList.propTypes = {
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

export default CategoryGridList
