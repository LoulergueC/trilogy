import React, { createContext, useState } from "react"
import {Dimensions, LayoutChangeEvent, StyleSheet} from "react-native"
import { View } from "@/components/view"
import { ColumnsProps } from "./ColumnsProps"
import { ComponentName } from "@/components/enumsComponentsName"
import { ScrollView } from 'react-native'
import { ColumnsGap, ColumnsGapValue } from "@/components/columns/ColumnsTypes"
import {Text} from "@/components/text";

/**
 * Columns Native Component
 * @param children {React.ReactNode}
 * @param centered {boolean} Center columns
 * @param verticalCentered {boolean} Vertical centered columns
 * @param marginSize {ColumnsSize} Delete margins between columns with Size
 * @param scrollable {boolean} Make colomns scrollable to vertical. Don't work with props 'marginSize'
 * @param gap {ColumnsGap} Gap between columns
 */

export const ColumnsContext = createContext({scrollable: false})

const Columns = ({
                   children,
                   centered,
                   gap,
                   nbCols,
                   verticalCentered,
                   fullBleed,
                   scrollable,
                   multiline,
                   ...others
                 }: ColumnsProps): JSX.Element => {

  const [width, setWidth] = useState(0)
  const [enlarge, setEnlarge] = useState(0)

  const onLayoutHandler = (event: LayoutChangeEvent) => {
    if (!width) {
      const { width } = event.nativeEvent.layout
      if(fullBleed) {
        setEnlarge((Dimensions.get('screen').width - width)/2)
      }
      setWidth(width)
    }
  }
  const realGap = ColumnsGapValue[(gap as ColumnsGap)] || 16

  const styles = StyleSheet.create({
    columns: {
      width: width ? width+ (enlarge*2) : '100%',
      marginHorizontal: -(enlarge),
      paddingHorizontal: enlarge,
      flexDirection: "row",
      gap: ColumnsGapValue[(gap as ColumnsGap)] || 16,
      display: "flex",
      justifyContent: 'space-evenly',
    },
    centered: {
      alignSelf: "center",
    },
    verticalAlign: {
      justifyContent: "center",
      flex: 1,
    },
    multiline: {
      flexWrap: "wrap",
    },
    scrollContainer: {
      width: 'auto',
      paddingHorizontal: enlarge,
      justifyContent: 'space-around',
      gap: realGap,
    }
  })

  if (!scrollable) {
    return (
      <>
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <View style={[
          styles.columns,
          multiline && styles.multiline,
          centered && styles.centered,
          verticalCentered && styles.verticalAlign,
        ]}
              {...others}
              {...{onLayout: onLayoutHandler}}
        >
          {// eslint-disable-next-line @typescript-eslint/no-explicit-any
            React.Children.map(children, (child: any) =>
              React.cloneElement(child, {
                style: [child.props.style,
                  {width: nbCols && (width / nbCols) - realGap || child.props.size && (width * child.props.size / 12) - realGap || 'auto'},
                  child.props.narrow && {flex: 'none', flexShrink: 1},
                ]
              })
            )}
        </View>
      </>
    )
  }

  return <View style={{
    width: `100% + ${enlarge*2}px`,
    marginHorizontal: -(enlarge)
  }} {...{onLayout: onLayoutHandler}}>
    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
      {// eslint-disable-next-line @typescript-eslint/no-explicit-any
        React.Children.map(children, (child: any) =>
          React.cloneElement(child, {
            style: [child.props.style, {
              width: width / (12 / (child.props.size || child.props.mobileSize || 12)) - 2*realGap,
              flexGrow: 0,
            }, child.props.narrow && {flex: 'none', flexShrink: 1}],
          })
        )}
    </ScrollView>
  </View>
}

Columns.displayName = ComponentName.Columns

export default Columns
