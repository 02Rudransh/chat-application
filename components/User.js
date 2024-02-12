// import { StyleSheet, Text, View, Pressable, Image, ScrollView } from "react-native";
// import React, { useContext, useState, useEffect } from "react";
// import { UserType } from "../UserContext";
// import { useNavigation } from "@react-navigation/native";

// const User = ({ item }) => {
//   const { userId, setUserId } = useContext(UserType);
//   const [requestSent, setRequestSent] = useState(false);
//   const [friendRequests, setFriendRequests] = useState([]);
//   const [userFriends, setUserFriends] = useState([]);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchFriendRequests = async () => {
//       try {
//         const response = await fetch(
//           `http://192.168.0.110:8000/friend-requests/sent/${userId}`
//         );

//         const data = await response.json();
//         if (response.ok) {
//           setFriendRequests(data);
//         } else {
//           console.log("error", response.status);
//         }
//       } catch (error) {
//         console.log("error", error);
//       }
//     };

//     fetchFriendRequests();
//   }, []);

//   useEffect(() => {
//     const fetchUserFriends = async () => {
//       try {
//         const response = await fetch(`http://192.168.0.110:8000/friends/${userId}`);
//         const data = await response.json();

//         if (response.ok) {
//           setUserFriends(data);
//         } else {
//           console.log("error retrieving user friends", response.status);
//         }
//       } catch (error) {
//         console.log("Error message", error);
//       }
//     };

//     fetchUserFriends();
//   }, []);

//   const sendFriendRequest = async (currentUserId, selectedUserId) => {
//     try {
//       const response = await fetch("http://192.168.0.110:8000/friend-request", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ currentUserId, selectedUserId }),
//       });

//       if (response.ok) {
//         setRequestSent(true);
//       }
//     } catch (error) {
//       console.log("error message", error);
//     }
//   };

//   const handleFriendPress = () => {
//     if (userFriends.includes(item._id)) {
//       navigation.navigate("Messages", { recepientId: item._id });
//     } else {
//       sendFriendRequest(userId, item._id);
//     }
//   };

//   return (
//     <ScrollView>
//       <Pressable
//       onPress={handleFriendPress}
//       style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
//     >
//       <View>
//         <Image
//           style={{ 
//             width: 50,
//             height: 50,
//             borderRadius: 25,
//             resizeMode: "cover",
//           }}
//           source={{ uri: item.image }}
//         />
//       </View>

//       <View style={{ marginLeft: 12, flex: 1 }}>
//         <Text style={{ fontWeight: "bold", color:"#b34a00" }}>{item?.name}</Text>
//         <Text style={{ marginTop: 4, color: "#ff974d" }}>{item?.email}</Text>
//       </View>

//       {userFriends.includes(item._id) ? (
//         <Pressable
//           style={{
//             backgroundColor: "#ffa666",
//             padding: 10,
//             width: 105,
//             borderRadius: 6,
//           }}
//         >
//           <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
//         </Pressable>
//       ) : requestSent || friendRequests.some((friend) => friend._id === item._id) ? (
//         <Pressable
//           style={{
//             backgroundColor: "#ff6a00",
//             padding: 10,
//             width: 105,
//             borderRadius: 6,
//           }}
//         >
//           <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
//             Request Sent
//           </Text>
//         </Pressable>
//       ) : (
//         <Pressable
//           onPress={() => sendFriendRequest(userId, item._id)}
//           style={{
//             backgroundColor: "#cc5500",
//             padding: 10,
//             borderRadius: 6,
//             width: 105,
//           }}
//         >
//           <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
//             {userFriends.includes(item._id) ? "Added" : "Add Friend"}
//           </Text>
//         </Pressable>
//       )}
      
//     </Pressable>
//     </ScrollView>
    
//   );
// };

// export default User;

// const styles = StyleSheet.create({});





import { StyleSheet, Text, View, Pressable, Image, ScrollView, RefreshControl } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch data again
    await fetchFriendRequests();
    await fetchUserFriends();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFriendRequests();
    fetchUserFriends();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(
        `http://192.168.0.110:8000/friend-requests/sent/${userId}`
      );

      const data = await response.json();
      if (response.ok) {
        setFriendRequests(data);
      } else {
        console.log("error", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchUserFriends = async () => {
    try {
      const response = await fetch(`http://192.168.0.110:8000/friends/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setUserFriends(data);
      } else {
        console.log("error retrieving user friends", response.status);
      }
    } catch (error) {
      console.log("Error message", error);
    }
  };

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://192.168.0.110:8000/friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error message", error);
    }
  };

  const handleFriendPress = () => {
    if (userFriends.includes(item._id)) {
      navigation.navigate("Messages", { recepientId: item._id });
    } else {
      sendFriendRequest(userId, item._id);
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Pressable
        onPress={handleFriendPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <View>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              resizeMode: "cover",
            }}
            source={{ uri: item.image }}
          />
        </View>

        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ fontWeight: "bold", color:"#b34a00" }}>{item?.name}</Text>
          <Text style={{ marginTop: 4, color: "#ff974d" }}>{item?.email}</Text>
        </View>

        {userFriends.includes(item._id) ? (
          <Pressable
            style={{
              backgroundColor: "#ffa666",
              padding: 10,
              width: 105,
              borderRadius: 6,
            }}
          >
            <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
          </Pressable>
        ) : requestSent || friendRequests.some((friend) => friend._id === item._id) ? (
          <Pressable
            style={{
              backgroundColor: "#ff6a00",
              padding: 10,
              width: 105,
              borderRadius: 6,
            }}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
              Request Sent
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => sendFriendRequest(userId, item._id)}
            style={{
              backgroundColor: "#cc5500",
              padding: 10,
              borderRadius: 6,
              width: 105,
            }}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
              {userFriends.includes(item._id) ? "Added" : "Add Friend"}
            </Text>
          </Pressable>
        )}
        
      </Pressable>
    </ScrollView>
  );
};

export default User;

const styles = StyleSheet.create({});