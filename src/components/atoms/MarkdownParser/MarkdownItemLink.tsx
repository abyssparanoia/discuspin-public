import React from 'react'

interface Props {
  href: string
  children: React.ReactNode
}

export const MarkdownItemLink = (props: Props) => {
  return (
    <a href={props.href} target="_blank" rel="noreferrer noopener">
      {props.children}
    </a>
  )
}
