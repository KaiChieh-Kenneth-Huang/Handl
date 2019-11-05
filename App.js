import React, { Component } from 'react';
import {StyleSheet, Text, View, Button, TextInput,TouchableOpacity } from 'react-native';
// import Fetch from './component/Fetch';
// import Buy from './component/Buy';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Login from './pages/Login'
// import Home from './pages/Home'
import Intro from './component/Intro'
import Signup from './pages/Signup'
// import AppDrawerNavigator from './component/DrawerNavigator'

import ApiKeys from './assets/ApiKeys'
import firebase from 'firebase'
import 'firebase/firestore'

import Setting from './component/Setting'
import QRcodes from './component/CardComponent'
import Profile from './component/profile'
import AddContact from './component/addContact'
import QRScanner from './component/QRScanner'
import { Ionicons} from '@expo/vector-icons'

const HomeBottomTabNavigator = createBottomTabNavigator(
  {
      QRcodes: {
        screen: QRcodes,
        navigationOptions: {
          tabBarIcon: ({ focused, tintColor }) => {
              const iconName = `ios-information-circle${focused ? '' : '-outline'}`;
              return <Ionicons name={iconName} size={25} color={tintColor} />;
          },
        },
      },
      AddContact: {
        screen: AddContact,
        navigationOptions: {
          tabBarIcon: ({ focused, tintColor }) => {
              const iconName = `ios-keypad${focused ? '' : ''}`;
              return <Ionicons name={iconName} size={25} color={tintColor} />;
          },
        },
      },
      QRScanner: {
        screen: QRScanner,
        navigationOptions: {
          tabBarIcon: ({ focused, tintColor }) => {
              const iconName = `ios-qr-scanner${focused ? '' : ''}`;
              return <Ionicons name={iconName} size={25} color={tintColor} />;
          },
        },
      },
  },
  {
      initialRouteName: 'QRcodes',
      navigationOptions:({navigation})=>{
          const {routeName} = navigation.state.routes[navigation.state.index] 
          return { 
            headerLeft: <Ionicons 
                            name="md-person" //this.props.navigation.navigate('Home')
                            onPress={()=>navigation.navigate('Profile')}
                            size={20} 
                            style={{marginLeft: 15}}/>
          }
      }
  }
)

const HomeStackNavigator = createStackNavigator(
  { 
      HomeBottomTabNavigator: HomeBottomTabNavigator
  }
)

const ProfileBottomTabNavigator = createBottomTabNavigator(
  {
      Profile
  }
)

const ProfileStackNavigator = createStackNavigator(
  {
    Profile
  },
  {
      navigationOptions:{
            headerTitle: Profile
          }
  }
)

const Navigator = createSwitchNavigator(
  {
    Login: Login,
    //Home: {screen: AppDrawerNavigator},
    Home: {screen: HomeStackNavigator},
    Intro: Intro,
    Signup: Signup,
    Profile: {screen: ProfileStackNavigator},
  },
  {
    //initialRouteName: 'Home'
    initialRouteName: 'Login'
  }
);

const AppContainer = createAppContainer(Navigator);

export default class App extends Component {

  // ToDo not state!!!
  componentWillMount() {
   firebase.initializeApp({
    apiKey: "AIzaSyARwcdW2qtVmgXFAkevlEJwSidbABcuYMY",
    authDomain: "handl-e0779.firebaseapp.com",
    databaseURL: "https://handl-e0779.firebaseio.com",
    projectId: "handl-e0779",
    storageBucket: "handl-e0779.appspot.com",
    messagingSenderId: "703833117547",
    appId: "1:703833117547:web:0947f7971de110eec7322e",
    measurementId: "G-4G1W3XKFSM"
  })
    console.log(ApiKeys)
  }

  render() {
    return (
      <AppContainer/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});


// "react-native-svg": "^9.11.1",
// "react-native-qrcode": "^0.2.7",
// "react-native-qrcode-svg": "^5.2.0",