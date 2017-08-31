import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import GridList from '../../GridList'

const listHeader = [
    {
        sorting: false,
        name: 'name',
        title: 'Наименование',
        xs: 4
    },
    {
        sorting: false,
        name: 'type',
        title: 'Последняя отгрузка №',
        xs: 4
    },
    {
        sorting: false,
        name: 'brand',
        title: 'Состояние',
        xs: 4
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
            overflowY: 'scroll'
        },
        equipmentContent: {
            marginTop: '56px'
        }
    })
)

const ManufactureEquipment = enhance((props) => {
    const {equipmentData, classes} = props

    const filter = _.get(equipmentData, 'filter')
    const detail = (
        <span>a</span>
    )

    const equipmentList = _.map(_.get(equipmentData, 'equipmentList'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const lastShipment = _.get(item, 'lastShipment')
        const status = _.get(item, 'status') === '0' ? 'не работает'
            : (_.get(item, 'status') === '1' ? 'рабочий'
            : 'получить продукт')
        return (
            <Row key={id}>
                <Col xs={4}>{name}</Col>
                <Col xs={4}>{lastShipment}</Col>
                <Col xs={4}>{status}</Col>
            </Row>
        )
    })
    const equipmentListExp = {
        header: listHeader,
        list: equipmentList,
        loading: _.get(equipmentData, 'listLoading')
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
                    list={equipmentListExp}
                    detail={detail}
                    actionsDialog={actions}/>
            </Col>
        </Row>
    )
})

export default ManufactureEquipment
