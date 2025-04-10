// This file contains mock API functions to simulate backend calls
// Later these can be replaced with actual API calls

// Simulated delay to mimic network requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database
let users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@example.com",
    password: "password123",
    avatar: "https://via.placeholder.com/150",
  },
];

// Mock todos database
let todos = [
  {
    id: 1,
    userId: 1,
    title: "Complete portfolio website",
    completed: false,
    dueDate: "2025-04-20",
  },
  {
    id: 2,
    userId: 1,
    title: "Learn React hooks",
    completed: true,
    dueDate: "2025-04-10",
  },
  {
    id: 3,
    userId: 1,
    title: "Build personal assistant app",
    completed: false,
    dueDate: "2025-05-15",
  },
];

// Mock expenses database
let expenses = [
  {
    id: 1,
    userId: 1,
    description: "Web hosting",
    amount: 15.99,
    date: "2025-04-01",
    category: "Business",
  },
  {
    id: 2,
    userId: 1,
    description: "Coffee",
    amount: 4.5,
    date: "2025-04-03",
    category: "Food",
  },
  {
    id: 3,
    userId: 1,
    description: "Office supplies",
    amount: 25.75,
    date: "2025-04-05",
    category: "Business",
  },
];

// Mock blog database
let blogs = [
  {
    id: 1,
    title: "Getting Started with React Hooks",
    excerpt:
      "Learn how to use React Hooks to simplify your functional components and avoid class components.",
    content: `
      <h2>Introduction to React Hooks</h2>
      <p>React Hooks are a feature introduced in React 16.8 that allow you to use state and other React features without writing a class component. They let you "hook into" React state and lifecycle features from function components.</p>
      
      <h3>The useState Hook</h3>
      <p>The useState hook lets you add state to functional components. Here's a simple example:</p>
      
      <pre><code>
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}
      </code></pre>
      
      <h3>The useEffect Hook</h3>
      <p>The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.</p>
      
      <pre><code>
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = \`You clicked \${count} times\`;
  });

  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}
      </code></pre>
      
      <h3>Rules of Hooks</h3>
      <ul>
        <li>Only call Hooks at the top level. Don't call Hooks inside loops, conditions, or nested functions.</li>
        <li>Only call Hooks from React function components or custom Hooks.</li>
      </ul>
      
      <p>By following these rules, you ensure that Hooks are called in the same order each time a component renders, which is important for React to correctly preserve the state of Hooks between multiple useState and useEffect calls.</p>
      
      <h2>Conclusion</h2>
      <p>React Hooks provide a more direct API to the React concepts you already know: props, state, context, refs, and lifecycle. They offer a powerful way to share stateful logic and make your code more reusable and easier to understand.</p>
    `,
    category: "Programming",
    tags: ["React", "JavaScript", "Web Development"],
    coverImage: "https://via.placeholder.com/800x400?text=React+Hooks",
    author: "Demo User",
    authorId: 1,
    status: "published",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-02T14:30:00Z",
    relatedPosts: [
      {
        id: 2,
        title: "Building a Todo App with React",
        coverImage: "https://via.placeholder.com/300x200?text=React+Todo+App",
        createdAt: "2025-03-25T08:15:00Z",
      },
    ],
  },
  {
    id: 2,
    title: "Building a Todo App with React",
    excerpt:
      "Learn how to build a simple but effective Todo application using React, with state management and local storage.",
    content: `
      <h2>Introduction</h2>
      <p>Todo lists are a classic example for learning a new framework or library. In this tutorial, we'll build a simple Todo application using React. The app will allow users to add, edit, mark as completed, and delete tasks, and we'll use local storage to persist the data.</p>
      
      <h2>Setting Up the Project</h2>
      <p>First, let's create a new React application using Create React App:</p>
      
      <pre><code>npx create-react-app react-todo-app
cd react-todo-app
npm start</code></pre>
      
      <h2>Creating the Components</h2>
      <p>Let's start by creating the main components for our Todo app:</p>
      
      <h3>TodoForm Component</h3>
      <pre><code>
import React, { useState } from 'react';

function TodoForm({ addTodo }) {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue('');
  };

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input
        type="text"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Add a new task..."
      /&gt;
      &lt;button type="submit"&gt;Add&lt;/button&gt;
    &lt;/form&gt;
  );
}
      </code></pre>
      
      <h3>Todo Component</h3>
      <pre><code>
function Todo({ todo, index, completeTodo, removeTodo }) {
  return (
    &lt;div
      className="todo"
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    &gt;
      {todo.text}
      &lt;div&gt;
        &lt;button onClick={() => completeTodo(index)}&gt;Complete&lt;/button&gt;
        &lt;button onClick={() => removeTodo(index)}&gt;x&lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
      </code></pre>
      
      <h3>App Component</h3>
      <pre><code>
function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = text => {
    const newTodos = [...todos, { text, isCompleted: false }];
    setTodos(newTodos);
  };

  const completeTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    setTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    &lt;div className="app"&gt;
      &lt;div className="todo-list"&gt;
        &lt;h1&gt;Todo List&lt;/h1&gt;
        &lt;TodoForm addTodo={addTodo} /&gt;
        {todos.map((todo, index) => (
          &lt;Todo
            key={index}
            index={index}
            todo={todo}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
          /&gt;
        ))}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
      </code></pre>
      
      <h2>Adding Local Storage</h2>
      <p>Let's enhance our Todo app by adding local storage, so that tasks persist even when the user refreshes the page:</p>
      
      <pre><code>
function App() {
  // Load todos from localStorage on initial render
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });

  // Save todos to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Rest of the code remains the same
  // ...
}
      </code></pre>
      
      <h2>Conclusion</h2>
      <p>We've built a simple but functional Todo app using React. This project demonstrates the fundamentals of React, including components, state management, and effects. From here, you could enhance the app with features like due dates, categories, or even a backend server to store the todos.</p>
    `,
    category: "Programming",
    tags: ["React", "JavaScript", "Project"],
    coverImage: "https://via.placeholder.com/800x400?text=React+Todo+App",
    author: "Demo User",
    authorId: 1,
    status: "published",
    createdAt: "2025-03-25T08:15:00Z",
    updatedAt: "2025-03-26T09:45:00Z",
    relatedPosts: [
      {
        id: 1,
        title: "Getting Started with React Hooks",
        coverImage: "https://via.placeholder.com/300x200?text=React+Hooks",
        createdAt: "2025-04-01T10:00:00Z",
      },
    ],
  },
  {
    id: 3,
    title: "Productivity Tips for Developers",
    excerpt:
      "Maximize your productivity as a developer with these practical tips and tools.",
    content: `
      <h2>Introduction</h2>
      <p>As developers, we're constantly juggling multiple tasks, learning new technologies, and trying to stay focused in environments often filled with distractions. In this post, I'll share some productivity tips and tools that have helped me become more efficient.</p>
      
      <h2>Time Management Techniques</h2>
      
      <h3>The Pomodoro Technique</h3>
      <p>The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. After four pomodoros, take a longer break of 15-30 minutes.</p>
      <p>This technique helps maintain focus and prevents burnout by encouraging regular breaks. There are many Pomodoro timer apps available, but even a simple kitchen timer works.</p>
      
      <h3>Time Blocking</h3>
      <p>Allocate specific blocks of time for different activities in your calendar. For example, designate 9-11 AM for coding, 11-12 PM for meetings, etc. This helps create structure in your day and prevents context switching.</p>
      
      <h2>Environment Optimization</h2>
      
      <h3>Minimize Distractions</h3>
      <ul>
        <li>Turn off notifications on your phone and computer during focus periods</li>
        <li>Use website blockers to prevent access to distracting sites</li>
        <li>Communicate your focus times to colleagues</li>
        <li>Consider noise-canceling headphones if you work in a noisy environment</li>
      </ul>
      
      <h3>Optimize Your Workspace</h3>
      <p>Ensure your physical workspace is comfortable and conducive to productivity. This includes:</p>
      <ul>
        <li>Ergonomic chair and desk setup</li>
        <li>Good lighting</li>
        <li>Multiple monitors if possible</li>
        <li>Keep your workspace clean and organized</li>
      </ul>
      
      <h2>Development Tools and Practices</h2>
      
      <h3>Keyboard Shortcuts</h3>
      <p>Learning keyboard shortcuts for your IDE, terminal, and other frequently used applications can save you significant time. Invest time in learning at least the most common shortcuts.</p>
      
      <h3>Automate Repetitive Tasks</h3>
      <p>Identify repetitive tasks in your workflow and automate them using:</p>
      <ul>
        <li>Shell scripts</li>
        <li>IDE snippets and templates</li>
        <li>Build tools and task runners</li>
        <li>CI/CD pipelines</li>
      </ul>
      
      <h3>Use the Right Tools</h3>
      <p>Some tools that can boost your productivity:</p>
      <ul>
        <li><strong>Git GUI clients</strong> like GitKraken or SourceTree for easier version control</li>
        <li><strong>Snippet managers</strong> to store code snippets you frequently use</li>
        <li><strong>Terminal multiplexers</strong> like tmux to manage multiple terminal sessions</li>
        <li><strong>Note-taking apps</strong> with good code formatting support</li>
      </ul>
      
      <h2>Mental Well-being</h2>
      
      <h3>Take Regular Breaks</h3>
      <p>Regular breaks improve focus and prevent burnout. Use the Pomodoro technique or simply set reminders to stand up, stretch, and rest your eyes.</p>
      
      <h3>Exercise and Sleep</h3>
      <p>Physical exercise and adequate sleep are crucial for cognitive function. Prioritize these as part of your productivity system.</p>
      
      <h3>Continuous Learning</h3>
      <p>Set aside time for learning and experimentation. This might seem counterintuitive for productivity, but staying updated with new tools and techniques can make you more efficient in the long run.</p>
      
      <h2>Conclusion</h2>
      <p>Productivity is personal, and what works for one developer might not work for another. Experiment with these suggestions and adapt them to fit your unique work style and circumstances. The goal is not to work more hours, but to make the most of the time you do work.</p>
    `,
    category: "Productivity",
    tags: ["Productivity", "Developer Tips", "Time Management"],
    coverImage: "https://via.placeholder.com/800x400?text=Productivity+Tips",
    author: "Demo User",
    authorId: 1,
    status: "draft",
    createdAt: "2025-04-05T14:20:00Z",
    updatedAt: "2025-04-05T14:20:00Z",
    relatedPosts: [],
  },
];

