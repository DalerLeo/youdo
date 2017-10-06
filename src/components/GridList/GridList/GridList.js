import _ from 'lodash'
import {compose} from 'recompose'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import Loader from '../../Loader'
import Paper from 'material-ui/Paper'
import GridListNav from '../GridListNav'
import GridListHeader from '../GridListHeader'
import GridListBody from '../GridListBody'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            width: '100%'
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
        },
        transparentLoading: {
            extend: 'loader',
            position: 'absolute',
            left: '0',
            right: '0',
            top: '100px',
            background: 'transparent !important'
        }
    })
)

const GridList = enhance((props) => {
    const {
        classes,
        list,
        customData,
        detail,
        filter,
        filterDialog,
        addButton,
        actionsDialog,
        withoutCheckboxes,
        withoutRow,
        withInvoice,
        withoutSearch,
        printDialog,
        flexibleRow,
        withoutPagination,
        refreshAction,
        listShadow,
        transparentLoading
    } = props

    const header = _.get(list, 'header')
    const listItems = _.get(list, 'list')
    const loading = _.get(list, 'loading')
    const listIds = _.map(listItems, (item) => _.toInteger(_.get(item, 'key')))
    const loaderOrList = (listLoading) => {
        if (listLoading && !transparentLoading) {
            return (
                <Paper zDepth={1} className={classes.loader} style={!listShadow ? {boxShadow: 'none'} : {} }>
                    <Loader/>
                </Paper>
            )
        }

        return (
            <GridListBody
                filter={filter}
                list={listItems}
                detail={detail}
                listLoading={listLoading}
                transparentLoading={transparentLoading}
                flexibleRow={flexibleRow}
                withoutCheckboxes={withoutCheckboxes}
                listShadow={listShadow}
            />
        )
    }

    return (
        <div className={classes.wrapper}>
            <Paper zDepth={1} className={classes.header} style={!listShadow ? {boxShadow: 'none'} : {}}>
                <GridListNav
                    filter={filter}
                    customData={customData}
                    filterDialog={filterDialog}
                    addButton={addButton}
                    actions={actionsDialog}
                    withoutSearch={withoutSearch}
                    withInvoice={withInvoice}
                    printDialog={printDialog}
                    withoutPagination={withoutPagination}
                    refreshAction={refreshAction}
                />
                <GridListHeader
                    filter={filter}
                    listIds={listIds}
                    withoutCheckboxes={withoutCheckboxes}
                    withoutRow={withoutRow}
                    column={header}
                    listShadow={listShadow}
                />
            </Paper>
            {loaderOrList(loading)}
            {(transparentLoading && loading) &&
            <Paper zDepth={1} className={classes.transparentLoading} style={!listShadow ? {boxShadow: 'none'} : {} }>
                <Loader/>
            </Paper>}
        </div>
    )
})

GridList.propTypes = {
    filter: PropTypes.object.isRequired,
    withoutCheckboxes: PropTypes.bool,
    withoutSearch: PropTypes.bool,
    withoutRow: PropTypes.bool,
    withInvoice: PropTypes.bool,
    list: PropTypes.shape({
        header: PropTypes.array.isRequired,
        list: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired
    }),
    customData: PropTypes.shape({
        dialog: PropTypes.node.isRequired,
        listData: PropTypes.array.isRequired
    }),
    detail: PropTypes.node.isRequired,
    actionsDialog: PropTypes.node,
    filterDialog: PropTypes.node,
    addButton: PropTypes.node,
    printDialog: PropTypes.shape({
        openPrint: PropTypes.bool,
        handleOpenPrintDialog: PropTypes.func,
        handleClosePrintDialog: PropTypes.func
    }),
    refreshAction: PropTypes.func
}

GridList.defaultProps = {
    withoutCheckboxes: false,
    withoutSearch: false,
    withInvoice: false,
    withRefreshBtn: false,
    flexibleRow: false,
    withoutPagination: false,
    listShadow: true,
    transparentLoading: false,
    actionsDialog: (<div>no</div>)
}

export default GridList
