import axios from 'axios'
import React, { ChangeEventHandler, useEffect, useState } from 'react'

type VerseLanguages = {
  pt: string
  en: string
}


interface IVerseResponse {
  book: {
    abbrev: VerseLanguages,
    name: string
    author: string
    group: string
    version: string
  },
  chapter: number
  number: number
  text: string
}

interface ISearchResponse {
  version: string
  occurrence: number
  verses: IVerseResponse[]
}

interface IVerse { 
  text: string
  chapter: number
  verse: number
  book: string
}

function App() {
  const fakeData = {
    book: {
      abbrev: {pt: '2sm', en: '2sm'},
      author: "Samuel",
      group: "Históricos",
      name: "2º Samuel",
      version: "nvi"
    },
    chapter: 2,
    number: 12,
    text: "Abner, filho de Ner, e os soldados de Is-Bosete, filho de Saul"
  }


  let randomVerse = {
    text: fakeData.text,
    chapter: fakeData.chapter,
    verse: fakeData.number,
    book: fakeData.book.name  
  }


  const [verse, setVerse] = useState<IVerse | null>(randomVerse)
  const [searchResult, setSearchResult] = useState<IVerseResponse[] | null>(null)
  const [searchText, setSearchText] = useState<string | null>(null)
  const API_URL_GET = 'https://www.abibliadigital.com.br/api/verses/nvi/random'
  const API_URL_POST = 'https://www.abibliadigital.com.br/api/verses/search'


  const getRandomVerse = async () => {
  try {
    const { data } = await axios.get<IVerseResponse>(API_URL_GET)
    console.log('Data from api => ', data)

   
    setVerse(randomVerse)

  } catch (error) {
    console.log('Error > ', error)
  }
  }

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    let text = event.currentTarget.value
    setSearchText(text)
  }

  const handleSearch = async () => {
    console.log(searchText)
    try {
      const { data } = await axios.post<ISearchResponse>(
        API_URL_POST, {
          version: "nvi",
          search: searchText
        }
      )
      setSearchText(null)
      let result = data.verses.slice(0, 100)
      console.log(result)
      setSearchResult(result)

    } catch (error) {
      console.log(error)
    }
    
  }


  //useEffect(() => {
   // const handleRequest = async () => {
      //await getRandomVerse()
   // }
    //handleRequest()
  //},[])


  return (
    <div>
      <>
        <div>
          <h1>FastBibleVerses</h1>
          <h3>Procure palavras na Bíblia de uma forma rápida e fácil!</h3>
        </div>
        <div>
          <h4>Insira a palavra desejada: </h4>
          <input type="text" onChange={handleInput} placeholder='Ex: terra, ar, Jesus...'/>
          <button onClick={handleSearch} value={searchText as string} disabled={false} >Pesquisar</button>
        </div>
        {searchResult &&
          searchResult.map((result, index) => (
            <div key={index}>
              <h4>{result.text}</h4>
            </div>
          ))
        }
      </>
    </div>
  )
}

export default App
