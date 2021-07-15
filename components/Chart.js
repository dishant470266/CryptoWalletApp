import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SIZES, FONTS, COLORS } from "../constants";
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
  monotoneCubicInterpolation,
} from "@rainbow-me/animated-charts";
import moment from "moment";

const Chart = ({ containerStyle, chartPrices }) => {
  let startUnixTimestamp = moment().subtract(7, "day").unix();
  let data = chartPrices
    ? chartPrices?.map((item, index) => {
        return {
          x: startUnixTimestamp + (index + 1) * 3600,
          y: item,
        };
      })
    : [];
  let points = monotoneCubicInterpolation({ data, range: 40 });
  const formatUSD = (value) => {
    "worklet";
    if (value === "") {
      return "";
    }
    return `$${Number(value).toFixed(2)}`;
  };
  const formatDateTime = (value) => {
    "Worklet";
    if (value === "") {
      return "";
    }

    var selectedDate = new Date(value * 1000);
    let date = `0${selectedDate.getDate()}`.slice(-2);
    let month = `0${selectedDate.getMonth() + 1}`.slice(-2);
    return `${date} / ${month}`;
  };

  const formatNumber = (value, roundingPoint) => {
    if (value > 1e9) {
      return `${(value / 1e9).toFixed(roundingPoint)}B`;
    } else if (value > 1e6) {
      return `${(value / 1e6).toFixed(roundingPoint)}M`;
    } else if (value > 1e3) {
      return `${(value / 1e3).toFixed(roundingPoint)}K`;
    } else {
      return value.toFixed(roundingPoint);
    }
  };
  const getYaxisLabelValues = () => {
    if (chartPrices != undefined) {
      let minValue = Math.min(...chartPrices);
      let maxValue = Math.max(...chartPrices);
      let midValue = (minValue + maxValue) / 2;

      let higherMidValue = (maxValue + minValue) / 2;
      let lowerMidValue = (minValue + maxValue) / 2;
      let roundingPoint = 2;
      return [
        formatNumber(maxValue, roundingPoint),
        formatNumber(higherMidValue, roundingPoint),
        formatNumber(lowerMidValue, roundingPoint),
        formatNumber(minValue, roundingPoint),
      ];
    } else {
      return [];
    }
  };
  return (
    <View style={{ ...containerStyle }}>
      {/* y-axis label */}
      <View
        style={{
          position: "absolute",
          left: SIZES.padding,
          top: 0,
          buttom: 0,
          justifyContent: "space-between",
        }}
      >
        {getYaxisLabelValues().map((item, index) => {
          return (
            <Text
              key={index}
              style={{
                color: COLORS.lightGray3,
                ...FONTS.body4,
                margin: 10,
                left: -20,
              }}
            >
              {item}
            </Text>
          );
        })}
      </View>
      {data.length > 0 && (
        <ChartPathProvider data={{ points, smoothingStrategy: "bezier" }}>
          <ChartPath
            height={150}
            width={SIZES.width}
            stroke={COLORS.lightGreen}
            strokeWidth={2}
          />
          <ChartDot>
            <View
              style={{
                position: "absolute",
                left: -35,
                width: 80,
                alignItems: "center",
                backgroundColor: COLORS.transparentBlack1,
              }}
            >
              {/* Dots */}
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 25,
                  height: 25,
                  borderRadius: 15,
                  backgroundColor: COLORS.white,
                }}
              >
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 10,
                    backgroundColor: COLORS.lightGreen,
                  }}
                />
              </View>
              {/* ylabel */}
              <ChartYLabel
                format={formatUSD}
                style={{
                  color: COLORS.white,
                  ...FONTS.body5,
                }}
              />
              {/* x-label */}
              <ChartXLabel
                // format={formatDateTime}
                style={{
                  marginTop: 3,
                  color: COLORS.lightGray3,
                  ...FONTS.body5,
                  lineHeight: 15,
                }}
              />
            </View>
          </ChartDot>
        </ChartPathProvider>
      )}
    </View>
  );
};

export default Chart;

const styles = StyleSheet.create({});
