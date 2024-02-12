import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequests from "../components/FriendRequests";
import { useNavigation } from "@react-navigation/native";

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Friends",
      headerStyle: {
        backgroundColor: "#cc5500", // Set header background color
      },
      headerTintColor: "#ffa666",
    });
  }, [navigation]);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.110:8000/friend-request/${userId}`
      );

      if (response.status === 200) {
        const friendRequestsData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));

        setFriendRequests(friendRequestsData);
      }
    } catch (err) {
      console.log("error message", err);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#ffe1cc" }}> 
      <View style={{ padding: 10, marginHorizontal: 12 }}>
      {friendRequests.length > 0 ? (
        <>
          <Text style={{color:"#ff974d", fontSize:15}}>Your Friend Requests!</Text>
          {friendRequests.map((item, index) => (
            <FriendRequests
              key={index}
              item={item}
              friendRequests={friendRequests}
              setFriendRequests={setFriendRequests}
            />
          ))}
        </>
      ) : (
        <Text style={{ fontSize:15, color:"#b34a00" }}>No Friend Request Yet...</Text>
      )}
    </View>
    </KeyboardAvoidingView> 
    
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
