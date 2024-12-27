import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Switch,
} from "react-native";
import ArrowHeaderNew from "../components/ArrowHeaderNew";
import { COLORS } from "../constants";

const ProSubscriptionScreen = ({navigation}) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    // <ImageBackground
    //   // source={{
    //   //   uri: "https://via.placeholder.com/150", // Replace with your background image
    //   // }}
    //   style={styles.container}
    //   // resizeMode="cover"
    // >
    <View style={styles.containerHeader} >
      <ArrowHeaderNew navigation={navigation} title={"Subscription"}/>
      <View style={styles.containerBody} >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Go Pro for Unlimited!</Text>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Yearly</Text>
          <Switch
            value={isYearly}
            onValueChange={() => setIsYearly(!isYearly)}
            thumbColor="#fff"
            trackColor={{ false: "#ccc", true: "#ffa500" }}
          />
          <Text style={styles.toggleText}>Monthly</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              //{ backgroundColor: isYearly ? COLORS.darkOrange : "#222" },
            ]}
          >
            <Text
              style={[
                styles.optionTitle,
                //{ color: isYearly ? "#fff" : COLORS.darkOrange },
              ]}
            >
              Pro
            </Text>
            <Text style={styles.optionPrice}>{isYearly ? "€4.99" : "5.99"}/mo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              //{ backgroundColor: isYearly ? "#222" : COLORS.darkOrange },
            ]}
          >
            <Text
              style={[
                styles.optionTitle,
                //{ color: isYearly ? COLORS.darkOrange : "#fff" },
              ]}
            >
              Ultimate 
            </Text>
            <Text style={styles.optionPrice}>{isYearly ? "€19.99" : "24.99"}/mo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeText}>Go Pro, Now!</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Privacy Policy • Terms & Conditions
        </Text>
      </View>
    {/* </ImageBackground> */}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerHeader: {
    flex: 1,
    backgroundColor: COLORS.dark
  },
  containerBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleText: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 10,
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: COLORS.darkOrange
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark
  },
  optionPrice: {
    fontSize: 18,
    color: "#fff",
  },
  subscribeButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 20,
    color: "#ccc",
    fontSize: 12,
  },
});

export default ProSubscriptionScreen;
