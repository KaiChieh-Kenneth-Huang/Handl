import React, { Component } from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import firebase from 'firebase'
import 'firebase/firestore'
import * as Google from 'expo-google-app-auth';
// import * as MailComposer from 'expo-mail-composer';

import {AppRegistry, 
    Activityindicator, 
    Text, 
    View, 
    FlatList , 
    StyleSheet, 
    TouchableHighlight, 
    TouchableOpacity,
    TextInput, 
    Button}
    from 'react-native';  

require('console');

export default class Login extends Component {
    constructor(props){
        super()
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            response: ''
        }
    }

    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user){
                this.props.navigation.navigate('Home')
            }
            else{

            }
        })
    }

    logInHandler = () => {
        if (!this.state.email || !this.state.password) {
          this.setState({ errorMessage: 'Email and password can not be empty.'});
        } else {
          firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(function(result) {
                console.log('user signed in ')
                if (result.additionalUserInfo.isNewUser) {
                    firebase
                      .database()
                      .ref('UserInfo/' + result.user.uid)
                      .set({
                        email: result.user.email,
                        profile_picture: result.additionalUserInfo.profile.picture,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name,
                        created_at: Date.now()
                      })
                      .then((data)=>{
                        //success callback 
                        console.log('data ' , data)
                      });
                  } else {
                    firebase  
                      .database()
                      .ref('UserInfo/' + result.user.uid)
                      .update({
                        last_logged_in: Date.now()
                      });
                  }
            })
            .then(() => this.props.navigation.navigate('Intro'))
            .catch(error => this.setState({ errorMessage: 'Error: ' + error.message }));
        }
      }
    
    componentDidMount(){
        this.checkIfLoggedIn()
        return fetch('http://24.72.151.67:5000/test')
            .then(response => response.json())
            .then((r) => {
                console.log(r) 
                this.setState({
                    errorMessage: '',
                    response: r[0].Name
                })
            })
            .catch(error => console.log(error));

        this.setState({
            errorMessage: ''
        })
    }

    

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      }

    onSignIn = (googleUser) => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                //googleUser.getAuthResponse().id_token
                googleUser.idToken,
                googleUser.accessToken
                );
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential)
            .then(function(result) {
                console.log('user signed in ')
                if (result.additionalUserInfo.isNewUser) {
                    firebase
                      .database()
                      .ref('UserInfo/' + result.user.uid)
                      .set({
                        email: result.user.email,
                        profile_picture: result.additionalUserInfo.profile.picture,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name,
                        created_at: Date.now()
                      })
                      .then((data)=>{
                        //success callback 
                        console.log('data ' , data) 
                      });
                    /*
                    console.log('ready to send email')
                    MailComposer.composeAsync({
                          recipients: [result.user.email],
                          subject: 'Welcomne to Handel',
                          body: 'Hi, welcome to your personal social hub!'
                      })
                      .then(status =>{
                          console.log('Email status', status)
                      })
                     */
                      
                  } else {
                    firebase 
                      .database()
                      .ref('UserInfo/' + result.user.uid)
                      .update({
                        last_logged_in: Date.now()
                      });
                  }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        }.bind(this));
      }
    
    signInWithGoogleAsync = async () => {
        try {
          const result = await Google.logInAsync({
            androidClientId: '703833117547-b8a3cc54ttg3bvkanblkg5banfbkdd76.apps.googleusercontent.com',
            iosClientId: '703833117547-9rin8et8ailspaicg8aie5moqrjnl196.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            this.onSignIn(result)
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
      }


    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.errorMessage}</Text>
                <TextInput 
                    style={styles.input}
                    placeholder= {this.state.response}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                >
                </TextInput>
                <TextInput 
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                >
                </TextInput >
                <View style={styles.btnContainer}>
                    < TouchableOpacity style={styles.userBtn}>
                        <Text style={styles.btnText} onPress={this.logInHandler}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.btnContainer}>
                    < TouchableOpacity style={styles.userBtn}>
                            <Text style={styles.btnText} onPress={() => this.props.navigation.navigate('Signup')}>Sign Up</Text>
                        </TouchableOpacity>
                </View>
                <View>
                    < TouchableOpacity style={styles.signInWithGooglerBtn}>
                        <Text onPress={() => this.signInWithGoogleAsync()}>Sign In With Google</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '90%',
        marginBottom: 1,
        borderRadius: 5,
        padding: 15
    },
    welcome: {
        fontSize: 30,
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
    signInWithGooglerBtn: {
        padding: 15,
        marginTop: 15,
        borderRadius: 30
    },
    userBtn: {
        backgroundColor: "#5B2C6F",
        padding: 15,
        width: "100%",
        marginTop: 15,
        borderRadius: 30
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        width: "90%",
        marginTop: 10
    },
    btnText: {
        fontSize: 18,
        textAlign: "center",
        color: 'white'
    },
    text: {
        marginTop: 40,
        fontSize: 18,
        textAlign: "center"
    }
});

AppRegistry.registerComponent('Login', () => Login);
    