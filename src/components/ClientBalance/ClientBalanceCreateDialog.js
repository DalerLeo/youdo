import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'

import Pagination from '../GridList/GridListNavPagination'
import {Row, Col} from 'react-flexbox-grid'

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            background: '#fff'
        },
        wrapper: {
            position: 'relative',
            padding: '0 30px',
            marginBottom: '5px',
            '& .row': {
                alignItems: 'center',
                '& div': {
                    lineHeight: '55px'
                }
            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '55px',
            fontWeight: '600',
            borderBottom: '1px #efefef solid'

        },
        content: {
            width: '100%',
            overflow: 'hidden',
            '& > .row': {
                overflowY: 'auto',
                overflowX: 'hidden',
                margin: '0 -0.5rem',
                padding: '0'
            },
            '& > .row:first-child': {
                fontWeight: '600',
                lineHeight: '20px'
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            }
        }

    })
)

const ClientBalanceCreateDialog = enhance((props) => {
    const {open, loading, filter, onClose, classes} = props
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '900px'} : {width: '900px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
                <Row className={classes.wrapper} style={{position: 'relative'}}>
                    <Col xs={6}>TITLE</Col>
                    <Col xs={6}>N/A</Col>
                </Row>
                <div>
                    <div className={classes.title}>
                        <div className={classes.titleLabel}>Парти товаров</div>
                        <Pagination filter={filter}/>
                    </div>
                    <div className={classes.content}>
                        <Row className='dottedList'>
                            <Col xs={4}>Код</Col>
                            <Col xs={4}>Дата приемки</Col>
                            <Col xs={3}>Кол-во</Col>
                            <Col xs={1}>Статус</Col>
                        </Row>
                        <Row className='dottedList'>
                            <Col xs={4}>12</Col>
                            <Col xs={4}>12</Col>
                            <Col xs={3}>12 </Col>
                            <Col xs={1}>12</Col>
                        </Row>
                        <Row className='dottedList'>
                            <Col xs={4}>12</Col>
                            <Col xs={4}>12</Col>
                            <Col xs={3}>12 </Col>
                            <Col xs={1}>12</Col>
                        </Row>
                    </div>
                </div>
        </Dialog>
    )
})

ClientBalanceCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default ClientBalanceCreateDialog
