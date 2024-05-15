import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput, StyleSheet, ScrollView, Dimensions,RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage, db } from '../../firebaseConfig'; // Firebase ayarlarını içeren dosya
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme, darkTheme, DarkToonTheme } from '../components/ThemaStil';
import { doc, getDoc, query, collection, updateDoc, orderBy, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const windowWidth = Dimensions.get('window').width;

const WebtoonReadPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [refreshing, setRefreshing] = useState(false);
  const { webtoon, episode } = route.params;
  const theme = useSelector(state => state.user.theme);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]); // Initialize comments state
  const [shouldScrollToTop, setShouldScrollToTop] = useState(true);

  const [resimler, setResimler] = useState([]);
  const [resimYukseklik, setResimYukseklik] = useState(0);

  useEffect(() => {
    fetchComments();
    getBolumResimler();
    sorgu();
  }, [webtoon, episode]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComments();
    await getBolumResimler();
    await sorgu();
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
        const resimListesi = await listAll(ref(storage, `Webtoons/${webtoon}/Bölümler/${episode}`));
        for (const item of resimListesi.items) {
          const resimURL = await getDownloadURL(item);
          resimURLs.push(resimURL);
        }
        setResimler(resimURLs);
      } catch (error) {
        console.error("Bölüm resimleri alınamadı:", error);
      }
    };
  
  const sorgu = async () => {
    if (resimler.length > 0) {
      Image.getSize(resimler[0], (width, height) => {
        const oran = height / width;
        setResimYukseklik(windowWidth * oran);
      });
    }}

  const [resimIndex, setResimIndex] = useState(0);

  const handleIleri = () => {
    if (resimIndex < resimler.length - 1) {
      setResimIndex(resimIndex + 1);
      setShouldScrollToTop(true);
        scrollToTop();
      
      
    }
  };

  const handleGeri = () => {
    if (resimIndex > 0) {
      setResimIndex(resimIndex - 1);
      setShouldScrollToTop(true);
scrollToTop();
      
      
    }
  };
  const scrollViewRef = useRef();

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

        // Kullanıcı belgesini Firestore'dan al
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          // Kullanıcı adını belgeden al
          const userName = userDocSnapshot.data().name;

          const commentData = {
            userId: userId,
            userName: userName,
            text: commentText.trim(),
            timestamp: new Date(),
          };

          // Yorumu veritabanına ekleyin
          await addCommentToDatabase(commentData);

          // Modalı kapatın ve yorum metnini sıfırlayın
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
      // Webtoon belgesini bul
      const webtoonDocRef = doc(db, 'webtoonlar', webtoon,'episodes',episode);
      const webtoonDocSnap = await getDoc(webtoonDocRef);

      if (webtoonDocSnap.exists()) {
        const webtoonId = webtoonDocSnap.id;
        console.log('Webtoon ID:', webtoonId);

        // Comments alt koleksiyonunu bul ve yeni döküman ekle
        const commentRef = collection(webtoonDocRef, 'comments');
        await addDoc(commentRef, commentData);
        console.log('Yorum başarıyla eklendi.');
      } else {
        console.error('Webtoon bulunamadı.');
      }
    } catch (error) {
      console.error('Yorum eklenirken bir hata oluştu:', error);
    }
  };

  const handleWebtoonSelect = (webtoon) => {
    console.log(`Seçilen webtoon: ${webtoon}`);
    navigation.navigate('WebtoonInfoPage', { webtoon: webtoon });
  };

  return (
    <View style={[styles.container, {
      backgroundColor: theme === 'DarkToon'
        ? DarkToonTheme.purpleStil.backgroundColor : theme === 'lightTheme'
          ? lightTheme.whiteStil.backgroundColor
          : darkTheme.darkStil.backgroundColor
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../../assets/İmage/HomePage_images/settings.png')} style={styles.settingicon} />
        </TouchableOpacity>

        <View style={styles.logoyazi}>
          <Image source={require('../../assets/İmage/HomePage_images/icon1.png')} style={styles.logo} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>DARK</Text>
            <Text style={styles.subtitle}>TON</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Bildirimler')}>
          <Image source={require('../../assets/İmage/HomePage_images/bildirim.png')} style={styles.bildirimicon} />
        </TouchableOpacity>
      </View>

      {/* Orta Bölüm */}
      <View style={styles.middleContainer}>
        {/* Üst Buton Konteynırı */}
        <View style={styles.topButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleGeri}>
            <Text style={styles.buttonText}>Geri</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleWebtoonSelect(webtoon)}>
          <Text style={styles.title}>{webtoon}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleIleri}>
            <Text style={styles.buttonText}>İleri</Text>
          </TouchableOpacity>
        </View>

        {/* Alt Bölge Konteynırı */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.bottomContainer}
          onContentSizeChange={scrollToTop}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Resimler Konteynırı */}
          <View style={styles.imageContainer}>
            {resimler.length > 0 && (
              <Image
                source={{ uri: resimler[resimIndex] }}
                style={[styles.image, { height: resimYukseklik }]}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Yorumlar */}
        <View style={styles.commentsContainer}>
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
      {/* Kapatma düğmesi */}
      <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>

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
    </View>
  </View>
</Modal>

 {/* Bottom Navigation */}
 <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/İmage/HomePage_images/home.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Kesfet')}>
          <Image source={require('../../assets/İmage/HomePage_images/keşif.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Kaydet')}>
          <Image source={require('../../assets/İmage/HomePage_images/save.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
          <Image source={require('../../assets/İmage/HomePage_images/profil.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
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
    paddingBottom: 15,
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
  settingicon: {
    width: 35,
    height: 35,
  },
  bildirimicon: {
    width: 35,
    height: 35,
  },
  middleContainer: {
    flex: 1,
  },
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  bottomContainer: {
    flex: 1,
    marginTop:1,
  },
  imageContainer: {
    marginBottom: 1,
    alignItems: 'center',
  },
  image: {
    width: windowWidth, // Ekran genişliği kadar genişlik
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingBottom: 15,
    paddingTop: 10,
  },
  navIcon: {
    width: 35,
    height: 35,
  },
  commentsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 15,
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
  commentsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 15,
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
    textDecorationLine: 'underline',
    marginBottom: 10,
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
});

export default WebtoonReadPage;
