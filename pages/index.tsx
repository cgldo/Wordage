import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Bridge from "../components/Icons/Bridge";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { Result, Prompt } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import getImage from "../api/image";
import getPrompt from "../api/prompt";
import getScore from "../api/semantic";

const Home: NextPage = ({ prompts }: { prompts: Prompt[] }) => {
  const [state, setState] = useState([]);
  const [load, setLoad] = useState(false);
  const [buttonText, setButtonText] = useState("New Image");
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const [noun, setNoun] = useState("");
  const [guesses, setGuesses] = useState([]);
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);
  const [score, setScore] = useState(50000);
  const [win, setWin] = useState("");
  const [prev, setPrev] = useState("");
  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  const fetchImage = async () => {
    setLoad(true);
    setButtonText("Loading...");
    const res: Result = { id: state.length };
    await getImage(prompts[index], res);
    setState((previous) => [...previous, res]);
    setLoad(false);
    setButtonText("New Image");
  };

  const handleSubmit = async () => {
    if (noun !== "") {
      const closeness = await getScore(prompts[index].noun, noun);
      setGuesses((previous) => [
        noun + " Semantic Score: " + closeness + "%",
        ...previous,
      ]);
      if (noun !== prompts[index].noun) {
        setNoun("");
      }
      if (noun === prompts[index].noun) {
        setWin("You Won!");
      } else {
        setScore(score - 1000);
      }
    }
  };

  const handleClick = () => {
    if (state.length != 0 && noun !== prompts[index].noun) {
      setScore(score - 5000);
    }
    fetchImage();
  };

  const handleNewGame = () => {
    setPrev(prompts[index].adjective + " " + prompts[index].noun);
    setIndex(index + 1);
    setState([]);
    setGuesses([]);
    setScore(50000);
    setWin("");
    fetchImage();
  };

  const handleKeyDown = async (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <>
      <main className="mx-auto max-w-[1960px] p-4">
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-start gap-2 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-70">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Logo />
              </span>
              <span className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            <h1 className="mb-4 mt-8 text-base font-bold uppercase tracking-widest">
              {win}
            </h1>
            <h3 className="z-50 mb-4 mt-8 text-base font-bold uppercase tracking-widest">
              Previous Prompt : {prev}
            </h3>
            <h2 className="z-50 mb-4 mt-8 text-base font-bold uppercase tracking-widest">
              Score : {score}
            </h2>
            <h3 className="z-50 mb-4 mt-8 text-base font-bold uppercase tracking-widest">
              {prompts[index].adjective + " ???"}
            </h3>
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
              onClick={handleClick}
            >
              {buttonText}
            </button>

            <button
              disabled={load}
              className="pointer z-10 mt-3 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-2"
              onClick={handleSubmit}
            >
              Submit Guess
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
            <Link
              key={result.id}
              href={result.src}
              ref={
                result.id === Number(lastViewedPhoto)
                  ? lastViewedPhotoRef
                  : null
              }
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
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
            </Link>
          ))}
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
