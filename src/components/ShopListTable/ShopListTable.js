import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import React from 'react'
import {Link} from 'react-router'
import {Dimmer, Loader} from 'semantic-ui-react'
import GridList from '../GridList'
import Checkbox from 'material-ui/Checkbox'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'

const ShopGridList = (props) => {
    const {filter, loading, data} = props

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

    const body = _.map(data, (item, index) => {
        if (item === 6) {
            return (
                <Row className="grid__detail" key={index}>
                    <div>Hello</div>
                </Row>
            )
        }

        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const phone = _.get(item, 'phone')
        const address = _.get(item, 'address')
        const guide = _.get(item, 'guide')
        const contactName = _.get(item, 'contact_name')
        const createdDate = moment(_.get(item, 'created_date')).format('DD.MM.YYYY')

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
        <div>
            <Dimmer active={loading} inverted>
                <Loader size="large">Loading</Loader>
            </Dimmer>

            <GridList filter={filter} header={header} list={body} />
        </div>
    )
}

ShopGridList.propTypes = {
    filter: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
    data: React.PropTypes.array
}

export default ShopGridList
