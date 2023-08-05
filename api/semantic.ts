
import { Prompt } from "../utils/types";

/**
 * Send api request to image generator and save the resulting image in the json
 * @param req store whatever is require to generate the image
 * @param res store the image in json format
 */
export default async function getScore(req: string, guess: string) {
    const result:number = await checkSemantic({"inputs": {"source_sentence":req, "sentences": [guess]}, options:{"wait_for_model":true}})
    console.log(result)
    return Math.round(result * 100);
  }

async function checkSemantic(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/cgldo/semanticClone",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}
