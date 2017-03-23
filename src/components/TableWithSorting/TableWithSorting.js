import _ from 'lodash'
import React from 'react'
import {Link, hashHistory} from 'react-router'
import {Table, Icon} from 'semantic-ui-react'
import './TableWithSorting.css'

export const TableWithSorting = ({columns, filter}) => {
    const headerCells = _.map(columns, (column, index) => {
        const columnName = _.get(column, ['columnName'])
        const columnSorted = _.get(column, ['columnSorted'])
        const columnTitle = _.get(column, ['columnTitle'])
        const sortingType = filter.getSortingType(columnName)

        if (!columnSorted) {
            return (
                <Table.HeaderCell key={index}>
                    {columnTitle}
                </Table.HeaderCell>
            )
        }

        return (
            <Table.HeaderCell key={index}>
                <Link className="SortingTableCell" onClick={() => hashHistory.push(filter.sortingURL(columnName))}>
                    {columnTitle}
                    {!_.isNull(sortingType) &&
                        <Icon
                            name={sortingType ? 'arrow up' : 'arrow down'}
                            size={'tiny'}
                        />}
                </Link>
            </Table.HeaderCell>
        )
    })

    return (
        <Table.Header>
            <Table.Row>
                {headerCells}
            </Table.Row>
        </Table.Header>
    )
}

TableWithSorting.propTypes = {
    filter: React.PropTypes.object.isRequired,
    columns: React.PropTypes.arrayOf(React.PropTypes.shape({
        columnName: React.PropTypes.string.isRequired,
        columnSorted: React.PropTypes.bool.isRequired,
        columnTitle: React.PropTypes.string.isRequired
    }))
}

export default TableWithSorting
