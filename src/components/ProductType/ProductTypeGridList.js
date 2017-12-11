import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import FlatButton from 'material-ui/FlatButton'
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
import SettingSideMenu from '../Settings/SettingsSideMenu'
import Tooltip from '../ToolTip'
import Dot from '../Images/dot.png'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 5,
        title: 'Категории'
    },
    {
        sorting: true,
        name: 'division',
        xs: 3,
        title: 'Подразделение'
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
            '& svg': {
                width: '14px !important',
                height: '14px !important'
            }
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
        subCategory: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover > div:last-child > div ': {
                opacity: '1'
            },
            '& > div:first-child': {
                paddingLeft: '50px'
            },
            '& > div:last-child': {
                paddingRight: '0'
            },
            '&:after': {
                content: '""',
                opacity: '0.5',
                background: 'url(' + Dot + ')',
                position: 'absolute',
                height: '2px',
                top: '0',
                left: '0',
                right: '0',
                marginTop: '1px'
            }
        },
        parentCategory: {
            width: '100%',
            '& > div:first-child': {
                paddingLeft: '0'
            },
            '&:hover > div:last-child > div ': {
                opacity: '1'
            }
        },
        marginLeft: {
            marginLeft: '20px !important'
        },
        right: {
            justifyContent: 'flex-end',
            textAlign: 'right',
            paddingRight: '0'
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

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
        rowWithParent: {
            flexWrap: 'wrap',
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            '& > div': {
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                '&:hover button': {
                    opacity: '1'
                }
            },
            '& > div:first-child': {
                fontWeight: '600'
            }
        },
        rowWithoutParent: {
            extend: 'rowWithParent',
            flexWrap: 'none'
        },
        iconBtn: {
            display: 'flex',
            opacity: '0',
            justifyContent: 'flex-end',
            transition: 'all 200ms ease-out'
        }
    })
)

const vertMenuStyle = {
    button: {
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30
    },
    icon: {
        color: '#666',
        width: 18,
        height: 18
    }
}
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
        const division = _.get(item, ['division', 'name'])
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const hasChild = !_.isEmpty(_.get(item, 'children'))
        const iconButton = (
            <IconButton
                disableTouchRipple={true}
                className={classes.verticalButton}
                style={vertMenuStyle.button}>
                <MoreVertIcon />
            </IconButton>
        )
        if (hasChild) {
            return (
                <Row key={id} className={classes.rowWithParent}>
                    <div className={classes.parentCategory}>
                        <Col xs={5}>{name}</Col>
                        <Col xs={3}>{division}</Col>
                        <Col xs={3}>{createdDate}</Col>
                        <Col xs={1} className={classes.right}>
                            <div className={classes.iconBtn}>
                                <Tooltip position="bottom" text="Изменить">
                                    <IconButton
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        disableTouchRipple={true}
                                        touch={true}
                                        onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip position="bottom" text="Удалить">
                                    <IconButton
                                        disableTouchRipple={true}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                                        touch={true}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </Col>
                    </div>
                    {_.map(_.get(item, 'children'), (child) => {
                        const childId = _.get(child, 'id')
                        const childName = _.get(child, 'name')
                        const childDivision = _.get(child, ['division', 'name']) || 'Не указано'
                        const childCreatedDate = dateFormat(_.get(child, 'createdDate'))
                        return (
                            <div key={childId} className={classes.subCategory}>
                                <Col xs={5}>{childName}</Col>
                                <Col xs={3}>{childDivision}</Col>
                                <Col xs={3}>{childCreatedDate}</Col>
                                <Col xs={1} className={classes.right}>
                                    <div className={classes.iconBtn}>
                                        <Tooltip position="bottom" text="Изменить">
                                            <IconButton
                                                iconStyle={iconStyle.icon}
                                                style={iconStyle.button}
                                                disableTouchRipple={true}
                                                touch={true}
                                                onTouchTap={() => { updateDialog.handleOpenUpdateDialog(childId) }}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip position="bottom" text="Удалить">
                                            <IconButton
                                                disableTouchRipple={true}
                                                iconStyle={iconStyle.icon}
                                                style={iconStyle.button}
                                                onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(childId) }}
                                                touch={true}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </Col>
                            </div>
                        )
                    })}
                </Row>
            )
        }
        return (
            <Row key={id} className={classes.rowWithoutParent}>
                <Col xs={5}>{name}</Col>
                <Col xs={3}>{division}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col xs={1} className={classes.right}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        iconStyle={vertMenuStyle.icon}
                        menuItemStyle={{fontSize: '13px'}}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText="Изменить"
                            leftIcon={<Edit />}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}
                        />
                        <MenuItem
                            primaryText="Удалить"
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
    const addButton = (
        <div className={classes.addButtonWrapper}>
            <FlatButton
                backgroundColor="#fff"
                labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb', fontSize: '13px'}}
                className={classes.addButton}
                label="добавить тип продукта"
                onTouchTap={createDialog.handleOpenCreateDialog}
                icon={<ContentAdd color="#12aaeb"/>}>
            </FlatButton>
        </div>
    )
    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.PRODUCT_TYPE_LIST_URL}/>
                <div className={classes.rightPanel}>
                    <GridList
                        filter={filter}
                        list={list}
                        detail={productTypeDetail}
                        actionsDialog={actions}
                        withoutPagination={true}
                        flexibleRow={true}
                        hoverableList={false}
                        listShadow={false}
                        addButton={addButton}
                    />
                </div>
            </div>

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
