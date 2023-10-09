import React, {useState} from 'react';
import './App.css';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from 'recoil';


//1.todo列表atom
const todoListState = atom({
  key: 'todoListState',
  default: [],
});

//2.筛选状态atom
const todoListFilterState = atom({
  key: 'todoListFilterState',
  default: 'Show All',
});

//根据atom1和2创建筛选条件selector
const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({get}) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch (filter) {
      case 'Show Completed':
        return list.filter((item) => item.isComplete);
      case 'Show Uncompleted':
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  },
});

//根据atom1和2创建统计信息selector
const todoListStatsState = selector({
  key: 'todoListStatsState',
  get: ({get}) => {
    const todoList = get(todoListState);
    const totalNum = todoList.length;
    const totalCompletedNum = todoList.filter((item) => item.isComplete).length;
    const totalUncompletedNum = totalNum - totalCompletedNum;
    const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum * 100;

    return {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum,
      percentCompleted,
    };
  },
});

//创建todos组件
function TodoItemCreator() {
  const [inputValue, setInputValue] = useState('');
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList((oldTodoList) => [
      ...oldTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      },
    ]);
    setInputValue('');
  };

  const onChange = ({target: {value}}) => {
    setInputValue(value);
  };

  return (
    <div>
      <input placeholder='Take the garbage out' class="w-72 inline-block leading-8 rounded  my-4 py-1 px-4 text-base border border-slate-300 
      min-w-min transition-all focus:outline-none focus:border-blue-300 placeholder:italic" type="text" value={inputValue} onChange={onChange} />
      <div class="inline-block leading-8 rounded border-0 my-4 py-1 px-4 text-base text-center font-bold cursor-pointer border bg-[#6664ff] text-addcolor
      float-right p-1 " onClick={addItem}>+</div>
    </div>
  );
}

//编辑todo
function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

//移除todo
function removeItemAtIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

// 用于创建唯一 id 的工具函数
let id = 0;
function getId() {
  return id++;
}

//todo列表
function TodoItem({item}) {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = ({target: {value}}) => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: value,
    });

    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);
    setTodoList(newList);
  };


  return (
    <li>
      <input
        type="checkbox"
        class="todo-checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <input class="todo-text" type="text" value={item.text} onChange={editItemText} />
      <span class="delete" onClick={deleteItem}></span>
    </li>
  );
}

//状态过滤组件
function TodoListFilters() {
  const [filter, setFilter] = useRecoilState(todoListFilterState);

  const updateFilter = ({target: {value}}) => {
    setFilter(value);
  };

  return (
    <div>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value="Show All">All</option>
        <option value="Show Completed">Completed</option>
        <option value="Show Uncompleted">Uncompleted</option>
      </select>
    </div>
  );
}

//todo状态信息展示组件
function TodoListStats() {
  let {
    totalNum,
    totalCompletedNum,
    totalUncompletedNum,
    percentCompleted,
  } = useRecoilValue(todoListStatsState);
  const todoList = useRecoilValue(filteredTodoListState);
  const [,setTodoList] = useRecoilState(todoListState);





  const formattedPercentCompleted = Math.round(percentCompleted);

  const clearAll = () => {
    setTodoList([]);
  };

  if (totalNum > 0) {
    return (
      <div class="">
        <ul>
          <li class="status busy">You have {totalNum} pending item{ totalNum > 0 && <span>s</span> }</li>
          <li>Percent completed: {formattedPercentCompleted}%</li>
        </ul>
        <ul  class="todo-list">
          {todoList.map((todoItem) => (
            <TodoItem item={todoItem} key={todoItem.id} />
          ))}
        </ul>
        <div class="control-buttons">
          {
            totalNum > 0 && <div class="btn-secondary" onClick={clearAll}>Clear All</div>
          }
        </div>
      </div>  
    );
  }
  if (!totalNum){
    return (
      <p class="status free" ><img src="https://nourabusoud.github.io/vue-todo-list/images/beer_celebration.svg" alt="celebration"/>Time to chill!  You have no todos.</p>
    )
  }
}

function TodoList() {
  return (
    <div className='homepage'>
      <div class="w-96  mt-25px mx-auto rounded px-5 py-8 bg-todowrap truncate relative shadow-lg">
        <h1 class="text-title text-xl text-center">Simple To Do List</h1>
        <TodoItemCreator />
        <TodoListFilters />
        <TodoListStats />
      </div>
      <footer class="">
        Made with React by Ahuntsun
        View on <a href="https://github.com/AhuntSun/RecoilTodoList">Github</a>
      </footer>
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <TodoList />
    </RecoilRoot>
  );
}

export default App;
