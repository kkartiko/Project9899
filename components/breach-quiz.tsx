"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Shield, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
  id: number
  type: "multiple-choice" | "true-false" | "slider" | "matching"
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  tip: string
  sliderConfig?: {
    min: number
    max: number
    step: number
    unit: string
  }
  matchingPairs?: { company: string; impact: string; correct: string }[]
}

const questions: Question[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "Which company had the highest breach impact in our dataset?",
    options: ["T-Mobile", "Meta/Facebook", "Robinhood", "Medibank"],
    correctAnswer: "Meta/Facebook",
    explanation:
      "Meta/Facebook had the highest impact with over $6B in settlements and penalties from various privacy breaches and regulatory fines.",
    tip: "💡 Large tech companies often face higher penalties due to their massive user bases and stricter regulatory oversight.",
  },
  {
    id: 2,
    type: "true-false",
    question: "True or False: A breach's total impact includes penalties, settlements, and indirect costs.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation:
      "Breach impacts go far beyond immediate costs, including regulatory fines, legal settlements, reputation damage, customer churn, and operational disruption.",
    tip: "🔍 The hidden costs of breaches (reputation, customer trust, operational disruption) often exceed the direct financial penalties.",
  },
  {
    id: 3,
    type: "slider",
    question: "Guess the total combined impact of all major breaches in our dataset:",
    correctAnswer: 8.3,
    sliderConfig: {
      min: 1,
      max: 15,
      step: 0.1,
      unit: "B",
    },
    explanation:
      "The total impact across all major breaches in our dataset is $8.3 billion, highlighting the massive financial consequences of cybersecurity failures.",
    tip: "📊 Breach costs have increased 12% year-over-year, making cybersecurity investment more critical than ever.",
  },
  {
    id: 4,
    type: "multiple-choice",
    question: "What percentage of breaches involve human error or social engineering?",
    options: ["25%", "45%", "65%", "85%"],
    correctAnswer: "85%",
    explanation:
      "Studies show that 85% of breaches involve human elements, whether through social engineering, phishing, or simple mistakes.",
    tip: "👥 Employee training and awareness programs are your first line of defense against cyber threats.",
  },
  {
    id: 5,
    type: "true-false",
    question: "True or False: Small businesses are less likely to be targeted by cybercriminals.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation:
      "Small businesses are actually more likely to be targeted because they often have weaker security measures while still having valuable data.",
    tip: "🏢 43% of cyberattacks target small businesses, but only 14% are prepared to defend themselves.",
  },
]

interface BreachQuizProps {
  onComplete: (score: number) => void
}

export function BreachQuiz({ onComplete }: BreachQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(string | number)[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [sliderValue, setSliderValue] = useState([5])

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (answer: string | number) => {
    if (showAnswer) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answer
    setSelectedAnswers(newAnswers)
    setShowAnswer(true)

    // Check if answer is correct
    let isCorrect = false
    if (question.type === "slider") {
      const tolerance = 0.5
      isCorrect = Math.abs((answer as number) - (question.correctAnswer as number)) <= tolerance
    } else {
      isCorrect = answer === question.correctAnswer
    }

    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setShowAnswer(false)
      setSliderValue([5]) // Reset slider
    } else {
      setIsComplete(true)
    }
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return { message: "Cybersecurity Expert! 🛡️", color: "text-green-500" }
    if (percentage >= 60) return { message: "Security Conscious! 🔒", color: "text-blue-500" }
    if (percentage >= 40) return { message: "Getting There! ⚠️", color: "text-yellow-500" }
    return { message: "Keep Learning! 📚", color: "text-red-500" }
  }

  const retakeQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowAnswer(false)
    setScore(0)
    setIsComplete(false)
    setSliderValue([5])
  }

  if (isComplete) {
    const scoreMessage = getScoreMessage()
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription>Here's how you performed on cybersecurity knowledge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {score}/{questions.length}
              </div>
              <div className={cn("text-lg font-semibold", scoreMessage.color)}>{scoreMessage.message}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {Math.round((score / questions.length) * 100)}% correct
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Knowledge Level</div>
                  <div className="text-sm text-muted-foreground">
                    You're {score >= 4 ? "well-prepared" : "building awareness"} for cybersecurity challenges
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium">Key Takeaway</div>
                  <div className="text-sm text-muted-foreground">
                    Cyber threats cost businesses $8.3B+ annually. Stay informed and protected!
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={retakeQuiz} className="flex-1 bg-transparent">
                Retake Quiz
              </Button>
              <Button onClick={() => onComplete(score)} className="flex-1">
                Explore Breach Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Score: {score}/{currentQuestion + (showAnswer ? 1 : 0)}
            </div>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-xl">{question.question}</CardTitle>
          <CardDescription>Test your cybersecurity knowledge before exploring real breach data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {question.type === "multiple-choice" || question.type === "true-false" ? (
            <div className="grid gap-3">
              {question.options?.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === option
                const isCorrect = option === question.correctAnswer
                const showCorrect = showAnswer && isCorrect
                const showIncorrect = showAnswer && isSelected && !isCorrect

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={cn(
                      "justify-start h-auto p-4 text-left",
                      showCorrect && "border-green-500 bg-green-50 text-green-700",
                      showIncorrect && "border-red-500 bg-red-50 text-red-700",
                      isSelected && !showAnswer && "border-primary bg-primary/5",
                    )}
                    onClick={() => handleAnswer(option)}
                    disabled={showAnswer}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-shrink-0">
                        {showCorrect && <CheckCircle className="h-5 w-5" />}
                        {showIncorrect && <XCircle className="h-5 w-5" />}
                        {!showAnswer && <div className="w-5 h-5 rounded-full border-2 border-current" />}
                      </div>
                      <span>{option}</span>
                    </div>
                  </Button>
                )
              })}
            </div>
          ) : question.type === "slider" ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  ${sliderValue[0]}
                  {question.sliderConfig?.unit}
                </div>
                <div className="text-sm text-muted-foreground">Drag to select your estimate</div>
              </div>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={question.sliderConfig?.max}
                min={question.sliderConfig?.min}
                step={question.sliderConfig?.step}
                className="w-full"
                disabled={showAnswer}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  ${question.sliderConfig?.min}
                  {question.sliderConfig?.unit}
                </span>
                <span>
                  ${question.sliderConfig?.max}
                  {question.sliderConfig?.unit}
                </span>
              </div>
              {!showAnswer && (
                <Button onClick={() => handleAnswer(sliderValue[0])} className="w-full">
                  Submit Answer
                </Button>
              )}
            </div>
          ) : null}

          {showAnswer && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-2">Explanation</div>
                    <p className="text-sm text-muted-foreground mb-3">{question.explanation}</p>
                    <div className="text-sm font-medium text-primary">{question.tip}</div>
                  </div>
                </div>
              </div>

              <Button onClick={nextQuestion} className="w-full">
                {currentQuestion < questions.length - 1 ? "Next Question" : "View Results"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
