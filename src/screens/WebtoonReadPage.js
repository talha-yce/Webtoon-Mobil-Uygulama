import React, { useState, useEffect, useRef,  } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput, StyleSheet, ScrollView,RefreshControl } from 'react-native';
import { useNavigation, useRoute,  } from '@react-navigation/native';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage, db } from '../../firebaseConfig'; // Firebase ayarlarını içeren dosya
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme, darkTheme, DarkToonTheme } from '../components/ThemaStil';
import { doc, getDoc, query, collection, updateDoc, orderBy, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const WebtoonReadPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [refreshing, setRefreshing] = useState(false);
  const { webtoon, episode } = route.params;
  const {username, profileImage} = route.params;
  const theme = useSelector(state => state.user.theme);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]); 
  const [shouldScrollToTop, setShouldScrollToTop] = useState(true);

  const [resimler, setResimler] = useState([]);

  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const scrollViewRef = useRef();

  useEffect(() => {
    fetchComments();
    getBolumResimler();
    
  }, [webtoon, episode]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComments();
    await getBolumResimler();
    
    setRefreshing(false);
  };

 

  const fetchComments = async () => {
    try {
      const q = query(
        collection(db, 'webtoonlar', webtoon, 'episodes',episode,'comments'),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const commentsData = [];
        querySnapshot.forEach(async (doce) => {
          try {
            const commentData = doce.data();
            const userDocref = doc(db, 'users', commentData.userId);
            const userDoc = await getDoc(userDocref);

            if (userDoc.exists()) {
              const userProfile = userDoc.data().profileImage;

              commentsData.push({
                ...commentData,
                id: doce.id,
                profileImage: userProfile
              });
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        });

        setComments(commentsData);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

 

    
    const getBolumResimler = async () => {
      try {
        const resimURLs = [];
        let resimListesi;
        
       
        try {
          resimListesi = await listAll(ref(storage, `Webtoons/${webtoon}/Bölümler/${episode}`));
        } catch (error) {
         
          const episodeNumber = parseInt(episode.split(' ')[1]);
          if (episodeNumber > 1) {
            const oncekiBolum = `Bölüm ${episodeNumber - 1}`;
            resimListesi = await listAll(ref(storage, `Webtoons/${webtoon}/Bölümler/${oncekiBolum}`));
          } else {
            console.error("Bölüm veri tabanında bulunamadı ve bir önceki bölüm de yok.");
            return;
          }
        }
        
        
        for (const item of resimListesi.items) {
          const resimURL = await getDownloadURL(item);
          resimURLs.push(resimURL);
        }
        
       
        setResimler(resimURLs);
      } catch (error) {
        console.error("Bölüm resimleri alınamadı:", error);
      }
    };
    
  
 



  const handleIleri = () => {
    
    const { webtoon, episode } = route.params;

   
    const episodeNumber = parseInt(episode.split(' ')[1]);

    
    const yeniBolum = `Bölüm ${episodeNumber + 1}`;

    
    navigation.navigate('WebtoonReadPage', { webtoon: webtoon, episode: yeniBolum ,username: username, profileImage: profileImage});

    
    getBolumResimler();
};

const handleGeri = () => {
    
    const { webtoon, episode } = route.params;

   
    const episodeNumber = parseInt(episode.split(' ')[1]);

    
    if (episodeNumber > 1) {
        const yeniBolum = `Bölüm ${episodeNumber - 1}`;
        
        
        navigation.navigate('WebtoonReadPage', { webtoon: webtoon, episode: yeniBolum,username: username, profileImage: profileImage });

        
        getBolumResimler();
    }
};

 

  const scrollToTop = () => {
    if (shouldScrollToTop) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };
  

  const handleAddComment = () => {
    setIsModalVisible(true);
  };

  const handleSendComment = async () => {
    setShouldScrollToTop(false);  
    if (commentText.trim() === '') {
      alert('Lütfen bir yorum girin.');
      return;
    }

    try {
      const user = getAuth().currentUser;

      if (user) {
        const userId = user.uid;

        
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          
          const userName = userDocSnapshot.data().name;

          const commentData = {
            userId: userId,
            userName: userName,
            text: commentText.trim(),
            timestamp: new Date(),
          };

          
          await addCommentToDatabase(commentData);

          
          setIsModalVisible(false);
          setCommentText('');
          
        } else {
          console.log('Kullanıcı belgesi bulunamadı.');
        }
      } else {
        console.log("Kullanıcı oturum açmamış.");
      }
    } catch (error) {
      console.error("Yorum eklenirken bir hata oluştu:", error);
    }
  };

  const addCommentToDatabase = async (commentData) => {
    try {
     
      const webtoonDocRef = doc(db, 'webtoonlar', webtoon,'episodes',episode);
      const webtoonDocSnap = await getDoc(webtoonDocRef);

      if (webtoonDocSnap.exists()) {
        const webtoonId = webtoonDocSnap.id;
        

       
        const commentRef = collection(webtoonDocRef, 'comments');
        await addDoc(commentRef, commentData);
       
      } else {
        console.error('Webtoon bulunamadı.');
      }
    } catch (error) {
      console.error('Yorum eklenirken bir hata oluştu:', error);
    }
  };

  const handleWebtoonSelect = (webtoon) => {
   
    navigation.navigate('WebtoonInfoPage', { webtoon: webtoon });
  };

  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();
    
    const messages = [
      { startHour: 0, endHour: 6, message: 'Gece kuşu musun? İyi Geceler!' },
      { startHour: 6, endHour: 9, message: 'Keyifli okumalar.' },
      { startHour: 9, endHour: 12, message: 'Webtoon zamanı.' },
      { startHour: 12, endHour: 14, message: 'Yeni bölümler seni bekliyor.' },
      { startHour: 14, endHour: 17, message: 'Ara ver ve biraz oku.' },
      { startHour: 17, endHour: 19, message: 'Hikayelere devam.' },
      { startHour: 19, endHour: 21, message: 'Rahatla ve oku.' },
      { startHour: 21, endHour: 24, message: 'Güzel rüyalar.' },
    ];
  
    const messageObj = messages.find(({ startHour, endHour }) => currentHour >= startHour && currentHour < endHour);
  
    return messageObj ? messageObj.message : 'Bir hata oluştu!';
  };
  

  const handleScroll = (event) => {
    const currentScrollPosition = event.nativeEvent.contentOffset.y;
    if (currentScrollPosition > previousScrollPosition && isBottomNavVisible) {
      setIsBottomNavVisible(false);
    } else if (currentScrollPosition < previousScrollPosition && !isBottomNavVisible) {
      setIsBottomNavVisible(true);
    }
    setPreviousScrollPosition(currentScrollPosition);
  };
  

  return (
    <View style={[styles.container, {
      backgroundColor: theme === 'DarkToon'
        ? DarkToonTheme.purpleStil.backgroundColor : theme === 'lightTheme'
          ? lightTheme.whiteStil.backgroundColor
          : darkTheme.darkStil.backgroundColor
    }]}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profil', { username: username, profileImage: profileImage })}>
            <Image source={{ uri: profileImage }} style={styles.profilePicture} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>{getGreetingMessage()}</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/settings_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/settings.png') : require('../../assets/İmage/HomePage_images/settings_beyaz.png')} style={styles.settingicon} />
 </TouchableOpacity>
      </View>

      {/* Orta Bölüm */}
      <View style={[styles.middleContainer, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.toonStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.koyugrayStil.backgroundColor }]}>
        {/* Üst Buton Konteynırı */}
        <View style={[styles.topButtonContainer, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.toonStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.greyStil.backgroundColor }]}>
          
          <TouchableOpacity  onPress={handleGeri}>
          <Image source={require('../../assets/İmage/HomePage_images/back.png')} style={styles.yonIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleWebtoonSelect(webtoon)}>
          <Text style={styles.titlewebtoon}>{webtoon}</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={handleIleri}>
          <Image source={require('../../assets/İmage/HomePage_images/next.png')} style={styles.yonIcon} />
          </TouchableOpacity>
        </View>
        

        {/* Alt Bölge Konteynırı */}
        <ScrollView
          ref={scrollViewRef}
          style={[styles.bottomContainer, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.toonStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.koyugrayStil.backgroundColor }]} onScroll={handleScroll}
          onContentSizeChange={scrollToTop}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
           <ScrollView
          contentContainerStyle={styles.imageContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {resimler.map((resimURL, index) => (
            <Image key={index} source={{ uri: resimURL }} style={styles.image} />
          ))}
        </ScrollView>

          <View style={[styles.topButtonContainer, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.toonStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.greyStil.backgroundColor }]}>
          
          <TouchableOpacity  onPress={handleGeri}>
          <Image source={require('../../assets/İmage/HomePage_images/back.png')} style={styles.yonIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleWebtoonSelect(webtoon)}>
          <Text style={styles.titlewebtoon}>{webtoon}</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={handleIleri}>
          <Image source={require('../../assets/İmage/HomePage_images/next.png')} style={styles.yonIcon} />
          </TouchableOpacity>
        </View>

        

          {/* Yorumlar */}
        <View style={[styles.commentsContainer, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.toonStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.greyStil.backgroundColor }]}>
          <Text style={styles.commentsTitle}>Yorumlar</Text>
          <TouchableOpacity onPress={handleAddComment}>
            <Text style={styles.addButton}>Yorum Ekle</Text>
          </TouchableOpacity>

          {/* Yorumları listeleme */}
          {comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Image source={{ uri: comment.profileImage || require('../../assets/İmage/HomePage_images/profil.png') }} style={styles.commentAvatar} />
              <View style={styles.commentTextContainer}>
                <Text style={styles.commentUsername}>{comment.userName}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
                <Text style={styles.commentTimestamp}>{comment.timestamp?.toDate().toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      </View>

      {/* Yorum ekleme modalı */}
<Modal
  visible={isModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TextInput
        style={styles.commentInput}
        multiline={true}
        placeholder="Yorumunuzu buraya yazın..."
        onChangeText={setCommentText}
        value={commentText}
      />
      <TouchableOpacity onPress={handleSendComment}>
        <Text style={styles.sendButton}>Gönder</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsModalVisible(false)}>
        <Text style={styles.usageModalClose}>Kapat</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
{isBottomNavVisible && (
 
 <View style={[styles.bottomNav, { backgroundColor: theme === 'DarkToon' 
 ? DarkToonTheme.purpleStil.backgroundColor : theme === 'lightTheme'
 ? lightTheme.whiteStil.backgroundColor
 : darkTheme.darkStil.backgroundColor }]}>
 <TouchableOpacity onPress={() => navigation.navigate('Home', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/home_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/home.png') : require('../../assets/İmage/HomePage_images/home_beyaz.png')} style={styles.navIcon} />
 </TouchableOpacity>
 <TouchableOpacity onPress={() => navigation.navigate('Kaydet', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/save_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/save.png') : require('../../assets/İmage/HomePage_images/save_beyaz.png')} style={styles.navIcon} />
 </TouchableOpacity>
 <TouchableOpacity onPress={() => navigation.navigate('Kesfet', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/keşif_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/keşif.png') : require('../../assets/İmage/HomePage_images/keşif_beyaz.png')} style={styles.navIcon} />
 </TouchableOpacity>
</View>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingBottom: 10,
    paddingTop: 10,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#ffb685',
    
  },
  subtitle: {
    fontSize: 20,
    color: '#ffb685',
    position: 'relative',
    left: 37,
    top: -5,
  },
  logoyazi: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  
  middleContainer: {
    flex: 1,
  },
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 5,
    marginRight: 5,
    borderWidth:1,
    borderColor:'lightgray',
    borderRadius:25,
    paddingLeft:5,
    paddingRight:5,
    marginTop:5,
  },
 
  titlewebtoon: {
    fontSize: 22,
    color: '#ffb685',
    fontWeight:'bold',
    marginTop:10,
    marginBottom:10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  bottomContainer: {
    flex: 1,
    marginTop:1,
    backgroundColor:'white',
  },
  imageContainer: {
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 9 / 16,  
    
  },
  commentsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    borderColor:'lightgray',
    borderRadius:15,
    borderWidth:1,
    marginBottom:10,
  },
  yonIcon: {
    width: 30,
    height: 30,
    marginTop:5,
    marginBottom:5,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    marginTop:10,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 15,
    borderWidth:1,
    borderColor:'gray',
    borderRadius:25,
  },
  commentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  commentText: {
    fontSize: 14,
    color: 'black',
  },
 

  commentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  commentText: {
    fontSize: 14,
    color: 'black',
  },
  commentTimestamp: {
    fontSize: 12,
    color: 'gray',
  },
  addButton: {
    fontSize: 18,
    color: 'blue',
    fontWeight:'bold',
    marginBottom: 10,
    marginTop:10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  commentInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    minHeight: 100,
  },
  sendButton: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 23,
    height: 23,
    borderRadius: 5,
    backgroundColor:'purple',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: 'black',
  },
  usageModalClose: {
    fontSize: 18,
    color: 'blue',
    marginTop: 10,
    textAlign: 'right',
  },
  
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginTop:5,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffb685',
  },
  username: {
    fontSize: 14,
    color: '#ffb685',
  },
  settingicon: {
    width: 35,
    height: 35,
    marginTop:10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 27,
    borderWidth: 1,
    margin: 15,
    position: 'absolute',
    bottom: 0,
    width: '92%',
  },
  navIcon: {
    width: 35,
    height: 35,
  },
});

export default WebtoonReadPage;