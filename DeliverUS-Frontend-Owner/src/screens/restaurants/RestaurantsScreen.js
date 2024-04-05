/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import { getAll } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'
import AuthorizationContext from '../../context/AuthorizationContext'
import * as GlobalStyles from '../../styles/GlobalStyles'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import { showMessage } from 'react-native-flash-message'
export default function RestaurantsScreen ({ navigation }) {
  const [restaurants, setRestaurants] = useState([])
  const { loggedInUser } = useContext(AuthorizationContext)
  useEffect(() => {
    async function fetchRestaurants () { // Addresses problem 1
      try {
        const fetchedRestaurants = await getAll()
        setRestaurants(fetchedRestaurants)
      } catch (error) { // Addresses problem 3
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    if (loggedInUser) { // Addresses problem 2
      fetchRestaurants()
    } else {
      setRestaurants(null)
    }
  }, [loggedInUser]) // Addresses problem 2

  const renderRestaurant = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.logo ? { uri: process.env.API_BASE_URL + '/' + item.logo } : restaurantLogo}
        title={item.name}
        onPress={() => {
          navigation.navigate('RestaurantDetailScreen', { id: item.id })
        }}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        {item.averageServiceMinutes !== null &&
          <TextSemiBold>Avg. service time: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.averageServiceMinutes} min.</TextSemiBold></TextSemiBold>
        }
        <TextSemiBold>Shipping: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.shippingCosts.toFixed(2)}€</TextSemiBold></TextSemiBold>
      </ImageCard>
    )
  }

  return (
    <FlatList
      style={styles.container}
      data={restaurants}
      renderItem={renderRestaurant}
      keyExtractor={item => item.id.toString()}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
