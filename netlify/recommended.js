export async function handler(event, context) {
  try {
    const { group, marks, interest } = JSON.parse(event.body);

    const prompt = `The student studied in group: ${group}, scored marks: ${marks}, and is interested in ${interest}. 
    Provide a clear, concise, and easy-to-read list of recommended degree courses and suitable colleges. 
    Format the output as key points, not a big paragraph, so it is friendly for a student to understand.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        suggestions: data.candidates?.[0]?.content?.parts?.[0]?.text || "No recommendations found.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
