import styled from "styled-components";
import {
  fetchData,
  nextQuestion,
  startGame,
  submitQuestion,
} from "../redux/slices/quizSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../ui/Spinner";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IconContext } from "react-icons";
import Timer from "../ui/Timer";
import { AppDispatch, RootState } from "../redux/store";
import { device } from "../breakpoints";
import "../ui/IconsStyling.css";
import { AnswerType } from "../redux/slices/quizSlice.ts";

import ProgressBarComponent from "../ui/ProgressBar";

const StyledGameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: 100%;
  position: relative;

  @media ${device.lgPhones} {
    justify-content: start;
    gap: 1rem;
  }

  @media ${device.md} {
    padding: 4rem 8rem;
    justify-content: start;
    gap: 3rem;
  }

  @media ${device.md} and (orientation: landscape) {
    padding: 0rem;
    gap: 0.5rem;
  }

  @media ${device.sm} {
    padding: 2rem;
    gap: 1rem;
  }
`;

const StyledAddonsContainer = styled.div`
  position: absolute;
  top: 0rem;

  padding: 4rem;
  width: 100%;
  height: 5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media ${device.lgPhones} {
    position: fixed;
  }

  @media ${device.sm} {
    position: fixed;
  }
  @media ${device.xs} {
    padding: 1rem;
    height: auto;
  }
`;

const StyledAddonsText = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: #71717a;

  @media ${device.md} {
    font-size: 2rem;
  }
  @media ${device.xs} {
    font-size: 1.5rem;
  }
`;

const StyledQuestion = styled.h1`
  font-size: 2.4rem;
  font-weight: 600;
  color: #71717a;
  text-align: center;

  padding: 2rem;

  @media ${device.lgPhones} {
    padding: 1rem;
    font-size: 1.5rem;
  }

  @media ${device.md} {
    font-size: 3rem;
  }
  @media ${device.md} and (orientation: landscape) {
    padding: 0.5rem;
    font-size: 1.5rem;
  }

  @media ${device.sm} {
    font-size: 2rem;
    text-wrap: wrap;
  }

  @media ${device.xs} {
    font-size: 1.8rem;
    padding: 1rem;
  }
`;

const StyledPoints = styled.p`
  font-size: 2.5rem;
  font-weight: 400;
  color: #71717a;
  margin-top: -1rem;

  @media ${device.lgPhones} {
    font-size: 1.5rem;
  }

  @media ${device.md} {
    font-size: 3rem;
  }

  @media ${device.md} and (orientation: landscape) {
    font-size: 1.5rem;
    margin-top: -2rem;
  }

  @media ${device.sm} {
    font-size: 2rem;
  }
`;

const StyledAnswersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media ${device.lgPhones} {
    gap: 1rem;
  }
  @media ${device.md} and (orientation: landscape) {
    gap: 0.5rem;
  }

  @media ${device.sm} {
    gap: 1rem;
  }
`;

const StyledAnswers = styled.button`
  background-color: #f9fafb;
  height: 5rem;
  width: 45rem;
  border: 1px solid #d4d4d4;
  border-radius: 1rem;

  color: #18181b;
  font-weight: 500;
  font-size: 1.6rem;

  cursor: pointer;

  &.static {
    background-color: #f9fafb;
  }

  &.goodanswer {
    background-color: #34d399;
    transition: background-color 0.3s;
  }
  &.wronganswer {
    background-color: #f87171;
    transition: background-color 0.3s;
  }

  @media ${device.lgPhones} {
    height: 3rem;
    width: 20rem;
    font-size: 1rem;
  }

  @media ${device.md} {
    height: 7rem;
    font-size: 3rem;
  }
  @media ${device.md} and (orientation: landscape) {
    height: 3rem;
    width: 20rem;
    font-size: 1rem;
  }

  @media ${device.sm} {
    width: 25rem;
    font-size: 2rem;
  }
  @media ${device.xs} {
    height: 5rem;
    width: 25rem;
    font-size: 1.5rem;
  }
