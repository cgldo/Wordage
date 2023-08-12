/**
 * Api point for frontend, return semantic closeness of a user guess
 * @param req a original word
 * @param guess the user guess
 * @returns score * 100 to give a estimate percent closeness
 */
export default async function getScore(req: string, guess: string) {
    const result:number = await checkSemantic({"inputs": {"source_sentence":req, "sentences": [guess]}, options:{"wait_for_model":true}})
    console.log(result)
    return Math.round(result * 100);
  }

  /**
   * Send a query to a Model for checking word closeness
   * @param data data to send to model for checking
   * @returns number from 0-1 representing closeness
   */
async function checkSemantic(data) {
	const response = await fetch(
		process.env.SEMANTIC,
		{
			headers: { Authorization: process.env.HUGGING_KEY },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}
