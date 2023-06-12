import React, { useState, useEffect } from "react";
import "./SurveyApp.css";

const SurveyApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [showThankYouScreen, setShowThankYouScreen] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const storedAnswers = localStorage.getItem("surveyAnswers");
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("surveyAnswers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = [
          {
            id: 1,
            text: "How satisfied are you with our products?",
            type: "rating",
            options: [1, 2, 3, 4, 5],
          },
          {
            id: 2,
            text: "How fair are the prices compared to similar retailers?",
            type: "rating",
            options: [1, 2, 3, 4, 5],
          },
          {
            id: 3,
            text: "How satisfied are you with the value for money of your purchase?",
            type: "rating",
            options: [1, 2, 3, 4, 5],
          },
          {
            id: 4,
            text: "On a scale of 1-10, how would you recommend us to your friends and family?",
            type: "rating",
            options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
          {
            id: 5,
            text: "What could we do to improve our service?",
            type: "text",
          },
        ];

        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleStartSurvey = () => {
    setShowWelcomeScreen(false);
  };

  const handleAnswerQuestion = (answer, event) => {
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      { questionId: questions[currentQuestionIndex].id, answer },
    ]);

    if (currentQuestionIndex === questions.length - 1) {
      setSurveyCompleted(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setSurveyCompleted(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleConfirmSubmit = () => {
    setAnswers([]);
    setSurveyCompleted(false);
    setShowThankYouScreen(true);

    localStorage.setItem("surveyStatus", "COMPLETED");

    setTimeout(() => {
      setShowWelcomeScreen(true);
      setShowThankYouScreen(false);
    }, 5000);
  };

  const handleRestart = () => {
    setSurveyCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleFeedback = (event) => {
    setFeedback(event.target.value);
    setSurveyCompleted(true);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];

    if (!question) {
      return null;
    }

    return (
      <div className="questionBox">
        <h2 className="questionHeading">Question {currentQuestionIndex + 1}</h2>
        <p className="question">{question.text}</p>
        {question.type === "rating" && (
          <div>
            {question.options.map((option) => (
              <button
                className="ratingButton"
                key={option}
                onClick={() => handleAnswerQuestion(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {question.type === "text" && (
          <div>
            <textarea className="feedbackText" onChange={handleFeedback}>
              {feedback}
            </textarea>
          </div>
        )}
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="previousButton"
        >
          Previous
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className="nextButton"
        >
          Next
        </button>
        <button className="skipButton" onClick={handleSkipQuestion}>
          Skip
        </button>
      </div>
    );
  };

  if (localStorage.getItem("surveyStatus") === "COMPLETED") {
    setTimeout(() => {
      localStorage.removeItem("surveyStatus");
      handleRestart();
    }, 5000);
    return <h2>Thank you! Please come back later.</h2>;
  }

  return (
    <div>
      {showWelcomeScreen && (
        <div className="welcomeScreen">
          <h2>Welcome to the Survey</h2>
          <button className="startButton" onClick={handleStartSurvey}>
            Start
          </button>
        </div>
      )}
      {renderQuestion()}
      {surveyCompleted && (
        <div>
          <h2>Confirm Submit</h2>
          <p>Are you sure you want to submit the survey?</p>
          <button onClick={handleConfirmSubmit}>Yes</button>
        </div>
      )}
      {showThankYouScreen && (
        <div>
          <h2 className="thanksHeading">Thank you for your time!</h2>
        </div>
      )}
    </div>
  );
};

export default SurveyApp;
