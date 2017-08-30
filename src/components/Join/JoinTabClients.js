import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import GridList from '../GridList'
import moment from 'moment'
import IconButton from 'material-ui/IconButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Tooltip from '../ToolTip'
import Join from 'material-ui/svg-icons/content/link'
import JoinDialog from './JoinDialog'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            '& .row > div > svg': {
                position: 'relative',
                width: '16px !important',
                height: '16px !important',
                top: '3px',
                marginRight: '5px'
            }
        },
        mainButton: {
            position: 'absolute',
            top: -50,
            right: 18
        },
        loader: {
            position: 'absolute',
            background: '#fff',
            top: '100px',
            left: '0',
            width: '100%',
            minHeight: '400px',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        listWrapper: {
            position: 'relative',
            '& > div:nth-child(2)': {
                marginTop: '0 !important'
            }
        },
        list: {
            cursor: 'pointer',
            marginBottom: '5px',
            '& > a': {
                color: 'inherit'
            }
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
        }
    })
)

const listHeader = [
    {
        sorting: true,
        name: 'id',
        xs: 1,
        title: 'Id'
    },
    {
        sorting: true,
        name: 'name',
        xs: 5,
        title: 'Наименование'
    },
    {
        sorting: true,
        title: 'Похожие',
        xs: 2
    },
    {
        sorting: true,
        xs: 3,
        name: 'created_date',
        title: 'Дата создания'
    },
    {
        sorting: false,
        xs: 1,
        name: 'actions',
        title: ''
    }
]

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

const JoinTabClients = enhance((props) => {
    const {
        listData,
        filter,
        classes,
        joinClientDialog
    } = props
    const listLoading = _.get(listData, 'clientsListLoading')
    const clientDetails = (<div>2</div>)

    const clientList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const repetition = _.get(item, 'repetition')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={1}>{id}</Col>
                <Col xs={5}>{name}</Col>
                <Col xs={2}>{repetition}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col xs={1}>
                    <div className={classes.iconBtn}>
                        <Tooltip position="bottom" text="Объединить">
                            <IconButton
                                onTouchTap={() => { joinClientDialog.handleOpenJoinClients(id) }}
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
        list: clientList,
        loading: listLoading
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.mainButton}>
                <Tooltip position="left" text="Объединить">
                    <FloatingActionButton
                        onTouchTap={() => { joinClientDialog.handleOpenJoinClients(true) }}
                        backgroundColor="#12aaeb"
                        mini={true}
                        zDepth={1}>
                        <Join/>
                    </FloatingActionButton>
                </Tooltip>
            </div>
            <GridList
                filter={filter}
                list={list}
                listShadow={false}
                detail={clientDetails}/>
            <JoinDialog
                initialValues={joinClientDialog.initialValues}
                isClient={true}
                open={joinClientDialog.openJoinClient}
                loading={joinClientDialog.clientsItemLoading}
                onClose={joinClientDialog.handleCloseJoinClients}
                onSubmit={joinClientDialog.handleSubmitJoinClients}
            />
        </div>
    )
})

JoinTabClients.propTypes = {
    joinClientDialog: PropTypes.shape({
        joinLoading: PropTypes.bool.isRequired,
        openJoinClient: PropTypes.string.isRequired,
        handleOpenJoinClients: PropTypes.func.isRequired,
        handleCloseJoinClients: PropTypes.func.isRequired,
        handleSubmitJoinClients: PropTypes.func.isRequired
    }).isRequired
}

export default JoinTabClients
