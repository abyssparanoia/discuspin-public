import React from 'react'
import ReactMarkdown from 'react-markdown'
import { MarkdownItemImage } from './MarkdownItemImage'
import { MarkdownItemLink } from './MarkdownItemLink'
import { MarkdownItemCode } from './MarkdownItemCode'

interface Props {
  source: string
}

export const Markdown = (props: Props) => {
  return (
    <ReactMarkdown
      source={props.source}
      renderers={{
        image: MarkdownItemImage,
        link: MarkdownItemLink,
        code: MarkdownItemCode
      }}
    ></ReactMarkdown>
  )
}
