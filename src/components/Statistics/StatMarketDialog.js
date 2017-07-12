import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import {Row, Col} from 'react-flexbox-grid'
import Pagination from '../GridList/GridListNavPagination'

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
            textTransform: 'capitalize',
            lineHeight: '60px',
            padding: '0 30px',
            '& div': {
                display: 'flex',
                alignItems: 'center'
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

const StatMarketDialog = enhance((props) => {
    const {open, loading, onClose, classes, filter} = props

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
                <span>Наименование магазина</span>
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
                        <Col xs={6}>Агент</Col>
                        <Col xs={2}>Дата</Col>
                        <Col xs={2}>Сумма</Col>
                    </Row>
                    <Row className="dottedList">
                        <Col xs={2}>123452</Col>
                        <Col xs={6}>Хабибуллаев Тошмуроджон</Col>
                        <Col xs={2}>22 Апр, 2017</Col>
                        <Col xs={2}>100000 UZS</Col>
                    </Row>
                    <Row className="dottedList">
                        <Col xs={2}>123452</Col>
                        <Col xs={6}>Хамидуллаев Хамзабек</Col>
                        <Col xs={2}>22 Апр, 2017</Col>
                        <Col xs={2}>100000 UZS</Col>
                    </Row>
                </div>
                <Pagination filter={filter}/>
            </div>
        </Dialog>
    )
})

StatMarketDialog.propTyeps = {
    filter: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default StatMarketDialog
