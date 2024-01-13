import React, { Component } from 'react';
import { Button, View, Text,SafeAreaView,Platform,StatusBar,StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      location: {},
      temp: 0,
      latDelta:1,
      lonDelta:1
    };
  }

  getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status == 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        location: location.coords,
      });
      this.getWeather()
    }
  };
  getWeather = async () => {
    const { location } = this.state;
    var url =
      'https://fcc-weather-api.glitch.me/api/current?lat=' +
      location.latitude +
      '&lon=' +
      location.longitude;
    fetch(url)
      .then((response) => response.json())
      .then((responsejson) => {
        this.setState({ temp: responsejson.main.temp });
      });
  };
  componentDidMount() {
    this.getLocation();
  }
  dothis = (selected) => {
    this.setState({
      location: selected,
    });
    this.getWeather()
  };
  render() {
    const { location, temp,latDelta,lonDelta } = this.state;
    console.log(location);
    if (Object.keys(location).length == 0) {
      return (
        <Text style={{ alignSelf: 'center', marginTop: 200 }}>
          Loading.....
        </Text>
      );
    }
    return (
      <View style={{ flex: 0.7 }}>
      <SafeAreaView style={styles.safeArea}/>
        <MapView
          style={{ width: '100%', height: '100%' }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            longitudeDelta: latDelta,
            latitudeDelta: lonDelta,
          }}
          onPress={(event) => {
            this.dothis(event.nativeEvent.coordinate);
          }}
         >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
           ></Marker>
        </MapView>
         <Text style={{alignSelf:'center',marginTop:40,fontFamily:'Lobster',fontSize:20}}>{'Temperature: '+ this.state.temp+' °C'}</Text>
      </View>
    );
  }
}
const styles=StyleSheet.create({
  safeArea:{
    marginTop:Platform.OS=='android'?StatusBar.currentHeight:50
  }
})
