import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import {Link} from 'react-router'
import {Icon, Table, Button, Dimmer, Loader} from 'semantic-ui-react'
import Pagination from '../Pagination'
import TableWithNoData from '../TableWithNoData'
import * as ROUTES from '../../constants/routes'
import currencyFormat from '../../helpers/currencyFormat'

const DailyEntryListTable = ({data, loading, filter}) => {
    const items = _.map(data, (item, index) => {
        const id = _.get(item, 'id')
        const client = _.get(item, 'client_name')
        const date = moment(_.get(item, 'date')).format('DD.MM.YYYY')
        const number = _.get(item, 'account_number')
        const amount = _.get(item, 'amount')

        return (
            <Table.Row key={index}>
                <Table.Cell style={{width: '50px'}}>{id}</Table.Cell>
                <Table.Cell>{client}</Table.Cell>
                <Table.Cell>{number}</Table.Cell>
                <Table.Cell>{currencyFormat(amount)}</Table.Cell>
                <Table.Cell>{date}</Table.Cell>
            </Table.Row>
        )
    })

    return (
        <div>
            <Dimmer active={loading} inverted>
                <Loader size="large">Loading</Loader>
            </Dimmer>

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>#</Table.HeaderCell>
                        <Table.HeaderCell>Client</Table.HeaderCell>
                        <Table.HeaderCell>Account</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <TableWithNoData
                    colSpan={5}
                    data={items}
                    text="No data"
                />

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan="6">
                            {filter && <Pagination filter={filter} />}
                            <Link to={ROUTES.DAILY_ENTRY_CREATE_URL}>
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

DailyEntryListTable.propTypes = {
    data: React.PropTypes.array,
    loading: React.PropTypes.bool.isRequired,
    filter: React.PropTypes.object
}

export default DailyEntryListTable
