import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
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
        xs: 4,
        title: '№'
    },
    {
        sorting: true,
        name: 'name',
        xs: 4,
        title: 'Курс'
    },
    {
        sorting: true,
        name: 'createdDate',
        xs: 4,
        title: 'Дата обновления'
    }
]
const CurrencyDetails = enhance((props) => {
    const {
        classes,
        loading,
        data,
        currentId,
        listData,
        actionsDialog,
        filter,
        currency,
        setCurrencyUpdateDialog
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
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const rate = _.get(item, 'id')
        return (
            <Row key={id}>
                <Col xs={4}>{id}</Col>
                <Col xs={4}>1 {currency} = {rate} SUM</Col>
                <Col xs={4}>{createdDate}</Col>
            </Row>
        )
    })
    const list = {
        header: listHeader,
        list: historyList,
        loading: loading
    }
    const customData = {
        id: currentId,
        dialog: setCurrencyUpdateDialog,
        listData: listData
    }

    return (
        <GridList
            filter={filter}
            list={list}
            customData={customData}
            detail={detail}
            actionsDialog={actions}
            withoutSearch={true}
        />
    )
})

CurrencyDetails.propTypes = {
    listData: PropTypes.object,
    handleOpenEditMaterials: PropTypes.func.isRequired,
    handleOpenConfirmDialog: PropTypes.func.isRequired,
    setCurrencyUpdateDialog: PropTypes.shape({
        setCurrencyLoading: PropTypes.bool.isRequired,
        openSetCurrencyDialog: PropTypes.bool.isRequired,
        handleOpenSetCurrencyDialog: PropTypes.func.isRequired,
        handleCloseSetCurrencyDialog: PropTypes.func.isRequired,
        handleSubmitSetCurrencyDialog: PropTypes.func.isRequired
    })
}

export default CurrencyDetails
