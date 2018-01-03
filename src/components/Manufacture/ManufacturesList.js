import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Loader from '../Loader'
import Paper from 'material-ui/Paper'
import Alukobond from '../CustomIcons/Manufacture/Alukobond.svg'
import Metall from '../CustomIcons/Manufacture/Metall.svg'
import Crusher from '../CustomIcons/Manufacture/Crusher.svg'
import Glue from '../CustomIcons/Manufacture/Glue.svg'
import Carving from '../CustomIcons/Manufacture/Carving.svg'
import Tape from '../CustomIcons/Manufacture/Tape.svg'
import Manufacture from '../CustomIcons/Manufacture/Manufacture.svg'

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
        classes,
        handleClick,
        detailId
    } = props
    const manufactureList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const keyName = _.get(item, 'keyName')
        let icon = ''
        switch (keyName) {
            case 'alyukobond': icon = Alukobond
                break
            case 'metall': icon = Metall
                break
            case 'tape': icon = Tape
                break
            case 'glue': icon = Glue
                break
            case 'crusher': icon = Crusher
                break
            case 'carving': icon = Carving
                break
            default: icon = Manufacture
        }
        return (
            <li key={id}
                className={classes.productionType}
                onClick={() => {
                    handleClick(id)
                }}
                style={detailId === id ? {backgroundColor: 'white'} : {}}>
                <img src={icon}/>
                {name}
            </li>
        )
    })

    return (
        <div className={classes.productionLeftSide}>
            <h2>{t('Этапы производства')}</h2>
            <Paper zDepth={1} style={{height: 'calc(100% - 58px)', position: 'relative'}}>
                {_.get(listData, 'listLoading')
                    ? <div className={classes.loader}>
                        <Loader size={0.75}/>
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
