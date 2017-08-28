import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import GridList from '../GridList'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import IconButton from 'material-ui/IconButton'
import Join from 'material-ui/svg-icons/content/link'
import Tooltip from '../ToolTip'

const listHeader = [
    {
        xs: 3,
        sorting: true,
        name: 'name',
        title: 'Название'
    },
    {
        xs: 3,
        sorting: true,
        name: 'client',
        title: 'Клиент'
    },
    {
        xs: 3,
        sorting: true,
        name: 'address',
        title: 'Адрес'
    },
    {
        xs: 2,
        sorting: true,
        name: 'phone',
        title: 'Телефон'
    }
]

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            background: '#fff',
            top: '72px',
            left: '0',
            width: '100%',
            minHeight: '400px',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        iconBtn: {
            display: 'flex',
            justifyContent: 'flex-end',
            opacity: '0',
            transition: 'all 200ms ease-out',
            '& button > div': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        },
        listRow: {
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            '&:hover > div:last-child > div ': {
                opacity: '1'
            }
        },
        wrapper: {
            '& .row > div > svg': {
                position: 'relative',
                width: '16px !important',
                height: '16px !important',
                top: '3px',
                marginRight: '5px'
            }
        }
    })
)

const iconStyle = {
    icon: {
        color: '#5d6474',
        width: 22,
        height: 22
    },
    button: {
        width: 40,
        height: 40,
        padding: 0
    }
}

const JoinTabMarkets = enhance((props) => {
    const {
        filter,
        listData,
        classes
    } = props

    const shopDetail = (
        <div>-</div>

    )
    const shopList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const client = _.get(item, ['client', 'name'])
        const address = _.get(item, 'address') || 'Не известен'
        const phone = _.get(item, 'phone') || '-'
        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={3}>{name}</Col>
                <Col xs={3}>{client}</Col>
                <Col xs={3}>{address}</Col>
                <Col xs={2}>{phone}</Col>
                <Col xs={1}>
                    <div className={classes.iconBtn}>
                        <Tooltip position="bottom" text="Объединить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                <Join/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: shopList,
        loading: _.get(listData, 'marketsListLoading')
    }

    return (
        <div className={classes.wrapper}>
            <GridList
                filter={filter}
                list={list}
                listShadow={false}
                detail={shopDetail}
            />
        </div>
    )
})

JoinTabMarkets.propTypes = {}

export default JoinTabMarkets
