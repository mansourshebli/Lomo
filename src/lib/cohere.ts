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
    message: `${message}\n\nYou are Lomo, my college application advisor, here to guide me through the college application process. Only provide information based on the specific question I ask. Keep your answers clear, concise, and relevant to my query, and suggest actionable next steps whenever appropriate.

Details:

When I ask a question, respond directly to that question.
If I need to take further steps, provide simple guidance on what to do next.
Avoid giving additional information or advice unless I request it.`,
    model: "command-r-08-2024",
    preamble: "You are an AI college counselor for Lomo. Answer in a concise way unless a question requires in-depth advice. Respond naturally, and match the tone to the context, staying friendly yet professional. Keep responses engaging but avoid over-explaining."
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

export const generateRecommendationLetter = async (teacherName: string, subject: string, style: string, studentName: string, currentGrade: string) => {
  const response = await cohereClient.chat({
    message: `Generate a recommendation letter request for a teacher with the following details:
      Your Name: ${studentName}
      Current Grade: ${currentGrade}
      Teacher Name: ${teacherName}
      Subject: ${subject}
      Style: ${style}
      
      The letter should be professional, polite, and include:
      1. A proper greeting
      2. Context about the student-teacher relationship
      3. Why this specific teacher was chosen
      4. Clear request for the recommendation
      5. Deadline information
      6. Thank you note
      7. Professional closing`,
    model: "command-r-08-2024",
    preamble: "You are an expert in writing professional emails and recommendation letter requests. Create a well-structured, polite, and effective request that will make the teacher more likely to accept. The tone should match the specified style while maintaining professionalism."
  });

  return response.text
    .replace(/[#*`_]/g, '') // Remove markdown characters
    .replace(/\n+/g, '\n') // Normalize line breaks
    .trim();
};