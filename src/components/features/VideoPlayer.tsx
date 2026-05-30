import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useVideoPlayer, VideoView } from 'expo-video';
import Text from '../common/Text';
import { Theme } from '../../constants/Theme';
import { scale } from '../../utils/responsive';
import CloseIcon from '../icons/CloseIcon';

interface VideoPlayerProps {
  url: string;
  isVisible: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function VideoPlayer({ url, isVisible, onClose, onComplete }: VideoPlayerProps) {
  const [isYouTube, setIsYouTube] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (url) {
      const isYT = url.includes('youtube.com') || url.includes('youtu.be');
      setIsYouTube(isYT);
    }
  }, [url]);

  const getYouTubeEmbedUrl = (ytUrl: string) => {
    let videoId = '';
    if (ytUrl.includes('v=')) {
      videoId = ytUrl.split('v=')[1].split('&')[0];
    } else if (ytUrl.includes('youtu.be/')) {
      videoId = ytUrl.split('youtu.be/')[1].split('?')[0];
    } else if (ytUrl.includes('embed/')) {
      videoId = ytUrl.split('embed/')[1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`;
  };

  const player = useVideoPlayer(isYouTube ? null : { uri: url }, (player) => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    if (!isYouTube && player) {
      const subscription = player.addListener('playToEnd', () => {
        if (onComplete) onComplete();
      });
      return () => {
        subscription.remove();
      };
    }
  }, [isYouTube, player, onComplete]);

  // For YouTube, we can't easily track "watched to end" with just WebView without a lot of JS injection.
  // We'll simulate completion for now or just allow marking as complete after some time.
  // Better yet, just mark as complete when the Modal is closed if they spent enough time?
  // For now, let's just mark it as complete after 10 seconds of being open for YouTube.
  useEffect(() => {
    if (isVisible && isYouTube) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 10000); // Mark as complete after 10s of watching YouTube
      return () => clearTimeout(timer);
    }
  }, [isVisible, isYouTube, onComplete]);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <CloseIcon size={scale(24)} color={Theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.videoContainer}>
          {loading && (
            <ActivityIndicator 
              size="large" 
              color={Theme.colors.primaryMedium} 
              style={styles.loader} 
            />
          )}
          
          {isYouTube ? (
            <WebView
              style={styles.webview}
              source={{ uri: getYouTubeEmbedUrl(url) }}
              onLoadEnd={() => setLoading(false)}
              allowsFullscreenVideo={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          ) : (
            <VideoView
              player={player}
              style={styles.video}
              allowsFullscreen={true}
              allowsPictureInPicture={true}
              onLayout={() => setLoading(false)}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: scale(60),
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
  },
  closeButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(20),
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
});
