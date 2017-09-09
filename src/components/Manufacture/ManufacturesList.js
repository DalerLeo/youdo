import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import Glue from '../Images/glue.png'
import Cylindrical from '../Images/cylindrical.png'
import Press from '../Images/press.png'
import Cut from '../Images/cut.png'
import Badge from '../Images/badge.png'

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            position: 'absolute',
            top: '100px',
            left: '0',
            right: '0',
            bottom: '0',
            background: '#fff',
            justifyContent: 'space-around'
        },
        productionLeftSide: {
            padding: '0',
            width: '280px',
            '& h2': {
                fontSize: '13px',
                fontWeight: 'bold',
                margin: '0',
                padding: '20px 30px'
            }
        },
        productionUl: {
            listStyle: 'none',
            margin: '0',
            padding: '0',
            borderRight: '1px #efefef solid'
        },
        productionType: {
            background: '#f2f5f8',
            margin: '0',
            padding: '0 30px',
            height: '50px',
            borderBottom: '1px solid #efefef',
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '& img': {
                opacity: '0.8',
                width: '20px',
                height: '20px',
                marginRight: '10px'
            }
        }
    })
)

const ManufacturesList = enhance((props) => {
    const {
        listData,
        detailData,
        classes
    } = props

    const detailId = _.get(detailData, 'id')
    const glue = 2
    const cylindrical = 4
    const press = 6
    const cut = 1
    const badge = 8
    const manufactureList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        return (
            <li key={id} className={classes.productionType}
                onClick={() => {
                    listData.handleClickItem(id)
                }}
                style={detailId === id ? {backgroundColor: 'white'} : {}}>
                {id === glue ? <img src={Glue}/> : (
                    id === cylindrical ? <img src={Cylindrical}/> : (
                        id === press ? <img src={Press}/> : (
                            id === cut ? <img src={Cut}/> : (
                                id === badge ? <img src={Badge}/> : '')
                        )
                    )
                )}

                {name}
            </li>
        )
    })

    return (
        <div className={classes.productionLeftSide}>
            <h2>Этапы производства</h2>
            <Paper zDepth={1} style={{height: 'calc(100% - 58px)', position: 'relative'}}>
                {_.get(listData, 'listLoading')
                    ? <div className={classes.loader}>
                        <CircularProgress size={40} thickness={4}/>
                    </div>
                    : <ul className={classes.productionUl}>
                        {manufactureList}
                    </ul>}
            </Paper>
        </div>
    )
})

ManufacturesList.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default ManufacturesList
