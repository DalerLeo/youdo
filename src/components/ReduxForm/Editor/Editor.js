import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  compose,
  withState,
  withHandlers,
  lifecycle
} from 'recompose'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertFromHTML,
  ContentState
} from 'draft-js'
import {stateToHTML} from 'draft-js-export-html'
import BlockStyleControls from './BlockStyleControls'
import InlineStyleControls from './InlineStyleControls'
import 'draft-js/dist/Draft.css'
import './Editor.css'
import {BORDER_STYLE} from '../../../constants/styleConstants'
import Label from './FieldLabel'

const enhance = compose(
  withState('editorState', 'setEditorState', EditorState.createEmpty()),
  withHandlers({
    onChange: props => (state) => {
      const {setEditorState, input} = props
      const html = stateToHTML(state.getCurrentContent())
      setEditorState(state)
      return input.onChange(html)
    }
  }),
  lifecycle({
    componentDidMount () {
      const {input, setEditorState} = this.props
      const value = input.value
      if (value) {
        const state = EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(input.value)
          )
        )
        setEditorState(state)
      }
    },
    componentDidUpdate (prevProps) {
      const nextProps = this.props
      const {setEditorState} = nextProps
      const prevInputValue = _.get(prevProps, 'input.value')
      const nextInputValue = _.get(nextProps, 'input.value')

      if (nextInputValue !== prevInputValue && !nextInputValue) {
        const state = EditorState.createWithContent(
          ContentState.createFromText('')
        )
        setEditorState(state)
      }
    }
  }),
  injectSheet({
    wrapper: {
      borderRadius: '0',
      border: BORDER_STYLE,
      position: 'relative',
      background: '#fff'
    },
    controls: {
      transition: 'all 300ms',
      borderBottom: BORDER_STYLE,
      opacity: '0',
      height: '0',
      display: 'flex',
      overflow: 'hidden',
      visibility: 'hidden',
      margin: '0',
      padding: '0'
    },
    controlShow: {
      margin: '0 15px',
      height: '45px',
      overflow: 'hidden',
      padding: '12px 10px',
      opacity: '1',
      visibility: 'visible'
    },
    editor: {
      cursor: 'text',
      minHeight: '40px',
      padding: '10px 15px',
      '& .public-DraftEditorPlaceholder-root': {
        color: '#bfbfbf'
      }
    },
    editAnim: {minHeight: '55px'}
  })
)

const TextEditor = (props) => {
  const {
    classes,
    editorState,
    label,
    placeholder,
    button,
    meta: {active},
    input
  } = props
  const editor = React.createRef()

  const focus = () => {
    return editor.current.focus()
  }

  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command)
    if (newState) {
      props.onChange(newState)
      return true
    }
    return false
  }

  const mapKeyToEditorCommand = (event) => {
    const TAB_CHAR = 9
    const MAX_DEPTH = 4
    if (event.keyCode === TAB_CHAR) {
      const newEditorState = RichUtils.onTab(
        event,
        editorState,
        MAX_DEPTH
      )
      if (newEditorState !== editorState) {
        return props.onChange(newEditorState)
      }
    }
    return getDefaultKeyBinding(event)
  }

  const toggleBlockType = (blockType) => {
    return props.onChange(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    )
  }

  const toggleInlineStyle = (inlineStyle) => {
    return props.onChange(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineStyle
      )
    )
  }

  const getBlockStyle = (block) => {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote'
      default: return null
    }
  }

  const styleMap = {
    CODE: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2
    }
  }

  const contentState = editorState.getCurrentContent()
  const hidePlaceholder = !contentState.hasText() && contentState.getBlockMap().first().getType() !== 'unstyled'
  return (
    <div>
      <Label label={label}/>
      <div className={classes.wrapper}>
        <div className={classNames({
          [classes.controls]: true,
          [classes.controlShow]: active
        })}>
          {button}
          <BlockStyleControls
            editorState={editorState}
            onToggle={toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={toggleInlineStyle}
          />
        </div>
        <div className={classNames(classes.editor, {
          [classes.editAnim]: active,
          'RichEditor-hidePlaceholder': hidePlaceholder
        })} onClick={focus}>
          <Editor
            ref={editor}
            placeholder={placeholder}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            onChange={props.onChange}
            onBlur={() => input.onBlur()}
            onFocus={() => input.onFocus()}
            spellCheck={true}
          />
        </div>
      </div>
    </div>
  )
}

TextEditor.propTypes = {
  extraButton: PropTypes.node,
  flexible: PropTypes.bool,
  filesCount: PropTypes.number,
  editorHeight: PropTypes.number
}

export default enhance(TextEditor)