`;

const StyledNextButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #ffffff;
  border: 1px solid #71717a;
  padding: 1rem 2rem;
  font-size: 1.6rem;
  border-radius: 10rem;
  font-weight: 300;

  position: absolute;
  bottom: 2rem;
  right: 3rem;

  @media ${device.lgPhones} {
    position: static;
    font-size: 1rem;
    background-color: #f9fafb;
    height: 3rem;
    width: 20rem;
    border: 1px solid #d4d4d4;
    border-radius: 1rem;

    color: #18181b;
    font-weight: 500;
  }

  @media ${device.md} {
    position: static;
    font-size: 3rem;
    background-color: #f9fafb;
    height: 7rem;
    width: 45rem;
    border: 1px solid #d4d4d4;
    border-radius: 1rem;

    color: #18181b;
    font-weight: 500;
  }

  @media ${device.md} and (orientation: landscape) {
    height: 3rem;
    width: 20rem;
    font-size: 1rem;
  }

  @media ${device.sm} {
    width: 25rem;
    font-size: 2rem;
  }
  @media ${device.xs} {
    height: 5rem;
    width: 25rem;
    font-size: 1.5rem;
  }
`;

const StyledErrorButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #ffffff;
  border: 1px solid #71717a;
  padding: 1rem 2rem;
  font-size: 1.6rem;
  border-radius: 10rem;
  font-weight: 300;

  cursor: pointer;
`;

function Game() {
  const [isSubbmited, setIsSubmited] = useState(false);

  const { category } = useParams<{ category: string }>();
  const { difficulty } = useParams<{ difficulty: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const questions = useSelector((state: RootState) => state.quiz.questions);
  const isLoading = useSelector((state: RootState) => state.quiz.isLoading);
  const answers: AnswerType[][] = useSelector((state: RootState) => state.quiz.answers);
  const currentQuestion = useSelector(
    (state: RootState) => state.quiz.currentQuestion
  );
  const errorWhenFetching = useSelector(
    (state: RootState) => state.quiz.errorWhenFetching
  );

  const score = useSelector((state: RootState) => state.quiz.score);

  useEffect(() => {
    if (category && difficulty) {
      dispatch(fetchData({ category, difficulty })).then(() => {
        dispatch(startGame());
      });
    }
  }, [category, difficulty, dispatch]);

  function handleAnswerClick(answer: AnswerType) {
    setIsSubmited(true);
    dispatch(submitQuestion(answer));
  }

  function handleNextClick() {
    setIsSubmited(false);

    if (currentQuestion === 9) {
      navigate("/finish");
    }

    dispatch(nextQuestion());
  }

  if (errorWhenFetching) {
    return (
      <StyledGameContainer>
        <StyledQuestion>
          There was an error fetching the questions
        </StyledQuestion>
        <StyledErrorButton onClick={() => navigate("/")}>
          Go back
        </StyledErrorButton>
      </StyledGameContainer>
    );
  }

  if (
    (isLoading && !errorWhenFetching) ||
    !questions.length ||
    !answers.length
  ) {
    return (
      <StyledGameContainer>
        <Spinner />
      </StyledGameContainer>
    );
  }

  return (
    <StyledGameContainer>
      <StyledAddonsContainer>
        <StyledAddonsText>
          <Timer />
        </StyledAddonsText>
        <StyledAddonsText>
          {currentQuestion + 1} / {questions.length}
        </StyledAddonsText>
      </StyledAddonsContainer>
      <StyledQuestion
        dangerouslySetInnerHTML={{ __html: questions[currentQuestion] }}
      />
      <StyledPoints>Points: {score}</StyledPoints>
      <StyledAnswersContainer>
        {answers[currentQuestion].map((answer, index) => (
          <StyledAnswers
            onClick={() => handleAnswerClick(answer)}
            disabled={isSubbmited}
            key={index}
            className={`${
              !isSubbmited
                ? "static"
                : isSubbmited && answer.correct === true
                ? "goodanswer"
                : "wronganswer"
            }`}
            dangerouslySetInnerHTML={{ __html: answer.text }}
          />
        ))}
      </StyledAnswersContainer>
      {isSubbmited == true && (
        <StyledNextButton onClick={() => handleNextClick()}>
          Next
          <IconContext.Provider value={{ className: "Icon-Game" }}>
            <FaLongArrowAltRight />
          </IconContext.Provider>
        </StyledNextButton>
      )}
      <ProgressBarComponent />
    </StyledGameContainer>
  );
}

export default Game;
