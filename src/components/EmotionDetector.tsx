
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'surprised' | 'fear' | 'disgust';

export type EmotionData = {
  emotion: Emotion;
  confidence: number;
};

interface EmotionDetectorProps {
  imageData?: ImageData;
  isActive: boolean;
}

const mockEmotionDetection = (imageData?: ImageData): EmotionData[] => {
  // In a real implementation, this would use a ML model to detect emotions
  // For this demo, we'll return random emotions with random confidences
  const emotions: Emotion[] = ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fear', 'disgust'];
  
  // Generate random emotions with confidences that sum to 100%
  const randomEmotions: EmotionData[] = [];
  let remainingConfidence = 100;
  
  // Assign a dominant emotion with higher confidence
  const dominantIndex = Math.floor(Math.random() * emotions.length);
  const dominantConfidence = Math.floor(Math.random() * 40) + 30; // Between 30-70%
  
  randomEmotions.push({
    emotion: emotions[dominantIndex],
    confidence: dominantConfidence
  });
  
  remainingConfidence -= dominantConfidence;
  
  // Distribute remaining confidence among other emotions
  for (let i = 0; i < emotions.length; i++) {
    if (i !== dominantIndex) {
      if (i === emotions.length - 1) {
        // Last emotion gets whatever confidence is left
        randomEmotions.push({
          emotion: emotions[i],
          confidence: remainingConfidence
        });
      } else {
        const conf = Math.min(remainingConfidence, Math.floor(Math.random() * 20));
        if (conf > 0) {
          randomEmotions.push({
            emotion: emotions[i],
            confidence: conf
          });
          remainingConfidence -= conf;
        }
      }
    }
  }
  
  return randomEmotions.sort((a, b) => b.confidence - a.confidence);
};

const EmotionDetector: React.FC<EmotionDetectorProps> = ({ imageData, isActive }) => {
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  const [dominantEmotion, setDominantEmotion] = useState<EmotionData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isActive) {
      // Real implementation would process the imageData here
      // For now, we'll update every second with random emotions
      intervalId = setInterval(() => {
        const detectedEmotions = mockEmotionDetection(imageData);
        setEmotions(detectedEmotions);
        setDominantEmotion(detectedEmotions[0]);
      }, 1000);
      
      toast({
        title: "Emotion detection started",
        description: "We're analyzing your facial expressions in real-time",
      });
    } else {
      setEmotions([]);
      setDominantEmotion(null);
    }
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isActive, imageData, toast]);

  const getEmotionColor = (emotion: Emotion): string => {
    const colorMap: Record<Emotion, string> = {
      happy: 'bg-emotion-happy',
      sad: 'bg-emotion-sad',
      angry: 'bg-emotion-angry',
      neutral: 'bg-emotion-neutral',
      surprised: 'bg-emotion-surprised',
      fear: 'bg-emotion-fear',
      disgust: 'bg-emotion-disgust'
    };
    
    return colorMap[emotion] || 'bg-gray-400';
  };

  const getEmotionTextColor = (emotion: Emotion): string => {
    const colorMap: Record<Emotion, string> = {
      happy: 'text-emotion-happy',
      sad: 'text-emotion-sad',
      angry: 'text-emotion-angry',
      neutral: 'text-emotion-neutral',
      surprised: 'text-emotion-surprised',
      fear: 'text-emotion-fear',
      disgust: 'text-emotion-disgust'
    };
    
    return colorMap[emotion] || 'text-gray-400';
  };

  const getEmotionEmoji = (emotion: Emotion): string => {
    const emojiMap: Record<Emotion, string> = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      neutral: '😐',
      surprised: '😮',
      fear: '😨',
      disgust: '🤢'
    };
    
    return emojiMap[emotion] || '❓';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotion Analysis</CardTitle>
        <CardDescription>
          {isActive 
            ? "Real-time emotion detection from facial expressions" 
            : "Start the camera to begin emotion detection"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {dominantEmotion ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Dominant Emotion</h3>
              <span className={cn("text-sm font-semibold", getEmotionTextColor(dominantEmotion.emotion))}>
                {dominantEmotion.confidence}%
              </span>
            </div>
            <div className={cn("p-4 rounded-lg flex items-center justify-between animate-pulse-emotion", getEmotionColor(dominantEmotion.emotion))}>
              <span className="text-4xl">{getEmotionEmoji(dominantEmotion.emotion)}</span>
              <span className="text-2xl font-bold text-white capitalize">{dominantEmotion.emotion}</span>
            </div>
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center text-muted-foreground">
            {isActive ? "Analyzing..." : "No emotion detected"}
          </div>
        )}

        <div className="space-y-3 mt-4">
          <h3 className="text-lg font-medium mb-3">All Emotions</h3>
          {emotions.length > 0 ? (
            emotions.map((emotion, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="capitalize flex items-center">
                    <span className="mr-2">{getEmotionEmoji(emotion.emotion)}</span>
                    {emotion.emotion}
                  </span>
                  <span className="text-xs text-muted-foreground">{emotion.confidence}%</span>
                </div>
                <Progress 
                  value={emotion.confidence} 
                  className={cn("h-2", getEmotionColor(emotion.emotion))} 
                />
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {isActive ? "Loading emotion data..." : "Turn on the camera to detect emotions"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionDetector;
