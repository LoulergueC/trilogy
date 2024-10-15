import React, { createContext } from "react"
import {Dimensions, StyleSheet} from "react-native"
import { View } from "@/components/view"
import { ScrollView } from "@/components/scroll-view"
import { ColumnsProps } from "./ColumnsProps"
import { ComponentName } from "@/components/enumsComponentsName"

/**
 * Columns Native Component
 * @param children {React.ReactNode}
 * @param centered {boolean} Center columns
 * @param verticalCentered {boolean} Vertical centered columns
 * @param gapless {boolean} Delete margins between columns
 * @param marginSize {ColumnsSize} Delete margins between columns with Size (apply is-variable)
 * @param scrollable {boolean} Make colomns scrollable to vertical. Don't work with props 'marginSize'
 */

export const ColumnsContext = createContext({ scrollable: false })

const Columns = ({
  children,
  centered,
  gapless,
  marginSize,
  verticalCentered,
  fullBleed,
  scrollable,
   multiline,
...others
}: ColumnsProps): JSX.Element => {
  const styles = StyleSheet.create({
    columns: {
      flexDirection: "row",
      minWidth: "100%",
      display: "flex",
    },
    centered: {
      alignSelf: "center",
    },
    verticalAlign: {
      justifyContent: "center",
      flex: 1,
    },
    gapless: {
      margin: 0,
      padding: 0,
    },
    variable: {
      padding: marginSize || 0,
    },
    fullbleed: {
      width: Dimensions.get('window').width,
      marginLeft: "50%",
      transform: [{ translateX: Dimensions.get('window').width / 2 }],
      padding: 0
    },
    multiline: {
      flexWrap: "wrap",
    }
  })

  if (marginSize && !scrollable) {
    return (
      <View
        style={[
          styles.columns,
          centered,
          fullBleed && styles.fullbleed,
          multiline && styles.multiline,
          verticalCentered && styles.verticalAlign,
        ]}
        {...others}
      >
        {children && marginSize
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            React.Children.map(children, (child: any) =>
              React.cloneElement(child, {
                style: [child.props.style, styles.variable],
              })
            )
          : children}
      </View>
    )
  }

  if (gapless) {
    return (
      <View
        style={[
          styles.columns,
          centered,
          verticalCentered && styles.verticalAlign,
          multiline && styles.multiline,
          fullBleed && styles.fullbleed
        ]}
        {...others}
      >
        {children && gapless
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            React.Children.map(children, (child: any) =>
              React.cloneElement(child, {
                style: [child.props.style, styles.gapless],
              })
            )
          : children}
      </View>
    )
  }

  return scrollable ? (
    <ColumnsContext.Provider
      value={{
        scrollable,
      }}
    >
      <View style={{ width: Dimensions.get("window").width, resizeMode: "cover", flexDirection: 'column', justifyContent: 'space-between'}}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {children}
      </ScrollView>
      </View>
    </ColumnsContext.Provider>
  ) : (
    <View
      style={[
        styles.columns,
        centered && styles.centered,
        gapless && styles.gapless,
        verticalCentered && styles.verticalAlign,
        fullBleed && styles.fullbleed
      ]}
      {...others}
    >
      {children}
    </View>
  )
}

Columns.displayName = ComponentName.Columns

export default Columns
