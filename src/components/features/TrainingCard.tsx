/**
 * Training Card Component
 * Video training card with inline playback via YouTube embed
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { WebView } from 'react-native-webview';
import { Theme } from '../../constants/Theme';
import { scale, verticalScale } from '../../utils/responsive';
import Text from '../common/Text';
import PlayIcon from '../icons/PlayIcon';
import CheckmarkLargeWhiteIcon from '../icons/CheckmarkLargeWhiteIcon';

interface TrainingCardProps {
  title?: string;
  duration?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  completed?: boolean;
  onPress?: () => void;
  onVideoComplete?: () => void;
  style?: ViewStyle;
}

function getYouTubeEmbedUrl(url: string): string | null {
  let videoId = '';
  if (url.includes('v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('embed/')) {
    videoId = url.split('embed/')[1].split('?')[0];
  }
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&controls=1&rel=0&modestbranding=1`;
}

export default function TrainingCard({
  title = 'Delivery Partner Basics',
  duration = '5 mins',
  thumbnailUrl,
  videoUrl,
  completed = false,
  onPress,
  onVideoComplete,
  style,
}: TrainingCardProps) {
  const [playing, setPlaying] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(false);
  const completeFiredRef = useRef(false);

  useEffect(() => {
    if (!playing || completeFiredRef.current) return;
    const timer = setTimeout(() => {
      completeFiredRef.current = true;
      onVideoComplete?.();
    }, 10000);
    return () => clearTimeout(timer);
  }, [playing, onVideoComplete]);

  const handlePress = () => {
    if (videoUrl) {
      setPlaying(true);
      setWebViewLoading(true);
    }
    onPress?.();
  };

  const handleStopPlaying = () => {
    setPlaying(false);
    setWebViewLoading(false);
  };

  if (playing && videoUrl) {
    const embedUrl = getYouTubeEmbedUrl(videoUrl);
    const isYouTube = !!embedUrl;

    return (
      <View style={[styles.card, styles.cardPlaying, style]}>
        {webViewLoading && (
          <ActivityIndicator
            size="large"
            color={Theme.colors.primaryMedium}
            style={styles.loader}
          />
        )}
        {isYouTube ? (
          <WebView
            style={styles.webview}
            source={{ uri: embedUrl! }}
            onLoadEnd={() => setWebViewLoading(false)}
            allowsFullscreenVideo={false}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
          />
        ) : (
          <WebView
            style={styles.webview}
            source={{ uri: videoUrl }}
            onLoadEnd={() => setWebViewLoading(false)}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            scrollEnabled={false}
          />
        )}

        <TouchableOpacity style={styles.closeButton} onPress={handleStopPlaying}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.videoInfoPlaying}>
          <Text variant="loginInfo" color={Theme.colors.white} style={styles.videoTitle}>
            {title}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel={completed ? `${title} - Training Complete, tap to re-watch` : `${title} training video`}
      accessibilityRole="button"
    >
      <View style={styles.videoContainer}>
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={300}
          />
        ) : null}
        <View style={[styles.videoOverlay, completed && styles.videoOverlayCompleted]} />

        {completed ? (
          <View style={styles.completedContent}>
            <CheckmarkLargeWhiteIcon size={scale(42)} />
            <Text variant="loginSubtitle" color={Theme.colors.white} style={styles.completedTitle}>
              Training Complete
            </Text>
            <Text variant="loginInfo" color="#D1D5DC" style={styles.completedSubtitle}>
              Tap to re-watch
            </Text>
          </View>
        ) : (
          <View style={styles.playButtonContainer}>
            <View style={styles.playButtonCircle}>
              <PlayIcon size={scale(17.5)} color="#237227" />
            </View>
          </View>
        )}
      </View>

      {!completed && (
        <View style={styles.videoInfo}>
          <Text variant="loginInfo" color={Theme.colors.white} style={styles.videoTitle}>
            {title}
          </Text>
          <Text variant="loginInfo" color="rgba(255, 255, 255, 0.8)" style={styles.videoDuration}>
            Duration: {duration}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: scale(202.5),
    backgroundColor: Theme.colors.textDark,
    borderRadius: scale(14),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  cardPlaying: {
    height: scale(220),
  },
  videoContainer: {
    width: '100%',
    height: scale(202.5),
    position: 'relative',
  },
  thumbnail: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  videoOverlayCompleted: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  playButtonContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircle: {
    width: scale(49),
    height: scale(49),
    borderRadius: scale(24.5),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: scale(3.5),
  },
  completedContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(7),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  completedTitle: {
    fontSize: scale(14),
    lineHeight: scale(21),
    fontWeight: '700',
    color: Theme.colors.white,
  },
  completedSubtitle: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
    color: '#D1D5DC',
  },
  videoInfo: {
    position: 'absolute',
    bottom: scale(10.5),
    left: scale(10.5),
    gap: 0,
  },
  videoInfoPlaying: {
    position: 'absolute',
    bottom: scale(6),
    left: scale(10),
  },
  videoTitle: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '700',
    color: Theme.colors.white,
  },
  videoDuration: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: scale(14),
    fontWeight: '700',
  },
});
