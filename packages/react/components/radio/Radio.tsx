import { RadioProps } from '@/components/radio/RadioProps'
import { useTrilogyContext } from '@/context'
import { hashClass } from '@/helpers/hashClassesHelpers'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

/**
 * radio Component
 * @param checked {boolean} Checked radio
 * @param disabled {boolean} Disabled
 * @param readOnly {boolean} readonly radio
 * @param id {string} Id for button, by default id is generate
 * @param label {string} Label for radio
 * @param onChange {ChangeEvent}
 * @param name {string} Name for radio
 * @param value {string} Value for radio
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes (ONLY FOR WEB)
 */
const Radio = ({
  checked,
  className,
  disabled,
  readonly,
  id = React.useId(),
  label,
  onChange,
  name,
  value,
  ...others
}: RadioProps): JSX.Element => {
  const { styled } = useTrilogyContext()

  const [_checked, setChecked] = useState<boolean>(checked || false)

  useEffect(() => {
    if (!readonly) {
      setChecked(checked || false)
    }
  }, [checked, readonly])

  return (
    <div className={hashClass(styled, clsx('radio', className))}>
      <input
        type='radio'
        readOnly={readonly}
        id={id}
        disabled={disabled}
        name={name}
        value={value}
        checked={readonly ? checked : _checked}
        onChange={(e) => (onChange ? onChange : setChecked(e.target.checked))}
        {...others}
      />
      <label htmlFor={id} className={hashClass(styled, clsx('radio-label'))}>
        {label}
      </label>
    </div>
  )
}

export default Radio
