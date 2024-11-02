import { CohereClient } from "cohere-ai";

export const cohereClient = new CohereClient({ 
  token: "x1MgjGg5r82m3h79h2DYvW1DzR16JD6UHDl6otvU" 
});

export const getEssayFeedback = async (essay: string) => {
  const response = await cohereClient.chat({
    message: `Analyze this college application essay and provide detailed feedback. Please review the following essay in a structured way. Start with an overview of the essay, summarizing its main argument and purpose. Identify the strongest aspects of the writing, such as clear points, strong evidence, and effective language, and explain why these parts are effective. Then, provide constructive feedback on areas for improvement. Address elements such as the organization, clarity, and strength of arguments, supporting evidence, and style. Suggest specific changes, such as rephrasing for clarity, adding more detailed examples, or improving transitions between paragraphs. Conclude with an overall assessment of the essay's impact and suggest two to three actionable steps to enhance it further.: "${essay}"`,
    model: "command-r-08-2024",
    preamble: "You are an expert college admissions counselor. Provide constructive feedback on college application essays, focusing on content, structure, authenticity, and impact. Be specific and actionable in your suggestions. Format your response as plain text."
  });
  
  return response.text
    .replace(/[#*`_]/g, '') // Remove markdown characters
    .replace(/\n+/g, '\n') // Normalize line breaks
    .trim();
};

export const getCounselorResponse = async (message: string) => {
  const response = await cohereClient.chat({
    message: `${message}\n\nFormat your response as plain text. For emphasis, wrap important text in <strong></strong> tags. For bullet points, start lines with • (bullet point symbol).`,
    model: "command-r-08-2024",
    preamble: "You are an AI college counselor for Lomo, a platform that helps students with their college applications. Provide expert guidance on college selection, application strategy, and admissions requirements. Be supportive and informative while maintaining a professional tone. Format your response as plain text with HTML strong tags for emphasis and bullet points starting with •"
  });

  return response.text
    .replace(/[#*`_]/g, '') // Remove any markdown characters
    .replace(/\n+/g, '\n') // Normalize line breaks
    .trim();
};

export const generateActivities = async () => {
  const response = await cohereClient.chat({
    message: "Generate 6 unique and impactful extracurricular activities for a college application. Include a title and description for each activity.",
    model: "command-r-08-2024",
    preamble: "You are an expert college admissions counselor specializing in extracurricular activities. Generate creative and meaningful activities that will enhance a student's college application. Format the response as a JSON array with 'name' and 'description' fields."
  });

  try {
    // Extract JSON from the response
    const jsonStr = response.text.substring(
      response.text.indexOf('['),
      response.text.lastIndexOf(']') + 1
    );
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing activities:', error);
    return [];
  }
};