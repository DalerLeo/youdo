import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Col} from 'react-flexbox-grid'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import Delete from 'material-ui/svg-icons/action/delete'
import GridList from '../../components/GridList'

const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            width: '100%'
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '65px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '700'
        },
        materialsList: {
            padding: '0 30px'
        },
        rawMaterials: {
            '& .dottedList': {
                padding: '10px 0'
            },
            '& .dottedList:last-child:after': {
                backgroundImage: 'none'
            }
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end',
            '& svg': {
                color: '#fff !important'
            }
        },
        listButtons: {
            display: 'flex',
            justifyContent: 'flex-end',
            '& button': {
                height: '20px !important',
                width: '25px !important'
            }
        }
    }),
)

const listHeader = [
    {
        sorting: true,
        name: 'id',
        xs: 3,
        title: '№'
    },
    {
        sorting: true,
        name: 'name',
        xs: 3,
        title: 'Name'
    }
]
const CurrencyDetails = enhance((props) => {
    const {
        classes,
        loading,
        data,
        actionsDialog,
        filter
    } = props

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={100} thickness={6}/>
                </div>
            </div>
        )
    }
    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon />
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <Delete />
            </IconButton>
        </div>
    )

    const detail = (
        <span>a</span>
    )

    const historyList = _.map(_.get(data, 'results'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        return (
            <li key={id} className="dottedList">
                <Col xs={7}>{id}</Col>
                <Col xs={3}>{name}</Col>
            </li>
        )
    })
    const list = {
        header: listHeader,
        list: historyList,
        loading: loading
    }

    return (
        <GridList
            filter={filter}
            list={list}
            detail={detail}
            actionsDialog={actions}/>
    )
})

CurrencyDetails.propTypes = {
    handleOpenEditMaterials: PropTypes.func.isRequired,
    handleOpenConfirmDialog: PropTypes.func.isRequired
}

export default CurrencyDetails
