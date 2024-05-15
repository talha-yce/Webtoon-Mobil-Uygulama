import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet,Modal,TextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage } from '../../firebaseConfig'; // Firebase ayarlarını içeren dosya
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme, darkTheme, DarkToonTheme } from '../components/ThemaStil';
import { doc, getDoc, query, collection, updateDoc, orderBy,addDoc, onSnapshot,increment } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth } from "firebase/auth";
const WebtoonInfoPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { webtoon } = route.params;
  const [webtoonLiked, setWebtoonLiked] = useState(false); 
  const [webtoonRecorded, setWebtoonRecorded] = useState(false); 
  const [comments, setComments] = useState([]);
  const theme = useSelector(state => state.user.theme);
  const [bolumler, setBolumler] = useState([]);
  const [kapakResmi, setKapakResmi] = useState(null);
  const [begenCount, setBegenCount] = useState(0);
  const [kaydetCount, setKaydetCount] = useState(0);
  const [yorumCount, setYorumCount] = useState(0);
  const [konu, setKonu] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likeButtonEnabled, setLikeButtonEnabled] = useState(true);
  const [recordButtonEnabled, setRecordButtonEnabled] = useState(true);
  const [warningVisible, setWarningVisible] = useState(false);


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(
          collection(db, 'webtoonlar', webtoon, 'comments'),
          orderBy('timestamp', 'desc')
        );
    
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const commentsData = [];
          querySnapshot.forEach(async (doce) => {
            try {
              const commentData = doce.data();
              const userDocref =  doc(db, 'users', commentData.userId);
              const userDoc = await getDoc(userDocref);
             
    
              if (userDoc.exists()) {
                const userProfile = userDoc.data().profileImage;
                
    
                commentsData.push({
                  ...commentData,
                  id: doce.id,
                  profileImage: userProfile
                });
              } else {
                
              }
            } catch (error) {
              
            }
          });
          
          setComments(commentsData);
        });
    
        return () => {
          
          unsubscribe();
        };
      } catch (error) {
       
      }
    };
    

    fetchComments();
  }, [webtoon]);



 
  

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid;
  
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const likeArray = userSnap.data().like || [];
          setWebtoonLiked(likeArray.includes(webtoon));
        } else {
          setWebtoonLiked(false);
        }
      } else {
        console.log("Kullanıcı oturum açmamış.");
      }
    });
  
    return unsubscribe;
  }, [webtoon]);


  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid;
  
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const kaydetArray = userSnap.data().kaydet || [];
          setWebtoonRecorded(kaydetArray.includes(webtoon));
        } else {
          setWebtoonRecorded(false);
        }
      } else {
        console.log("Kullanıcı oturum açmamış.");
      }
    });
  
    return unsubscribe;
  }, [webtoon]);
  
  const toggleLiked = async (webtoonName) => {
    if (!likeButtonEnabled) {
      
      setWarningVisible(true);
      return;
    }
    const user = getAuth().currentUser;
  
    if (user) {
      try {
        const userId = user.uid;
  
        
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const likeArray = userData.like || [];
  
          
          const webtoonDocRef = doc(db, 'webtoonlar', webtoonName);
          const webtoonDocSnap = await getDoc(webtoonDocRef);
  
          if (webtoonDocSnap.exists()) {
            const webtoonData = webtoonDocSnap.data();
            const currentBegenCount = webtoonData.begen || 0;
  
            if (webtoonLiked) {
              
              setWebtoonLiked(false);
              setBegenCount(begenCount - 1);
              await updateDoc(userDocRef, {
                like: likeArray.filter(webtoon => webtoon !== webtoonName)
              });
  
              await updateDoc(webtoonDocRef, {
                begen: currentBegenCount - 1
              });
  
              console.log("Webtoon unliked:", webtoonName);
            } else {
              
              setWebtoonLiked(true);
              setBegenCount(begenCount + 1);
              await updateDoc(userDocRef, {
                like: [...likeArray, webtoonName]
              });
  
              
              await updateDoc(webtoonDocRef, {
                begen: currentBegenCount + 1
              });
  
              console.log("Webtoon liked:", webtoonName);
            }
          } else {
            console.error("Webtoon not found:", webtoonName);
          }
        } else {
          console.error("User document not found:", userId);
        }
      } catch (error) {
        console.error("Hata oluştu:", error);
      }
      setLikeButtonEnabled(false);
    } else {
      console.log("Kullanıcı oturum açmamış.");
    }
    setTimeout(() => {
      setLikeButtonEnabled(true);
    }, 2000);
  };
  
  const toggleRecord = async (webtoonName) => {
    if (!recordButtonEnabled) {
      
      setWarningVisible(true);
      return;
    }
    const user = getAuth().currentUser;
  
    if (user) {
      try {
        const userId = user.uid;
  
        
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const kaydetArray = userData.kaydet || [];
  
          
          const webtoonDocRef = doc(db, 'webtoonlar', webtoonName);
          const webtoonDocSnap = await getDoc(webtoonDocRef);
  
          if (webtoonDocSnap.exists()) {
            const webtoonData = webtoonDocSnap.data();
            const currentKaydetCount = webtoonData.kaydet || 0;
  
            if (webtoonRecorded) {
             
              setWebtoonRecorded(false);
              setKaydetCount(kaydetCount - 1);
              await updateDoc(userDocRef, {
                kaydet: kaydetArray.filter(webtoon => webtoon !== webtoonName)
              });
  
              
              await updateDoc(webtoonDocRef, {
                kaydet: currentKaydetCount - 1
              });
  
              console.log("Webtoon kaydetme:", webtoonName);
            } else {
             
              setWebtoonRecorded(true);
              setKaydetCount(kaydetCount + 1);
              await updateDoc(userDocRef, {
                kaydet: [...kaydetArray, webtoonName]
              });
  
              
              await updateDoc(webtoonDocRef, {
                kaydet: currentKaydetCount + 1
              });
  
              console.log("Webtoon kaydet:", webtoonName);
            }
          } else {
            console.error("Webtoon not found:", webtoonName);
          }
        } else {
          console.error("User document not found:", userId);
        }
      } catch (error) {
        console.error("Hata oluştu:", error);
      }
      setRecordButtonEnabled(false);
    } else {
      console.log("Kullanıcı oturum açmamış.");
    }
    setTimeout(() => {
      setRecordButtonEnabled(true);
    }, 2000);
  };
  
  

