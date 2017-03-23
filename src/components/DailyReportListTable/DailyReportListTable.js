import _ from 'lodash'
import React from 'react'
import {Icon, Grid, Table, Button, Dimmer, Loader} from 'semantic-ui-react'
import DownloadDialog from '../DownloadDialog'
import TableWithNoData from '../TableWithNoData'
import TableWithSorting from '../TableWithSorting'
import DailyReportFilterForm from '../DailyReportFilterForm'
import currencyFormat from '../../helpers/currencyFormat'

const DailyReportListTable = (props) => {
    const {data, loading, filter, csvDialog, filterDialog} = props

    const beginHeader = [
        {
            columnSorted: false,
            columnName: 'account.client.name',
            columnTitle: 'Client'
        },
        {
            columnSorted: false,
            columnName: 'account.number',
            columnTitle: 'Account number'
        },
        {
            columnSorted: false,
            columnName: 'account.broker',
            columnTitle: 'Broker'
        },
        {
            columnSorted: false,
            columnName: 'account.fundManager',
            columnTitle: 'Fund manager'
        },
        {
            columnSorted: false,
            columnName: 'account.client.reference.name',
            columnTitle: 'Reference'
        },
        {
            columnSorted: false,
            columnName: 'account.client.reference.reference.name',
            columnTitle: 'Sub reference'
        },
        {
            columnSorted: false,
            columnName: 'account.client.reference.reference.name',
            columnTitle: 'Initial Capital'
        },
        {
            columnSorted: false,
            columnName: 'account.client.reference.reference.name',
            columnTitle: 'Opening Balance'
        }
    ]

    const monthDaysLength = _.get(data, ['0', 'days', 'length'])
    const centerHeader = _.map(_.range(monthDaysLength), (item) => {
        return {
            columnSorted: false,
            columnName: 'day',
            columnTitle: item + 1
        }
    })

    const endHeader = [
        {
            columnSorted: false,
            columnName: 'tgp',
            columnTitle: 'TGP'
        },
        {
            columnSorted: false,
            columnName: 'ntc',
            columnTitle: 'NTC'
        },
        {
            columnSorted: false,
            columnName: 'mtm',
            columnTitle: 'MTM'
        },
        {
            columnSorted: false,
            columnName: 'mtmBig20Percent',
            columnTitle: 'MTM > 20%'
        }
    ]

    const columns = _.concat(beginHeader, centerHeader, endHeader)

    const columnLength = columns.length
    const items = _.map(data, (item, index) => {
        const name = _.get(item, 'client')
        const number = _.get(item, 'account')
        const broker = _.get(item, 'broker')
        const fundManager = _.get(item, 'fund_manager')
        const reference = _.get(item, 'reference') || 'N/A'
        const subReference = _.get(item, 'sub_reference') || 'N/A'
        const initialCapital = _.get(item, 'initial_capital')
        const openingBalance = _.get(item, 'opening_balance')
        const days = _.get(item, 'days')
        const mtm = _.get(item, 'mtm')
        const mtm20 = _.get(item, 'mtm20') ? (<div style={{color: 'red'}}>{mtm}</div>) : (
            <div style={{color: 'green', minWidth: '100px'}}>So far so good</div>
        )
        const daysItem = _.map(days, (day, dayIndex) => {
            const dayValue = !_.isNaN(parseFloat(day)) && currencyFormat(day) || day || 'Nothing'
            return (
                <Table.Cell key={dayIndex}>{dayValue}</Table.Cell>
            )
        })
        const ntc = _.get(item, 'ntc')
        const tgp = _.get(item, 'tgp')

        return (
            <Table.Row key={index}>
                <Table.Cell><div style={{minWidth: '100px'}}>{name}</div></Table.Cell>
                <Table.Cell><div style={{minWidth: '100px'}}>{number}</div></Table.Cell>
                <Table.Cell><div style={{minWidth: '100px'}}>{broker}</div></Table.Cell>
                <Table.Cell><div style={{minWidth: '100px'}}>{fundManager}</div></Table.Cell>
                <Table.Cell><div style={{minWidth: '100px'}}>{reference}</div></Table.Cell>
                <Table.Cell><div style={{minWidth: '100px'}}>{subReference}</div></Table.Cell>
                <Table.Cell><div style={{minWidth: '100px'}}>{currencyFormat(initialCapital)}</div></Table.Cell>
                <Table.Cell><div style={{minWidth: '100px'}}>{currencyFormat(openingBalance)}</div></Table.Cell>
                {daysItem}
                <Table.Cell>{currencyFormat(tgp)}</Table.Cell>
                <Table.Cell>{currencyFormat(ntc)}</Table.Cell>
                <Table.Cell>{mtm}</Table.Cell>
                <Table.Cell>{mtm20}</Table.Cell>
            </Table.Row>
        )
    })

    return (
        <div>
            <Dimmer active={loading} inverted>
                <Loader size="large">Loading</Loader>
            </Dimmer>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
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
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <div style={{overflowX: 'scroll'}}>
                            <Table celled>
                                <TableWithSorting
                                    filter={filter}
                                    columns={columns}
                                />

                                <TableWithNoData
                                    colSpan={columnLength}
                                    data={items}
                                    text="No data"
                                />
                            </Table>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <DownloadDialog
                open={csvDialog.openCSVDialog}
                loading={csvDialog.csvLoading}
                onClose={csvDialog.handleCloseCSVDialog}
                file={csvDialog.csvData}
                filename={'DailyReport.csv'}
            />

            <DailyReportFilterForm
                initialValues={filterDialog.initialValues}
                open={filterDialog.openFilterDialog}
                onSubmit={filterDialog.handleSubmitFilterDialog}
                onClose={filterDialog.handleCloseFilterDialog}
            />
        </div>
    )
}

DailyReportListTable.propTypes = {
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

export default DailyReportListTable
