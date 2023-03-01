import { Configuration, OpenAIApi } from 'openai'

if (!process.env.OPENAI) throw new Error('OPENAI API key not found!')

const configuration = new Configuration({
  apiKey: process.env.OPENAI
})

const options = {
  temperature: 0.7, // OpenAI parameter
  max_tokens: 500, // OpenAI parameter [Max response size by tokens]
  top_p: 0.9, // OpenAI parameter
  frequency_penalty: 0, // OpenAI parameter
  presence_penalty: 0, // OpenAI parameter
  model: 'gpt-3.5-turbo' // OpenAI parameter  `gpt-3.5-turbo` is PAID
}

const openai = new OpenAIApi(configuration)

export async function getPrompt(text: string): Promise<string> {
  const resp = await openai.createChatCompletion({
    ...options,
    messages: [
      {
        role: 'user',
        content: text
      }
    ]
  })

  if (resp === null) return 'Virhe tapahtui'
  if (resp.status !== 200) return 'Virhe tapahtui !==200'

  const msg = resp.data.choices[0].message?.content

  if (msg === undefined) return 'Virhe tapahtui (msg === undefined)'

  return msg
}
