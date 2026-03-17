export async function generateFormIO(text: string) {

  const response = await fetch("https://api.openai.com/v1/chat/completions", {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
    },

    body: JSON.stringify({
      model: "gpt-4.1",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `You convert intake forms into Form.io JSON`
        },
        {
          role: "user",
          content: `
Convert this medical intake form into valid Form.io JSON.

Rules:

Use these components:

well → main container  
columns → fields on same line  
textfield → blank fields  
textarea → long answers  
radio → yes/no questions  
selectboxes → checkbox groups  
survey → matrix questions  
fieldset → section headers  
content → paragraph text  
signature → signatures  
datetime → dates  
If multiple questions share the same answer scale, convert them into a Form.io survey component.
Preserve all labels exactly as written in the form. Do not paraphrase.
All forms should have a required signature and date at the bottom in a column component side by side. 


Return JSON only.

FORM:

${text}
`
        }
      ]
    })
  });

  const data = await response.json();

  return JSON.parse(data.choices[0].message.content);
}