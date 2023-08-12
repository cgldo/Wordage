import { Prompt, Result } from "../utils/types";
require('dotenv').config()

/**
 * Send api request to image generator and save the resulting image in the json
 * @param req store whatever is require to generate the image
 * @param res store the image in json format
 */
export default async function getImage(req: Prompt, res:Result) {
    const result = await query({"inputs": req.adjective + " " + req.noun, options:{"use_cache":false, "wait_for_model":true}})
    const objectURL = URL.createObjectURL(result);
    res.statusCode = 200;    
    res.src = objectURL;
  }

  /**
   * 
   * @param data 
   * @returns 
   */
 async function query(data) {
	const response = await fetch(
		process.env.STABLE_DIFFUSION,
		{
			headers: { Authorization: process.env.HUGGING_KEY},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}
