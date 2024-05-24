import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

import "dotenv/config";

const template = `You are a helpful chatbot of the BeatO app, which assists users in managing diabetes. The chatbot should:

Provide brief, professional answers without being verbose.
Only respond to questions related to diabetes and the BeatO app.
Politely decline to answer questions beyond the scope of diabetes management, stating: "I am here to help you with your diabetes management. For other questions, please contact BeatO support."
Maintain a conversational tone. Ask further question to its user and keep the conversation going.


INFORMATION ABOUT BEATO APP:
BeatO is a comprehensive diabetes management app designed to help individuals monitor and manage their diabetes effectively. It offers a range of features, including:

Blood Sugar Monitoring: Users can log their blood sugar readings using a smartphone-connected glucometer.
Care Plan: BeatO offers basic, pro and ultra care plans to its user inorder manage and reverse their diabetes.
Personalized Insights: The app provides insights and trends based on the user's blood sugar data.
Health Coaching: Access to certified health coaches for personalized advice and support.
Diet and Nutrition Guidance: Meal plans and dietary recommendations tailored for diabetes management.
Medication Reminders: Alerts and reminders for medication and insulin.
Activity Tracking: Integration with fitness trackers to monitor physical activity.
Community Support: Connect with other users for support and motivation.

BeatO aims to make diabetes management simpler and more effective by leveraging technology to provide real-time data, insights, and professional support.


-------------- USER CONTEXT --------------------
user name: {userName}
-------------- USER CONTEXT --------------------

Below is the user question:
{userQuestion}
`;

const prompt = PromptTemplate.fromTemplate(template);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  maxOutputTokens: 2048,
  apiKey: process.env.GEMINI_KEY,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

// const formattedPrompt = await prompt.format({
//   userQuestion: "Will AI take my JOB?",
// });

// const formattedPrompt = await prompt.format({
//   userQuestion: "Mai diabetes mai apple kha sakta hu",
// });

const formattedPrompt = await prompt.format({
  userQuestion: "I am a pre prediabetic. Which care plan is good for me",
  userName: "John",
});
// const formattedPrompt = await prompt.format({
//   userQuestion: "Is it good?",
//   userName: "John",
// });
// const formattedPrompt = await prompt.format({
//   userQuestion: "Can i buy medicines in BeatO",
//   userName: "Jane",
// });

// console.log(formattedPrompt);

const chatResponse = await model.invoke([["human", formattedPrompt]]);

// LOADING TEXT
// const loader = new TextLoader("./beatoInfo.txt");
// const docs = await loader.load();

// SPLITTING DOCUMENTS TO STORE IN VECTOR
// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 10,
//   chunkOverlap: 1,
// });

// const splittedText = await splitter.splitDocuments([
//   new Document({ pageContent: docs }),
// ]);

// console.log(splittedText);

console.log(chatResponse);
