"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Progress } from "../../components/ui/progress"
import { Brain, Clock, Pause, Play, SkipForward, RefreshCw } from 'lucide-react'

export default function ExercisesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Relief Exercises</h1>
        <p className="text-muted-foreground">
          Quick exercises to help you relax, refocus, and reduce stress during your workday.
        </p>
      </div>

      <Tabs defaultValue="breathing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breathing">Breathing</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="stretching">Stretching</TabsTrigger>
        </TabsList>

        <TabsContent value="breathing" className="space-y-4">
          <BreathingExercise />

          <ExerciseCard 
            title="4-7-8 Breathing"
            description="A breathing pattern that can help reduce anxiety and help you sleep"
            duration={180}
            instructions={[
              "Exhale completely through your mouth",
              "Close your mouth and inhale through your nose for 4 seconds",
              "Hold your breath for 7 seconds",
              "Exhale completely through your mouth for 8 seconds",
              "Repeat this cycle 3-4 times"
            ]}
          />

          <ExerciseCard 
            title="Box Breathing"
            description="A simple technique to help you regain focus and calm"
            duration={160}
            instructions={[
              "Inhale through your nose for 4 seconds",
              "Hold your breath for 4 seconds",
              "Exhale through your mouth for 4 seconds",
              "Hold your breath for 4 seconds",
              "Repeat this cycle 4-5 times"
            ]}
          />
        </TabsContent>

        <TabsContent value="meditation" className="space-y-4">
          <ExerciseCard 
            title="Quick Focus Meditation"
            description="A 5-minute meditation to help you regain focus and clarity"
            duration={300}
            instructions={[
              "Find a comfortable seated position",
              "Close your eyes and take a few deep breaths",
              "Focus on your breathing, noticing the sensation of air moving in and out",
              "When your mind wanders, gently bring your attention back to your breath",
              "Continue for 5 minutes"
            ]}
          />

          <ExerciseCard 
            title="Body Scan Relaxation"
            description="A progressive relaxation technique to release tension"
            duration={420}
            instructions={[
              "Sit or lie down in a comfortable position",
              "Close your eyes and take a few deep breaths",
              "Starting from your toes, focus your attention on each part of your body",
              "Notice any tension and consciously relax that area",
              "Gradually move up through your entire body"
            ]}
          />
        </TabsContent>

        <TabsContent value="stretching" className="space-y-4">
          <GuidedStretchExercise />

          <ExerciseCard 
            title="Eye Strain Relief"
            description="Exercises to reduce eye fatigue from screen time"
            duration={180}
            sections={[
              {
                title: "20-20-20 Rule",
                description: "Every 20 minutes, look at something 20 feet away for 20 seconds."
              },
              {
                title: "Eye Rolling",
                description: "Helps relax eye muscles and reduce strain.",
                steps: [
                  "Close your eyes",
                  "Slowly roll your eyes in a clockwise direction",
                  "Complete 5-10 circles",
                  "Repeat in the counter-clockwise direction"
                ]
              },
              {
                title: "Palming",
                description: "Provides complete rest for your eyes.",
                steps: [
                  "Rub your palms together to warm them",
                  "Place your warm palms over your closed eyes",
                  "Make sure no light enters your eyes",
                  "Hold for 30-60 seconds while breathing deeply"
                ]
              }
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

function ExerciseCard({ title, description, duration, instructions, sections }) {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          // Update progress percentage
          setProgress(((duration - newTime) / duration) * 100);
          
          // Update current step based on progress
          if (instructions) {
            const stepDuration = duration / instructions.length;
            setCurrentStep(Math.min(
              Math.floor((duration - newTime) / stepDuration), 
              instructions.length - 1
            ));
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, duration, instructions]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(duration);
    setProgress(0);
    setCurrentStep(0);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {instructions && (
          <div className="mb-6">
            <ol className="list-decimal list-inside space-y-2">
              {instructions.map((instruction, index) => (
                <li key={index} className={currentStep === index && isActive ? "font-bold text-primary" : ""}>
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        )}
        
        {sections && (
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={index}>
                <h3 className="font-medium mb-1">{section.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {section.description}
                </p>
                {section.steps && (
                  <ol className="list-decimal list-inside text-sm">
                    {section.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{formatTime(timeRemaining)}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{formatTime(duration)}</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button onClick={toggleTimer}>
            {isActive ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function BreathingExercise() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("Get Ready");
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const totalTime = 120;
  
  // Phase durations in seconds
  const phaseDurations = {
    "Inhale": 4,
    "Hold": 4, 
    "Exhale": 4,
    "Rest": 2
  };
  
  const phaseOrder = ["Inhale", "Hold", "Exhale", "Rest"];
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTime, setPhaseTime] = useState(phaseDurations[phaseOrder[0]]);
  
  useEffect(() => {
    let interval = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            setPhase("Complete");
            return 0;
          }
          return prev - 1;
        });
        
        setProgress(((totalTime - timeRemaining + 1) / totalTime) * 100);
        
        // Handle phase transitions
        setPhaseTime(prev => {
          if (prev <= 1) {
            // Move to next phase
            setCurrentPhaseIndex(prevIndex => {
              const nextIndex = (prevIndex + 1) % phaseOrder.length;
              setPhase(phaseOrder[nextIndex]);
              return nextIndex;
            });
            return phaseDurations[phaseOrder[(currentPhaseIndex + 1) % phaseOrder.length]];
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, currentPhaseIndex, phaseOrder]);
  
  const togglePlay = () => {
    if (!isPlaying && timeRemaining === 0) {
      // Reset if completed
      setTimeRemaining(totalTime);
      setProgress(0);
      setPhase("Get Ready");
      setCurrentPhaseIndex(0);
      setPhaseTime(phaseDurations[phaseOrder[0]]);
    }
    setIsPlaying(!isPlaying);
    if (!isPlaying && phase === "Get Ready") {
      setPhase(phaseOrder[0]);
    }
  };
  
  const resetExercise = () => {
    setIsPlaying(false);
    setProgress(0);
    setPhase("Get Ready");
    setTimeRemaining(totalTime);
    setCurrentPhaseIndex(0);
    setPhaseTime(phaseDurations[phaseOrder[0]]);
  };

  // Calculate the scale factor for the breathing animation
  const getScaleFactor = () => {
    if (phase === "Inhale") {
      return 1 + (1 - (phaseTime / phaseDurations["Inhale"])) * 0.5;
    } else if (phase === "Exhale") {
      return 1.5 - (1 - (phaseTime / phaseDurations["Exhale"])) * 0.5;
    } else {
      return phase === "Complete" ? 1 : 1.5;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Deep Breathing Exercise
        </CardTitle>
        <CardDescription>A guided breathing exercise to help you relax and reduce stress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div 
              className={`absolute inset-0 rounded-full border-4 ${isPlaying ? "transition-all duration-1000" : ""}`} 
              style={{ 
                transform: `scale(${getScaleFactor()})`,
                borderColor: phase === "Inhale" ? "rgb(34, 197, 94)" : 
                             phase === "Exhale" ? "rgb(239, 68, 68)" : 
                             phase === "Hold" ? "rgb(59, 130, 246)" :
                             phase === "Rest" ? "rgb(168, 85, 247)" : "rgb(156, 163, 175)"
              }}
            />
            <div className="text-4xl font-light">{phase}</div>
            {phase !== "Get Ready" && phase !== "Complete" && (
              <div className="text-lg mt-12">{phaseTime}s</div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Time Remaining</span>
            <span>{formatTime(timeRemaining)}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">2 minutes</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={resetExercise}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button onClick={togglePlay}>
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {timeRemaining === 0 ? "Restart" : "Start"}
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function GuidedStretchExercise() {
  const exercises = [
    {
      title: "Neck Stretch",
      description: "Relieves tension in the neck and upper shoulders.",
      duration: 30,
      steps: [
        "Sit up straight in your chair",
        "Slowly tilt your head toward your right shoulder",
        "Hold for 15 seconds",
        "Return to center",
        "Repeat on the left side"
      ]
    },
    {
      title: "Wrist and Finger Stretch",
      description: "Helps prevent carpal tunnel and relieves typing strain.",
      duration: 30,
      steps: [
        "Extend your right arm with palm up",
        "Use your left hand to gently pull fingers back",
        "Hold for 15 seconds",
        "Release and shake out your hand",
        "Repeat with the other hand"
      ]
    },
    {
      title: "Seated Spinal Twist",
      description: "Relieves lower back tension and improves spinal mobility.",
      duration: 40,
      steps: [
        "Sit sideways in your chair",
        "Twist your torso toward the back of the chair",
        "Hold the back of the chair for a deeper stretch",
        "Hold for 20 seconds",
        "Release and switch sides"
      ]
    }
  ];

  const [isActive, setIsActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(exercises[0].duration);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Calculate total duration of all exercises
  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(totalDuration);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        // Update current exercise time
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next exercise
            if (currentExerciseIndex < exercises.length - 1) {
              setCurrentExerciseIndex(prevIndex => {
                const nextIndex = prevIndex + 1;
                setTimeRemaining(exercises[nextIndex].duration);
                setCurrentStepIndex(0);
                return nextIndex;
              });
            } else {
              // All exercises completed
              setIsActive(false);
              return 0;
            }
            return 0;
          }
          return prev - 1;
        });
        
        // Update total time
        setTotalTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(interval);
            return 0;
          }
          
          // Update progress percentage
          setProgress(((totalDuration - newTime) / totalDuration) * 100);
          return newTime;
        });
        
        // Update current step based on time distribution within exercise
        const currentExercise = exercises[currentExerciseIndex];
        if (currentExercise) {
          const stepDuration = currentExercise.duration / currentExercise.steps.length;
          const elapsedTime = currentExercise.duration - timeRemaining;
          setCurrentStepIndex(
            Math.min(Math.floor(elapsedTime / stepDuration), currentExercise.steps.length - 1)
          );
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, currentExerciseIndex, exercises, totalTimeRemaining, totalDuration]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
    
    // If restarting after completion
    if (!isActive && totalTimeRemaining === 0) {
      resetTimer();
    }
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setCurrentExerciseIndex(0);
    setTimeRemaining(exercises[0].duration);
    setTotalTimeRemaining(totalDuration);
    setProgress(0);
    setCurrentStepIndex(0);
  };
  
  const currentExercise = exercises[currentExerciseIndex];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desk Stretches</CardTitle>
        <CardDescription>Guided stretches to relieve tension while at your desk</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium text-lg mb-1">
            {currentExercise ? `${currentExerciseIndex + 1}/${exercises.length}: ${currentExercise.title}` : "Complete"}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {currentExercise ? currentExercise.description : "Great job completing all stretches!"}
          </p>
          
          {currentExercise && (
            <div className="ml-4">
              <ol className="list-decimal space-y-1">
                {currentExercise.steps.map((step, index) => (
                  <li key={index} className={index === currentStepIndex && isActive ? "font-bold text-primary" : ""}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          <div className="mt-4 text-center text-lg font-medium">
            {isActive ? `${timeRemaining}s` : totalTimeRemaining === 0 ? "Complete!" : "Ready"}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{formatTime(totalTimeRemaining)}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{formatTime(totalDuration)}</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button onClick={toggleTimer}>
            {isActive ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {totalTimeRemaining === 0 ? "Restart" : "Start"}
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}