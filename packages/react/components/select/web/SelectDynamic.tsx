import clsx from 'clsx'
import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'

import { Input } from '@/components/input'
import { SelectedValue, SelectProps } from '@/components/select/SelectProps'
import { useTrilogyContext } from '@/context/index'
import { hashClass } from '@/helpers'
import { SelectOption } from '../'

const SelectDynamic = ({
  onChange,
  disabled,
  onFocus,
  onBlur,
  children,
  selected,
  name,
  id,
  label,
  iconName,
  multiple,
  className,
}: PropsWithChildren<SelectProps>): JSX.Element => {
  const { styled } = useTrilogyContext()
  const [focused, setIsFocused] = React.useState<boolean>(false)
  const [selectedValues, setSelectedValues] = React.useState<SelectedValue>(selected)
  const [selectedName, setSelectedName] = React.useState<string[]>([])
  const reactId = React.useId()
  const selectClasses = React.useMemo(() => hashClass(styled, clsx('select', className)), [styled, className])
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)

  const onClickInput = React.useCallback(() => {
    setIsFocused((prev) => !prev)
  }, [])

  const onKeyPressInput = React.useCallback(
    (keyCode: number) => {
      if (keyCode === 13) {
        setIsFocused((prev) => {
          if (multiple && !prev) return true
          if (multiple && prev) return prev
          return !prev
        })
      }
    },
    [multiple],
  )

  const isChecked = useCallback(
    (value: string) =>
      (multiple && selectedValues && typeof selectedValues !== 'string' && typeof selectedValues !== 'number'
        ? selectedValues?.includes(value)
        : selectedValues === value),
    [multiple, selectedValues],
  )

  const setNewSelectedValues = useCallback(
    ({ isChecked, children, label, value }: { isChecked: boolean; children: string; label: string; value: string }) => {
      const selectedOptions: string[] = []
      if (isChecked) {
        setSelectedValues((prev) => {
          switch (true) {
            case Array.isArray(prev):
              setSelectedName((prev) => prev.filter((txt) => ![children, label].includes(txt)))
              const opts = (prev as string[]).filter((item: string | number) => item !== value)
              selectedOptions.push(...opts)
              return opts
            case !Array.isArray(prev):
              setSelectedName([])
              return undefined
            default:
              return value
          }
        })
      }
      if (!isChecked) {
        setSelectedValues((prev) => {
          if (Array.isArray(prev)) {
            const opts = [...prev, value]
            selectedOptions.push(...opts)
            return opts
          }
          selectedOptions.push(value)
          return value
        })
        setSelectedName((prev) => {
          if (multiple) return [...prev, children || label]
          return [children || label]
        })
      }
      return selectedOptions
    },
    [multiple],
  )

  React.useEffect(() => {
    const labelSelected = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return false
      const label = child.props.children || child.props.label
      switch (true) {
        case (Array.isArray(selected) && (selected as (number | string)[]).includes(child.props.value)) ||
          (!Array.isArray(selected) && child.props.value === selected):
          return label
        default:
          return false
      }
    })?.filter((item) => item)
    labelSelected && setSelectedName(labelSelected)
    setSelectedValues(selected)
  }, [selected])

  const modal = useMemo(
    () => <div role='presentation' className='select-trilogy_modal_open' onClick={() => setIsFocused(false)} />,
    [],
  )

  const options = React.useMemo(() => {
    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return null
      const clickEventValue = (v: string) => {
        switch (true) {
          case (multiple && (selectedValues as (number | string)[])?.includes(child.props.value)) ||
            (!multiple && selectedValues === child.props.value):
            return undefined
          default:
            return v
        }
      }

      const props = {
        ...child.props,
        checked: isChecked(child.props.value),
        focused: focusedIndex === index ? 'true' : undefined,
        onClick: () => {
          const opts = setNewSelectedValues({
            children: child.props.children,
            label: child.props.label,
            value: child.props.value,
            isChecked: isChecked(child.props.value),
          })
          onChange &&
            onChange({
              selectValue: clickEventValue(child.props.value),
              selectName: clickEventValue(child.props.children || child.props.label),
              selectId: clickEventValue(child.props.id),
              name: clickEventValue(child.props.children || child.props.label),
              selectedOptions: opts,
            })
          if (child.props.onClick) child.props.onClick()
          if (!multiple) setIsFocused(false)
        },
      }
      return <SelectOption {...props} key={`${reactId}_${index}`} />
    })
  }, [multiple, selectedValues, focusedIndex, children])

  return (
    <div className={selectClasses}>
      <Input
        value={selectedName.join(', ')}
        name={name}
        disabled={disabled}
        placeholder={label}
        onFocus={onFocus}
        iconNameLeft={iconName}
        onBlur={onBlur}
        onClick={onClickInput}
        className={hashClass(styled, clsx(focused && 'focus'))}
        onKeyPress={(e) => {
          e.preventDefault()
        }}
        onKeyUp={(e) => {
          e.preventDefault()
          onKeyPressInput(e.inputKeyCode)
        }}
        {...{ readOnly: true, id, role: 'combobox' }}
      />
      {focused && <ul role="listbox"  className={hashClass(styled, clsx('select-options'))}>{options}</ul>}
      {focused && ReactDOM.createPortal(modal, document.body)}
    </div>
  )
}
export default SelectDynamic
