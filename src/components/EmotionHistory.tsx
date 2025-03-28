import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { EmotionData, Emotion } from './EmotionDetector';
import { useIsMobile } from '@/hooks/use-mobile';

interface EmotionHistoryProps {
  isActive: boolean;
  dominantEmotion: EmotionData | null;
}

interface EmotionHistoryData {
  timestamp: number;
  emotion: Emotion;
  confidence: number;
}

interface EmotionCount {
  name: string;
  count: number;
  color: string;
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({ isActive, dominantEmotion }) => {
  const [history, setHistory] = useState<EmotionHistoryData[]>([]);
  const [aggregatedData, setAggregatedData] = useState<EmotionCount[]>([]);
  const isMobile = useIsMobile();

  // Add dominant emotion to history
  useEffect(() => {
    if (isActive && dominantEmotion) {
      setHistory(prev => {
        // Keep only the last 50 emotions for performance
        const newHistory = [...prev, {
          timestamp: Date.now(),
          emotion: dominantEmotion.emotion,
          confidence: dominantEmotion.confidence
        }];
        
        if (newHistory.length > 50) {
          return newHistory.slice(newHistory.length - 50);
        }
        
        return newHistory;
      });
    }
  }, [dominantEmotion, isActive]);

  // Aggregate history data for chart
  useEffect(() => {
    const emotionCounts: Record<string, number> = {};
    const emotionColors: Record<string, string> = {
      happy: '#FFC107',
      sad: '#64B5F6',
      angry: '#EF5350',
      neutral: '#B0BEC5',
      surprised: '#AB47BC',
      fear: '#7E57C2',
      disgust: '#66BB6A'
    };
    
    history.forEach(item => {
      const emotion = item.emotion;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
    
    const data = Object.keys(emotionCounts).map(emotion => ({
      name: emotion,
      count: emotionCounts[emotion],
      color: emotionColors[emotion as Emotion] || '#ccc'
    }));
    
    setAggregatedData(data);
  }, [history]);
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow text-sm">
          <p className="capitalize font-semibold">{data.name}</p>
          <p>Count: <span className="font-bold">{data.count}</span></p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotion History</CardTitle>
        <CardDescription>
          Tracking detected emotions over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={aggregatedData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  name="Frequency" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={500}
                  // Use the emotion-specific color for each bar
                  fill={(data) => data.color}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            {isActive 
              ? "Waiting for emotion data..." 
              : "No emotion history available. Start the camera to begin tracking."}
          </div>
        )}
        
        {history.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground text-right">
            Tracking {history.length} recent emotion{history.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