// Authentication APIs
export const mockLogin = async (email, password) => {
  await delay(800);
  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const mockRegister = async (name, email, password) => {
  await delay(1000);

  if (users.some((u) => u.email === email)) {
    throw new Error("Email already in use");
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    avatar: `https://via.placeholder.com/150?text=${name
      .charAt(0)
      .toUpperCase()}`,
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const mockLogout = async () => {
  await delay(500);
  return { success: true };
};

// Todo APIs
export const fetchTodos = async (userId) => {
  await delay(700);
  return todos.filter((todo) => todo.userId === userId);
};

export const addTodo = async (userId, todoData) => {
  await delay(800);
  const newTodo = {
    id: todos.length + 1,
    userId,
    completed: false,
    ...todoData,
  };
  todos.push(newTodo);
  return newTodo;
};

export const updateTodo = async (todoId, updates) => {
  await delay(600);
  const index = todos.findIndex((todo) => todo.id === todoId);
  if (index === -1) throw new Error("Todo not found");

  todos[index] = { ...todos[index], ...updates };
  return todos[index];
};

export const deleteTodo = async (todoId) => {
  await delay(600);
  const index = todos.findIndex((todo) => todo.id === todoId);
  if (index === -1) throw new Error("Todo not found");

  todos = todos.filter((todo) => todo.id !== todoId);
  return { success: true };
};

// Expense APIs
export const fetchExpenses = async (userId) => {
  await delay(700);
  return expenses.filter((expense) => expense.userId === userId);
};

export const addExpense = async (userId, expenseData) => {
  await delay(800);
  const newExpense = {
    id: expenses.length + 1,
    userId,
    ...expenseData,
  };
  expenses.push(newExpense);
  return newExpense;
};

export const updateExpense = async (expenseId, updates) => {
  await delay(600);
  const index = expenses.findIndex((expense) => expense.id === expenseId);
  if (index === -1) throw new Error("Expense not found");

  expenses[index] = { ...expenses[index], ...updates };
  return expenses[index];
};

export const deleteExpense = async (expenseId) => {
  await delay(600);
  const index = expenses.findIndex((expense) => expense.id === expenseId);
  if (index === -1) throw new Error("Expense not found");

  expenses = expenses.filter((expense) => expense.id !== expenseId);
  return { success: true };
};

// Blog APIs
export const fetchBlogs = async () => {
  await delay(800);
  // Only return published blogs for public view
  return blogs.filter((blog) => blog.status === "published");
};

export const fetchBlogById = async (blogId) => {
  await delay(600);
  const blog = blogs.find((b) => b.id === blogId);
  if (!blog) throw new Error("Blog not found");
  return blog;
};

export const fetchBlogsByAuthor = async (authorId) => {
  await delay(800);
  return blogs.filter((blog) => blog.authorId === authorId);
};

export const createBlog = async (blogData) => {
  await delay(1000);
  const newBlog = {
    id: blogs.length + 1,
    ...blogData,
  };
  blogs.push(newBlog);
  return newBlog;
};

export const updateBlog = async (blogId, updates) => {
  await delay(800);
  const index = blogs.findIndex((blog) => blog.id === blogId);
  if (index === -1) throw new Error("Blog not found");

  blogs[index] = {
    ...blogs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return blogs[index];
};

export const updateBlogStatus = async (blogId, status) => {
  await delay(600);
  const index = blogs.findIndex((blog) => blog.id === blogId);
  if (index === -1) throw new Error("Blog not found");

  blogs[index].status = status;
  blogs[index].updatedAt = new Date().toISOString();
  return blogs[index];
};

export const deleteBlog = async (blogId) => {
  await delay(800);
  const index = blogs.findIndex((blog) => blog.id === blogId);
  if (index === -1) throw new Error("Blog not found");

  blogs = blogs.filter((blog) => blog.id !== blogId);
  return { success: true };
};

// Dashboard analytics
export const fetchDashboardStats = async (userId) => {
  await delay(900);

  const userTodos = todos.filter((todo) => todo.userId === userId);
  const userExpenses = expenses.filter((expense) => expense.userId === userId);
  const userBlogs = blogs.filter((blog) => blog.authorId === userId);

  return {
    todoStats: {
      total: userTodos.length,
      completed: userTodos.filter((t) => t.completed).length,
      pending: userTodos.filter((t) => !t.completed).length,
    },
    expenseStats: {
      total: userExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      categories: Object.entries(
        userExpenses.reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
          return acc;
        }, {})
      ).map(([category, amount]) => ({ category, amount })),
    },
    blogStats: {
      total: userBlogs.length,
      published: userBlogs.filter((b) => b.status === "published").length,
      drafts: userBlogs.filter((b) => b.status === "draft").length,
    },
  };
};
