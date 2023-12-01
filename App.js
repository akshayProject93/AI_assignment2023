import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [pdf, setPdf] = useState(null);
  const [response, setResponse] = useState('');

  const handleQuery = async () => {
    try {
      const formData = new FormData();
      formData.append('query', query);
      formData.append('pdf', pdf);

      const result = await axios.post('http://localhost:3001/query', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponse(result.data.response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <div>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        <input type="file" onChange={(e) => setPdf(e.target.files[0])} />
        <button onClick={handleQuery}>Submit</button>
      </div>
      <div>
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default App;