import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ShopFilterForm from '../ShopFilterForm'
import ShopDetails from '../ShopDetails'
import ShopCreateDialog from '../ShopCreateDialog'
import DeleteDialog from '../DeleteDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'
const listHeader = [
    {
        sorting: true,
        name: 'name',
        title: 'Name'
    },
    {
        sorting: true,
        name: 'phone',
        title: 'Phone'
    },
    {
        sorting: true,
        name: 'address',
        title: 'Address'
    },
    {
        sorting: true,
        name: 'guide',
        title: 'Guide'
    },
    {
        sorting: true,
        name: 'contactName',
        title: 'Contact name'
    },
    {
        sorting: true,
        name: 'createdDate',
        title: 'Created date'
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

const ShopGridList = enhance((props) => {
    const {filter, createDialog, deleteDialog, filterDialog, actionsDialog,
        listData, confirmDialog, detailData, tabData, classes} = props

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

    const shopFilterDialog = (
        <ShopFilterForm
            initialValues={filterDialog.initialValues}
            open={filterDialog.openFilterDialog}
            onSubmit={filterDialog.handleSubmitFilterDialog}
            onClose={filterDialog.handleCloseFilterDialog}
        />
    )

    const shopDetail = (
        <ShopDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            deleteDialog={deleteDialog}
            confirmDialog={confirmDialog}
            loading={_.get(detailData, 'detailLoading')}
            tabData={tabData}
        />
    )

    const shopList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const phone = _.get(item, 'phone') || 'N/A'
        const address = _.get(item, 'address') || 'N/A'
        const guide = _.get(item, 'guide') || 'N/A'
        const contactName = _.get(item, 'contactName') || 'N/A'
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')

        return (
            <Row key={id}>
                <Col xs={2}>
                    <Link to={sprintf(ROUTES.SHOP_ITEM_PATH, id)}>{name}</Link>
                </Col>
                <Col xs={2}>{phone}</Col>
                <Col xs={2}>{address}</Col>
                <Col xs={2}>{guide}</Col>
                <Col xs={2}>{contactName}</Col>
                <Col xs={2}>{createdDate}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: shopList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu id={7}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить магазин">
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
                detail={shopDetail}
                handleOpenFilterDialog={filterDialog.handleOpenFilterDialog}
                actionsDialog={actions}
                filterDialog={shopFilterDialog}
            />
            <ShopCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                errors={createDialog.createErrors}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />
            <DeleteDialog
                filter={filter}
                open={deleteDialog.openDeleteDialog}
                onClose={deleteDialog.handleCloseDeleteDialog}
            />
        </Container>
    )
})

ShopGridList.defaultProps = {
    detailData: {},
    listData: {}
}

ShopGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object.isRequired,
    detailData: PropTypes.object.isRequired,
    tabData: PropTypes.object.isRequired,
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
    deleteDialog: PropTypes.shape({
        openDeleteDialog: PropTypes.bool.isRequired,
        handleOpenDeleteDialog: PropTypes.func.isRequired,
        handleCloseDeleteDialog: PropTypes.func.isRequired
    }).isRequired,
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default ShopGridList
