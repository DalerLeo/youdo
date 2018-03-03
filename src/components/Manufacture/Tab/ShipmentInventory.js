import React from 'react'
import _ from 'lodash'
import Pagination from '../../GridList/GridListNavPagination'
import t from '../../../helpers/translate'
import Loader from '../../Loader'
import {hashHistory} from 'react-router'
import sprintf from 'sprintf'
import * as ROUTES from '../../../constants/routes'

import dateFormat from '../../../helpers/dateFormat'
import {Row, Col} from 'react-flexbox-grid'

const ShipmentInventory = (props) => {
    const {data, loading, filter, classes} = props

    const handleClickInventoryItem = (id) => {
        hashHistory.push({
            pathname: sprintf(ROUTES.INVENTORY_ITEM_PATH, id)
        })
    }
    const inventories = _.map(data, (item) => {
        const id = _.get(item, 'id')
        const stockInventory = _.get(item, ['stock', 'name'])
        const createdBy = _.get(item, 'createdBy')
            ? _.get(item, ['createdBy', 'firstName']) + ' ' + _.get(item, ['createdBy', 'secondName'])
            : 'Не указано'
        const createdDate = _.get(item, 'createdDate') ? dateFormat(_.get(item, 'createdDate')) : t('Не закончилась')
        const comment = _.get(item, 'comment') || 'Без комментариев'
        return (
            <Row key={id} className={classes.inventory} onClick={() => handleClickInventoryItem(id)}>
                <Col xs={3}>{stockInventory}</Col>
                <Col xs={3}>{createdBy}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col xs={3}>{comment}</Col>
            </Row>
        )
    })

    return (

        !_.isEmpty(data)
        ? <div className={classes.productsBlock}>
            <div className={classes.pagination}>
                <Pagination filter={filter}/>
            </div>
            <Row className={classes.flexTitleShift}>
                <Col xs={3}><h4>{t('Склад')}</h4></Col>
                <Col xs={3}><h4>{t('Создал')}</h4></Col>
                <Col xs={3}><h4>{t('Дата создания')}</h4></Col>
                <Col xs={3}><h4>{t('Комментарий')}</h4></Col>
            </Row>
            {loading
                ? <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
                : inventories}
          </div>
        : loading
            ? <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>
            : <div className={classes.emptyQuery}>
                <div>{t('В этом периоде не найдено смен')}</div>
            </div>
    )
}

export default ShipmentInventory
