import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [domain, setDomain] = useState(null);
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    // send request to introspect api
    fetch(API_URL +"/introspect")
      .then((res) => res.json())
      .then((data) => {
        setDomain(data.website);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [API_URL]);

  useEffect(() => {
    if (!domain) return;
    // send request to articles api
    fetch(API_URL +"/articles/" + domain.id)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [API_URL, domain]);

  return (
    <>
      {domain && <h2>{domain.name}</h2>}
      {articles && articles.map((article) => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
        </div>
      ))}
    </>
  )
}

export default App
