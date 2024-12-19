const BACKEND_URL = 'https://a16e-2a03-d000-84a8-ca70-f8a9-5bf0-d6fa-36bf.ngrok-free.app';
let tg = window.Telegram.WebApp;
window.Telegram.WebApp.ready();

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
];

let state = {
    quizStarted: false,
    currentQuestion: 0,
    selectedAnswers: {},
    results: {},
    showResult: false,
    language: 'ru',
    showBooking: false,
    selectedDate: null,
    selectedTime: null
};

function setState(newState) {
    state = { ...state, ...newState };
    renderQuiz();
}

function startQuiz() {
    setState({ quizStarted: true });
}

function handleAnswerSelect(answer) {
    const question = questions[state.currentQuestion];
    const currentAnswers = state.selectedAnswers[question.category] || [];
    let updatedAnswers;

    if (question.multiSelect) {
        updatedAnswers = currentAnswers.includes(answer)
            ? currentAnswers.filter(a => a !== answer)
            : [...currentAnswers, answer];
    } else {
        updatedAnswers = [answer];
    }

    setState({
        selectedAnswers: {
            ...state.selectedAnswers,
            [question.category]: updatedAnswers
        }
    });
}

function handleNextQuestion() {
    const question = questions[state.currentQuestion];
    const updatedResults = {
        ...state.results,
        [question.category]: state.selectedAnswers[question.category] || []
    };

    if (state.currentQuestion < questions.length - 1) {
        setState({
            currentQuestion: state.currentQuestion + 1,
            results: updatedResults
        });
    } else {
        setState({
            showResult: true,
            results: updatedResults
        });
        sendResultsToAdmin();
    }
}

function handlePreviousQuestion() {
    if (state.currentQuestion > 0) {
        setState({ currentQuestion: state.currentQuestion - 1 });
    }
}

function resetQuiz() {
    setState({
        quizStarted: false,
        currentQuestion: 0,
        selectedAnswers: {},
        results: {},
        showResult: false
    });
}

function toggleLanguage() {
    setState({ language: state.language === 'en' ? 'ru' : 'en' });
}

function analyzeResults() {
    let recommendation = "";
    if (state.results.purpose && state.results.purpose.includes("For work")) {
        recommendation += state.language === 'en' 
            ? "We recommend our Business English course. "
            : "Мы рекомендуем наш курс делового английского. ";
    } else if (state.results.purpose && state.results.purpose.includes("For travel")) {
        recommendation += state.language === 'en'
            ? "Our Conversational English course would be perfect for you. "
            : "Наш курс разговорного английского идеально подойдет вам. ";
    }

    if (state.results.level && (state.results.level.includes("Beginner") || state.results.level.includes("Intermediate"))) {
        recommendation += state.language === 'en'
            ? "We'll focus on building your foundational skills. "
            : "Мы сосредоточимся на развитии ваших базовых навыков. ";
    } else {
        recommendation += state.language === 'en'
            ? "We'll help you refine your advanced skills. "
            : "Мы поможем вам усовершенствовать ваши продвинутые навыки. ";
    }

    if (state.results.challenge && state.results.challenge.includes("Grammar")) {
        recommendation += state.language === 'en'
            ? "Our lessons will have a strong focus on grammar exercises. "
            : "Наши уроки будут иметь сильный акцент на грамматических упражнениях. ";
    } else if (state.results.challenge && state.results.challenge.includes("Pronunciation")) {
        recommendation += state.language === 'en'
            ? "We'll incorporate plenty of pronunciation practice. "
            : "Мы включим много практики произношения. ";
    }

    return recommendation;
}

function handleBookLesson() {
    setState({ showBooking: true });
}

