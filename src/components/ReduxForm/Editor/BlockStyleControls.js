import _ from 'lodash'
import React from 'react'
import StyleButton from './StyleButton'
import blockTypes from './blockTypes'

const BlockStyleControls = (props) => {
  const {editorState, onToggle} = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return _.map(blockTypes, (type, index) => {
    return (
      <StyleButton
        key={index}
        active={type.style === blockType}
        label={type.label}
        onToggle={onToggle}
        style={type.style}
      />
    )
  })
}

export default BlockStyleControls
