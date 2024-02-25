require("dotenv").config();
const OpenAI =require( "openai");

const openai = new OpenAI({
    apiKey: process.env.CGKEY,
});

async function chatgpt(message) {
  const completion = await openai.chat.completions.create({
    messages: [

        { role: "system", content: "You are a helpful assistant called GPT-3 you shoud reply to user messages." },
        { role: "user", content: message },
    ],
    model: "gpt-3.5-turbo",
  });
 console.log(completion);
  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}

module.exports = { chatgpt };