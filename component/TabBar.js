import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import posed from "react-native-pose";

const windowWidth = Dimensions.get("window").width;
const tabWidth = windowWidth / 3;
const SpotLight = posed.View({
  route0: { x: 0 },
  route1: { x: tabWidth},
  route2: { x: tabWidth * 2}
});

const S = StyleSheet.create({
  container: { flexDirection: "row", height: 52, elevation: 2,  backgroundColor: "#330455"},
  tabButton: { flex: 0.9, justifyContent: "center", alignItems: "center" },
  spotLight: {
    width: tabWidth + 2,
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  spotLightInner: {
    width: 52,
    height: 52,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    borderTopLeftRadius: -26,
  },
  scaler: { flex: 0.9, alignItems: "center", justifyContent: "center" }
});

const Scaler = posed.View({
    active: { scale: 1 },
    inactive: { scale: 0.9 }
  });


const TabBar = props => {
    const {
      renderIcon,
      getLabelText,
      activeTintColor,
      inactiveTintColor,
      onTabPress,
      onTabLongPress,
      getAccessibilityLabel,
      navigation
    } = props;
  
    const { routes, index: activeRouteIndex } = navigation.state;
  
    return (
      <View style={S.container}>
        <View style={StyleSheet.absoluteFillObject}>
            <SpotLight style={S.spotLight} pose={`route${activeRouteIndex}`}>
                <View style={S.spotLightInner} />
            </SpotLight>
        </View>
        {routes.map((route, routeIndex) => {
          const isRouteActive = routeIndex === activeRouteIndex;
          const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
  
          return (
            <TouchableOpacity
              key={routeIndex}
              style={S.tabButton}
              onPress={() => {
                onTabPress({ route });
              }}
              onLongPress={() => {
                onTabLongPress({ route });
              }}
              accessibilityLabel={getAccessibilityLabel({ route })}
            >
            <Scaler style={S.scaler} pose={isRouteActive ? "active" : "inactive"}>
              {renderIcon({ route, focused: isRouteActive, tintColor })}
            </Scaler>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  
  export default TabBar;