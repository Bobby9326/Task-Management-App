import '@testing-library/jest-dom';
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import LoginBox from "./LoginBox";
import axiosInstance from "../../utils/axios";
import { wait } from '../../utils/wait';

// Mock the axios instance
vi.mock("../../utils/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to render the component with Router
  const renderLoginBox = () => {
    return render(
      <BrowserRouter>
        <LoginBox />
      </BrowserRouter>
    );
  };
  it("loads and display", () => {

    renderLoginBox()

    const heading = screen.getByRole("heading", { name: /login/i });
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });
    const noAccountText = screen.getByText(/don't have an account\?/i);
    const registerLink = screen.getByRole("link", { name: /register/i });
    

    expect(heading).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(noAccountText).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");

  });


  it("displays validation errors for empty fields", async () => {
    renderLoginBox();
  
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);
    await wait(100);
    const emailError = screen.getByText(/email is required/i);
    const passwordError = screen.getByText(/password is required/i);
  
    await waitFor(() => {
      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
    });
  });
  
  it("validates email format", async () => {
    renderLoginBox();
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "email");
    fireEvent.blur(emailInput);
    

    const emailError = screen.getByText(/invalid email format/i);
    await waitFor(() => {
      expect(emailError).toBeInTheDocument();
    });
  });


  it("navigates to home on successful login", async () => {
    renderLoginBox();
    const mockResponse = { data: { token: "fake-token" } };
    vi.mocked(axiosInstance.post).mockResolvedValueOnce(mockResponse);


    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "mock@mock.com" } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: "M0ck!123" } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(axiosInstance.post).toHaveBeenCalledWith("/auth/login", {
          email: "mock@mock.com",
          password: "M0ck!123"
        });
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
  });

  it("shows error message on failed login", async () => {
    renderLoginBox();
    const errorMessage = "Invalid credentials";
    vi.mocked(axiosInstance.post).mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage
        }
      }
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "wrong@wrong.com" } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: "Wr0ng!123" } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
  });

  it("shows default error message when error has no response", async () => {
    renderLoginBox();
    
    // ทำให้ axiosInstance.post reject ด้วย error ปกติ
    vi.mocked(axiosInstance.post).mockRejectedValueOnce(new Error("Network Error"));
  
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });
  
    fireEvent.change(emailInput, { target: { value: "mock@mock.com" } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: "M0ck!123" } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
    });
  });
  it("shows default error message when server response has no message", async () => {
    renderLoginBox();
    
    // ทำให้ axiosInstance.post reject ด้วย response ที่ไม่มี message
    vi.mocked(axiosInstance.post).mockRejectedValueOnce({
      response: {
        data: {}
      }
    });
  
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });
  
    fireEvent.change(emailInput, { target: { value: "mock@mock.com" } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: "M0ck!123" } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
    });
  });
  
  

  
});