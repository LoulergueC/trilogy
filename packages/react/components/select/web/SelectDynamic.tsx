import clsx from 'clsx'
import React, { PropsWithChildren, useMemo } from 'react'
import ReactDOM from 'react-dom'

import { hashClass } from '../../../helpers'
import { Input } from '../../input'
import { SelectProps } from '../SelectProps'
import SelectOption from '../option'
import { useTrilogyContext } from './../../../context'

const SelectDynamic = ({
  onChange,
  nullable,
  disabled,
  onFocus,
  onBlur,
  children,
  selected,
  name,
  id,
  testId,
  label,
  iconName,
  multiple,
  className,
}: PropsWithChildren<SelectProps>): JSX.Element => {
  const { styled } = useTrilogyContext()
  const [focused, setIsFocused] = React.useState<boolean>(false)
  const [selectedValues, setSelectedValues] = React.useState(selected)
  const [selectedName, setSelectedName] = React.useState<string[]>([])
  const reactId = React.useId()
  const selectClasses = React.useMemo(() => hashClass(styled, clsx('select', className)), [styled, className])

  const onClickInput = React.useCallback(() => {
    setIsFocused((prev) => !prev)
  }, [])

  React.useEffect(() => {
    setSelectedValues(selected)

    const setInputValue = () => {
      const labelSelected = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return false
        const label = child.props.children || child.props.label

        if (Array.isArray(selected)) {
          if ((selected as (number | string)[]).includes(child.props.value)) return label
        }
        if (!Array.isArray(selected) && child.props.value === selected) {
          return label
        }

        return false
      })?.filter((item) => item)
      labelSelected && setSelectedName(labelSelected)
    }
    setInputValue()
  }, [selected])

  const modal = useMemo(() => {
    return <div role='presentation' className='select-trilogy_modal_open' onClick={() => setIsFocused(false)}></div>
  }, [])

  const options = React.useMemo(() => {
    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return null

      const clickEventValue = (v: string) => {
        switch (true) {
          case nullable && multiple && (selectedValues as (number | string)[])?.includes(child.props.value):
            return undefined
          case nullable && !multiple && selectedValues === child.props.value:
            return undefined
          default:
            return v
        }
      }

      const isChecked = multiple
        ? (selectedValues as (number | string)[])?.includes(child.props.value)
        : selectedValues === child.props.value

      const setNewSelectedValues = () => {
        if (isChecked) {
          setSelectedValues((prev) => {
            switch (true) {
              case Array.isArray(prev) && nullable:
                setSelectedName((prev) =>
                  prev.filter((txt) => ![child.props.children, child.props.label].includes(txt)),
                )
                return (prev as (number | string)[]).filter((item: string | number) => item !== child.props.value)

              case Array.isArray(prev) && !nullable:
                return prev

              case !Array.isArray(prev) && !nullable:
                setIsFocused(false)
                return prev

              case !Array.isArray(prev) && nullable:
                setIsFocused(false)
                setSelectedName([])
                return undefined

              default:
                return child.props.value
            }
          })
        }

        if (!isChecked) {
          setSelectedValues((prev) => {
            console.log(prev)
            if (Array.isArray(prev)) {
              setSelectedName((prev) => [...prev, child.props.children || child.props.label])
              return [...prev, child.props.value]
            }
            setIsFocused(false)
            setSelectedName([child.props.children || child.props.label])
            return child.props.value
          })
        }
      }

      const props = {
        ...child.props,
        checked: isChecked,
        onClick: () => {
          setNewSelectedValues()
          onChange &&
            onChange({
              selectValue: clickEventValue(child.props.value),
              selectName: clickEventValue(child.props.children || child.props.label),
              selectId: clickEventValue(child.props.id),
            })
          if (child.props.onClick) child.props.onClick()
        },
      }
      return <SelectOption {...props} key={`${reactId}_${index}`} />
    })
  }, [multiple, nullable, selectedValues])

  return (
    <div className={selectClasses}>
      <Input
        value={selectedName.join(', ')}
        testId={testId}
        name={name}
        disabled={disabled}
        placeholder={label}
        onFocus={onFocus}
        customIconLeft={iconName}
        customIconRight={focused ? 'tri-arrow-up' : 'tri-arrow-down'}
        onBlur={onBlur}
        onClick={onClickInput}
        className={hashClass(styled, clsx(focused && 'focus'))}
        {...{ readOnly: true, id }}
      />
      {focused && <div className={hashClass(styled, clsx('select-options'))}>{options}</div>}
      {focused && ReactDOM.createPortal(modal, document.body)}
    </div>
  )
}

export default SelectDynamic
