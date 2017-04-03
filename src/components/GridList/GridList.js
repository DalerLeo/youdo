import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import GridListNav from '../GridListNav'
import GridListHeader from '../GridListHeader'
import GridListBody from '../GridListBody'
import CircularProgress from 'material-ui/CircularProgress'

const GridList = (props) => {
    const {classes, filter, loading, header, list, actions, detailId} = props
    const listIds = _.map(list, item => _.toInteger(_.get(item, 'key')))

    return (
        <div className={classes.wrapper}>
            <GridListNav filter={filter} actions={actions} />
            <GridListHeader listIds={listIds} filter={filter} column={header} />
            {!loading && <GridListBody detailId={detailId} filter={filter} list={list} />}
            {loading && <div className={classes.loader}>
                <CircularProgress size={100} thickness={6} />
            </div>}
        </div>
    )
}

export default injectSheet({
    wrapper: {
        position: 'relative'
    },
    loader: {
        background: '#fff',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})(GridList)
