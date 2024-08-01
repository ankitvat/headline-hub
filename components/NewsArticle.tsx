import { horizontalScale, verticalScale } from "@/constants/metrics";
import moment from "moment";
import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { Image } from "expo-image";
import { newImage } from "@/assets/images";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import Swipeable from "react-native-gesture-handler/Swipeable";
import { Entypo, EvilIcons } from "@expo/vector-icons";
import useStore from "@/hooks/useStore";

const { width, height } = Dimensions.get("window");

type Source = {
  id: string | null;
  name: string;
};

interface NewsArticleData {
  id: string;
  source: Source;
  author: string;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsArticleProps {
  data: NewsArticleData;
}

const NewsArticle: React.FC<NewsArticleProps> = ({ data }) => {
  const { pinnedArticles, pinArticle, unpinArticle, deleteArticle } =
    useStore();
  const isPinned = pinnedArticles.includes(data.id);

  const handlePin = React.useCallback(() => {
    if (isPinned) {
      unpinArticle(data.id);
    } else {
      pinArticle(data.id);
    }
  }, [isPinned, data.id, pinArticle, unpinArticle]);

  const handleDelete = React.useCallback(() => {
    deleteArticle(data.id);
  }, [data.id, deleteArticle]);

  const RightSwipeActions = () => {
    return (
      <View style={styles.pinLayout}>
        <Pressable style={styles.flexCol} onPress={handleDelete}>
          <EvilIcons name="trash" color={"#FFF"} size={32} />
          <Text style={styles.pin}>Delete</Text>
        </Pressable>
        <Pressable style={styles.flexCol} onPress={handlePin}>
          <Entypo name="pin" color={"#FFF"} size={22} />
          <Text style={styles.pin}>{isPinned ? "Unpin" : "Pin"}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={RightSwipeActions}
      dragOffsetFromRightEdge={10}
      overshootFriction={10}
    >
      <Animated.View
        style={[styles.container]}
        entering={FadeIn}
        exiting={FadeOut}
      >
        <View style={styles.topSection}>
          <Text style={styles.source}>{data?.author}</Text>
          <Text style={styles.timing}>
            {moment(data?.publishedAt).format("HH:MM A")}
          </Text>
        </View>
        <View style={styles.topSection}>
          <Text
            style={[styles.title, { marginTop: verticalScale(10) }]}
            numberOfLines={3}
          >
            {data?.title}
          </Text>
          <View style={styles.imageSection}>
            {data?.urlToImage !== null ? (
              <Image
                source={{
                  uri: data?.urlToImage,
                }}
                contentFit="cover"
                style={styles.image}
              />
            ) : (
              <Image source={newImage} contentFit="fill" style={styles.image} />
            )}
          </View>
        </View>
        <View style={[styles.footer]}>
          <Text style={styles.source}>{data?.source?.name}</Text>
        </View>
      </Animated.View>
    </Swipeable>
  );
};

export default NewsArticle;

const styles = StyleSheet.create({
  container: {
    width,
    height: verticalScale(210),
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: "#F9F9F9",
    flexDirection: "column",
    paddingVertical: verticalScale(20),
    paddingHorizontal: "5%",
  },
  pin: {
    fontFamily: "SatoshiMedium",
    fontSize: 16,
    color: "#FFF",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  source: {
    fontFamily: "SatoshiLight",
    fontSize: 16,
  },
  timing: {
    fontFamily: "SatoshiLight",
    fontSize: 12,
    marginRight: horizontalScale(5),
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  flexCol: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: verticalScale(10),
  },
  pinnedContainer: {
    borderColor: "red",
    borderWidth: 2,
  },
  title: {
    fontFamily: "SatoshiBold",
    fontSize: 20,
    width: horizontalScale(220),
    fontWeight: 700,
  },
  imageSection: {
    width: horizontalScale(85),
    height: verticalScale(85),
    borderRadius: 14,
    marginTop: verticalScale(20),
  },

  footer: {
    marginTop: verticalScale(20),
  },

  pinLayout: {
    width: horizontalScale(80),
    backgroundColor: "#4BBDFC",
    height: verticalScale(140),
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    marginTop: verticalScale(40),
    paddingVertical: verticalScale(10),
  },
});
