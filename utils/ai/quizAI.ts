import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { z } from "zod";
import { REACT_GUIDELINES } from "../prompts/react";
import { OpenAI } from "@langchain/openai";

const parser = StructuredOutputParser.fromZodSchema(
  z.array(
    z.object({
      question: z
        .string()
        .describe(
          "The mcq question that you want to ask interviewer to asses their knowledge"
        ),
      topics: z.array(
        z.string().describe("The topics to which the question belongs")
      ),
      type: z
        .enum(["mcq", "msq", "code_snippet", "subjective"])
        .describe(
          "Defines the type of the question. 'mcq' for multiple choice questions, 'msq' for multiple select questions, 'code_snippet' for questions requiring a code answer, and 'subjective' for open-ended questions."
        ),
      options: z
        .array(
          z.object({
            text: z
              .string()
              .describe("The option text which belong to question"),
            correct: z.boolean().describe("Is this option correct"),
            score: z
              .number()
              .describe(
                "The score which is awarded to user. 10 if this is correct answer, 0 if wrong"
              ),
          })
        )
        .describe(
          "This will be empty in case type is question type is subjective and in case question type is code-snippet this will contain only right answer"
        ),
    })
  )
);

const getPrompt = async (
  topic: string,
  position: string,
  numQuestions: number
) => {
  const format_instructions = parser.getFormatInstructions();
  const prompt = new PromptTemplate({
    template: `You are an expert ${topic} software developer. You are in charge of hiring ${topic} ${position} developers. For candidates's assessment you need to create ${numQuestions}. Analyze the following requirement to create questions of different types (multi choice, multi select, code-snippet, subjective) aimed at assessing the knowledge and skills of candidates applying for a ${topic} ${position} position. Each question should focus on a key aspect of ${topic}, follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{guidelines} `,
    inputVariables: ["guidelines"],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    guidelines: REACT_GUIDELINES.topicGuidelines,
  });

  return input;
};

export const generateQuestion = async () => {
  const input = await getPrompt("react.js", "lead developer", 25);
  console.log("input", input);
  const model = new OpenAI({
    temperature: 0,
    modelName: "gpt-4-turbo-preview",
  });
  const output = await model.invoke(input);
  console.log("Here", output);

  try {
    return parser.parse(output);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new OpenAI({ temperature: 0, modelName: "gpt-4-turbo-preview" }),
      parser
    );
    const fix = await fixParser.parse(output);
    return fix;
  }
};
