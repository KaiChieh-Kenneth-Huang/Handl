import React, { Component } from 'react'
import {AppRegistry, 
    Activityindicator, 
    Text, 
    View, 
    FlatList , 
    StyleSheet, 
    TouchableHighlight, 
    TouchableOpacity,
    TextInput,
    Button,
    Picker
    }from 'react-native';
import { CheckBox } from 'react-native-elements'

import { AsyncStorage } from "react-native"

import * as SMS from 'expo-sms';
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';

export default class AddContact extends Component {

    constructor(props) {
        super()
        this.state = {
            isLoadingComplete: false,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            checked: true,
            text: '',
            key: 'contactData',
            smsAvailable: false,
            userFirstName: '',
            userLastName: '',
            userPhoneNumber: '',
        };
        this.item = {
        };
    }  

    componentDidMount(){
        qrCardsUpToDate = false;
        this.loadData();
    }

    componentDidUpdate(){
        if(!qrCardsUpToDate){
            this.loadData();
        }
    }

    async initializeData(){
        try {
            await AsyncStorage.setItem('contactData', JSON.stringify(this.item));
            qrCardsUpToDate = false;          
            console.log('contact data stored');
        } catch (error) {
            // Error saving data
            console.log('error saving user\'s contact data');
        }
    }
    

    async loadData() {
        if(!qrCardsUpToDate){
            try {
                this.retrieveItem('contactData').then((contactData) => {
                    if(contactData != null){
                        this.cardData = contactData;
                        //console.log('number of cards loaded: ' + this.cardData.cards.length);
                        console.log(this.cardData);
                        //console.log('we here');
                        let cardNum = this.cardData.cards.length;
                        for(let i = 0; i < cardNum; i++){
                            const card = this.cardData.cards[i];
                            if(card.name == 'phone'){
                                this.state.userFirstName = card.data.firstName;
                                this.state.userLastName = card.data.lastName;
                                this.state.userPhoneNumber = card.data.phoneNumber;
                            }
                            console.log(this.state.userFirstName + this.state.userLastName + this.state.userPhoneNumber);
                        }
                    }else{
                        this.cardData = this.item;
                        this.initializeData();
                    }
                    qrCardsUpToDate = true;
                    this.setState({cardDataRetrieved: true});
                    
                });
            }catch(error){
                console.log("error retrieving contactData from AsyncStorage");
            }
        }
      }

    async retrieveItem(key) {
        try {
          const retrievedItem =  await AsyncStorage.getItem(key);
          const item = JSON.parse(retrievedItem);
          return item;
        } catch (error) {
          console.log(error.message);
        }
        return;
      }


    checkSMS = async () => {
    const { status } = await Permissions.askAsync(Permissions.SMS);
    if (status == 'granted'){
        alert('Permission for SMS granted');
    }
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
        this.state.smsAvailable = true;
      //const { result } = await SMS.sendSMSAsync('8502287475', 'test1234');
    }
    console.log(isAvailable);
  }


    handleChange = key => val => {
        console.log(key)
        /*
        this.setState({
            [key]: val
        })
        */
    }

    onPress = () => {
        let message = '';
        message += this.state.userFirstName + ' ' + this.state.userLastName +'\n';
        message += '\n' + 'sent from the Handl app'


        /*IDK how to set this up
        const phoneNum = {
            [Contacts.PhoneNumber.digits]: this.state.phoneNumber
        };
        */

        const contact = {
            [Contacts.Fields.FirstName]: this.state.firstName,
            [Contacts.Fields.lastName]: this.state.lastName,
            //[Contacts.Fields.phoneNumbers]: phoneNum
        };
        if (this.state.checked){
            const { result } = SMS.sendSMSAsync(this.state.phoneNumber, message);
            console.log(result);
        }

        if (this.state.smsAvailable) {
            alert("sms available");
        } 

    }

    render() {
        return (
            <View>
                <TextInput placeholder="First Name" value={this.state.firstName} style={styles.input} onChangeText={(firstName) => this.setState({firstName})}/>
                <TextInput placeholder="Last Name" value={this.state.lastName} style={styles.input} onChangeText={(lastName) => this.setState({lastName})}/>
                <TextInput placeholder="Phone Number" value={this.state.phoneNumber} style={styles.input} onChangeText={(phoneNumber) => this.setState({phoneNumber})}/>
                <CheckBox
                    title='Send Your Contact'
                    checked={this.state.checked}
                    onPress={() => this.setState({checked: !this.state.checked})}
                />
                <View style={styles.btnContainer}>
                    < TouchableOpacity 
                        style={styles.userBtn}
                        onPress={this.onPress}
                    >
                            <Text style={styles.btnText}>Save</Text>
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
        width: '100%',
        marginBottom: 1,
        borderRadius: 5
    },
    userBtn: {
        backgroundColor: "#5B2C6F",
        padding: 15,
        width: "100%",
        marginTop: 15,
        borderRadius: 30
    },
    btnContainer: {
        alignSelf: 'center',
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
});