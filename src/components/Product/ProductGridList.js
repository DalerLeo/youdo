import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import Edit from 'material-ui/svg-icons/image/edit'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ProductFilterForm from './ProductFilterForm'
import ProductCreateDialog from './ProductCreateDialog'
import ProductShowPhotoDialog from './ProductShowPhotoDialog'
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
import Landscape from 'material-ui/svg-icons/image/landscape'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        title: 'Наименование',
        xs: 3
    },
    {
        sorting: true,
        name: 'code',
        title: 'Код товара',
        xs: 2
    },
    {
        sorting: true,
        name: 'type',
        title: 'Тип товара',
        xs: 2
    },
    {
        sorting: true,
        name: 'measurement',
        title: 'Мера',
        xs: 2
    },
    {
        sorting: true,
        name: 'created_date',
        title: 'Дата создания',
        xs: 2
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
        productImg: {
            width: '30px',
            height: '30px',
            overflow: 'hidden',
            marginRight: '5px',
            display: 'inline-block',
            borderRadius: '4px',
            textAlign: 'center',
            '& img': {
                height: '30px'
            }
        }
    })
)

const ProductGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        filterDialog,
        showBigImg,
        confirmDialog,
        listData,
        detailData,
        classes
    } = props

    const productFilterDialog = (
        <ProductFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const productDetail = (
        <span>a</span>
    )

    const productList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const codeProduct = _.get(item, 'code') || 'не установлено'
        const type = _.get(item, ['type', 'name']) || 'N/A'
        const image = _.get(item, ['image', 'file'])
        const measurement = _.get(item, ['measurement', 'name']) || ''
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id}>
                <Col xs={3} style={{display: 'flex', alignItems: 'center'}}>
                    <div className={classes.productImg}>
                        {_.isEmpty(image) ? <Landscape style={{color: '#999', paddingTop: '2px'}} />
                            : <a onClick={() => showBigImg.handleOpenShowBigImg(id)}><img src={image} /> </a>}
                    </div>
                    <div style={{display: 'inline-block'}}>{name}</div>
                </Col>
                <Col xs={2}>{codeProduct}</Col>
                <Col xs={2}>{type}</Col>
                <Col xs={2}>{measurement}</Col>
                <Col xs={2}>{createdDate}</Col>
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
        list: productList,
        loading: _.get(listData, 'listLoading')
    }

    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(_.get(detailData, 'id'))})
    return (
        <Container>
            <SubMenu url={ROUTES.PRODUCT_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить продукт">
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
                detail={productDetail}
                filterDialog={productFilterDialog}
            />

            <ProductCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <ProductCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <ProductShowPhotoDialog
                initialValues={showBigImg.initialValues}
                open={showBigImg.openShowBigImg}
                loading={_.get(showBigImg, 'showBigImgLoading')}
                onClose={showBigImg.handleCloseShowBigImg}
                detailData={detailData}
            />

            {currentDetail && <ConfirmDialog
                type="delete"
                message={_.get(currentDetail, 'name')}
                loading={confirmDialog.confirmLoading}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

ProductGridList.propTypes = {
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
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default ProductGridList
