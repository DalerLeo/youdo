import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import PriceFilterForm from './PriceFilterForm'
import PriceSupplyDialog from './PriceSupplyDialog'
import SubMenu from '../SubMenu'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import PriceDetails from './PriceDetails'
const listHeader = [
    {
        sorting: true,
        name: 'name',
        title: 'Названия',
        xs: 5
    },
    {
        sorting: true,
        name: 'type',
        title: 'Себестоимость',
        xs: 2
    },
    {
        sorting: true,
        name: 'price',
        title: 'Цена',
        xs: 3
    },
    {
        sorting: true,
        name: 'created_date',
        title: 'Дата обновления',
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
        priceImg: {
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
const PriceGridList = enhance((props) => {
    const {
        filter,
        filterDialog,
        confirmDialog,
        priceSupplyDialog,
        priceSetForm,
        listData,
        detailData
    } = props
    const priceFilterDialog = (
        <PriceFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )
    const priceDetail = (
        <PriceDetails
            key={_.get(detailData, 'id')}
            detailData={detailData}
            priceSupplyDialog={priceSupplyDialog}
            priceSetForm = {priceSetForm}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
            mergedList={detailData.mergedList()}>
        </PriceDetails>
    )
    const priceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, ['type', 'name']) || 'N/A'
        const price = _.get(item, ['measurement', 'name']) || ''
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id}>
                <Col xs={5} style={{display: 'flex', alignItems: 'center'}}>
                    <Link to={{
                        pathname: sprintf(ROUTES.PRICE_ITEM_PATH, id),
                        query: ''
                    }}>{name}</Link>
                </Col>
                <Col xs={2}>{type}</Col>
                <Col xs={2}>{price}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
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
        list: priceList,
        loading: _.get(listData, 'listLoading')
    }
    return (
        <Container>
            <SubMenu url={ROUTES.PRICE_LIST_URL}/>
            <GridList
                filter={filter}
                list={list}
                detail={priceDetail}
                filterDialog={priceFilterDialog}
            />
            <PriceSupplyDialog
                open={priceSupplyDialog.openPriceSupplyDialog}
                onClose={priceSupplyDialog.handleCloseSupplyDialog}
            />
        </Container>
    )
})
PriceGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    priceSupplyDialog: PropTypes.shape({
        openPriceSupplyDialog: PropTypes.bool.isRequired,
        handleOpenSupplyDialog: PropTypes.func.isRequired,
        handleCloseSupplyDialog: PropTypes.func.isRequired
    }).isRequired,
    priceSetForm: PropTypes.shape({
        openPriceSetForm: PropTypes.bool.isRequired,
        handleOpenPriceSetForm: PropTypes.func.isRequired,
        handleClosePriceSetForm: PropTypes.func.isRequired,
        handleSubmitPriceSetForm: PropTypes.func.isRequired
    }).isRequired
}
export default PriceGridList
