import _ from 'lodash'
import {compose} from 'recompose'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import GridListNav from '../GridListNav'
import GridListHeader from '../GridListHeader'
import GridListBody from '../GridListBody'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            paddingBottom: '35px'
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
    })
)

const GridList = enhance((props) => {
    const {classes, list, detail, filter, filterDialog, actionsDialog, withoutCheckboxes} = props
    const header = _.get(list, 'header')
    const listItems = _.get(list, 'list')
    const loading = _.get(list, 'loading')
    const listIds = _.map(listItems, item => _.toInteger(_.get(item, 'key')))
    const loaderOrList = (listLoading) => {
        if (listLoading) {
            return (
                <div className={classes.loader}>
                    <CircularProgress size={100} thickness={6} />
                </div>
            )
        }

        return (
            <GridListBody
                filter={filter}
                list={listItems}
                detail={detail}
                withoutCheckboxes={withoutCheckboxes}
            />
        )
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.header}>
                <GridListNav
                    filter={filter}
                    filterDialog={filterDialog}
                    actions={actionsDialog}
                />
                <GridListHeader
                    filter={filter}
                    listIds={listIds}
                    withoutCheckboxes={withoutCheckboxes}
                    column={header}
                />
            </div>
            {loaderOrList(loading)}
        </div>
    )
})

GridList.propTypes = {
    filter: PropTypes.object.isRequired,
    withoutCheckboxes: PropTypes.bool,
    list: PropTypes.shape({
        header: PropTypes.array.isRequired,
        list: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired
    }),
    detail: PropTypes.node.isRequired,
    actionsDialog: PropTypes.node.isRequired,
    filterDialog: PropTypes.node
}

GridList.defaultProps = {
    withoutCheckboxes: false
}

export default GridList
