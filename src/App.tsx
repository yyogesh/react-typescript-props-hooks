import React, { useCallback, useEffect, useReducer, useState } from 'react';
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

interface Payload {
  text: string;
}

interface Todo {
  id: number;
  done: boolean;
  text: string;
}

// An enum with all the types of actions to use in our reducer
enum CountActionKind {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

// An interface for our actions
interface CountAction {
  type: CountActionKind;
  payload: number;
}

// An interface for our state
interface CountState {
  count: number;
}

type ActionType =
  | { type: "ADD"; text: string }
  | { type: "REMOVE"; id: number };

function reducer(state: Todo[], action: ActionType) {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: state.length,
          text: action.text,
          done: false,
        },
      ];
    case "REMOVE":
      return state.filter(({ id }) => id !== action.id);
    default:
      throw new Error();
  }
}


// Our reducer function that uses a switch statement to handle our actions
function counterReducer(state: CountState, action: CountAction) {
  const { type, payload } = action;
  switch (type) {
    case CountActionKind.INCREASE:
      return {
        ...state,
        count: state.count + payload,
      };
    case CountActionKind.DECREASE:
      return {
        ...state,
        count: state.count - payload,
      };
    default:
      return state;
  }
}

const useNumber = (initialValue: number) => useState<number>(initialValue);

type UseNumberValue = ReturnType<typeof useNumber>[0];

type UseNumberSetValue = ReturnType<typeof useNumber>[1];


const Button: React.FunctionComponent<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { title?: string }> =
  ({ children, style, title, ...rest }) => {
    return (
      <button {...rest} style={{ ...style, background: 'red', color: 'white', fontSize: 'large' }}>{title ?? children}</button>
    )
  }

const Incremenent: React.FunctionComponent<
  {
    value: UseNumberValue,
    setValue: UseNumberSetValue
  }> = ({ value, setValue }) => (
    <Button onClick={() => setValue(value + 1)} title={`Add - ${value}`}></Button>
  )


function App() {
  const [payload, setPayload] = useState<Payload | null>(null);

  const [value, setValue] = useNumber(0);

  useEffect(() => {
    fetch("/data.json")
      .then(response => response.json())
      .then(data => {
        setPayload(data);
      })
  }, []);


  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  // const [todos, dispatch] = useReducer(reducer, { count: 0 })
  console.log(state);
  const onListClick = useCallback((item: string) => {
    console.log(item)
  }, []);

  return (
    <div className="App">
      <Heading title="Introduction" />
      <Box>
        Hello there
      </Box>
      <List items={['one', 'two']} onClick={onListClick} />
      <Box>{JSON.stringify(payload)}</Box>
      <Heading title="Todos" />
      <div>
        Count: {state.count}
        {/* Calling our actions on button click */}
        <Button
          onClick={() => dispatch({ type: CountActionKind.INCREASE, payload: 5 })}
        >
          +
        </Button>
        <Button onClick={() => dispatch({ type: CountActionKind.DECREASE, payload: 5 })}>-</Button>
      </div>
      <Incremenent value={value} setValue={setValue} />
    </div>
  );
}

export default App;
