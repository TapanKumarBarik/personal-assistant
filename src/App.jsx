import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TodoProvider } from "./context/TodoContext";
import { ExpenseProvider } from "./context/ExpenseContext";

// Landing page components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import LandingPage from "./components/landing/LandingPage";

// Auth components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Dashboard components
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/dashboard/Profile";
import TodoList from "./components/dashboard/TodoList";
import ExpenseManager from "./components/dashboard/ExpenseManager";
import BlogManager from "./components/dashboard/BlogManager";
import BlogEditor from "./components/dashboard/BlogEditor";

// Public blog components
import BlogPage from "./components/blog/BlogPage";
import BlogDetail from "./components/blog/BlogDetail";

// Styles
import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <TodoProvider>
        <ExpenseProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route
                path="/"
                element={
                  <>
                    <Header />
                    <LandingPage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/login"
                element={
                  <>
                    <Header />
                    <Login />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/register"
                element={
                  <>
                    <Header />
                    <Register />
                    <Footer />
                  </>
                }
              />

              {/* Public blog routes */}
              <Route
                path="/blog"
                element={
                  <>
                    <Header />
                    <BlogPage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/blog/:id"
                element={
                  <>
                    <Header />
                    <BlogDetail />
                    <Footer />
                  </>
                }
              />

              {/* Protected dashboard routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="todo" element={<TodoList />} />
                <Route path="expenses" element={<ExpenseManager />} />
                <Route path="blog-manager" element={<BlogManager />} />
                <Route path="blog-editor" element={<BlogEditor />} />
                <Route path="blog-editor/:id" element={<BlogEditor />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ExpenseProvider>
      </TodoProvider>
    </AuthProvider>
  );
}

export default App;
