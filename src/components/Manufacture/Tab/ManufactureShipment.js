import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import ManufactureShipmentDetail from './ManufactureShipmentDetail'
import GridList from '../../GridList'
import Paper from 'material-ui/Paper'
import Choose from '../../Images/choose-menu.png'
import dateTimeFormat from '../../../helpers/dateTimeFormat'

const listHeader = [
    {
        sorting: false,
        name: 'name',
        title: 'Работник',
        xs: 2
    },
    {
        sorting: true,
        name: 'openedTime',
        title: 'Начало смены',
        xs: 2
    },
    {
        sorting: true,
        name: 'closedTime',
        title: 'Конец смены',
        xs: 2
    },
    {
        sorting: false,
        name: '',
        title: 'Затрачено сырья',
        alignRight: true,
        xs: 2
    },
    {
        sorting: false,
        name: 'brand',
        title: 'Произведено',
        alignRight: true,
        xs: 2
    },
    {
        sorting: false,
        name: 'brand',
        title: 'Браковано',
        alignRight: true,
        xs: 2
    }
]
const enhance = compose(
    injectSheet({
        shipmentContent: {
            marginTop: '56px'
        },
        choose: {
            background: 'url(' + Choose + ') no-repeat center 50px',
            backgroundSize: '200px',
            marginTop: '20px',
            padding: '245px 0 30px',
            textAlign: 'center',
            fontSize: '15px',
            color: '#666 !important'
        },
        listRow: {
            position: 'relative',
            margin: '0 -30px !important',
            padding: '0 30px',
            width: 'auto !important',
            '&:hover': {
                background: '#f2f5f8'
            }
        },
        alignRight: {
            textAlign: 'right'
        },
        openDetails: {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer'
        }
    })
)

const ManufactureShipment = enhance((props) => {
    const {shipmentData, classes, manufactureId} = props

    const ZERO = 0
    const filter = _.get(shipmentData, 'filter')
    const detail = (
        <ManufactureShipmentDetail
            key={_.get(shipmentData, ['detailData', 'id'])}
            detailData={_.get(shipmentData, 'detailData')}
            filter={_.get(shipmentData, 'filter')}
        />
    )
    const handleClick = _.get(shipmentData, 'handleShipmentClick')
    const shipment = _.map(_.get(shipmentData, 'shipmentList'), (item) => {
        const id = _.get(item, 'id')
        const user = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName'])
        const openedTime = _.get(item, 'openedTime') ? dateTimeFormat(_.get(item, 'openedTime')) : 'Не началась'
        const closedTime = _.get(item, 'closedTime') ? dateTimeFormat(_.get(item, 'closedTime')) : 'Не закончилась'
        return (
            <Row className={classes.listRow} key={id}>
                <Col xs={2}>{user}</Col>
                <Col xs={2}>{openedTime}</Col>
                <Col xs={2}>{closedTime}</Col>
                <div className={classes.openDetails} onClick={() => { handleClick(id) }}>{null}</div>
                <Col xs={2} className={classes.alignRight}>4 564 USD</Col>
                <Col xs={2} className={classes.alignRight}>3 335 USD</Col>
                <Col xs={2} className={classes.alignRight}>1 346 USD</Col>
            </Row>
        )
    })
    const shipmentExp = {
        header: listHeader,
        list: shipment,
        loading: _.get(shipmentData, 'listLoading')
    }
    const actions = (
        <div>
            <IconButton>
                <ModEditorIcon />
            </IconButton>

            <IconButton>
                <DeleteIcon />
            </IconButton>
        </div>
    )

    if (manufactureId <= ZERO) {
        return (
            <Paper zDepth={1} className={classes.choose}>
                <div>Выберите производство...</div>
            </Paper>
        )
    }
    return (
        <div className={classes.shipmentContent}>
            <GridList
                filter={filter}
                list={shipmentExp}
                detail={detail}
                actionsDialog={actions}/>
        </div>
    )
})

export default ManufactureShipment
