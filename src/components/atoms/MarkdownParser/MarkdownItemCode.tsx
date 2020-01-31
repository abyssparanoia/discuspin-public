import React from 'react'
import Highlight from 'react-highlight.js'

interface Props {
  language: string | undefined
  value: string
}
export const MarkdownItemCode = (props: Props) => {
  return <Highlight language={props.language || 'javascript'}>{props.value}</Highlight>
}
