import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import GridList from '../../GridList'
import Choose from '../../Images/choose-menu.png'
import t from '../../../helpers/translate'

const listHeader = [
    {
        sorting: false,
        name: 'name',
        title: t('Наименование'),
        xs: 4
    },
    {
        sorting: false,
        name: 'type',
        title: t('Последняя отгрузка') + ' №',
        xs: 4
    },
    {
        sorting: false,
        name: 'brand',
        title: t('Состояние'),
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

const ManufactureEquipment = enhance((props) => {
    const {equipmentData, classes, manufactureId} = props
    const ZERO = 0

    const filter = _.get(equipmentData, 'filter')
    const detail = (
        <span>a</span>
    )

    const equipmentList = _.map(_.get(equipmentData, 'equipmentList'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const lastShipment = _.get(item, 'lastShipment')
        const status = _.get(item, 'status') === '0' ? t('не работает')
            : (_.get(item, 'status') === '1' ? 'рабочий'
            : t('получить продукт'))
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
    if (manufactureId <= ZERO) {
        return (
            <Paper zDepth={1} className={classes.choose}>
                <div>{t('Выберите производство')}...</div>
            </Paper>
        )
    }
    return (
        <div className={classes.equipmentContent}>
            <GridList
                filter={filter}
                list={equipmentListExp}
                detail={detail}
                actionsDialog={actions}/>
        </div>
    )
})

export default ManufactureEquipment
