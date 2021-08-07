import { useState } from 'react';
import axios from 'axios';

function App() {
  const [link, setLink] = useState('');
  const [imageLink, setImageLink] = useState([]);

  const getImages = async () => {
    const { data } = await axios.post('http://127.0.0.1:8080/', { link });
    setImageLink([...data]);
  };

  const postImage = (images) => {
    return images.map((img, i) => (
      <img
        key={i}
        style={{ width: '100px', padding: '10px' }}
        src={img}
        alt={i}
      />
    ));
  };

  return (
    <div className="App">
      <h2>Image Scrapper</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
          }}
        />
        <button onClick={getImages}>Get Image</button>
      </form>
      {imageLink.length > 0 && postImage(imageLink)}
    </div>
  );
}

export default App;
