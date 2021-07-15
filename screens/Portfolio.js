import React from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { MainLayout } from ".";
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getHoldings } from "../stores/market/marketActions";
import { BalanceInfo, Chart } from "../components";
import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
const Portfolio = ({ myHoldings, getHoldings }) => {
  const [selectedCoin, setSelectedCoin] = React.useState(null);

  useFocusEffect(
    React.useCallback(() => {
      getHoldings((holdings = dummyData.holdings));
    }, [])
  );
  let totalwallet = myHoldings.reduce((a, b) => a + (b.total || 0), 0);
  let valueChange = myHoldings.reduce(
    (a, b) => a + (b.holding_value_change_7d || 0),
    0
  );
  let percChange = (valueChange / (totalwallet - valueChange)) * 100;
  function renderCurrentBalanceSection() {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: COLORS.gray,
        }}
      >
        <Text
          style={{
            marginTop: 25,
            color: COLORS.white,
            ...FONTS.largeTitle,
          }}
        >
          Portfolio
        </Text>
        <BalanceInfo
          title="Current Balance"
          displayAmount={totalwallet}
          changePct={percChange}
          containerStyle={{
            marginTop: SIZES.radius,
            marginButtom: SIZES.padding,
          }}
        />
      </View>
    );
  }
  return (
    <MainLayout>
      <View style={{ flex: 1, backgroundColor: COLORS.black }}>
        {/* Header Balance */}
        {renderCurrentBalanceSection()}
        {/* chart */}
        <Chart
          containerStyle={{ marginTop: SIZES.radius }}
          chartPrices={
            selectedCoin
              ? selectedCoin?.sparkline_in_7d?.value
              : myHoldings[0]?.sparkline_in_7d?.value
          }
        />
        {/* Assset */}
        <FlatList
          data={myHoldings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            marginTop: SIZES.padding,
            paddingHorizontal: SIZES.padding,
          }}
          ListHeaderComponent={
            <View>
              {/* Seltion title */}
              <Text
                style={{
                  ...FONTS.h2,
                  color: COLORS.white,
                }}
              >
                Your Asset
              </Text>
              {/* headerc label */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: SIZES.radius,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    color: COLORS.lightGray3,
                  }}
                >
                  Asset
                </Text>

                <Text
                  style={{
                    flex: 1,
                    color: COLORS.lightGray3,
                    textAlign: "center",
                  }}
                >
                  Price
                </Text>
                <Text
                  style={{
                    flex: 1,
                    color: COLORS.lightGray3,
                  }}
                >
                  Holdings
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            let priceColor =
              item.price_change_percentage_7d_in_currency == 0
                ? COLORS.lightGray3
                : item.price_change_percentage_7d_in_currency > 0
                ? COLORS.lightGreen
                : COLORS.red;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCoin(item)}
                style={{
                  flexDirection: "row",
                  height: 55,
                }}
              >
                {/* Asset */}
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text
                    style={{
                      marginLeft: SIZES.radius,
                      color: COLORS.white,
                      ...FONTS.h4,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
                {/* price */}
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "right",
                      color: COLORS.white,
                      ...FONTS.h4,
                      lineHeight: 15,
                    }}
                  >
                    ${item.current_price.toLocaleString()}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {item.price_change_percentage_7d_in_currency != 0 && (
                      <Image
                        source={icons.upArrow}
                        style={{
                          height: 10,
                          width: 10,
                          tintColor: priceColor,
                          transform:
                            item.price_change_percentage_7d_in_currency > 0
                              ? [{ rotate: "45deg" }]
                              : [{ rotate: "125deg" }],
                        }}
                      />
                    )}
                    <Text
                      style={{
                        marginLeft: 5,
                        color: priceColor,
                        ...FONTS.body5,
                        lineHeight: 15,
                      }}
                    >
                      {item.price_change_percentage_7d_in_currency.toFixed(2)}%
                    </Text>
                  </View>
                </View>
                {/* holding */}
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text
                    style={{
                      textAlign: "right",
                      color: COLORS.white,
                      ...FONTS.h4,
                      lineHeight: 15,
                    }}
                  >
                    ${item.total.toLocaleString()}
                  </Text>
                  <Text
                    style={{
                      textAlign: "right",
                      color: COLORS.lightGray3,
                      ...FONTS.body5,
                      lineHeight: 15,
                    }}
                  >
                    {item.qty}
                    {item.symbol.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            <View
              style={{
                marginBottom: 50,
              }}
            />
          }
        />
      </View>
    </MainLayout>
  );
};

// export default Portfolio;
function mapStateToProps(state) {
  return {
    myHoldings: state.marketReducer.myHoldings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getHoldings: (
      holdings,
      currency,
      coinList,
      orderBy,
      sparkline,
      priceChangePerc,
      perPage,
      page
    ) => {
      return dispatch(
        getHoldings(
          holdings,
          currency,
          coinList,
          orderBy,
          sparkline,
          priceChangePerc,
          perPage,
          page
        )
      );
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
