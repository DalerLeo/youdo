import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import React from 'react'
import {Link} from 'react-router'
import {Table, Button, Icon, Dimmer, Loader} from 'semantic-ui-react'
import Pagination from '../Pagination'
import TableWithNoData from '../TableWithNoData'
import TableWithSorting from '../TableWithSorting'
import * as ROUTES from '../../constants/routes'

const BrokerListTable = (props) => {
    const {filter, loading, data} = props

    const columns = [
        {
            columnSorted: false,
            columnName: 'id',
            columnTitle: '#'
        },
        {
            columnSorted: true,
            columnName: 'name',
            columnTitle: 'Name'
        },
        {
            columnSorted: true,
            columnName: 'phone',
            columnTitle: 'Phone'
        },
        {
            columnSorted: true,
            columnName: 'address',
            columnTitle: 'Address'
        },
        {
            columnSorted: true,
            columnName: 'guide',
            columnTitle: 'Guide'
        },
        {
            columnSorted: true,
            columnName: 'contactName',
            columnTitle: 'Contact name'
        },
        {
            columnSorted: true,
            columnName: 'createdDate',
            columnTitle: 'Created date'
        }

    ]

    const items = _.map(data, (item, index) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const phone = _.get(item, 'phone')
        const address = _.get(item, 'address')
        const guide = _.get(item, 'guide')
        const contactName = _.get(item, 'contact_name')
        const createdDate = moment(_.get(item, 'created_date')).format('DD.MM.YYYY')

        return (
            <Table.Row key={index}>
                <Table.Cell style={{width: '50px'}}>{id}</Table.Cell>
                <Table.Cell>
                    <Link to={sprintf(ROUTES.BROKER_EDIT_PATH, id)}>
                        {name}
                    </Link>
                </Table.Cell>
                <Table.Cell>{phone}</Table.Cell>
                <Table.Cell>{address}</Table.Cell>
                <Table.Cell>{guide}</Table.Cell>
                <Table.Cell>{contactName}</Table.Cell>
                <Table.Cell>{createdDate}</Table.Cell>
            </Table.Row>
        )
    })

    return (
        <div>
            <Dimmer active={loading} inverted>
                <Loader size="large">Loading</Loader>
            </Dimmer>

            <Table celled>
                <TableWithSorting
                    filter={filter}
                    columns={columns}
                />

                <TableWithNoData
                    colSpan={6}
                    data={items}
                    text="No Data"
                />

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan={columns.length}>
                            {filter && <Pagination filter={filter} />}
                            <Link to={ROUTES.BROKER_CREATE_URL}>
                                <Button floated="right" icon={true} labelPosition="left" positive size="small">
                                    <Icon name="add" /> Add
                                </Button>
                            </Link>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </div>
    )
}

BrokerListTable.propTypes = {
    filter: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
    data: React.PropTypes.array
}

export default BrokerListTable
