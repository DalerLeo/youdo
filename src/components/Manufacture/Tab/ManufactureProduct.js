import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ProductFilterForm from '../../Product/ProductFilterForm'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import FlatButton from 'material-ui/FlatButton'
import ManufactureDetails from '../ManufactureDetails'
import Choose from '../../Images/choose-menu.png'

import GridList from '../../GridList'
const listHeader = [
    {
        sorting: false,
        name: 'name',
        title: 'Наименование',
        xs: 5
    },
    {
        sorting: false,
        name: 'description',
        title: 'Описание',
        xs: 4
    },
    {
        sorting: false,
        name: 'bom',
        title: 'BoM',
        xs: 3
    }
]
const enhance = compose(
    injectSheet({
        listRow: {
            cursor: 'pointer',
            width: 'auto !important',
            margin: '0 -30px !important',
            padding: '0 30px'
        },
        imgContent: {
            '& img': {
                width: '33%',
                margin: '1px'
            },
            height: '390px',
            overflowY: 'scroll'
        },
        cursor: {
            cursor: 'pointer'
        },
        choose: {
            background: 'url(' + Choose + ') no-repeat center 50px',
            backgroundSize: '200px',
            marginTop: '20px',
            padding: '245px 0 30px',
            textAlign: 'center',
            fontSize: '15px',
            color: '#666'
        }
    })
)

const ManufactureProduct = enhance((props) => {
    const {classes, filter, filterDialog, productData, editMaterials, createMaterials, deleteMaterials, handleCloseDetail, manufactureId} = props
    const ZERO = 0

    const productFilterDialog = (
        <ProductFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const actions = (
        <div>
            <IconButton>
                <ModEditorIcon />
            </IconButton>

            <IconButton>
                <DeleteIcon />
            </IconButton>
        </div>
    )

    const detailData = _.get(productData, 'detailData')
    const productTitle = _.get(_.find(_.get(productData, 'productList'), {'id': _.toInteger(_.get(productData, ['detailData', 'id']))}), 'name')
    const detail = (
        <ManufactureDetails
            createMaterials={createMaterials}
            productTitle={productTitle}
            key={_.get(detailData, 'id')}
            id={_.get(detailData, 'id')}
            data={_.get(detailData, 'data')}
            handleDeleteAllIngredient={_.get(productData, ['confirmDialog', 'handleOpenConfirmDialog'])}
            handleOpenConfirmDialog={_.get(deleteMaterials, ['handleOpenConfirmDialog'])}
            handleOpenEditMaterials={_.get(editMaterials, ['handleOpen'])}
            handleOpenChangeManufacture={_.get(productData, ['changeManufacture', 'handleOpenChangeManufacture'])}
            loading={_.get(detailData, 'detailLoading')}
            handleCloseDetail={handleCloseDetail}
        />
    )
    const productList = _.map(_.get(productData, 'productList'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, ['type', 'name']) || 'N/A'
        const brand = _.get(item, ['brand', 'name']) || 'N/A'
        return (
            <Row className={classes.listRow} key={id} onClick={ () => { productData.handleItemClick(id) }}>
                <Col xs={5}>{name}</Col>
                <Col xs={4}>{type}</Col>
                <Col xs={3}>{brand}</Col>
            </Row>
        )
    })
    const productListExp = {
        header: listHeader,
        list: productList,
        loading: _.get(productData, 'listLoading')
    }
    const createDialog = _.get(productData, 'createDialog')
    if (manufactureId <= ZERO) {
        return (
            <Paper zDepth={1} className={classes.choose}>
                <div>Выберите производство...</div>
            </Paper>
        )
    }
    return (
        <div>
            <div style={{padding: '10px 0', textAlign: 'right'}}>
                <FlatButton
                    label="Добавить продукцию"
                    onClick={createDialog.handleOpenCreateDialog}
                    labelStyle={{color: '#12aaeb', fontSize: '13px', textTransform: 'normal'}}
                    icon={<ContentAdd style={{width: 13, height: 13, fill: '#12aaeb'}}/>}/>
            </div>
            <GridList
                filter={filter}
                list={productListExp}
                detail={detail}
                actionsDialog={actions}
                filterDialog={productFilterDialog}
            />
        </div>
    )
})
ManufactureProduct.propTypes = {
    productData: PropTypes.object.isRequired
}

export default ManufactureProduct
