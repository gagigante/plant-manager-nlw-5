import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Welcome } from '../pages/Welcome';
import { Confirmation } from '../pages/Confirmation';
import { UserIdentification } from '../pages/UserIdentification';

import colors from '../styles/colors';

const StackNavigation = createStackNavigator();

export const StackRoutes = () => (
  <StackNavigation.Navigator
    headerMode="none"
    screenOptions={{
      cardStyle: {
        backgroundColor: colors.white,
      }
    }}
  >
    <StackNavigation.Screen 
      name="Welcome"
      component={Welcome}
    />

    <StackNavigation.Screen 
      name="UserIdentification"
      component={UserIdentification}
    />

    <StackNavigation.Screen 
      name="Confirmation"
      component={Confirmation}
    />
  </StackNavigation.Navigator>
)