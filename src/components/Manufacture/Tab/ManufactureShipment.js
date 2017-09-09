import _ from 'lodash'
import moment from 'moment'
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

const listHeader = [
    {
        sorting: false,
        name: 'name',
        title: 'Производство',
        xs: 3
    },
    {
        sorting: true,
        name: 'openTime',
        title: 'Время начала',
        xs: 3
    },
    {
        sorting: true,
        name: 'closeTime',
        title: 'Время окончания',
        xs: 3
    },
    {
        sorting: false,
        name: 'brand',
        title: 'Произведенный',
        xs: 2
    },
    {
        sorting: false,
        name: 'brand',
        title: 'Проводить',
        xs: 1
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
        const name = _.get(item, ['equipment', 'name'])
        const closedTime = moment(_.get(item, 'closedTime')).format('DD.MM.YYYY')
        const openedTime = moment(_.get(item, 'openedTime')).format('DD.MM.YYYY')
        const produced = _.get(item, 'produced')
        const spend = _.get(item, 'spend')
        return (
            <Row key={id}>
                <Col xs={3}><span onClick={() => { handleClick(id) }}>{name}</span></Col>
                <Col xs={3}>{openedTime}</Col>
                <Col xs={3}>{closedTime}</Col>
                <Col xs={2}>{produced}</Col>
                <Col xs={1}>{spend}</Col>
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
