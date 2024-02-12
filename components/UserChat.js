import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";

const UserChat = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const navigation = useNavigation();

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.0.110:8000/messages/${userId}/${item._id}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messages", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );

    const n = userMessages.length;

    return userMessages[n - 1];
  };

  const lastMessage = getLastMessage();

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Messages", {
          recepientId: item._id,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderColor: "#cc5500",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
        source={{ uri: item?.image }}
      />

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "500", color:"#b34a00" }}>{item?.name}</Text>
        {loading ? ( // Render loading text until messages are fetched
          <Text style={{color:"#ff974d"}}>Loading...</Text>
        ) : (
          lastMessage && (
            <Text style={{ marginTop: 3, color: "#ff974d", fontWeight: "500" }}>
              {lastMessage?.message}
            </Text>
          )
        )}
      </View>

      <View>
        {!loading && ( // Render timestamp only when not loading
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#ff974d" }}>
            {lastMessage && formatTime(lastMessage?.timeStamp)}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
