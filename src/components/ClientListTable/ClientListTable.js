import _ from 'lodash'
import React from 'react'
import {Table, Button, Icon, Dimmer, Loader} from 'semantic-ui-react'
import {Link} from 'react-router'
import Pagination from '../Pagination'
import TableWithSorting from '../TableWithSorting'
import TableWithNoData from '../TableWithNoData'
import * as ROUTES from '../../constants/routes'

const ClientListTable = ({data, loading, filter}) => {
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
            columnName: 'reference.name',
            columnTitle: 'Reference'
        },
        {
            columnSorted: true,
            columnName: 'reference.reference.name',
            columnTitle: 'Sub Reference'
        }
    ]
    const items = _.map(data, (item, index) => {
        const id = _.get(item, ['id'])
        const name = _.get(item, ['name'])
        const reference = _.get(item, 'reference_name') || 'N/A'
        const subReference = _.get(item, 'sub_reference_name') || 'N/A'

        return (
            <Table.Row key={index}>
                <Table.Cell style={{width: '50px'}}>{id}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{reference}</Table.Cell>
                <Table.Cell>{subReference}</Table.Cell>
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
                    colSpan={4}
                    data={items}
                    text="No data"
                />

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan="4">
                            {filter && <Pagination filter={filter} />}
                            <Link to={ROUTES.CLIENT_CREATE}>
                                <Button
                                    icon={true}
                                    positive={true}
                                    size="small"
                                    floated="right"
                                    labelPosition="left">
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

ClientListTable.propTypes = {
    data: React.PropTypes.array,
    loading: React.PropTypes.bool.isRequired,
    filter: React.PropTypes.object
}

export default ClientListTable

