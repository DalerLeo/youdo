import _ from 'lodash'
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
            columnTitle: 'Broker'
        }

    ]

    const items = _.map(data, (item, index) => {
        const id = _.get(item, 'id')
        const broker = _.get(item, 'name')

        return (
            <Table.Row key={index}>
                <Table.Cell style={{width: '50px'}}>{id}</Table.Cell>
                <Table.Cell>
                    <Link to={sprintf(ROUTES.BROKER_EDIT_PATH, id)}>
                        {broker}
                    </Link>
                </Table.Cell>
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
                        <Table.HeaderCell colSpan="2">
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
