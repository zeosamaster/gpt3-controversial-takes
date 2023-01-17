import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const prompts = {
  average: (userPrompt) =>
    `Generate a controversial take on the following topic: "${userPrompt}".\n`,
  hardcore: (userPrompt) =>
    `Generate a controversial take on the following topic: "${userPrompt}". The message should be outrageous and written using an extremely hardcore tone. Avoid mentioning money.\n`,
};

const generateAction = async (req, res) => {
  const { userInput, hardcore } = req.body;

  const promptType = hardcore ? prompts.hardcore : prompts.average;

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: promptType(userInput),
    temperature: 0.9,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
