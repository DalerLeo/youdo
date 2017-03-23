import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import {Link} from 'react-router'
import {Table, Button, Icon, Dimmer, Loader} from 'semantic-ui-react'
import Pagination from '../Pagination'
import TableWithNoData from '../TableWithNoData'
import TableWithSorting from '../TableWithSorting'
import DownloadDialog from '../DownloadDialog'
import MonthlyReportFilterForm from '../MonthlyReportFilterForm'
import * as ROUTES from '../../constants/routes'

const MonthlyReportListTable = (props) => {
    const {filter, loading, data, csvDialog, filterDialog} = props
    const columns = [
        {
            columnSorted: false,
            columnName: 'id',
            columnTitle: '#'
        },
        {
            columnSorted: true,
            columnName: 'account_number',
            columnTitle: 'Account'
        },
        {
            columnSorted: true,
            columnName: 'client',
            columnTitle: 'Client'
        },
        {
            columnSorted: true,
            columnName: 'broker',
            columnTitle: 'Broker'
        },
        {
            columnSorted: true,
            columnName: 'fund_manager',
            columnTitle: 'Fund manager'
        },
        {
            columnSorted: true,
            columnName: 'gross_balance',
            columnTitle: 'Gross balance'
        },
        {
            columnSorted: true,
            columnName: 'gross_profit',
            columnTitle: 'Gross profit'
        },
        {
            columnSorted: true,
            columnName: 'gross_profit',
            columnTitle: '15% Profit'
        },
        {
            columnSorted: true,
            columnName: 'gross_profit',
            columnTitle: '25% Profit'
        },
        {
            columnSorted: true,
            columnName: 'gross_profit',
            columnTitle: '40% Profit'
        },
        {
            columnSorted: true,
            columnName: 'opening_balance',
            columnTitle: 'Opening balance'
        },
        {
            columnSorted: true,
            columnName: 'reference',
            columnTitle: 'Reference'
        }

    ]

    const items = _.map(data, (item, index) => {
        const id = _.get(item, 'id')
        const accountNumber = _.get(item, 'account_number')
        const client = _.get(item, 'client') || 'N/A'
        const broker = _.get(item, 'broker') || 'N/A'
        const fundManager = _.get(item, 'fund_manager') || 'N/A'
        const grossBalance = _.get(item, 'gross_balance') || 'N/A'
        const grossProfit = _.get(item, 'gross_profit') || 'N/A'
        const fifteenPercentProfit = _.get(item, 'fifteen_percent_profit') || 'N/A'
        const twentyFivePercentProfit = _.get(item, 'twenty_five_percent_profit') || 'N/A'
        const fortyPercentProfit = _.get(item, 'forty_percent_profit') || 'N/A'
        const openingBalance = _.get(item, 'opening_balance')
        const reference = _.get(item, 'reference') || 'N/A'

        return (
            <Table.Row key={index}>
                <Table.Cell style={{width: '50px'}}>{id}</Table.Cell>
                <Table.Cell>
                    <Link to={sprintf(ROUTES.MONTHLY_REPORT_EDIT_PATH, id)}>
                        {accountNumber}
                    </Link>
                </Table.Cell>
                <Table.Cell>{client}</Table.Cell>
                <Table.Cell>{broker}</Table.Cell>
                <Table.Cell>{fundManager}</Table.Cell>
                <Table.Cell>{grossBalance}</Table.Cell>
                <Table.Cell>{grossProfit}</Table.Cell>
                <Table.Cell>{fifteenPercentProfit}</Table.Cell>
                <Table.Cell>{twentyFivePercentProfit}</Table.Cell>
                <Table.Cell>{fortyPercentProfit}</Table.Cell>
                <Table.Cell>{openingBalance}</Table.Cell>
                <Table.Cell>{reference}</Table.Cell>
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
                    colSpan={12}
                    data={items}
                    text="No Data"
                />

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan="12">
                            {filter && <Pagination filter={filter} />}
                            <Link to={ROUTES.MONTHLY_REPORT_CREATE_URL}>
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
                filename={'MonthlyReport.csv'}
            />

            <MonthlyReportFilterForm
                open={filterDialog.openFilterDialog}
                onSubmit={filterDialog.handleSubmitFilterDialog}
                onClose={filterDialog.handleCloseFilterDialog}
            />
        </div>
    )
}

MonthlyReportListTable.propTypes = {
    filter: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
    data: React.PropTypes.array,
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

export default MonthlyReportListTable
