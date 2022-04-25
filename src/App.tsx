import React, { useCallback } from 'react';
import './App.css';

const Heading = ({ title }: { title: string }) => <h2>Heading {title}</h2>

const Box = ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>

const List: React.FunctionComponent<{
  items: string[],
  onClick?: (item: string) => void
}> = ({ items, onClick }) => {
  console.log('List calling..')
  return (
    <ul>
      {
        items.map(item => <li onClick={() => onClick?.(item)} key={item}>{item}</li>)
      }
    </ul>
  )
}

function App() {
  const onListClick = useCallback((item: string) => {
    console.log(item)
  }, [])
  return (
    <div className="App">
      <Heading title="Introduction" />
      <Box>
        Hello there
      </Box>
      <List items={['one', 'two']} onClick={onListClick} />
    </div>
  );
}

export default App;
