import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Loader from '../../Loader'
import NotFound from '../../Images/not-found.png'
import numberFormat from '../../../helpers/numberFormat'
import dateTimeFormat from '../../../helpers/dateTimeFormat'

const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            width: '100%',
            alignSelf: 'flex-start'
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '100%',
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
            fontWeight: '600',
            '& span': {
                fontSize: '11px',
                fontWeight: 'normal'
            }
        },
        details: {
            display: 'flex',
            width: '100%'
        },
        leftSide: {
            width: '50%',
            padding: '20px 30px',
            borderRight: '1px #efefef solid'
        },
        rightSide: {
            width: '50%'
        },
        productsBlock: {
            padding: '20px 30px',
            borderBottom: '1px #efefef solid',
            '& h4': {
                fontWeight: '600',
                marginBottom: '5px',
                fontSize: '13px'
            },
            '&:last-child': {
                border: 'none'
            }
        },
        product: {
            display: 'flex',
            padding: '5px 0',
            justifyContent: 'space-between'
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

const ManufactureShipmentDetail = enhance((props) => {
    const {
        classes,
        detailData
    } = props

    const loading = _.get(detailData, 'loading')
    const productsLoading = _.get(detailData, 'productsLoading')
    const materialsLoading = _.get(detailData, 'materialsLoading')
    const userName = _.get(detailData, ['data', 'user', 'firstName']) + ' ' + _.get(detailData, ['data', 'user', 'secondName'])
    const openedTime = _.get(detailData, ['data', 'openedTime']) ? dateTimeFormat(_.get(detailData, ['data', 'openedTime'])) : 'Не началась'
    const closedTime = _.get(detailData, ['data', 'closedTime']) ? dateTimeFormat(_.get(detailData, ['data', 'closedTime'])) : 'Не закончилась'
    const producs = _.map(_.get(detailData, 'products'), (item, index) => {
        const measurement = _.get(item, ['measurement', 'name'])
        const product = _.get(item, ['product', 'name'])
        const amount = _.get(item, 'totalAmount')
        return (
            <div key={index} className={classes.product}>
                <span>{product}</span>
                <span>{numberFormat(amount, measurement)}</span>
            </div>
        )
    })
    const materials = _.map(_.get(detailData, 'materials'), (item, index) => {
        const measurement = _.get(item, ['measurement', 'name'])
        const product = _.get(item, ['product', 'name'])
        const amount = _.get(item, 'totalAmount')
        return (
            <div key={index} className={classes.product}>
                <span>{product}</span>
                <span>{numberFormat(amount, measurement)}</span>
            </div>
        )
    })
    if (loading || productsLoading || materialsLoading) {
        return (
            <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{userName} <span>({openedTime} - {closedTime})</span></div>
            </div>
            <div className={classes.details}>
                <div className={classes.leftSide}>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.productsBlock}>
                        <h4>Произведенная продукция</h4>
                        {producs}
                    </div>
                    <div className={classes.productsBlock}>
                        <h4>Затраченное сырье</h4>
                        {materials}
                    </div>
                </div>
            </div>
        </div>
    )
})

ManufactureShipmentDetail.propTypes = {
}

export default ManufactureShipmentDetail
