import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Logo from "../components/Icons/Logo";
import type { Result, Prompt } from "../utils/types";
import getImage from "../api/image";
import getPrompt from "../api/prompt";
import getScore from "../api/semantic";
import getWord from "../api/game";
const Home: NextPage = ({ prompts }: { prompts: Prompt[] }) => {
  const [state, setState] = useState([]);
  const [load, setLoad] = useState(false);
  const [buttonText, setButtonText] = useState("New Image Hint");
  const [submitText, setSubmitText] = useState("Submit Guess");
  const [index, setIndex] = useState(0);
  const [noun, setNoun] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [score, setScore] = useState(50000);
  const [win, setWin] = useState("");
  const [prev, setPrev] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [word, setWord] = useState("");

  useEffect(() => {
    const newGame = async () => {
      if (index > 0) {
        setPrev(prompts[index - 1].adjective + " " + prompts[index - 1].noun);
      }
      setState([]);
      setGuesses([]);
      setScore(50000);
      setWord(getWord(prompts[index], ""));
      setWin("");
      setLoad(true);
      setButtonText("Loading...");
      const res: Result = { id: state.length };
      await getImage(prompts[index], res);
      setState((previous) => [...previous, res]);
      setLoad(false);
      setButtonText("New Image Hint");
    };
    newGame();
  }, [index]);

  const fetchImage = async () => {
    setScore(score - 5000);
    setLoad(true);
    setButtonText("Loading...");
    const res: Result = { id: state.length };
    await getImage(prompts[index], res);
    setState((previous) => [...previous, res]);
    setLoad(false);
    setButtonText("New Image Hint");
  };

  const handleSubmit = async () => {
    if (noun !== "") {
      setSubmitText("Submitting...");
      const curr = noun.toLowerCase().trim();
      const closeness = await getScore(prompts[index].noun, curr);
      setGuesses((previous) => [
        curr + " Semantic Score: " + closeness + "%",
        ...previous,
      ]);
      setWord(getWord(prompts[index], curr));
      if (curr !== prompts[index].noun) {
        setNoun("");
      }
      if (curr === prompts[index].noun) {
        setWin("You Won!");
      } else {
        setScore(score - 1000);
      }
      setSubmitText("Submit Guess");
    }
  };

  const handleClick = () => {
    setShowModal(!showModal);
  };

  const handleNewGame = async () => {
    setIndex(index + 1);
  };

  const handleKeyDown = async (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      await handleSubmit();
    }
  };
  return (
    <>
      <main className="mx-auto max-w-[1960px] p-4">
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-auto flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <button
              className="pointer z-10 mt-3 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-2"
              onClick={handleClick}
            >
              Instruction
            </button>
            <Logo />
            <h1 className="mb-4 mt-8 text-base font-bold uppercase tracking-widest">
              <p>{win}</p>
              {prev !== "" && <p>Previous Prompt : {prev}</p>}
              <p className="text-yellow-300">Score : {score}</p>
              <p className="text-green-300">
                {prompts[index].adjective + " " + word}
              </p>
            </h1>
            <button
              disabled={load}
              className="pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-2"
              onClick={handleNewGame}
            >
              New Game
            </button>
            <button
              disabled={load}
              className="pointer z-10 mt-3 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-2"
              onClick={fetchImage}
            >
              {buttonText}
            </button>

            <button
              disabled={load}
              className="pointer z-10 mt-3 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-2"
              onClick={handleSubmit}
            >
              {submitText}
            </button>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="pointer z-10 mt-1 rounded-lg border border-white bg-white px-1 py-1 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-1"
            >
              <input
                placeholder="Noun"
                type="text"
                value={noun}
                onChange={(e) => setNoun(e.target.value)}
                className="text-sm font-semibold text-black"
                onKeyDown={handleKeyDown}
              />
            </form>

            {guesses.map((guess: String) => (
              <p className="z-50 font-semibold text-white">{guess}</p>
            ))}
          </div>

          {state.map((result: Result) => (
            <Image
              alt="Next.js Conf photo"
              className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
              style={{ transform: "translate3d(0, 0, 0)" }}
              src={result.src}
              width={720}
              height={480}
              sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
            />
          ))}
          {showModal ? (
            <>
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div
                  className="fixed inset-0 h-full w-full bg-black opacity-40"
                  onClick={handleClick}
                ></div>
                <div className="flex min-h-screen items-center px-4 py-8">
                  <div className="relative mx-auto w-full max-w-lg rounded-md bg-white p-4 shadow-lg">
                    <div className="mt-3 sm:flex">
                      <div className="mt-2 text-center sm:ml-4 sm:text-left">
                        <h4 className="text-center text-lg font-medium text-gray-800">
                          Instruction
                        </h4>
                        <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                          The image display is generated using AI using prompt
                          in the format of Adjective Noun.
                        </p>
                        <p className="mt-2  text-[15px] leading-relaxed text-gray-500">
                          The
                          <span className="text-green-300"> Green</span> text
                          display the prompt, the noun is hidden from you.
                        </p>
                        <p className="mt-2  text-[15px] leading-relaxed text-gray-500">
                          Your objective is to guess the Noun used to generate
                          the image!
                        </p>
                        <p className="mt-2  text-[15px] leading-relaxed text-gray-500">
                          Each of your guess will have a score base on how close
                          it is to the real word.
                        </p>
                        <p className="mt-2  text-[15px] leading-relaxed text-gray-500">
                          If you need more image hint, click the New Image Hint
                          Button.
                        </p>
                        <p className="mt-2 text-center text-[30px] leading-relaxed text-blue-500">
                          Have Fun!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default Home;

export async function getServerSideProps() {
  const prompts: Prompt[] = await getPrompt();
  return {
    props: {
      prompts: prompts,
    },
  };
}
