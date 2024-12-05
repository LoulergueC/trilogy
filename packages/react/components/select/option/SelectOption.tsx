import clsx from 'clsx'
import * as React from 'react'
import { SelectOptionProps } from './SelectOptionProps'
import { hashClass } from '@/helpers'
import { useTrilogyContext } from '@/context'
import { Icon } from '@/components/icon'
import { is } from '@/lib/services/classify'

/**
 * Select Option Component
 * @param value {string} Select option value
 * @param children {React.ReactNode}
 * @param label {string} option name
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param testId {string} id for testing
 * @param iconName {IconName | IconNameValues} icon
 * @param disabled {boolean} disable option
 * @param onClick {function} onclick function
 * @param id {string} Select option custom id
 * @param others
 */
const SelectOption = ({
                        id,
                        className,
                        value,
                        disabled,
                        children,
                        onClick,
                        label,
                        iconName,
                        testId,
                        ...others
                      }: SelectOptionProps) => {

  const { styled } = useTrilogyContext()
  const { checked, native, focused, ...props } = others as { checked: boolean, native: boolean, focused: boolean }
  const selectClasses = React.useMemo(() => hashClass(styled, clsx('option', focused && 'focus', disabled && is('disabled'), className)), [focused, className])

  if (native) {
    return (
      <option
        role="option"
        id={id}
        value={value}
        disabled={disabled}
        aria-label={label}
        data-testid={testId}
        onClick={onClick}
        {...props}
      >
        {children || label}
      </option>
    )
  }

  // return (
  //   <RadioTile
  //     checked={checked}
  //     horizontal
  //     className={selectClasses}
  //     value={value}
  //     disabled={disabled}
  //     onChange={onClick}
  //     icon={iconName}
  //     description={label || children}
  //     {...others}
  //   />
  // )

  return (
    <li
      id={id}
      className={selectClasses}
      data-selected={checked}
      role="option"
      aria-selected={checked}
      data-value={value}
      onClick={!disabled ? onClick : null}
      {...others}
    >
      {iconName && <Icon name={iconName} />}
      {label || children}
    </li>
  )
}

export default SelectOption
