import { OpenAI } from 'openai'

if (!process.env.OPENAI) throw new Error('OPENAI API key not found!')

const options = {
  temperature: 0.7, // OpenAI parameter
  max_tokens: 500, // OpenAI parameter [Max response size by tokens]
  top_p: 0.9, // OpenAI parameter
  frequency_penalty: 0, // OpenAI parameter
  presence_penalty: 0, // OpenAI parameter
  model: 'gpt-3.5-turbo' // OpenAI parameter  `gpt-3.5-turbo` is PAID
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI
})

export async function getPrompt(text: string): Promise<string> {
  const resp = await openai.chat.completions.create({
    ...options,
    messages: [
      {
        role: 'user',
        content: text
      }
    ]
  })

  if (resp === null) return 'Virhe tapahtui'

  const msg = resp.choices[0].message?.content
  if (msg === undefined || msg === null) return 'Virhe tapahtui (msg === undefined)'

  return msg
}

export async function createImage(prompt: string) {
  const resp = await openai.images.generate({
    size: '256x256',
    prompt,
    n: 1,
    response_format: 'url'
  })

  if (resp === null) return undefined
  if (resp.data.length === 0) return undefined

  return resp.data[0].url
}
