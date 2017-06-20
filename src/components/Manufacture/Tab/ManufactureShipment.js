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

const listHeader = [
    {
        sorting: true,
        name: 'name',
        title: 'Производство',
        xs: 3
    },
    {
        sorting: true,
        name: 'type',
        title: 'Время начала',
        xs: 3
    },
    {
        sorting: true,
        name: 'brand',
        title: 'Время окончания',
        xs: 3
    },
    {
        sorting: true,
        name: 'brand',
        title: 'Произведенный',
        xs: 2
    },
    {
        sorting: true,
        name: 'brand',
        title: 'Проводить',
        xs: 1
    }
]
const enhance = compose(
    injectSheet({

        imgContent: {
            '& img': {
                width: '33%',
                margin: '1px'
            },
            height: '390px',
            boxSizing: 'border-box',
            overflowY: 'scroll'
        },
        equipmentContent: {
            marginTop: '56px'
        }
    })
)

const ManufactureShipment = enhance((props) => {
    const {shipmentData, classes} = props

    const filter = _.get(shipmentData, 'filter')
    const detail = (
        <ManufactureShipmentDetail
            // detailData={_.get(shipmentData, 'detailData')}
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
    return (
        <Row className={classes.equipmentContent}>
            <Col xs={12}>
                <GridList
                    filter={filter}
                    list={shipmentExp}
                    detail={detail}
                    actionsDialog={actions}/>
            </Col>
        </Row>
    )
})

export default ManufactureShipment
