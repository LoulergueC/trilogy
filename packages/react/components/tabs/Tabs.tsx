import { TabsProps } from '@/components/tabs/TabsProps'
import { TabsContext } from '@/components/tabs/context'
import { useTrilogyContext } from '@/context/index'
import { hashClass } from '@/helpers/hashClassesHelpers'
import { is } from '@/services/classify'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

/**
 * Tabs Component
 * @param children {ReactNode} Children for tabs
 * @param activeIndex {number} default active tab index
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param fullwidth {boolean} Fullwidth tabs
 * @param id
 */
const Tabs = ({ children, className, id, activeIndex, fullwidth }: TabsProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(activeIndex || 0)
  const { styled } = useTrilogyContext()
  const classes = hashClass(styled, clsx('tabs', fullwidth && is('fullwidth'), className))

  useEffect(() => {
    activeIndex !== undefined && setCurrentIndex(activeIndex)
  }, [activeIndex])

  return (
    <TabsContext.Provider value={{ activeIndex: currentIndex, setActiveIndex: setCurrentIndex }}>
      <div id={id} className={classes} data-tabs-context=''>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export default Tabs
