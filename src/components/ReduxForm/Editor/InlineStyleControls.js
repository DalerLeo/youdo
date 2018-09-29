import _ from 'lodash'
import React from 'react'
import StyleButton from './StyleButton'
import inlineStyles from './inlineStyles'

const InlineStyleControls = (props) => {
  const {editorState, onToggle} = props
  const currentStyle = editorState.getCurrentInlineStyle()

  return _.map(inlineStyles, (type, index) => {
    return (
      <StyleButton
        key={index}
        active={currentStyle.has(type.style)}
        label={type.label}
        onToggle={onToggle}
        style={type.style}
      />
    )
  })
}

export default InlineStyleControls
