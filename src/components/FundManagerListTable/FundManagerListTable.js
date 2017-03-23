import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import {Link} from 'react-router'
import {Table, Button, Icon, Dimmer, Loader} from 'semantic-ui-react'
import Pagination from '../Pagination'
import TableWithNoData from '../TableWithNoData'
import TableWithSorting from '../TableWithSorting'
import * as ROUTES from '../../constants/routes'

const FundManagerListTable = (props) => {
    const {filter, loading, data} = props
    const columns = [
        {
            columnSorted: false,
            columnName: 'id',
            columnTitle: '#'
        },
        {
            columnSorted: true,
            columnName: 'username',
            columnTitle: 'Name'
        },
        {
            columnSorted: true,
            columnName: 'first_name',
            columnTitle: 'First Name'
        },
        {
            columnSorted: true,
            columnName: 'second_name',
            columnTitle: 'Second Name'
        }

    ]

    const items = _.map(data, (item, index) => {
        const id = _.get(item, 'id')
        const username = _.get(item, 'username')
        const firstName = _.get(item, 'first_name')
        const secondName = _.get(item, 'second_name')

        return (
            <Table.Row key={index}>
                <Table.Cell style={{width: '50px'}}>{id}</Table.Cell>
                <Table.Cell>
                    <Link to={sprintf(ROUTES.FUND_MANAGER_EDIT_PATH, id)}>
                        {username}
                    </Link>
                </Table.Cell>
                <Table.Cell>{firstName}</Table.Cell>
                <Table.Cell>{secondName}</Table.Cell>
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
                        <Table.HeaderCell colSpan="4">
                            {filter && <Pagination filter={filter} />}
                            <Link to={ROUTES.FUND_MANAGER_CREATE_URL}>
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

FundManagerListTable.propTypes = {
    filter: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
    data: React.PropTypes.array
}

export default FundManagerListTable
