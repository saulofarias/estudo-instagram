import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";

import api from "../../services/api";
import {
  Container,
  Post,
  Header,
  Avatar,
  Name,
  Description,
  Loading,
} from "./styles";

import FeedImage from "../../components/FeedImage";

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function loadPage() {
    setLoading(true);
    const { data } = await api.get("/feed?_expand=author");
    setLoading(false);
    setFeed(data);
  }

  useEffect(() => {
    loadPage();
  }, []);

  async function refreshList() {
    setRefreshing(true);
    await loadPage();
    setRefreshing(false);
  }

  return (
    <Container>
      <FlatList
        key="list"
        data={feed}
        keyExtractor={(item) => String(item.id)}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 10 }}
        showsVerticalScrollIndicator={false}
        onRefresh={refreshList}
        refreshing={refreshing}
        ListfooterComponent={loading && <Loading />}
        renderItem={({ item }) => {
          <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{item.author.name}</Name>
            </Header>
            <FeedImage
              aspectRatio={item.aspectRatio}
              smallSource={{ uri: item.image }}
              source={{ uri: item.small }}
            ></FeedImage>
            <Description>
              <Name>{item.author.name}</Name>
              {item.description}
            </Description>
          </Post>;
        }}
      />
    </Container>
  );
}