async function confirmBooking() {
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    
    if (dateInput && timeInput && dateInput.value && timeInput.value) {
        setState({
            selectedDate: new Date(dateInput.value),
            selectedTime: timeInput.value
        });
        
        try {
            tg.sendData('Бесплатный урок забронирован на: ' + state.selectedDate.toDateString() + ' ' + state.selectedTime);
            
            const response = await fetch(`${BACKEND_URL}/api/sendToTelegram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    type: 'booking',
                    message: `New lesson booked for ${state.selectedDate.toDateString()} at ${state.selectedTime}`
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to book lesson');
            }

            setState({ showBooking: false });
            alert(state.language === 'en' ? "Your lesson has been booked! Check your Telegram for details." : "Ваш урок забронирован! Проверьте Telegram для получения деталей.");
        } catch (error) {
            console.error('Error booking lesson:', error);
            alert(state.language === 'en' ? "Failed to book lesson. Please try again." : "Не удалось забронировать урок. Пожалуйста, попробуйте снова.");
        }
    } else {
        alert(state.language === 'en' ? "Please select both date and time." : "Пожалуйста, выберите дату и время.");
    }
}

async function sendResultsToAdmin() {
    const resultSummary = Object.entries(state.results)
        .map(([category, answers]) => `${category}: ${answers.join(', ')}`)
        .join('\n');

    tg.sendData('ACDtYD9FPZ5jZGFi', resultSummary);
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
    }
}

function renderQuiz() {
    const card = document.getElementById('card');
    card.innerHTML = '';

    if (!state.quizStarted && !state.showResult) {
        card.innerHTML = `
            <div class="text-center">
                <div class="mb-8">
                    <img src="/englishQuiz/english-quiz-hero.svg" alt="English Quiz" width="200" height="200" class="mx-auto">
                </div>
                <h1 class="text-4xl font-bold mb-6 text-primary">English Quiz</h1>
                <p class="text-gray-600 mb-8">
                    ${state.language === 'en'
                        ? "Test your English skills and get a personalized learning plan"
                        : "Проверьте свой английский и получите персонализированный план обучения"}
                </p>
                <button onclick="startQuiz()" class="w-full bg-primary hover:bg-primary-dark text-white rounded-full py-6 text-xl font-semibold transition-all duration-300">
                    ${state.language === 'en' ? "Start Quiz" : "Начать тест"}
                </button>
            </div>
        `;
    } else if (state.quizStarted && !state.showResult) {
        const question = questions[state.currentQuestion];
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-8">
                    <span class="text-sm text-gray-500">
                        ${state.language === 'en' ? "Question" : "Вопрос"} ${state.currentQuestion + 1}/${questions.length}
                    </span>
                    <button onclick="toggleLanguage()" class="text-primary">
                        ${state.language === 'en' ? "РУС" : "ENG"}
                    </button>
                </div>
                <h2 class="text-2xl font-bold mb-6 text-primary">
                    ${state.language === 'en' ? question.question : question.questionRu}
                </h2>
                <div class="grid grid-cols-2 gap-4">
                    ${question.answers.map((answer, index) => `
                        <div 
                            onclick="handleAnswerSelect('${answer.en}')"
                            class="cursor-pointer rounded-xl overflow-hidden shadow-md ${
                                state.selectedAnswers[question.category]?.includes(answer.en)
                                    ? 'ring-4 ring-primary'
                                    :''
                            }"
                        >
                            <div class="relative aspect-video">
                                <img src="${answer.gif}" alt="${answer.en}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div class="p-4 bg-white">
                                <p class="text-center font-semibold">
                                    ${state.language === 'en' ? answer.en : answer.ru}
                                </p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="flex justify-between pt-6">
                    <button 
                        onclick="handlePreviousQuestion()"
                        ${state.currentQuestion === 0 ? 'disabled' : ''}
                        class="text-primary"
                    >
                        ${state.language === 'en' ? "Previous" : "Назад"}
                    </button>
                    <button 
                        onclick="handleNextQuestion()"
                        class="bg-primary hover:bg-primary-dark text-white"
                    >
                        ${state.language === 'en' ? "Next" : "Далее"}
                    </button>
                </div>
            </div>
        `;
    } else if (state.showResult) {
        card.innerHTML = `
            <div class="text-center">
                <div class="mb-8">
                    <img src="/englishQuiz/english-quiz-result.svg" alt="Quiz Result" width="200" height="200" class="mx-auto">
                </div>
                <h2 class="text-3xl font-bold mb-4 text-primary">
                    ${state.language === 'en' ? "Your Personalized Learning Plan" : "Ваш персонализированный план обучения"}
                </h2>
                <p class="text-xl mb-6 text-gray-600">
                    ${analyzeResults()}
                </p>
                <button
                    onclick="handleBookLesson()"
                    class="w-full bg-primary hover:bg-primary-dark text-white rounded-full py-4 text-xl font-semibold transition-all duration-300 mb-4"
                >
                    ${state.language === 'en' ? "Book Your Free Lesson Now" : "Забронировать бесплатный урок"}
                </button>
                <button
                    onclick="resetQuiz()"
                    class="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full py-4 text-xl font-semibold transition-all duration-300"
                >
                    ${state.language === 'en' ? "Retake Quiz" : "Пройти тест заново"}
                </button>
            </div>
        `;
    }

    if (state.showBooking) {
        const bookingDialog = document.createElement('div');
        bookingDialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
        bookingDialog.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full">
                <h2 class="text-2xl font-bold mb-4">
                    ${state.language === 'en' ? "Book Your Free Lesson" : "Забронировать бесплатный урок"}
                </h2>
                <p class="mb-4">
                    ${state.language === 'en' ? "Choose a date and time for your free English lesson." : "Выберите дату и время для вашего бесплатного урока английского языка."}
                </p>
                <div class="mb-4">
                    <label for="date" class="block text-sm font-medium text-gray-700">
                        ${state.language === 'en' ? "Date" : "Дата"}
                    </label>
                    <input type="date" id="date" name="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
                </div>
                <div class="mb-4">
                    <label for="time" class="block text-sm font-medium text-gray-700">
                        ${state.language === 'en' ? "Time" : "Время"}
                    </label>
                    <select id="time" name="time" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
                        <option value="09:00">09:00</option>
                        <option value="11:00">11:00</option>
                        <option value="14:00">14:00</option>
                        <option value="16:00">16:00</option>
                    </select>
                </div>
                <div class="flex justify-between">
                    <button onclick="setState({ showBooking: false })" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                        ${state.language === 'en' ? "Cancel" : "Отмена"}
                    </button>
                    <button onclick="confirmBooking()" class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
                        ${state.language === 'en' ? "Confirm Booking" : "Подтвердить бронирование"}
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(bookingDialog);
    } else {
        const existingDialog = document.querySelector('.fixed.inset-0');
        if (existingDialog) {
            existingDialog.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const userLang = navigator.language || navigator.userLanguage;
    state.language = userLang.startsWith('ru') ? 'ru' : 'en';
    renderQuiz();
});

