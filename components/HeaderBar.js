import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SIZES, FONTS, COLORS } from "../constants";

const HeaderBar = ({ title }) => {
  return (
    <View
      style={{
        height: 80,
        paddingHorizontal: SIZES.radius,
        justifyContent: "flex-end",
      }}
    >
      <Text
        style={{ color: COLORS.white, ...FONTS.largeTitle, marginBottom: 10 }}
      >
        {title}
      </Text>
    </View>
  );
};

export default HeaderBar;
