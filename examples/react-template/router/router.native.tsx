import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import * as Screens from '../screens'
import { Wrapper } from '../Wrapper'
import { SafeAreaView } from 'react-native'
import { MenuScreen } from '../Menu'
import { TrilogyThemeProvider, defaultTheme } from '@trilogy-ds/react/context/providerTheme'
import { SVGicons } from '@trilogy-ds/assets/lib/iconsPath'

const Stack = createNativeStackNavigator()

export const Router: React.FC = () => {
  const theme = {
    ...defaultTheme,
    icons: SVGicons,
    fontFamily: { 'regular': 'poppins-regular', 'medium': 'poppins-medium', 'bold': 'poppins-semibold' }
  }

  return (
    // @ts-ignore
    <TrilogyThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='MenuNativeScreen'>
          <Stack.Screen options={{ headerShown: false }} name={'MenuNativeScreen'} component={MenuScreen} />
          {Object.keys(Screens).map((screen, index) => {
            const [pathName] = screen.split('Screen')
            // @ts-ignore
            const Element = Screens[screen]
            // @ts-ignore
            const Screen = ({ navigation }) => {
              return (
                <SafeAreaView>
                  <Wrapper
                    scrollable={screen != 'AutoCompleteScreen'}
                    title={pathName}
                    goBack={() => {
                      navigation.goBack()
                    }}
                  >
                    <Element />
                  </Wrapper>
                </SafeAreaView>
              )
            }
            return <Stack.Screen options={{ headerShown: false }} key={index} name={pathName} component={Screen} />
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </TrilogyThemeProvider>
  )
}
