import { StyleSheet, Text, View, ScrollView, Pressable, KeyboardAvoidingView } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import UserChat from "../components/UserChat";

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Chats",
      headerStyle: {
        backgroundColor: "#cc5500", // Set header background color
      },
      headerTintColor: "#ffa666",
    });
  }, [navigation]);

  useEffect(() => {

    const acceptedFriendsList = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.110:8000/accepted-friends/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setAcceptedFriends(data);
        }
      } catch (error) {
        console.log("error showing the accepted friends", error);
      } finally {
        setLoading(false); 
      }
    };

    acceptedFriendsList();
  }, []);

  console.log("friends", acceptedFriends);

  return (
    
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#ffe1cc" }}>   
    <ScrollView showsVerticalScrollIndicator={false}>
      {loading ? (
        <View style={{marginTop:360, flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{color:"#ffa666"}}>Loading friends...</Text>
        </View>
      ) : (
        <Pressable>
          {acceptedFriends.map((item, index) => (
            <UserChat key={index} item={item} />
          ))}
        </Pressable>
      )}
    </ScrollView>
    </KeyboardAvoidingView> 
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
