import React from 'react'
import GridListNav from '../GridListNav'
import GridListHeader from '../GridListHeader'
import GridListBody from '../GridListBody'
import './GridList.css'

const GridList = (props) => {
    const {filter, list, header, id} = props

    return (
        <div className="grid">
            <GridListNav filter={filter} />
            <GridListHeader filter={filter} column={header} />
            <GridListBody id={id} filter={filter} list={list} />
        </div>
    )
}

export default GridList
