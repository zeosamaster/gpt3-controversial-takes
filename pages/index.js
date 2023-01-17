import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [hardcore, setHardcore] = useState(false);
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async (e) => {
    e?.preventDefault();

    if (!userInput) return;

    setIsGenerating(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput, hardcore }),
    });

    const { output } = await response.json();
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  useEffect(() => {
    function keyDown(e) {
      if (!(e.keyCode == 13 && e.metaKey)) return;
      callGenerateEndpoint();
    }
    document.body.addEventListener("keydown", keyDown);
    return () => document.body.removeEventListener("keydown", keyDown);
  });

  return (
    <div className="root">
      <Head>
        <title>Controversial Takes</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Start a Debate</h1>
          </div>
          <div className="header-subtitle">
            <h2>Input a topic and generate controversial takes instantly!</h2>
          </div>
        </div>
        <form className="prompt-container" onSubmit={callGenerateEndpoint}>
          <textarea
            placeholder="(e.g. climate change and its effects on the environment)"
            className="prompt-box"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />

          <div className="prompt-buttons">
            <input
              id="hardcore-mode"
              type="checkbox"
              value={hardcore}
              onChange={() => setHardcore((prev) => !prev)}
            />
            <label for="hardcore-mode" style={{ color: "white" }}>
              Give me hardcore
            </label>

            <button className="generate-button" disabled={isGenerating}>
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </button>
          </div>

          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </form>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
