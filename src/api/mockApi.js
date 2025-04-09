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

// Dashboard analytics
export const fetchDashboardStats = async (userId) => {
  await delay(900);

  const userTodos = todos.filter((todo) => todo.userId === userId);
  const userExpenses = expenses.filter((expense) => expense.userId === userId);

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
  };
};
