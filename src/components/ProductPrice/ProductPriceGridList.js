import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import {reduxForm} from 'redux-form'
import {compose, withState, withHandlers} from 'recompose'
import sprintf from 'sprintf'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import Edit from 'material-ui/svg-icons/image/edit'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ProductPriceFilterForm from './ProductPriceFilterForm'
import ProductPriceCreateDialog from './ProductPriceCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import Popover from 'material-ui/Popover'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'
import {Link} from 'react-router'
import MainStyles from '../Styles/MainStyles'

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
        xs: 2
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
        name: 'price',
        title: 'Цена',
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
    injectSheet(_.merge(MainStyles, {
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
        wrapper: {
            width: '100%'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '65px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '700'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        containerPrice: {
            display: 'flex'
        },
        leftPrSide: {
            padding: '20px 30px',
            flexBasis: '30%',
            borderRight: '1px solid #efefef'
        },
        aboutPrice: {
            padding: '20px 0',
            '& span': {
                color: '#999'
            },
            '& p': {
                display: 'inline-block',
                '& span': {
                    fontSize: '11px !important'
                }
            },
            '& p:last-child': {
                fontWeight: '600',
                paddingLeft: '15px'
            }
        },
        rightPrSide: {
            padding: '20px 30px',
            flexBasis: '70%'
        },
        rawMaterials: {
            '& .dottedList': {
                padding: '10px 0'
            },
            '& li:last-child:after': {
                backgroundImage: 'none'
            },
            '& li div:last-child': {
                textAlign: 'right',
                paddingRight: '10px'
            },
            '& a': {
                borderBottom: '1px dashed'
            }
        },
        changePrice: {
            background: '#f1f5f8',
            margin: '0 -30px 0',
            padding: '20px 30px'
        },
        addPrice: {
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between'
        },
        popoverMode: {
            padding: '10px 30px',
            boxShadow: 'none !important',
            '& h4': {
                padding: '10px 0'
            },
            '& div p': {
                display: 'inline-block'
            },
            '& div p:first-child': {
                width: '120px'
            }
        }
    })),

    withState('showAddPrice', 'setShowAddPrice', false),
    withState('priceDetailsOpen', 'setPriceDetailsOpen', false),
    withState('anchorEl', 'setAnchorEl', (<div></div>)),

    withHandlers({
        handleOpenDetails: props => (event) => {
            props.setAnchorEl(event.currentTarget)
            props.setPriceDetailsOpen(true)
        },
        handleCloseDetails: props => (event) => {
            props.setPriceDetailsOpen(false)
        }
    }),

    reduxForm({
        form: 'ProductPriceCreateForm',
        enableReinitialize: true
    })
)

const tooltipPosition = 'bottom-center'

const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}

const ProductPriceGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        filterDialog,
        anchorEl,
        actionsDialog,
        confirmDialog,
        handleOpenDetails,
        handleCloseDetails,
        priceDetailsOpen,
        listData,
        detailData,
        classes
    } = props

    const detId = _.get(detailData, 'id')
    const detnName = _.get(detailData, ['data', 'name'])

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

    const productPriceFilterDialog = (
        <ProductPriceFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const productPriceDetail = (
        <div className={classes.wrapper} key={_.get(detailData, 'id')}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{detnName}</div>
            </div>
            <div className={classes.containerPrice}>
                <div className={classes.leftPrSide}>
                    <div>Расчет произведен на 1 еденицу продукта</div>
                    <div className={classes.aboutPrice}>
                        <p className={classes.priceLabel}>Cебестоимость:</p>
                        <p className={classes.priceCost}>20 000 UZS <span>(22 Апр, 2017)</span></p>
                    </div>
                    <hr className="lineDote"/>
                    <div className={classes.aboutPrice}>
                        <p className={classes.priceLabel}>Рыночная цена:</p>
                        <p className={classes.priceCost}>30 000 UZS <span>(22 Апр, 2017)</span></p>
                    </div>
                    <div className={classes.changePrice}>
                        <a onClick={() => { updateDialog.handleOpenUpdateDialog(detId) }}>Изменить рыночную стоимость</a>
                    </div>
                </div>
                <div className={classes.rightPrSide}>
                    <ul className={classes.rawMaterials}>
                        <li className="dottedList">
                            <Col xs={7}>
                                <strong>Сырье</strong>
                            </Col>
                            <Col xs={2}>
                                <strong>Обьем</strong>
                            </Col>
                            <Col xs={3}>
                                <strong>Стоимость</strong>
                            </Col>
                        </li>
                        <li className="dottedList">
                            <Col xs={7}>
                                Дистилированная вода
                            </Col>
                            <Col xs={2}>
                                100 л
                            </Col>
                            <Col xs={3}>
                                <a onClick={handleOpenDetails}>1 000 000 UZS</a>
                            </Col>
                        </li>
                        <li className="dottedList">
                            <Col xs={7}>
                                Дистилированная вода
                            </Col>
                            <Col xs={2}>
                                100 л
                            </Col>
                            <Col xs={3}>
                                <a onClick={handleOpenDetails}>1 000 000 UZS</a>
                            </Col>
                        </li>
                        <li className="dottedList">
                            <Col xs={7}>
                                Дистилированная вода
                            </Col>
                            <Col xs={2}>
                                100 л
                            </Col>
                            <Col xs={3}>
                                <a onClick={handleOpenDetails}>1 000 000 UZS</a>
                            </Col>
                        </li>
                        <li className="dottedList">
                            <Col xs={7}>
                                Дистилированная вода
                            </Col>
                            <Col xs={2}>
                                100 л
                            </Col>
                            <Col xs={3}>
                                <a onClick={handleOpenDetails}>1 000 000 UZS</a>
                            </Col>
                        </li>

                    </ul>
                </div>
            </div>
            <Popover
                open={priceDetailsOpen}
                anchorEl={anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                onRequestClose={handleCloseDetails}
            >
                <div className={classes.popoverMode}>
                    <h4>Дистилированая вода</h4>
                    <div>
                        <p>Объем:</p>
                        <p>100 л</p>
                    </div>
                    <div>
                        <p>Стоимость:</p>
                        <p>500 000 UZS</p>
                    </div>
                    <div>
                        <p>Доп. расход:</p>
                        <p>100 000 UZS</p>
                    </div>
                    <h4><i>Примерная стоимость 1 л = 6 000 UZS</i></h4>
                </div>
            </Popover>
        </div>
    )

    const productPriceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, ['type', 'name']) || 'N/A'
        const brand = _.get(item, ['brand', 'name']) || 'N/A'
        const measurement = _.get(item, ['measurement', 'name']) || ''
        const price = _.get(item, 'price') || 'N/A'
        return (
            <Row key={id}>
                <Col xs={3}>
                    <Link to={{
                        pathname: sprintf(ROUTES.PRODUCT_PRICE_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>{name}</Link>
                </Col>
                <Col xs={2}>{type}</Col>
                <Col xs={2}>{brand}</Col>
                <Col xs={2}>{measurement}</Col>
                <Col xs={2}>{price}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <IconButton
                        onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}
                        tooltip="Изменить"
                        touch={true}
                        tooltipPosition={tooltipPosition}
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}>
                        <Edit />
                    </IconButton>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: productPriceList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.PRODUCT_PRICE_LIST_URL}/>
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
                detail={productPriceDetail}
                actionsDialog={actions}
                filterDialog={productPriceFilterDialog}
            />

            <ProductPriceCreateDialog
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

ProductPriceGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
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

export default ProductPriceGridList
