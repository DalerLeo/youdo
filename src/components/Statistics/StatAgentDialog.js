import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import MainStyles from '../Styles/MainStyles'
import {Row, Col} from 'react-flexbox-grid'
import Person from '../Images/person.png'
import Pagination from '../GridList/GridListNavPagination'
import getConfig from '../../helpers/getConfig'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        content: {
            width: '100%',
            display: 'block',
            '& > div:last-child': {
                padding: '0 30px',
                borderTop: '1px #efefef solid'
            }
        },
        titleSummary: {
            padding: '20px 30px',
            display: 'flex',
            justifyContent: 'space-between'
        },
        downBlock: {
            padding: '20px 30px',
            '& .row': {
                lineHeight: '35px',
                padding: '0 10px',
                display: 'flex',
                justifyContent: 'space-between',
                '& > div:last-child': {
                    textAlign: 'right',
                    fontWeight: '600'
                }
            },
            '& .row:last-child': {
                fontWeight: '600',
                borderTop: '1px #efefef solid'
            }
        },
        subTitle: {
            paddingBottom: '8px',
            fontStyle: 'italic',
            fontWeight: '400'
        },
        titleContent: {
            textTransform: 'uppercase',
            lineHeight: '60px',
            padding: '0 30px',
            '& div': {
                display: 'flex',
                alignItems: 'center'
            },
            '& .personImage': {
                borderRadius: '50%',
                overflow: 'hidden',
                flexBasis: '35px',
                height: '35px',
                minWidth: '30px',
                width: '35px',
                marginRight: '10px',
                '& img': {
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }
            },
            '& button': {
                display: 'flex!important',
                justifyContent: 'center'
            }

        },
        tableWrapper: {
            padding: '0 30px',
            '& .row': {
                '&:first-child': {
                    fontWeight: '600'
                }
            },
            '& .dottedList': {
                padding: '15px 0',
                '& > div:last-child': {
                    textAlign: 'right'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        }
    })),
)

const StatAgentDialog = enhance((props) => {
    const {open, loading, onClose, classes, detailData} = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const orderList = _.map(_.get(detailData, ['data', 'results']), (item) => {
        const id = _.get(item, 'id')
        const market = _.get(item, ['market', 'name'])
        const totalPrice = _.get(item, 'totalPrice')
        const createdDate = moment(_.get(item, 'createdDate')).format('LL')

        return (
            <Row key={id} className="dottedList">
                <Col xs={2}>{id}</Col>
                <Col xs={6}>{market}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={2}>{totalPrice} {primaryCurrency}</Col>
            </Row>
        )
    })

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '400px'} : {width: '700px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <div>
                    <div className="personImage">
                        <img src={Person} alt=""/>
                    </div>
                    <div>Снегирев Нигер</div>
                </div>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.content}>
                <div className={classes.titleSummary}>
                    <div>Период: <strong>22 Апр, 2017 - 22 Май, 2017</strong></div>
                    <div>Сумма: <strong>3 000 000 UZS</strong></div>
                </div>
                <div className={classes.tableWrapper}>
                    <Row className="dottedList">
                        <Col xs={2}>№ заказа</Col>
                        <Col xs={6}>Магазин</Col>
                        <Col xs={2}>Дата</Col>
                        <Col xs={2}>Сумма</Col>
                    </Row>
                    {_.get(detailData, 'detailLoading')
                        ? <div style={{textAlign: 'center'}}>
                            <CircularProgress/>
                        </div>
                        : orderList}
                </div>
                <Pagination filter={_.get(detailData, 'filter')}/>
            </div>
        </Dialog>
    )
})

StatAgentDialog.propTyeps = {
    filter: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default StatAgentDialog
