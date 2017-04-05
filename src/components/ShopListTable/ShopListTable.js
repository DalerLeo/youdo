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
import ShopFilter from '../ShopFilter'

const ShopGridList = (props) => {
    const {filter, loading, list, detailId} = props

    const header = [
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

    const actions = (
        <div>
            <IconButton onClick={() => console.log('Click to edit')}>
                <ModEditorIcon />
            </IconButton>

            <IconButton onClick={() => console.log('Click to delete')}>
                <DeleteIcon />
            </IconButton>
        </div>
    )

    const filterDialog = (
        <ShopFilter onSubmit={() => console.log('filtering')} />
    )

    const body = _.map(list, (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const phone = _.get(item, 'phone')
        const address = _.get(item, 'address')
        const guide = _.get(item, 'guide')
        const contactName = _.get(item, 'contactName')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')

        if (id === detailId) {
            return (
                <ShopDetails key={id} item={item} />
            )
        }

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

    return (
        <GridList
            filter={filter}
            filterDialog={filterDialog}
            loading={loading}
            actions={actions}
            detailId={detailId}
            header={header}
            list={body}
        />
    )
}

ShopGridList.propTypes = {
    filter: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
    list: React.PropTypes.array
}

export default ShopGridList
