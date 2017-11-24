import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import LinearProgress from '../LinearProgress'
import Paper from 'material-ui/Paper'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import dateTimeFormat from '../../helpers/dateTimeFormat'
const ONE = 1
const TWO = 2
const TEN = 10
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            position: 'relative',
            margin: '15px 0',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex',
            '& > div': {
                background: 'transparent'
            }
        },
        padding: {
            padding: '20px 30px'
        },
        block: {
            paddingRight: '20px'
        },
        blockTitle: {
            padding: '15px 0',
            fontWeight: 'bold'
        },
        blockItems: {
            overflowY: 'auto',
            height: 'calc(100% - 80px)',
            paddingRight: '10px',
            '& a': {
                fontWeight: '600',
                display: 'block',
                textAlign: 'center',
                '&:hover': {
                    textDecoration: 'underline'
                }
            }
        },
        tube: {
            padding: '20px 15px',
            marginBottom: '10px',
            width: '300px'
        },
        tubeTitle: {
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between'
        },
        tubeTime: {
            fontSize: '10px',
            color: '#999'
        },
        status: {
            borderRadius: '2px',
            height: '4px',
            width: '30px'
        },
        statusGreen: {
            extend: 'status',
            background: '#92ce95'
        },
        statusRed: {
            extend: 'status',
            background: '#e57373'
        },
        tubeImg: {
            marginTop: '10px',
            '& img': {
                width: '100%',
                display: 'block',
                cursor: 'pointer'
            }
        },
        tubeImgDouble: {
            extend: 'tubeImg',
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                width: 'calc(50% - 4px)',
                position: 'relative',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    padding: '2px 8px',
                    color: '#fff',
                    background: '#333',
                    opacity: '0.8',
                    fontSize: '11px',
                    fontWeight: '600'
                },
                '&:first-child:after': {
                    content: '"до"'
                },
                '&:last-child:after': {
                    content: '"после"'
                }
            }
        },
        tubeInfo: {
            marginTop: '10px',
            lineHeight: '15px'
        }
    }),
    withState('defaultPage', 'updateDefaultPage', TWO)
)

const ActivityDelivery = enhance((props) => {
    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const {
        deliverylistData,
        classes,
        summary,
        summaryLoading,
        handleLoadMoreItems,
        defaultPage,
        updateDefaultPage
    } = props

    const type = _.meanBy(_.get(deliverylistData, 'data'), (o) => {
        return _.get(o, 'type')
    })
    const deliverylistLoading = _.get(deliverylistData, 'deliveryListLoading')
    const summaryCount = _.get(summary, 'count')
    const deliveryList = _.map(_.get(deliverylistData, 'data'), (item) => {
        const id = _.get(item, ['order', 'id'])
        const amount = numberFormat(_.get(item, ['order', 'totalPrice']), currentCurrency)
        const name = _.get(item, ['order', 'user', 'firstName']) + ' ' + _.get(item, ['order', 'user', 'secondName'])
        const market = _.get(item, ['order', 'market', 'name'])
        const createdDate = dateTimeFormat(_.get(item, ['order', 'createdDate']), true)

        return (
            <Paper key={id} zDepth={1} className={classes.tube}>
                <div className={classes.tubeTitle}>
                    <span>{name}</span>
                </div>
                <div className={classes.tubeTime}>{createdDate}</div>
                <div className={classes.tubeInfo}>Доставлено с магазина "{market}" на сумму {amount}</div>
            </Paper>
        )
    })

    if (_.isEmpty(deliveryList)) {
        return null
    }

    return (
        <div className={classes.block}>
            <div className={classes.blockTitle}>
                <div>Доставки ({summaryCount})</div>
            </div>
            <div className={classes.blockItems}>
                {deliveryList}
                {(deliverylistLoading || summaryLoading)
                    ? <div className={classes.loader}>
                        <LinearProgress/>
                    </div>
                : (summaryCount > TEN) && (deliverylistData.data.length < summaryCount) && <a onClick={() => {
                    handleLoadMoreItems(type, defaultPage)
                    updateDefaultPage(defaultPage + ONE)
                }}>Загрузить еще...</a>}
            </div>
        </div>
    )
})

ActivityDelivery.PropTypes = {
    returnlistData: PropTypes.object
}

export default ActivityDelivery
