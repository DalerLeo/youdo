import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import moment from 'moment'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ProductFilterForm from '../../Product/ProductFilterForm'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import FloatButton from 'material-ui/FlatButton'
import ManufactureDetails from '../ManufactureDetails'
import GridList from '../../GridList'
const listHeader = [
    {
        sorting: true,
        name: 'name',
        title: 'Наименование',
        xs: 3
    },
    {
        sorting: true,
        name: 'type',
        title: 'Тип товара',
        xs: 3
    },
    {
        sorting: true,
        name: 'brand',
        title: 'Бренд',
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
    const {classes, filter, filterDialog, productData} = props

    const productFilterDialog = (
        <ProductFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const detailData = _.get(productData, 'detailData')
    const detail = (
        <ManufactureDetails
            key={_.get(detailData, 'id')}
            id={_.get(detailData, 'id')}
            data={_.get(detailData, 'data')}
            handleOpenConfirmDialog={_.get(productData, ['confirmDialog', 'handleOpenConfirmDialog'])}
            handleOpenUpdateDialog={_.get(productData, ['updateDialog', 'handleOpenUpdateDialog'])}
            loading={_.get(detailData, 'detailLoading')}
        />
    )

    const productList = _.map(_.get(productData, 'productList'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, ['type', 'name']) || 'N/A'
        const brand = _.get(item, ['brand', 'name']) || 'N/A'
        const measurement = _.get(item, ['measurement', 'name']) || ''
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        return (
            <Row key={id}>
                <Col xs={3}>
                    <span
                        className={classes.cursor}
                        onTouchTap={ () => {
                            productData.handleItemClick(id)
                        }}>
                        {name}
                    </span>
                </Col>
                <Col xs={3}>{type}</Col>
                <Col xs={2}>{brand}</Col>
                <Col xs={2}>{measurement}</Col>
                <Col xs={2}>{createdDate}</Col>
            </Row>
        )
    })
    const productListExp = {
        header: listHeader,
        list: productList,
        loading: _.get(productData, 'listLoading')
    }
    const actions = (
        <div>
            <IconButton>
                {/*onTouchTap={actionsDialog.handleActionEdit}*/}
                <ModEditorIcon />
            </IconButton>

            <IconButton>
                {/*onTouchTap={actionsDialog.handleActionDelete}*/}
                <DeleteIcon />
            </IconButton>
        </div>
    )
    const createDialog = _.get(productData, 'createDialog')
    return (
        <Row>
            <div>
                <FloatButton onClick={createDialog.handleOpenCreateDialog}>
                    <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}}
                                viewBox="0 0 24 15"/>
                    добавить продукцию
                </FloatButton>
            </div>
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
