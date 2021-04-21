import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';

import { EnvironmentButton } from '../components/EnvironmentButton';
import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Loading } from '../components/Loading';

import { api } from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface Environment {
  key: string;
  title: string;
}

interface Plant {
  id: number
  name: string;
  about: string;
  water_tips: string;
  photo: string
  environments: string[];
  frequency: {
    times: number,
    repeat_every: string;
  }
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);

  useEffect(() => {
    async function fetchEnvironment() {
      const { data } = await api
        .get<Environment[]>('plants_environments?_sort=title&_order=asc');
      
      setEnvironments([
        {
          key: 'all',
          title: 'Todos',
        },
        ...data,
      ]);
    }

    fetchEnvironment();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  async function fetchPlants() {
    const { data } = await api
      .get<Plant[]>(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);
    
    if (!data) {
      // REVIEW - setLoadedAll
      return setIsLoading(true);
    }

    if (page > 1) {
      setPlants(state => [...state, ...data]);
      setFilteredPlants(state => [...state, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }

    setIsLoading(false);
    setLoadMore(false);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) {
      return;
    }

    setLoadMore(true);
    setPage(state => state + 1);
    fetchPlants();
  }

  function handleChangeEnvironment(environment: string) {
    setSelectedEnvironment(environment);

    if (environment === 'all') {
      setFilteredPlants(plants);
      return;
    }

    const filtered = plants.filter(plant => 
      plant.environments.includes(environment)
    );

    setFilteredPlants(filtered);
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />

        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>Você quer colocar a sua planta?</Text>
      </View>

      <View>
        <FlatList 
          data={environments}
          renderItem={({ item }) => <EnvironmentButton 
              key={item.key} 
              title={item.title}
              active={item.key === selectedEnvironment}
              onPress={() => handleChangeEnvironment(item.key)} 
            />
          }
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList 
          data={filteredPlants}
          renderItem={({ item }) => <PlantCardPrimary key={String(item.id)} data={item} />}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
            loadMore 
              ? <ActivityIndicator color={colors.green} />
              : <></>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    padding: 30,
  },

  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },

  subtitle: {
    fontFamily: fonts.text,
    fontSize: 12,
    lineHeight: 20,
    color: colors.heading,
  },

  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    paddingRight: 38,
    marginLeft: 32,
    marginBottom: 32,
  },

  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
});