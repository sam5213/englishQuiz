'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Sparkles, Star } from 'lucide-react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

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
  {
    question: "How would you rate your current English speaking skills?",
    questionRu: "Как бы вы оценили свои текущие разговорные навыки английского языка?",
    answers: [
      { en: "Beginner", ru: "Начинающий", gif: "https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif" },
      { en: "Intermediate", ru: "Средний", gif: "https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif" },
      { en: "Advanced", ru: "Продвинутый", gif: "https://media.giphy.com/media/3oKIPnbKgN3bXeVpvy/giphy.gif" },
      { en: "Fluent", ru: "Свободно владею", gif: "https://media.giphy.com/media/3oKIPwei3AJHhQy2Ys/giphy.gif" }
    ],
    category: "level",
    multiSelect: false
  },
  {
    question: "Which aspect of English do you find most challenging?",
    questionRu: "Какой аспект английского языка вы находите наиболее сложным?",
    answers: [
      { en: "Grammar", ru: "Грамматика", gif: "https://media.giphy.com/media/3o7btNNTPD746Dx2Ao/giphy.gif" },
      { en: "Vocabulary", ru: "Словарный запас", gif: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif" },
      { en: "Pronunciation", ru: "Произношение", gif: "https://media.giphy.com/media/3o7btNUUXBDTRB2N6E/giphy.gif" },
      { en: "Listening", ru: "Аудирование", gif: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif" }
    ],
    category: "challenge",
    multiSelect: true
  },
  {
    question: "How often do you practice English?",
    questionRu: "Как часто вы практикуете английский язык?",
    answers: [
      { en: "Daily", ru: "Ежедневно", gif: "https://media.giphy.com/media/3o7btNUUXBDTRB2N6E/giphy.gif" },
      { en: "Weekly", ru: "Еженедельно", gif: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif" },
      { en: "Monthly", ru: "Ежемесячно", gif: "https://media.giphy.com/media/3o7btNNTPD746Dx2Ao/giphy.gif" },
      { en: "Rarely", ru: "Редко", gif: "https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif" }
    ],
    category: "frequency",
    multiSelect: false
  },
  {
    question: "What type of English content do you engage with most?",
    questionRu: "С каким типом английского контента вы взаимодействуете чаще всего?",
    answers: [
      { en: "Movies/TV Shows", ru: "Фильмы/Сериалы", gif: "https://media.giphy.com/media/3o7btQ0NH6Kl8CxCfK/giphy.gif" },
      { en: "Books/Articles", ru: "Книги/Статьи", gif: "https://media.giphy.com/media/3o7btW1Js39uJ6Kae4/giphy.gif" },
      { en: "Music", ru: "Музыка", gif: "https://media.giphy.com/media/3o7btNUUXBDTRB2N6E/giphy.gif" },
      { en: "Social Media", ru: "Социальные сети", gif: "https://media.giphy.com/media/3o7btNNTPD746Dx2Ao/giphy.gif" }
    ],
    category: "content",
    multiSelect: true
  }
]

export default function EnglishQuiz() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({})
  const [results, setResults] = useState<Record<string, string[]>>({})
  const [showResult, setShowResult] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ru'>('ru')
  const [showBooking, setShowBooking] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)

  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    setLanguage(userLang.startsWith('ru') ? 'ru' : 'en');
  }, []);

  const startQuiz = () => {
    setQuizStarted(true)
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
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en')
  }

  const analyzeResults = () => {
    let recommendation = ""
    if (results.purpose?.includes("For work")) {
      recommendation += language === 'en' 
      ? "We recommend our Business English course. "
      : "Мы рекомендуем наш курс делового английского. ";
    } else if (results.purpose?.includes("For travel")) {
      recommendation += language === 'en'
      ? "Our Conversational English course would be perfect for you. "
      : "Наш курс разговорного английского идеально подойдет вам. ";
    }

    if (results.level?.includes("Beginner") || results.level?.includes("Intermediate")) {
      recommendation += language === 'en'
      ? "We'll focus on building your foundational skills. "
      : "Мы сосредоточимся на развитии ваших базовых навыков. ";
    } else {
      recommendation += language === 'en'
      ? "We'll help you refine your advanced skills. "
      : "Мы поможем вам усовершенствовать ваши продвинутые навыки. ";
    }

    if (results.challenge?.includes("Grammar")) {
      recommendation += language === 'en'
      ? "Our lessons will have a strong focus on grammar exercises. "
      : "Наши уроки будут иметь сильный акцент на грамматических упражнениях. ";
    } else if (results.challenge?.includes("Pronunciation")) {
      recommendation += language === 'en'
      ? "We'll incorporate plenty of pronunciation practice. "
      : "Мы включим много практики произношения. ";
    }

    return recommendation
  }

  const handleBookLesson = () => {
    setShowBooking(true)
  }

  const confirmBooking = async () => {
    if (selectedDate && selectedTime) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/sendToTelegram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            type: 'booking',
            message: `New lesson booked for ${selectedDate.toDateString()} at ${selectedTime}`
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to book lesson');
        }

        setShowBooking(false);
        alert(language === 'en' ? "Your lesson has been booked! Check your Telegram for details." : "Ваш урок забронирован! Проверьте Telegram для получения деталей.");
      } catch (error) {
        console.error('Error booking lesson:', error);
        alert(language === 'en' ? "Failed to book lesson. Please try again." : "Не удалось забронировать урок. Пожалуйста, попробуйте снова.");
      }
    }
  }

  const sendResultsToAdmin = async () => {
    const resultSummary = Object.entries(results)
      .map(([category, answers]) => `${category}: ${answers.join(', ')}`)
      .join('\n')

    try {
      const response = await fetch(`${BACKEND_URL}/api/sendToTelegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          type: 'quiz_results',
          message: `New quiz results:\n${resultSummary}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send quiz results');
      }
    } catch (error) {
      console.error('Error sending quiz results:', error);
      // Optionally show an error message to the user
    }
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
        {!quizStarted && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <Image src="/english-quiz-hero.svg" alt="English Quiz" width={200} height={200} className="mx-auto" />
            </div>
            <h1 className="text-4xl font-bold mb-6 text-[#2196F3]">English Quiz</h1>
            <p className="text-gray-600 mb-8">
              {language === 'en'
                ? "Test your English skills and get a personalized learning plan"
                : "Проверьте свой английский и получите персонализированный план обучения"}
            </p>
            <Button
              onClick={() => setQuizStarted(true)}
              className="w-full bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-full py-6 text-xl font-semibold transition-all duration-300"
            >
              {language === 'en' ? "Start Quiz" : "Начать тест"}
            </Button>
          </motion.div>
        )}
        {quizStarted && !showResult && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm text-gray-500">
                {language === 'en' ? "Question" : "Вопрос"} {currentQuestion + 1}/{questions.length}
              </span>
              <Button
                variant="ghost"
                onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
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
                        <Image
                          src={answer.gif}
                          alt={answer.en}
                          layout="fill"
                          objectFit="cover"
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
        )}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-8">
              <Image src="/english-quiz-result.svg" alt="Quiz Result" width={200} height={200} className="mx-auto" />
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
        )}
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
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="col-span-3"
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

