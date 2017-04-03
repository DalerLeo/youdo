import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import GridListNav from '../GridListNav'
import GridListHeader from '../GridListHeader'
import GridListBody from '../GridListBody'
import CircularProgress from 'material-ui/CircularProgress'

const GridList = (props) => {
    const {classes, filter, filterDialog, loading, header, list, actions, detailId} = props
    const listIds = _.map(list, item => _.toInteger(_.get(item, 'key')))

    return (
        <div className={classes.wrapper}>
            <div className={classes.header}>
                <GridListNav filterDialog={filterDialog} filter={filter} actions={actions} />
                <GridListHeader listIds={listIds} filter={filter} column={header} />
            </div>
            {loading && <div className={classes.loader}>
                <CircularProgress size={100} thickness={6} />
            </div>}
            {!loading && <GridListBody detailId={detailId} filter={filter} list={list} />}
        </div>
    )
}

export default injectSheet({
    wrapper: {
        position: 'relative'
    },
    header: {
        height: '100px'
    },
    loader: {
        background: '#fff',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})(GridList)
