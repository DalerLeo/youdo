import _ from 'lodash'
import React from 'react'
import sprintf from 'sprintf'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import InventoryDetails from './InventoryDetails'
import dateFormat from '../../helpers/dateFormat'
import FilterForm from './InventoryFilterForm'
import {reduxForm} from 'redux-form'
import GridList from '../GridList'
import Tooltip from '../ToolTip'
import InventoryDialog from './InventoryDialog'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/communication/clear-all'

const enhance = compose(
    injectSheet({
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        listRow: {
            '& > div': {
                '&:first-child': {
                    paddingLeft: '0'
                },
                '&:last-child': {
                    paddingRight: '0'
                }
            },
            '& a': {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                width: '100%'
            }
        },
        buttons: {
            display: 'flex',
            alignItems: 'center',
            height: '60px',
            position: 'absolute',
            top: '0',
            right: '0',
            fontWeight: '600',
            '& button': {
                '& span': {
                    fontWeight: '600 !important',
                    textTransform: 'none !important',
                    verticalAlign: 'baseline !important'
                }
            }
        }
    }),
    reduxForm({
        form: 'InventorySearchForm',
        enableReinitialize: true
    }),
)

const headerItems = [
    {
        name: 'stock',
        sorting: true,
        title: 'Склад',
        xs: 3
    },
    {
        name: 'createdBy',
        sorting: false,
        title: 'Создал',
        xs: 3
    },
    {
        sorting: true,
        name: 'createdDate',
        title: 'Дата создания',
        xs: 2
    },
    {
        sorting: true,
        name: 'comment',
        title: 'Комментарий',
        xs: 4
    }
]

const InventoryGridList = enhance((props) => {
    const {
        detailData,
        classes,
        filter,
        listData,
        handleCloseDetail,
        filterDialog,
        inventoryDialog
    } = props
    const listLoading = _.get(listData, 'listLoading')

    const remainderFilterDialog = (
        <FilterForm
            filterDialog={filterDialog}
            filter={filter}
            initialValues={filterDialog.initialValues}/>
    )

    const remainderDetail = (
        <InventoryDetails
            key={_.get(detailData, 'id')}
            detailData={detailData || {}}
            handleCloseDetail={handleCloseDetail}/>

    )

    const remainderList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const stock = _.get(item, ['stock', 'name'])
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const comment = _.get(item, 'comment') || 'Комментариев нет'
        const createdBy = _.get(item, ['createdBy', 'firstName']) + ' ' + _.get(item, ['createdBy', 'secondName'])
        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={3}>{stock}</Col>
                <Col xs={3}>{createdBy}</Col>
                <Link to={{
                    pathname: sprintf(ROUTES.INVENTORY_ITEM_PATH, id),
                    query: filter.getParams()
                }}/>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={4}>{comment}</Col>
            </Row>
        )
    })

    const list = {
        header: headerItems,
        list: remainderList,
        loading: listLoading
    }

    return (
        <Container>
            <SubMenu url={ROUTES.INVENTORY_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Инвентаризация">
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb"
                        onTouchTap={inventoryDialog.handleOpenInventoryDialog}>
                        <ContentAdd/>
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <GridList
                filter={filter}
                list={list}
                detail={remainderDetail}
                filterDialog={remainderFilterDialog}
            />

            <InventoryDialog
                data={inventoryDialog.data}
                loading={inventoryDialog.loading}
                moreLoading={inventoryDialog.moreLoading}
                loadMore={inventoryDialog.loadMore}
                open={inventoryDialog.openInventoryDialog}
                onClose={inventoryDialog.handleCloseInventoryDialog}
                onSubmit={inventoryDialog.handleSubmitInventoryDialog}
                stockChooseDialog={inventoryDialog.stockChooseDialog}
                filterStock={inventoryDialog.filterStock}
                filter={filter}
            />
        </Container>
    )
})

InventoryGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    filterItem: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    filterDialog: PropTypes.shape({
        openFilterDialog: PropTypes.bool.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired,
        handleClearFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    inventoryDialog: PropTypes.shape({
        data: PropTypes.array,
        loading: PropTypes.bool,
        moreLoading: PropTypes.bool,
        openInventoryDialog: PropTypes.bool,
        stockChooseDialog: PropTypes.bool,
        filterStock: PropTypes.func.isRequired,
        loadMore: PropTypes.func.isRequired,
        handleOpenInventoryDialog: PropTypes.func.isRequired,
        handleCloseInventoryDialog: PropTypes.func.isRequired,
        handleSubmitInventoryDialog: PropTypes.func.isRequired
    }).isRequired
}

export default InventoryGridList
