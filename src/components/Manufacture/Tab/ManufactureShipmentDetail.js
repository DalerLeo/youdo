import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import GridList from '../../GridList'
import NotFound from '../../Images/not-found.png'
import numberFormat from '../../../helpers/numberFormat'

const listHeader = [
    {
        sorting: true,
        name: 'barcode',
        title: 'Штрих-код',
        xs: 3
    },
    {
        sorting: true,
        name: 'productName',
        title: 'Наименование товара',
        xs: 3
    },
    {
        sorting: true,
        name: 'amount',
        title: 'Количество',
        xs: 3
    },
    {
        sorting: true,
        name: 'date',
        title: 'Время',
        xs: 3
    }
]

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
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '285px',
            padding: '260px 0 0',
            textAlign: 'center',
            fontSize: '15px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    }),
)
const actions = (<div></div>)

const ManufactureShipmentDetail = enhance((props) => {
    const {
        filter,
        detailData
    } = props

    const loading = _.get(detailData, 'loading')
    const detailList = _.map(_.get(detailData, ['data', 'results']), (item) => {
        const id = _.get(item, 'id')
        const barcode = _.get(item, 'barcode')
        const amount = numberFormat(_.get(item, 'amount'))
        const productName = _.get(item, ['product', 'name'])
        const measurement = _.get(item, ['product', 'measurement', 'name'])
        const createdDate = moment(_.get(item, 'createDate')).format('DD.MM.YYYY HH.mm')

        return (
            <Row key={id}>
                <Col xs={3}>{barcode}</Col>
                <Col xs={3}>{productName}</Col>
                <Col xs={3}>{amount} {measurement}</Col>
                <Col xs={2}>{createdDate}</Col>
            </Row>
        )
    })

    const detailDialog = <span></span>

    const list = {
        header: listHeader,
        list: detailList,
        loading: loading
    }

    return (
        <GridList
            filter={filter}
            list={list}
            detail={detailDialog}
            actionsDialog={actions}
        />
    )
})

ManufactureShipmentDetail.propTypes = {
}

export default ManufactureShipmentDetail
