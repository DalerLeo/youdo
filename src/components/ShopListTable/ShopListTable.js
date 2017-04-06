import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import React from 'react'
import {Link} from 'react-router'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import GridList from '../GridList'
import * as ROUTES from '../../constants/routes'
import ShopDetails from '../ShopDetails'
import ShopFilterForm from '../ShopFilterForm'

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

const ShopGridList = (props) => {
    const {filter, filterDialog, actionsDialog, listData, detailData} = props

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
            data={_.get(detailData, 'data')}
            loading={_.get(detailData, 'loading')}
        />
    )

    const shopList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const phone = _.get(item, 'phone')
        const address = _.get(item, 'address')
        const guide = _.get(item, 'guide')
        const contactName = _.get(item, 'contactName')
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
        loading: _.get(listData, 'loading')
    }

    return (
        <GridList
            filter={filter}
            list={list}
            detail={shopDetail}
            handleOpenFilterDialog={filterDialog.handleOpenFilterDialog}
            actionsDialog={actions}
            filterDialog={shopFilterDialog}
        />
    )
}

ShopGridList.defaultProps = {
    detailData: {},
    listData: {}
}

ShopGridList.propTypes = {
    filter: React.PropTypes.object.isRequired,
    listData: React.PropTypes.object.isRequired,
    detailData: React.PropTypes.object.isRequired,
    actionsDialog: React.PropTypes.shape({
        handleActionEdit: React.PropTypes.func.isRequired,
        handleActionDelete: React.PropTypes.func.isRequired
    }).isRequired,
    filterDialog: React.PropTypes.shape({
        initialValues: React.PropTypes.object,
        filterLoading: React.PropTypes.bool,
        openFilterDialog: React.PropTypes.bool.isRequired,
        handleOpenFilterDialog: React.PropTypes.func.isRequired,
        handleCloseFilterDialog: React.PropTypes.func.isRequired,
        handleSubmitFilterDialog: React.PropTypes.func.isRequired
    }).isRequired
}

export default ShopGridList
