import { Prompt, Result } from "../utils/types";

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

 async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/cgldo/diffusionclone",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}
