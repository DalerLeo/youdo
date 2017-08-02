import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import * as ROUTES from '../../constants/routes'
import dateFormat from '../../helpers/dateFormat'
import GridList from '../GridList'
import Container from '../Container'
import ProductTypeCreateDialog from './ProductTypeCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import Tooltip from '../ToolTip'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 8,
        title: 'Категории'
    },
    {
        sorting: true,
        xs: 3,
        name: 'created_date',
        title: 'Дата создания'
    },
    {
        sorting: true,
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
        },
        rowWithParent: {
            flexWrap: 'wrap',
            '& > div:first-child': {
                fontWeight: '600'
            }
        },
        rowWithoutParent: {
            '& > div:first-child': {
                fontWeight: '600'
            }
        },
        subCategory: {
            width: '100%',
            borderTop: '1px #efefef solid',
            display: 'flex',
            alignItems: 'center',
            '& > div:first-child': {
                paddingLeft: '50px'
            },
            '& > div:last-child': {
                paddingRight: '0'
            }
        },
        marginLeft: {
            marginLeft: '20px !important'
        },
        right: {
            textAlign: 'right',
            paddingRight: '0'
        }
    })
)

const ProductTypeGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        actionsDialog,
        confirmDialog,
        listData,
        detailData,
        classes
    } = props

    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon />
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <DeleteIcon />
            </IconButton>
        </div>
    )

    const productTypeDetail = (
        <span>a</span>
    )
    const productTypeList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const hasChild = !_.isEmpty(_.get(item, 'children'))
        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon />
            </IconButton>
        )
        if (hasChild) {
            return (
                <Row key={id} className={classes.rowWithParent}>
                    <Col xs={8}>{name}</Col>
                    <Col xs={3}>{createdDate}</Col>
                    <Col xs={1} className={classes.right}>
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
                    {_.map(_.get(item, 'children'), (child) => {
                        const childName = _.get(child, 'name')
                        const childId = _.get(child, 'id')
                        const childCreatedDate = dateFormat(_.get(child, 'createdDate'))
                        return (
                            <div key={childId} className={classes.subCategory}>
                                <Col xs={8}>{childName}</Col>
                                <Col xs={3}>{childCreatedDate}</Col>
                                <Col xs={1} className={classes.right}>
                                    <IconMenu
                                        iconButtonElement={iconButton}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                                        <MenuItem
                                            primaryText="Изменить"
                                            leftIcon={<Edit />}
                                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(childId) }}
                                        />
                                        <MenuItem
                                            primaryText="Удалить "
                                            leftIcon={<DeleteIcon />}
                                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(childId) }}
                                        />
                                    </IconMenu>
                                </Col>
                            </div>
                        )
                    })}
                </Row>
            )
        }
        return (
            <Row key={id} className={classes.rowWithoutParent}>
                <Col xs={8}>{name}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col xs={1} className={classes.right}>
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
        list: productTypeList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.PRODUCT_TYPE_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить тип продукта">
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
                detail={productTypeDetail}
                actionsDialog={actions}
                withoutPagination={true}
                flexibleRow={true}
            />

            <ProductTypeCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <ProductTypeCreateDialog
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
                loading={confirmDialog.confirmLoading}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

ProductTypeGridList.propTypes = {
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
        confirmLoading: PropTypes.bool.isRequired,
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
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired
}

export default ProductTypeGridList
