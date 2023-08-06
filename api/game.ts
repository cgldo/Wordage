import { Prompt } from "../utils/types";

export default function getWord(req: Prompt, guess:string) {
    const wordArr = req.noun.split("");
    for(let i = 0; i < wordArr.length; i++) {
        if(i > guess.length || wordArr[i] !== guess.charAt(i)) {
            wordArr[i] = "_"
        }
    }
    return wordArr.join("");
  }