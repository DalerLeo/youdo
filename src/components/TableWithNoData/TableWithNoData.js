import React from 'react'
import {Table} from 'semantic-ui-react'
import './TableWithNoData.css'

const TableNoData = (props) => {
    const {colSpan, data, text} = props

    const noData = (
        <Table.Row>
            <Table.Cell colSpan={colSpan}>
                <h4 className="TableNoData__text">{text}</h4>
            </Table.Cell>
        </Table.Row>
    )

    return (
        <Table.Body>
            {data.length ? data : noData}
        </Table.Body>
    )
}

export default TableNoData
