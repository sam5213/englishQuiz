import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/ui/dialog'
import { Label } from './components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'

const questions = [
  {
    question: "What's your primary goal for learning English?",
    questionRu: "Какова ваша основная цель изучения английского языка?",
    answers: [
      { en: "For work", ru: "Для работы", gif: "https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif" },
      { en: "For travel", ru: "Для путешествий", gif: "https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif" },
      { en: "For education", ru: "Для образования", gif: "https://media.giphy.com/media/3oKIPnbKgN3bXeVpvy/giphy.gif" },
      { en: "For fun", ru: "Для развлечения", gif: "https://media.giphy.com/media/3oKIPwei3AJHhQy2Ys/giphy.gif" }
    ],
    category: "purpose",
    multiSelect: true
  },
  // ... (other questions remain the same)
]

function EnglishQuiz() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({})
  const [results, setResults] = useState<Record<string, string[]>>({})
  const [showResult, setShowResult] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ru'>('ru')
  const [showBooking, setShowBooking] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const navigate = useNavigate()

  const startQuiz = () => {
    setQuizStarted(true)
    navigate('/quiz')
  }

  const handleAnswerSelect = (answer: string) => {
    const currentAnswers = selectedAnswers[questions[currentQuestion].category] || []
    let updatedAnswers

    if (questions[currentQuestion].multiSelect) {
      updatedAnswers = currentAnswers.includes(answer)
        ? currentAnswers.filter(a => a !== answer)
        : [...currentAnswers, answer]
    } else {
      updatedAnswers = [answer]
    }

    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestion].category]: updatedAnswers
    })
  }

  const handleNextQuestion = () => {
    setResults({
      ...results,
      [questions[currentQuestion].category]: selectedAnswers[questions[currentQuestion].category] || []
    })

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswers({})
    } else {
      setShowResult(true)
      sendResultsToAdmin()
      navigate('/results')
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setResults({})
    setShowResult(false)
    navigate('/')
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en')
  }

  const analyzeResults = () => {
    let recommendation = ""
    if (results.purpose?.includes("For work")) {
      recommendation += "We recommend our Business English course. "
    } else if (results.purpose?.includes("For travel")) {
      recommendation += "Our Conversational English course would be perfect for you. "
    }

    if (results.level?.includes("Beginner") || results.level?.includes("Intermediate")) {
      recommendation += "We'll focus on building your foundational skills. "
    } else {
      recommendation += "We'll help you refine your advanced skills. "
    }

    if (results.challenge?.includes("Grammar")) {
      recommendation += "Our lessons will have a strong focus on grammar exercises. "
    } else if (results.challenge?.includes("Pronunciation")) {
      recommendation += "We'll incorporate plenty of pronunciation practice. "
    }

    return recommendation
  }

  const handleBookLesson = () => {
    setShowBooking(true)
  }

  const confirmBooking = async () => {
    if (selectedDate && selectedTime) {
      console.log(`Booking confirmed for ${selectedDate.toDateString()} at ${selectedTime}`)

      // Here we would typically send this data to a backend
      // For GitHub Pages, we'll use a mock API call
      await mockSendToTelegram('booking', `New lesson booked for ${selectedDate.toDateString()} at ${selectedTime}`)

      setShowBooking(false)
      alert("Your lesson has been booked! Check your Telegram for details.")
    }
  }

  const sendResultsToAdmin = async () => {
    const resultSummary = Object.entries(results)
      .map(([category, answers]) => `${category}: ${answers.join(', ')}`)
      .join('\n')

    // Here we would typically send this data to a backend
    // For GitHub Pages, we'll use a mock API call
    await mockSendToTelegram('quiz_results', `New quiz results:\n${resultSummary}`)
  }

  // Mock function to simulate sending messages to Telegram
  const mockSendToTelegram = async (type: string, message: string) => {
    console.log(`Mock Telegram message (${type}):`, message)
    // In a real scenario, you would send this data to a serverless function or external API
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <Star className="absolute top-[10%] left-[10%] text-[#2196F3] w-6 h-6 animate-pulse" />
        <Sparkles className="absolute top-[20%] right-[20%] text-[#2196F3] w-8 h-8 animate-pulse" />
        <Star className="absolute bottom-[15%] left-[30%] text-[#2196F3] w-4 h-4 animate-pulse" />
        <Sparkles className="absolute bottom-[25%] right-[15%] text-[#2196F3] w-6 h-6 animate-pulse" />
      </div>

      <Card className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8">
        <Routes>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-8">
                <img src="/english-quiz-hero.svg" alt="English Quiz" width={200} height={200} className="mx-auto" />
              </div>
              <h1 className="text-4xl font-bold mb-6 text-[#2196F3]">English Quiz</h1>
              <p className="text-gray-600 mb-8">
                {language === 'en'
                  ? "Test your English skills and get a personalized learning plan"
                  : "Проверьте свой английский и получите персонализированный план обучения"}
              </p>
              <Button
                onClick={startQuiz}
                className="w-full bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-full py-6 text-xl font-semibold transition-all duration-300"
              >
                {language === 'en' ? "Start Quiz" : "Начать тест"}
              </Button>
            </motion.div>
          } />
          <Route path="/quiz" element={
            <div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm text-gray-500">
                  {language === 'en' ? "Question" : "Вопрос"} {currentQuestion + 1}/{questions.length}
                </span>
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className="text-[#2196F3]"
                >
                  {language === 'en' ? "РУС" : "ENG"}
                </Button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold mb-6 text-[#2196F3]">
                    {language === 'en'
                      ? questions[currentQuestion].question
                      : questions[currentQuestion].questionRu}
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    {questions[currentQuestion].answers.map((answer, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`cursor-pointer rounded-xl overflow-hidden shadow-md ${
                          selectedAnswers[questions[currentQuestion].category]?.includes(answer.en)
                            ? 'ring-4 ring-[#2196F3]'
                            : ''
                        }`}
                        onClick={() => handleAnswerSelect(answer.en)}
                      >
                        <div className="relative aspect-video">
                          <img
                            src={answer.gif}
                            alt={answer.en}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 bg-white">
                          <p className="text-center font-semibold">
                            {language === 'en' ? answer.en : answer.ru}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 0}
                      className="flex items-center space-x-2 text-[#2196F3]"
                      variant="ghost"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{language === 'en' ? "Previous" : "Назад"}</span>
                    </Button>
                    <Button
                      onClick={handleNextQuestion}
                      className="flex items-center space-x-2 bg-[#2196F3] hover:bg-[#1976D2] text-white"
                    >
                      <span>{language === 'en' ? "Next" : "Далее"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          } />
          <Route path="/results" element={
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-8">
                <img src="/english-quiz-result.svg" alt="Quiz Result" width={200} height={200} className="mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-[#2196F3]">
                {language === 'en' ? "Your Personalized Learning Plan" : "Ваш персонализированный план обучения"}
              </h2>
              <p className="text-xl mb-6 text-gray-600">
                {analyzeResults()}
              </p>
              <Button
                onClick={handleBookLesson}
                className="w-full bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-full py-4 text-xl font-semibold transition-all duration-300 mb-4"
              >
                {language === 'en' ? "Book Your Free Lesson Now" : "Забронировать бесплатный урок"}
              </Button>
              <Button
                onClick={resetQuiz}
                className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full py-4 text-xl font-semibold transition-all duration-300"
              >
                {language === 'en' ? "Retake Quiz" : "Пройти тест заново"}
              </Button>
            </motion.div>
          } />
        </Routes>
      </Card>
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'en' ? "Book Your Free Lesson" : "Забронировать бесплатный урок"}</DialogTitle>
            <DialogDescription>
              {language === 'en' ? "Choose a date and time for your free English lesson." : "Выберите дату и время для вашего бесплатного урока английского языка."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                {language === 'en' ? "Date" : "Дата"}
              </Label>
              <input
                type="date"
                id="date"
                className="col-span-3"
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                {language === 'en' ? "Time" : "Время"}
              </Label>
              <Select onValueChange={setSelectedTime}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={language === 'en' ? "Select a time" : "Выберите время"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmBooking} disabled={!selectedDate || !selectedTime}>
              {language === 'en' ? "Confirm Booking" : "Подтвердить бронирование"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function App() {
  return (
    <Router>
      <EnglishQuiz />
    </Router>
  )
}

export default App

