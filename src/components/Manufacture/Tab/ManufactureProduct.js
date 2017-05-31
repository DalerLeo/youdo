import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ProductFilterForm from '../../Product/ProductFilterForm'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import Edit from 'material-ui/svg-icons/image/edit'
import FloatButton from 'material-ui/FlatButton'
import ManufactureDetails from '../ManufactureDetails'

import GridList from '../../GridList'
const listHeader = [
    {
        sorting: true,
        name: 'name',
        title: 'Наименование',
        xs: 4
    },
    {
        sorting: true,
        name: 'description',
        title: 'Описание',
        xs: 5
    },
    {
        sorting: true,
        name: 'bom',
        title: 'BoM',
        xs: 2
    },
    {
        sorting: true,
        name: 'action',
        title: '',
        xs: 1
    }
]
const enhance = compose(
    injectSheet({

        imgContent: {
            '& img': {
                width: '33%',
                margin: '1px'
            },
            height: '390px',
            boxSizing: 'border-box',
            overflowY: 'scroll'
        },
        cursor: {
            cursor: 'pointer'
        }
    })
)

const ManufactureProduct = enhance((props) => {
    const {classes, filter, filterDialog, productData, editMaterials} = props

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
    const detail = (
        <ManufactureDetails
            key={_.get(detailData, 'id')}
            id={_.get(detailData, 'id')}
            data={_.get(detailData, 'data')}
            handleOpenConfirmDialog={_.get(productData, ['confirmDialog', 'handleOpenConfirmDialog'])}
            handleOpenEditMaterials={_.get(editMaterials, ['handleOpen'])}
            loading={_.get(detailData, 'detailLoading')}
        />
    )

    const productList = _.map(_.get(productData, 'productList'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, ['type', 'name']) || 'N/A'
        const brand = _.get(item, ['brand', 'name']) || 'N/A'
        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id}>
                <Col xs={4}>
                    <span
                        className={classes.cursor}
                        onTouchTap={ () => {
                            productData.handleItemClick(id)
                        }}>
                        {name}
                    </span>
                </Col>
                <Col xs={5}>{type}</Col>
                <Col xs={2}>{brand}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText="Изменить"
                            leftIcon={<Edit />}
                        />
                        <MenuItem
                            primaryText="Удалить "
                            leftIcon={<DeleteIcon />}
                        />
                    </IconMenu>
                </Col>
            </Row>
        )
    })
    const productListExp = {
        header: listHeader,
        list: productList,
        loading: _.get(productData, 'listLoading')
    }
    const createDialog = _.get(productData, 'createDialog')
    return (
        <Row>
            <Col xs={12}>
                <div style={{padding: '10px 0', textAlign: 'right'}}>
                    <FloatButton onClick={createDialog.handleOpenCreateDialog} style={{color: '#12aaeb'}}>
                        <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}}
                                    viewBox="0 0 24 15"/>
                        добавить продукцию
                    </FloatButton>
                </div>
            </Col>
            <Col xs={12}>
                <GridList
                    filter={filter}
                    list={productListExp}
                    detail={detail}
                    actionsDialog={actions}
                    filterDialog={productFilterDialog}
                />
            </Col>
        </Row>
    )
})
ManufactureProduct.propTypes = {
    productData: PropTypes.object.isRequired
}

export default ManufactureProduct
