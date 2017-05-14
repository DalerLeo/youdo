import _ from 'lodash'
import sprintf from 'sprintf'
import * as ROUTES from '../../constants/routes'
import React from 'react'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import {Row, Col} from 'react-flexbox-grid'

const enhance = compose(
    injectSheet({

    }),
    withState('openDetails', 'setOpenDetails', false)
)

const StatDebtorsDetail = enhance((props) => {
    const {
        filter,
        classes,
        loading,
        data
    } = props
    const orderList = _.map(data, (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name'])
        const user = _.get(item, ['user', 'firstName']) + _.get(item, ['user', 'secondName']) || 'N/A'
        const dateDelivery = _.get(item, 'dateDelivery') || 'N/A'
        const totalPrice = _.get(item, 'totalPrice') || 'N/A'
        const totalBalance = _.toInteger(_.get(item, 'totalBalance'))
        const status = _.get(item, ['status', 'name']) || 'N/A'

        return (
            <Row key={id}>
                <Col xs={1}>{id}</Col>
                <Col xs={2}>
                    <Link to={{
                        pathname: sprintf(ROUTES.ORDER_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>{client}</Link>
                </Col>
                <Col xs={2}>{user}</Col>
                <Col xs={2}>{dateDelivery}</Col>
                <Col xs={2}>{totalPrice}</Col>
                <Col xs={2}>{totalBalance}</Col>
                <Col xs={1}>{status}</Col>
            </Row>
        )
    })

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={100} thickness={6}/>
                </div>
            </div>
        )
    }

    return (
        <div className={classes.title}>
            <div className={classes.titleLabel}>Наименование фирмы клиента или его имя</div>
            {orderList}
        </div>
    )
})

export default StatDebtorsDetail
