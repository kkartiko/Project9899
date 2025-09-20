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
    question: "Which company in the ones listed had the highest financial impact from a breach?",
    options: ["Optus", "T-Mobile", "Medibank", "Latitude"],
    correctAnswer: "Optus",
    explanation:
      "Optus had the highest financial impact out of all of them. Their breach cost over $1.5 billion, primarily due to brand damage and regulatory action. (Queensland Government 2022, Optus data breach, Queensland Government.)",
    tip: "💡 Brand damage can often outweigh direct remediation costs in large-scale breaches.",
  },
  {
    id: 2,
    type: "true-false",
    question: "True or False: The Optus breach in 2022 had a total impact of over $1.64 billion.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation:
      "The breach affected 10 million customers and caused a total impact of $1.64 billion, including brand value loss and penalties.",
    tip: "🔍 When a breach involves sensitive customer data, it can severely affect the company’s reputation and financial stability.",
  },
  {
    id: 2,
    type: "true-false",
    question: "True or False: The Latitude data breach in 2023 had a total projected impact of $76 million.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation:
      "The total financial impact of the 2023 Latitude breach had a projected impact of $76 million due to lost revenue and operational disruptions. (Sadler, D 2023, Data breach cost Latitude $76 million, Information Age.)",
    tip: "💡 Operational disruptions and lost revenue can significantly add to the total financial impact of a data breach.",
  },
  {
    id: 3,
    type: "slider",
    question: "Guess the total impact of the 2021 T-Mobile breach (including settlements and penalties):",
    correctAnswer: 381.5,
    sliderConfig: {
      min: 1,
      max: 500,
      step: 1,
      unit: "M",
    },
    explanation:
      "The total impact of the T-Mobile breach, including a $31.5 million settlement with the FCC and $350 million in class action settlements, is over $381 million. (T-Mobile’s $350M Settlement and the Future of Data Breach Consequences | InformationWeek n.d., www.informationweek.com.)",
    tip: "📊 Breaches at major companies can lead to settlements that far exceed the initial cost of a breach due to long-term repercussions.",
  },
  {
    id: 4,
    type: "multiple-choice",
    question: "Which company had the breach that exposed the highest number of sensitive documents (such as passport and Medicare numbers)?",
    options: ["T-Mobile", "Medibank", "Latitude", "Optus"],
    correctAnswer: "Medibank",
    explanation:
      "Medibank’s 2022 ransomware attack exposed personal and medical data of 9.7 million Australians, including sensitive medical records. (Queensland Government 2022, Medibank Private cyber incident, Qld.gov.au.)",
    tip: "🛡️ Ransomware attacks often target highly sensitive personal information, leading to both financial and reputational damage.",
  },
  {
    id: 5,
    type: "true-false",
    question: "True or False: Robinhood's breach in 2021 was caused by a traditional data breach, where hackers gained unauthorized access to their network.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation:
      "The breach was caused by a social engineering attack where a customer service employee was tricked into providing access to internal support systems. (BBC News 2021, ‘Robinhood trading app hit by data breach affecting seven million’)",
    tip: "💡 Social engineering can be even more dangerous than technical breaches, as it targets human vulnerabilities.",
  },
];

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
