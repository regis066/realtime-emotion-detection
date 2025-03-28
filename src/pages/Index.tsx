
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebcamCapture from '@/components/WebcamCapture';
import EmotionDetector, { EmotionData } from '@/components/EmotionDetector';
import EmotionHistory from '@/components/EmotionHistory';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Info, Camera, ChartBar, BrainCircuit } from 'lucide-react';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentImageData, setCurrentImageData] = useState<ImageData | undefined>(undefined);
  const [dominantEmotion, setDominantEmotion] = useState<EmotionData | null>(null);
  
  const handleFrame = useCallback((imageData: ImageData) => {
    setCurrentImageData(imageData);
  }, []);
  
  const toggleCamera = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="py-6 px-4 sm:px-6 md:px-8 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-950/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <BrainCircuit size={28} className="text-purple-600 mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">EmotionSense</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center sm:text-right">
            Real-time emotion detection powered by AI
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Webcam Feed</CardTitle>
                <CardDescription>
                  Start the camera to begin emotion detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WebcamCapture 
                  onFrame={handleFrame} 
                  isActive={isActive} 
                  onToggle={toggleCamera} 
                />
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Info size={14} className="mr-1" />
                  {isActive 
                    ? "Your webcam feed is being analyzed in real-time" 
                    : "Your privacy is important. No data is stored or sent to external servers."}
                </div>
              </CardFooter>
            </Card>
            
            <EmotionHistory isActive={isActive} dominantEmotion={dominantEmotion} />
          </div>
          
          <div className="space-y-6">
            <Tabs defaultValue="detection" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="detection" className="flex items-center">
                  <Camera size={14} className="mr-1" /> Detector
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center">
                  <ChartBar size={14} className="mr-1" /> Stats
                </TabsTrigger>
              </TabsList>
              <TabsContent value="detection">
                <EmotionDetector 
                  imageData={currentImageData} 
                  isActive={isActive}
                />
              </TabsContent>
              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle>Emotion Statistics</CardTitle>
                    <CardDescription>
                      Analysis of your emotional patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        This feature is coming soon in the next update!
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        We'll provide detailed analytics and patterns from your emotion data.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Understanding the emotion detection process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">1. Facial Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    The system identifies faces in the video stream using computer vision algorithms.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-medium">2. Feature Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Key facial features are extracted and analyzed to identify emotional expressions.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-medium">3. Emotion Classification</h3>
                  <p className="text-sm text-muted-foreground">
                    A trained machine learning model classifies the expressions into distinct emotions.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled={true}>
                  <BrainCircuit size={14} className="mr-2" />
                  View Technical Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="mt-12 py-6 px-4 sm:px-6 md:px-8 border-t bg-white/50 dark:bg-gray-950/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>EmotionSense Sculptor &copy; {new Date().getFullYear()} - AI-Powered Emotion Detection</p>
          <p className="mt-1">For demonstration purposes only - Using simulated emotion detection</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
