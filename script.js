
const questions = [
    {
        question: "Which city is famous for the Eiffel Tower?",
        answers: [
            { text: "Paris", correct: true },
            { text: "Dubai", correct: false },
            { text: "Tokyo", correct: false },
            { text: "Bali", correct: false }
        ]
    },

    {
        question: "Which country is famous for Bali?",
        answers: [
            { text: "France", correct: false },
            { text: "Indonesia", correct: true },
            { text: "Japan", correct: false },
            { text: "Switzerland", correct: false }
        ]
    },

    {
        question: "Which country is famous for the Swiss Alps?",
        answers: [
            { text: "India", correct: false },
            { text: "France", correct: false },
            { text: "Switzerland", correct: true },
            { text: "UAE", correct: false }
        ]
    },

    {
        question: "Which city is famous for Burj Khalifa?",
        answers: [
            { text: "Dubai", correct: true },
            { text: "Paris", correct: false },
            { text: "Bali", correct: false },
            { text: "London", correct: false }
        ]
    },

    {
        question: "Which country is known for Mount Fuji?",
        answers: [
            { text: "Japan", correct: true },
            { text: "Germany", correct: false },
            { text: "Italy", correct: false },
            { text: "Brazil", correct: false }
        ]
    }
];


let currentQuestionIndex = 0;
let score = 0;


const questionElement =
    document.getElementById("question");

const answerButtons =
    document.getElementById("answer-buttons");

const nextButton =
    document.getElementById("next-btn");

const quizResult =
    document.getElementById("quiz-result");



function startQuiz() {

    currentQuestionIndex = 0;
    score = 0;

    nextButton.style.display = "none";

    quizResult.textContent = "";

    showQuestion();

}




function showQuestion() {

    resetAnswers();

    const currentQuestion =
        questions[currentQuestionIndex];

    questionElement.textContent =
        (currentQuestionIndex + 1) +
        ". " +
        currentQuestion.question;


    currentQuestion.answers.forEach(function(answer) {

        const button =
            document.createElement("button");

        button.textContent =
            answer.text;

        button.classList.add("answer-btn");

        if (answer.correct) {

            button.dataset.correct = "true";

        }

        button.addEventListener(
            "click",
            selectAnswer
        );

        answerButtons.appendChild(button);

    });

}




function resetAnswers() {

    nextButton.style.display = "none";

    while (answerButtons.firstChild) {

        answerButtons.removeChild(
            answerButtons.firstChild
        );

    }

}




function selectAnswer(event) {

    const selectedButton =
        event.target;

    const isCorrect =
        selectedButton.dataset.correct === "true";


    if (isCorrect) {

        selectedButton.classList.add("correct");

        score++;

    } else {

        selectedButton.classList.add("wrong");

    }


    

    Array.from(
        answerButtons.children
    ).forEach(function(button) {

        if (button.dataset.correct === "true") {

            button.classList.add("correct");

        }

        button.disabled = true;

    });


    nextButton.style.display = "inline-block";

}



nextButton.addEventListener("click", function() {

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {

        showQuestion();

    } else {

        showResult();

    }

});


/* SHOW FINAL RESULT */

function showResult() {

    resetAnswers();

    questionElement.textContent =
        "🎉 Quiz Completed!";

    quizResult.textContent =
        "You scored " +
        score +
        " out of " +
        questions.length +
        "!";

    nextButton.textContent =
        "Play Again";

    nextButton.style.display =
        "inline-block";


    nextButton.onclick = function() {

        nextButton.textContent =
            "Next Question";

        startQuiz();

    };

}




startQuiz();





const cityInput =
    document.getElementById("cityInput");

const weatherButton =
    document.getElementById("weatherBtn");

const cityName =
    document.getElementById("cityName");

const temperature =
    document.getElementById("temperature");

const weatherDescription =
    document.getElementById(
        "weatherDescription"
    );




weatherButton.addEventListener(
    "click",
    getWeather
);




cityInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            getWeather();

        }

    }
);




async function getWeather() {

    const city =
        cityInput.value.trim();


    if (city === "") {

        cityName.textContent =
            "Please enter a city name.";

        temperature.textContent = "";

        weatherDescription.textContent = "";

        return;

    }


    cityName.textContent =
        "Loading...";

    temperature.textContent = "";

    weatherDescription.textContent = "";


    try {

   

        const locationResponse =
            await fetch(
                "https://geocoding-api.open-meteo.com/v1/search?name=" +
                encodeURIComponent(city) +
                "&count=1&language=en&format=json"
            );


        const locationData =
            await locationResponse.json();


        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            cityName.textContent =
                "City not found.";

            return;

        }


        const location =
            locationData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;



        const weatherResponse =
            await fetch(
                "https://api.open-meteo.com/v1/forecast" +
                "?latitude=" +
                latitude +
                "&longitude=" +
                longitude +
                "&current=temperature_2m,weather_code" +
                "&timezone=auto"
            );


        const weatherData =
            await weatherResponse.json();


        const currentWeather =
            weatherData.current;



        cityName.textContent =
            "📍 " +
            location.name +
            ", " +
            location.country;


        temperature.textContent =
            currentWeather.temperature_2m +
            "°C";


        weatherDescription.textContent =
            getWeatherDescription(
                currentWeather.weather_code
            );


    } catch (error) {

        console.error(error);

        cityName.textContent =
            "Unable to get weather.";

        weatherDescription.textContent =
            "Please check your internet connection and try again.";

    }

}



function getWeatherDescription(code) {

    if (code === 0) {

        return "☀️ Clear sky";

    }

    if (code === 1 || code === 2) {

        return "🌤️ Mainly clear / partly cloudy";

    }

    if (code === 3) {

        return "☁️ Overcast";

    }

    if (
        code === 45 ||
        code === 48
    ) {

        return "🌫️ Foggy";

    }

    if (
        code >= 51 &&
        code <= 57
    ) {

        return "🌦️ Drizzle";

    }

    if (
        code >= 61 &&
        code <= 67
    ) {

        return "🌧️ Rain";

    }

    if (
        code >= 71 &&
        code <= 77
    ) {

        return "❄️ Snow";

    }

    if (
        code >= 80 &&
        code <= 82
    ) {

        return "🌧️ Rain showers";

    }

    if (
        code >= 85 &&
        code <= 86
    ) {

        return "🌨️ Snow showers";

    }

    if (
        code >= 95 &&
        code <= 99
    ) {

        return "⛈️ Thunderstorm";

    }

    return "🌍 Weather information available";

}




const navLinks =
    document.querySelectorAll(
        ".nav-links a"
    );


navLinks.forEach(function(link) {

    link.addEventListener(
        "click",
        function(event) {

            const targetId =
                this.getAttribute("href");


            if (targetId.startsWith("#")) {

                event.preventDefault();


                const target =
                    document.querySelector(
                        targetId
                    );


                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }

        }
    );

});




window.addEventListener(
    "load",
    function() {

        console.log(
            "🌍 Welcome to World Tour!"
        );

        console.log(
            "✈️ Explore the world and discover amazing destinations."
        );

    }
);
