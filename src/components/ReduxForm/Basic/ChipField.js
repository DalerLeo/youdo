/* eslint no-invalid-this: 0 */
/* eslint no-undefined: 0 */

import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import Chip from 'material-ui/Chip'

import {compose, withHandlers} from 'recompose'

const enhance = compose(
  withHandlers({
    handleRequestDelete: props => (id) => {
      const onChange = _.get(props, ['input', 'onChange'])
      const marketTypes = _(props)
        .get(['input', 'value'])
        .filter((item, index) => item.id !== id)

      onChange(marketTypes)
    }
  })
)

const ChipField = enhance(({input, classes, handleRequestDelete}) => {
  return (
    <div className={classes.wrapper}>
      <span>Тип магазинов</span>
      <div className={classes.chipWrapper}>
        {_.map(input.value, (item) => {
          return (
            <Chip
              key={item.id}
              style={{margin: 4}}
              onRequestDelete={
                () => { handleRequestDelete(item.id) }
              }
              onChange={() => { input.onChange(input.value) }}
            >
              {item.name}
            </Chip>
          )
        })}
      </div>
    </div>
  )
})

export default injectSheet({
  chipWrapper: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '10px'
  },
  wrapper: {
    marginTop: '10px'
  },
  button: {
    display: 'flex',
    border: 'solid 1px #efefef !important',
    '& button': {
      '& > div': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
  }
})(ChipField)
