import React, { useState, useEffect } from "react";
import "./App.css"
import axios from "./axios";

function App() {

  const [bubbleId, setBubbleId] = useState();
  const [inputId, setInputId] = useState();
  const [buttonId, setButtonId] = useState();
  const [reply, setReplay] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [colour, setColour] = useState("");
  const [answer, setAnswer] = useState(false);
  const [buttonHide, setHideButton] = useState(true);
  const [answerData, setAnswerData] = useState(() => "");
  const [qandaId, setQandaId] = useState(() => "");

  useEffect(() => {
    setInterval(() => {
      axios.get("/qanda").then((res) => {
        console.log(res);
        setQuestions(res.data);
      });
    }, 1000);
  }, []);

  const onSendAnswer = async (e) => {
    console.log("qandaId", qandaId);
    await axios.patch(`/qanda/${qandaId}`, {
      answer: answerData,

    })
      .then((res) => {
        setAnswerData("");
        // setColour("green");
      });
  }

  return (
    <div className="App">
      <div className="Body-area">
        {questions.map((data) => (
          <>
            <div 
            key={data._id}
            className={`bubble ${bubbleId === data._id && colour === "green"
              ? "answer-action"
              : bubbleId === data._id && colour === "red"
                ? "reject-action"
                : "default"
              }`}>
              <h6>
                {data.senderId}
              </h6>
              <p>
                {data.text}
              </p>
              {buttonHide && buttonId === data._id ? <div className="bubble-button">
                <button
                  key={data._id}
                  onClick={() => {
                    setReplay(!reply)
                    setBubbleId(data._id);
                    setQandaId(data._id);
                    setInputId(data._id);
                    setColour("green");
                    setHideButton(!buttonHide);
                    setButtonId(data._id)
                  }}
                  style={{ color: "limegreen" }}
                >Answer</button>
                <button
                  key={data._id}
                  onClick={() => {
                    setBubbleId(data._id);
                    setColour("red");
                    setHideButton(!buttonHide);
                    setButtonId(data._id)
                  }}
                  style={{ color: "red" }}
                >Reject</button>
              </div> : null}
            </div>
            {reply && inputId === data._id ? <div className="reply-bubble">
              <input
                type="text"
                placeholder="Type Here"
                value={answerData}
                onChange={(event) => {
                  setAnswerData(event.target.value);
                }}
              />
              <button
                onClick={() => {
                  setAnswer(!answer);
                  setReplay(!reply);
                  onSendAnswer();
                }}>Send</button>
            </div> : null}
            {data.answer ? <div className="answer-bubble">
              <div className="answer-head">
                <p>Admin</p>
                <a href="#">Copy Answer</a>
              </div>
              <div>
                <p>{data.answer}</p>
              </div>
            </div> : null}
          </>
        ))}
      </div>
    </div >
  )
}

export default App;