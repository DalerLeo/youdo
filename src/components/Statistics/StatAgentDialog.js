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
import Person from '../Images/person.png'
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
            '& .personImage': {
                borderRadius: '50%',
                overflow: 'hidden',
                flexBasis: '35px',
                height: '35px',
                padding: '0!important',
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

                '&:last-child:after': {
                    display: 'none'
                }
            }
        }
    })),
)

const StatAgentDialog = enhance((props) => {
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
                    <div>Период: <b>22 Апр, 2017 - 22 Май, 2017</b></div>
                    <div>Сумма: <b>3 000 000 UZS</b></div>
                </div>
                <div className={classes.tableWrapper}>
                    <Row className="dottedList">
                        <Col xs={2}>№ заказа</Col>
                        <Col xs={6}>Магазин</Col>
                        <Col xs={2}>Дата</Col>
                        <Col xs={2}>Сумма</Col>
                    </Row>
                    <Row className="dottedList">
                        <Col xs={2}>123452</Col>
                        <Col xs={6}>Наименование объекта для сделки</Col>
                        <Col xs={2}>22 Апр, 2017</Col>
                        <Col xs={2}>100000 UZS</Col>
                    </Row>
                    <Row className="dottedList">
                        <Col xs={2}>123452</Col>
                        <Col xs={6}>Наименование объекта для сделки</Col>
                        <Col xs={2}>22 Апр, 2017</Col>
                        <Col xs={2}>100000 UZS</Col>
                    </Row>
                </div>
                <Pagination filter={filter}/>
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