useEffect(() => {
    const getWebtoonData = async () => {
      try {
        const webtoonDoc = doc(db, 'webtoonlar', webtoon);
        const webtoonSnapshot = await getDoc(webtoonDoc);

        if (webtoonSnapshot.exists()) {
          const webtoonData = webtoonSnapshot.data();
          const begenCount = webtoonData.begen || 0;
          const kaydetCount = webtoonData.kaydet || 0;
          const yorumCount = webtoonData.yorum || 0;
          const konu=webtoonData.konu;
          setKonu(konu);
          setBegenCount(begenCount);
          setKaydetCount(kaydetCount);
          setYorumCount(yorumCount);
        } else {
          console.log('Webtoon bulunamadı');
        }
      } catch (error) {
        console.error('Webtoon verileri alınamadı:', error);
      }
    };

    getWebtoonData();
  }, [webtoon]);
  

  useEffect(() => {
    // Webtoon kapak resmi URL'sini getir
    getDownloadURL(ref(storage, `Webtoons/${webtoon}/Kapak/${webtoon}.jpg`))
      .then(url => setKapakResmi(url))
      .catch(error => {
        getDownloadURL(ref(storage, `Webtoons/${webtoon}/Kapak/${webtoon}.jpeg`))
          .then(url => setKapakResmi(url))
          .catch(error => console.error("Kapak resmi alınamadı:", error));
      });

    // Webtoon bölümlerini getir
    listAll(ref(storage, `Webtoons/${webtoon}/Bölümler`))
      .then(dir => {
        const bolumler = dir.prefixes.map(folderRef => folderRef.name);
        setBolumler(bolumler.reverse());
      })
      .catch(error => console.error("Bölümler alınamadı:", error));
    }, [webtoon]);
    

  const goToWebtoonReadPage = (episode) => {
    navigation.navigate('WebtoonReadPage', { webtoon: webtoon, episode: episode });
  };

 

  const handleAddComment = () => {
    setIsModalVisible(true);
  };

  const handleSendComment = async () => {
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
      const webtoonDocRef = doc(db, 'webtoonlar', webtoon);
      const webtoonDocSnap = await getDoc(webtoonDocRef);
  
      if (webtoonDocSnap.exists()) {
        const webtoonId = webtoonDocSnap.id;
        console.log('Webtoon ID:', webtoonId);
  
        // Comments alt koleksiyonunu bul ve yeni döküman ekle
        const commentRef = collection(webtoonDocRef, 'comments');
        await addDoc(commentRef, commentData);
        console.log('Yorum başarıyla eklendi.');
  
        // Webtoon belgesindeki yorum sayısını arttır
        await updateDoc(webtoonDocRef, {
          yorum: increment(1) // Mevcut yorum sayısını 1 artır
        });
        setYorumCount(prevCount => prevCount + 1);
        console.log('Webtoon yorum sayısı güncellendi.');
      } else {
        console.error('Webtoon bulunamadı.');
      }
    } catch (error) {
      console.error('Yorum eklenirken bir hata oluştu:', error);
    }
  };
  

