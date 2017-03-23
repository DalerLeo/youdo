import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import {Link} from 'react-router'
import {Icon, Table, Button, Dimmer, Loader} from 'semantic-ui-react'
import Pagination from '../Pagination'
import TableWithNoData from '../TableWithNoData'
import TableWithSorting from '../TableWithSorting'
import BalanceFilterForm from '../BalanceFilterForm'
import DownloadDialog from '../DownloadDialog'
import currencyFormat from '../../helpers/currencyFormat'
import * as ROUTES from '../../constants/routes'

const BalanceListTable = ({data, loading, filter, csvDialog, filterDialog}) => {
    const columns = [
        {
            columnName: '#',
            columnSorted: false,
            columnTitle: '#'
        },
        {
            columnName: 'client',
            columnSorted: true,
            columnTitle: 'Client'
        },
        {
            columnName: 'amount',
            columnSorted: true,
            columnTitle: 'Amount'
        },
        {
            columnName: 'initial_capital',
            columnSorted: true,
            columnTitle: 'Initial capital'
        },
        {
            columnName: 'in_out',
            columnSorted: false,
            columnTitle: 'In/Out'
        },
        {
            columnName: 'initial_capital_date',
            columnSorted: true,
            columnTitle: 'Date'
        }
    ]

    const items = _.map(data, (item, index) => {
        const id = _.get(item, 'id')
        const client = _.get(item, 'name')
        const amount = _.get(item, 'amount')
        const comingOrGoing = amount > 0 ? 'In' : 'Out'
        const initialCapital = _.get(item, 'initial_capital')
        const initialCapitalDate = moment(_.get(item, 'initial_capital_date')).format('DD.MM.YYYY')

        return (
            <Table.Row key={index}>
                <Table.Cell style={{width: '50px'}}>{id}</Table.Cell>
                <Table.Cell>{client}</Table.Cell>
                <Table.Cell>{currencyFormat(amount)}</Table.Cell>
                <Table.Cell>{initialCapital ? (<Icon name="check" />) : (<Icon name="cancel" />)}</Table.Cell>
                <Table.Cell>{comingOrGoing}</Table.Cell>
                <Table.Cell>{initialCapitalDate}</Table.Cell>
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
                    text="No data"
                />

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan={6}>
                            {filter && <Pagination filter={filter} />}
                            <Link to={ROUTES.BALANCE_CREATE_URL}>
                                <Button floated="right" icon={true} labelPosition="left" positive size="small">
                                    <Icon name="add" /> Add
                                </Button>
                            </Link>

                            <Button
                                icon={true}
                                size="small"
                                floated="right"
                                labelPosition="left"
                                onClick={csvDialog.handleOpenCSVDialog}>
                                <Icon name="download" /> Download CSV
                            </Button>

                            <Button
                                icon={true}
                                size="small"
                                floated="right"
                                labelPosition="left"
                                onClick={filterDialog.handleOpenFilterDialog}>
                                <Icon name="filter" /> Filter
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>

            <DownloadDialog
                open={csvDialog.openCSVDialog}
                loading={csvDialog.csvLoading}
                onClose={csvDialog.handleCloseCSVDialog}
                file={csvDialog.csvData}
                filename={'Balance.csv'}
            />

            <BalanceFilterForm
                initialValues={filterDialog.initialValues}
                open={filterDialog.openFilterDialog}
                onSubmit={filterDialog.handleSubmitFilterDialog}
                onClose={filterDialog.handleCloseFilterDialog}
            />
        </div>
    )
}

BalanceListTable.propTypes = {
    data: React.PropTypes.array,
    loading: React.PropTypes.bool.isRequired,
    filter: React.PropTypes.object,
    csvDialog: React.PropTypes.shape({
        csvData: React.PropTypes.any,
        csvLoading: React.PropTypes.bool,
        openCSVDialog: React.PropTypes.bool,
        handleOpenCSVDialog: React.PropTypes.func,
        handleCloseCSVDialog: React.PropTypes.func
    }),
    filterDialog: React.PropTypes.shape({
        initialValues: React.PropTypes.object,
        filterLoading: React.PropTypes.bool,
        openFilterDialog: React.PropTypes.bool,
        handleOpenFilterDialog: React.PropTypes.func,
        handleCloseFilterDialog: React.PropTypes.func,
        handleSubmitFilterDialog: React.PropTypes.func
    })
}
export default BalanceListTable
