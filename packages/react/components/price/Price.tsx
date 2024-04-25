import * as React from "react"
import clsx from "clsx"
import { PriceProps } from "./PriceProps"
import { has, is } from "../../services/classify"
import { Text } from "../text"
import { Alignable } from "../../objects"
import { checkCents } from "./PriceHelpers"
import { hashClass } from "../../helpers"
import { useTrilogyContext } from "../../context"

/**
 * Price Component
 * @param amount {number} Amount for Price
 * @param mention {string} Mention for price ( (1)* )
 * @param period {string} Period for Price (mois)
 * @param showCents {boolean} Display cents
 * @param level {PriceLevel} Price custom size
 * @param inverted {boolean} Inverted Price Color
 * @param children {React.ReactNode}
 * @param align {Alignable} Price alignement
 * @param inline {boolean} Inline display Price
 * @param accessibilityLabel {string} Accessibility label
 * @param testId {string} Test Id for Test Integration
 * @param suptitle {string} Price Suptitle
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param striked {boolean} Striked Price
 * - --------------- NATIVE PROPERTIES ----------------------------------
 */
const Price = ({
  className,
  amount,
  mention,
  period,
  showCents,
  level,
  inverted,
  align,
  alert,
  inline,
  testId,
  accessibilityLabel,
  striked,
  suptitle,
  ...others
}: PriceProps): JSX.Element => {
  const { styled } = useTrilogyContext()

  const classes = hashClass(
    styled,
    clsx(
      "price",
      alert && is(`${alert}`),
      level && is(`level-${level}`),
      inverted && is("inverted"),
      inline && is("inlined"),
      striked && is("striked"),
      suptitle && has("suptitle"),
      className
    )
  )

  const priceParentNode = hashClass(
    styled,
    clsx(
      (align == Alignable.ALIGNED_START && has("text-left")) ||
        (align == Alignable.ALIGNED_CENTER && has("text-centered")) ||
        (align == Alignable.ALIGNED_END && has("text-right")) ||
        ""
    )
  )

  const isNegative = amount < 0
  const absoluteAmount = Math.abs(amount)
  const absoluteWhole = Math.floor(absoluteAmount)
  const whole = isNegative ? -absoluteWhole : absoluteWhole

  let cents = checkCents(
    absoluteAmount.toString().split(/[.,]/)[1]?.substring(0, 2) || ""
  )

  cents = (cents && cents.length === 1 && `${cents}0`) || cents

  const centsDisplayed =
    (inline && showCents && `,${cents || "00"} €`) ||
    (showCents && `€${cents || "00"}`) ||
    "€"

  if (align) {
    return (
      <div className={priceParentNode}>
        <div
          data-testid={testId}
          aria-label={accessibilityLabel}
          className={classes}
          {...others}
        >
          {suptitle && <span className='price-suptitle'>{suptitle}</span>}
          <Text>{`${whole}`}</Text>
          <span className={hashClass(styled, clsx("price-details"))}>
            <span className={hashClass(styled, clsx("cents"))}>
              {inline && centsDisplayed === "€" ? (
                <>&nbsp;{centsDisplayed}</>
              ) : (
                centsDisplayed
              )}
              {mention && <sup>{mention}</sup>}
            </span>
            {period && (
              <span className={hashClass(styled, clsx("period"))}>
                /{period}
              </span>
            )}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      data-testid={testId}
      aria-label={accessibilityLabel}
      className={classes}
      {...others}
    >
      {suptitle && <span className='price-suptitle'>{suptitle}</span>}
      <Text>{`${whole}`}</Text>
      <span className={hashClass(styled, clsx("price-details"))}>
        <span className={hashClass(styled, clsx("cents"))}>
          {centsDisplayed || "00"}
          {mention && <sup>{mention}</sup>}
        </span>
        {period && (
          <span className={hashClass(styled, clsx("period"))}>/{period}</span>
        )}
      </span>
    </div>
  )
}

export default Price
