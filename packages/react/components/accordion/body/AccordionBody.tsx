import React from 'react'
import { AccordionBodyProps } from './AccordionBodyProps'
import clsx from 'clsx'
import { hashClass } from '../../../helpers'
import { useTrilogyContext } from '../../../context'

/**
 * Accordion Body Component
 * @param children {React.ReactNode} Children for Accordion body
 * - ------------------ WEB PROPERTIES -----------------------
 * @param className {string} Additionnal CSS Classes
 * @param contentClassName {string} Additionnal CSS Classes for accordion-content
 */
const AccordionBody = ({ children, className, dataId, testId, ...others }: AccordionBodyProps): React.JSX.Element => {
  const { styled } = useTrilogyContext()

  return (
    <div data-accordion-body={true}
         data-id={dataId}
        data-testid={testId} className={hashClass(styled, clsx('accordion-body is-clipped', className))} {...others}
         onClick={(e) => {
             e.stopPropagation()
         }}>
      <div className={hashClass(styled, clsx('accordion-content'))}>{children}</div>
    </div>
  )
}

export default AccordionBody