const handleStopButtonPress = () => {
  setWarningVisible(false);
};

  return (
    <View style={[styles.container, { backgroundColor: theme === 'DarkToon'
      ? DarkToonTheme.purpleStil.backgroundColor : theme === 'lightTheme'
        ? lightTheme.whiteStil.backgroundColor
        : darkTheme.darkStil.backgroundColor }]}>
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

        <TouchableOpacity>
          <Text style={styles.bildirimicon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Orta Bölge */}
        <View style={styles.middleContent}>
          <Text style={styles.basliktitle}>{webtoon}</Text>
          {/* Kapak resmi */}
          {kapakResmi && <Image source={{ uri: kapakResmi }} style={styles.webtoonImage} />}

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Konusu</Text>
            <Text style={styles.infoText}>{konu}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.counterContainer}>
            <TouchableOpacity onPress={() => toggleRecord(webtoon)}>
              <Image source={webtoonRecorded ? require('../../assets/İmage/HomePage_images/kaydet.png'):require('../../assets/İmage/HomePage_images/pasif_kaydet.png')} style={styles.counterIcon} />
              </TouchableOpacity>
              <Text style={styles.counterText}>{kaydetCount}</Text>
              
            </View>
            <View style={styles.counterContainer}>
            <TouchableOpacity onPress={() => toggleLiked(webtoon)}>
              <Image source={webtoonLiked ? require('../../assets/İmage/HomePage_images/like.png') : require('../../assets/İmage/HomePage_images/pasif_like.png')} style={styles.counterIcon} />
              </TouchableOpacity>
              <Text style={styles.counterText}>{begenCount}</Text>
            </View>

            <View style={styles.counterContainer}>
              <Image source={require('../../assets/İmage/HomePage_images/yorum.png')} style={styles.counterIcon} />
              <Text style={styles.counterText}>{yorumCount}</Text>
            </View>
          </View>
        </View>

        {/* Bölümler */}
        <View style={styles.episodesContainer}>
          <Text style={styles.episodesTitle}>Bölümler</Text>
          {/* Bölüm butonları */}
            {bolumler.map((bolum, index) => (
            <TouchableOpacity
              key={index}
              style={styles.episodeButton}
              onPress={() => goToWebtoonReadPage(bolum)}
            >
              <Text style={styles.episodeButtonText}>{bolum}</Text>
            </TouchableOpacity>
          ))}

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
{/* Uyarı modalı */}
<Modal
        visible={warningVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setWarningVisible(false)}
      >
        <View style={styles.modaluyarıContainer}>
          <View style={styles.modaluyarıContent}>
            <Text style={styles.warningText}>Bu hızınıza bir DUR dememiz gerekiyor!</Text>
            {/* Dur butonu */}
          <TouchableOpacity onPress={handleStopButtonPress}>
            <Text style={styles.stopButton}>DURACAĞIM</Text>
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
}

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
  logoyazi: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  titleContainer: {

    alignItems: 'center',
  },

  basliktitle: {
    fontSize: 28,
    color: 'black',
    marginBottom: 10,
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
  settingicon: {
    width: 35,
    height: 35,
  },
  bildirimicon: {
    width: 35,
    height: 35,
  },
  middleContent: {
    alignItems: 'center',
    paddingTop: 20,
  },
  webtoonImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: 'black',

  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  counterContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  counterIcon: {
    width: 30,
    height: 30,
  },
  counterText: {
    color: 'black',
    fontSize:16,
    fontWeight:'bold',
  },
  episodesContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  episodesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  episodeButton: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  episodeButtonText: {
    fontSize: 16,
    color: 'white',
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
  scrollView: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
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
  modaluyarıContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modaluyarıContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  warningText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stopButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'purple',
    marginTop: 10,
    textAlign: 'center',
  },

});

export default WebtoonInfoPage;
