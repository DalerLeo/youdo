import _ from 'lodash'
import React from 'react'
import GridListNav from '../GridListNav'
import GridListHeader from '../GridListHeader'
import GridListBody from '../GridListBody'
import './GridList.css'

const GridList = (props) => {
    const {filter, header, list, actions, detailId} = props
    const listIds = _.map(list, item => _.toInteger(_.get(item, 'key')))

    return (
        <div className="grid">
            <GridListNav filter={filter} actions={actions} />
            <GridListHeader listIds={listIds} filter={filter} column={header} />
            <GridListBody detailId={detailId} filter={filter} list={list} />
        </div>
    )
}

export default GridList
