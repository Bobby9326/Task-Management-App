import '@testing-library/jest-dom';
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import RegisterBox from './RegisterBox';
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

describe("RegisterBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to render the component with Router
  const renderRegisterBox = () => {
    return render(
      <BrowserRouter>
        <RegisterBox />
      </BrowserRouter>
    );
  };
  it("loads and display", () => {

    renderRegisterBox()

    const heading = screen.getByRole("heading", { name: /register/i });
    const emailInput = screen.getByLabelText(/email/i);
    const mainPasswordInput = screen.getByLabelText(/main password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const registerButton = screen.getByRole("button", { name: /register/i });
    const noAccountText = screen.getByText(/already have an account?\?/i);
    const loginLink = screen.getByRole("link", { name: /login/i });

    expect(heading).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(mainPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
    expect(noAccountText).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");

  });


  it("displays validation errors for empty fields", async () => {
    renderRegisterBox();
  
    const loginButton = screen.getByRole("button", { name: /register/i });
    fireEvent.click(loginButton);
    await wait(100);
    const emailError = screen.getByText(/email is required/i);
    const mainPasswordError = screen.getByText(/Password is required/);
    const confirmPasswordError = screen.getByText(/Confirm password is required/);
  
    await waitFor(() => {
      expect(emailError).toBeInTheDocument();
      expect(mainPasswordError).toBeInTheDocument();
      expect(confirmPasswordError).toBeInTheDocument();
    });
  });
  
  it("validates email format", async () => {
    renderRegisterBox();
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "email");
    fireEvent.blur(emailInput);
    

    const emailError = screen.getByText(/invalid email format/i);
    await waitFor(() => {
      expect(emailError).toBeInTheDocument();
    });
  });

  it("validates password requirements", async () => {
    renderRegisterBox();
    
    const mainPasswordInput = screen.getByLabelText(/main password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    await userEvent.type(mainPasswordInput, "1234");
    fireEvent.blur(mainPasswordInput);
    
    const mainPasswordShortError = screen.getByText(/password must be at least 8 characters/i);
    await waitFor(() => {
      expect(mainPasswordShortError).toBeInTheDocument();
      
    });
    
    await userEvent.clear(mainPasswordInput);
    await userEvent.type(mainPasswordInput, "12345678");
    await userEvent.type(confirmPasswordInput, "1233");
    fireEvent.blur(mainPasswordInput);
    fireEvent.blur(confirmPasswordInput);

    const passwordValidateError = screen.getByText(/password must contain at least one uppercase letter, one lowercase letter, one number, and one special character/i);
    const confirmPasswordMatchError = screen.getByText(/passwords must match/i);
    await waitFor(() => {
      expect(passwordValidateError).toBeInTheDocument();
      expect(confirmPasswordMatchError).toBeInTheDocument();
    });
  });

  it("navigates to home on successful register", async () => {
    renderRegisterBox();
    const mockResponse = { data: { token: "fake-token" } };
    vi.mocked(axiosInstance.post).mockResolvedValueOnce(mockResponse);


    const emailInput = screen.getByLabelText(/email/i);
    const mainPasswordInput = screen.getByLabelText(/main password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(emailInput, { target: { value: "mock@mock.com" } });
    fireEvent.blur(emailInput);
    fireEvent.change(mainPasswordInput, { target: { value: "M0ck!123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "M0ck!123" } });
    fireEvent.blur(mainPasswordInput);
    fireEvent.blur(confirmPasswordInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(axiosInstance.post).toHaveBeenCalledWith("/user", {
          email: "mock@mock.com",
          password: "M0ck!123"
        });
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
  });

  it("shows error message on failed register", async () => {
    renderRegisterBox();
    const errorMessage = "Invalid credentials";
    
    vi.mocked(axiosInstance.post).mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage
        }
      }
    });
  
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/main password/i); // แก้ตรงนี้ให้ตรง label
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /register/i }); // ปุ่มคือ "Register"
  
    fireEvent.change(emailInput, { target: { value: "wrong@wrong.com" } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: "Wr0ng!123" } });
    fireEvent.blur(passwordInput);
    fireEvent.change(confirmPasswordInput, { target: { value: "Wr0ng!123" } });
    fireEvent.blur(confirmPasswordInput);
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
  
  it("shows default error message when error has no response", async () => {
    renderRegisterBox();
    
    vi.mocked(axiosInstance.post).mockRejectedValueOnce(new Error("Network Error"));
  
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/main password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });
  
    fireEvent.change(emailInput, { target: { value: "mock@mock.com" } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: "M0ck!123" } });
    fireEvent.blur(passwordInput);
    fireEvent.change(confirmPasswordInput, { target: { value: "M0ck!123" } });
    fireEvent.blur(confirmPasswordInput);
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
    });
  });
  
  it("shows default error message when server response has no message", async () => {
    renderRegisterBox();
    
    vi.mocked(axiosInstance.post).mockRejectedValueOnce({
      response: {
        data: {}
      }
    });
  
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/main password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });
  
    fireEvent.change(emailInput, { target: { value: "mock@mock.com" } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: "M0ck!123" } });
    fireEvent.blur(passwordInput);
    fireEvent.change(confirmPasswordInput, { target: { value: "M0ck!123" } });
    fireEvent.blur(confirmPasswordInput);
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
    });
  });
  

  
});