import { Image } from "expo-image";
import { StyleSheet, Text, View, Dimensions, FlatList } from "react-native";
import { appLogo } from "../../assets/images/index";
import { EvilIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import axios from "axios";
import React from "react";
import useStore, { generateUUID } from "@/hooks/useStore";
import NewsArticle from "@/components/NewsArticle";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const {
    newsListing,
    refreshHeadlines,
    dripTimer,
    pinnedArticles,
    pinArticle,
    unpinArticle,
  } = useStore((state) => ({
    newsListing: state.newsListing,
    refreshHeadlines: state.refreshHeadlines,
    dripTimer: state.dripTimer,
    pinnedArticles: state.pinnedArticles,
    pinArticle: state.pinArticle,
    unpinArticle: state.unpinArticle,
  }));
  useEffect(() => {
    refreshHeadlines();

    return () => {
      if (dripTimer) clearInterval(dripTimer);
    };
  }, [refreshHeadlines, dripTimer]);

  const renderItem = useCallback(({ item }: any) => {
    return <NewsArticle data={item} />;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar
          animated={true}
          backgroundColor="white"
          hideTransitionAnimation="fade"
          networkActivityIndicatorVisible={true}
        />
        <View style={styles.header}>
          <Image source={appLogo} contentFit="contain" style={styles.appLogo} />
          <EvilIcons
            name="refresh"
            size={32}
            color={"#000"}
            style={styles.refreshIcon}
            onPress={refreshHeadlines}
          />
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={newsListing}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#FFFF",
  },
  appLogo: {
    width: width / 3,
    height: height / 9,
  },
  header: {
    backgroundColor: "white",
    height: height / 6,
    paddingTop: height / 16,
    paddingHorizontal: width / 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",

    width: width,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    zIndex: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  refreshIcon: {
    marginBottom: height / 26,
  },
  headerText: {
    fontFamily: "SatoshiBlack",
    fontSize: 22,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "white",
    height: height,
    width: width,
    paddingBottom: "10%",
  },
});
