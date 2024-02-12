import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import User from "../components/User";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <>
          <View>
            <Image source={require("../assets/Logo.png")} style={{ width: 140, height: 40, marginRight:300 }} />
          </View>
        </>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <Ionicons onPress={() => navigation.navigate("Chats")} name="chatbox-ellipses-outline" size={24} color="#ffa666" />
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={24}
            color="#ffa666"
          />
          <AntDesign name="logout" size={21} color="#ffa666" onPress={handleLogout} />
        </View>
      ),
      headerStyle: {
        backgroundColor: "#cc5500",
      },
    });
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setUserId(null);
      navigation.replace("Login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);

        const response = await axios.get(`http://192.168.0.110:8000/users/${userId}`);
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.log("error retrieving users", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [setUserId]);

  console.log("users", users);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#ffe1cc" }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{color:"#ffa666"}}>Loading Users...</Text>
        </View>
      ) : (
        <View>
          <View style={{ padding: 10 }}>
            {users.map((item, index) => (
              <User key={index} item={item} />
            ))}
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
