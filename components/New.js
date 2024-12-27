import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { COLORS } from '../constants';

import moment from 'moment';



const New = ({article}) => {

  const formatDate = (date) => {
        return moment(date || moment.now()).fromNow();
  };
  return (
        <TouchableOpacity style={styles.card}>
           <Image style={styles.image} source={ article.urlToImage } />
           <View style={styles.content}>
              <Text style={styles.title}>{article.title}</Text>
              <Text style={styles.description}>{article.description}</Text>
              <Text style={styles.author}>{article.author}</Text>
              <Text style={styles.publishedAt}>{formatDate(article.publishedAt)}</Text>
           </View>
        </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    card: {
       flex: 1,
       flexDirection: 'row',
       alignItems: 'center',
       margin: 10,
       padding: 10,
       backgroundColor: COLORS.lightGray,
       borderRadius: 10,
       shadowColor: '#000',
       shadowOffset: {
          width: 0,
          height: 2,
       },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
       elevation: 5,
    },
    image: {
       width: 100,
       height: 100,
       borderRadius: 10,
       marginRight: 10,
    },
    content: {
       flex: 1,
    },
    title: {
       fontWeight: 'bold',
       fontSize: 18,
       marginBottom: 5,
       color: COLORS.primary
    },
    description: {
       fontSize: 14,
       marginBottom: 5,
       color: COLORS.primary


    },
    author: {
       fontSize: 12,
       marginBottom: 5,
    },
    publishedAt: {
       fontSize: 12,
       color: '#888',
    },
 });
 

export default New