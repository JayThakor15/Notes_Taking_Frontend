"use client";
import API from "../utils/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../components/ui/toast";

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-5 w-5"
  >
    {/* Colorful Google Icon using official brand colors */}
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    ></path>
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    ></path>
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    ></path>
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    ></path>
    <path d="M1 1h22v22H1z" fill="none"></path>
  </svg>
);

export function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    showIcon?: boolean;
    duration?: number;
  } | null>(null);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Notification at top center */}
      {notification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md flex justify-center pointer-events-none">
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            showIcon={notification.showIcon}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      {/* Login Card - More compact and shadcn-like */}
      <div className="flex items-center gap-2 mb-4 w-full absolute z-2 top-4 left-3">
        <img src="./Logo.png" alt="NotesHive Logo" className="h-10 w-10" />
        <h3 className="text-lg font-semibold">NotesHive</h3>
      </div>
      <div className="flex w-full h-full">
        <div className="relative w-2/3 mt-10 max-w-sm p-6 space-y-6 bg-white dark:bg-black rounded-lg ">
          <div className="text-center space-y-3">
            <div>
              <h1 className="text-left text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Sign up
              </h1>
              <p className="text-left text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Enter your details to create an account
              </p>
            </div>
          </div>
          {/* Single Form with conditional OTP field */}
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setNotification(null);

              if (!otpStep) {
                // First step: Send OTP
                try {
                  const res = await API.post("/auth/signup", {
                    name,
                    email,
                    dob,
                  });
                  setNotification({
                    type: "success",
                    title: "Success!",
                    message: res.data?.message || "OTP sent to your email",
                    showIcon: true,
                    duration: 3000,
                  });
                  setOtpStep(true);
                } catch (err: any) {
                  let errorMsg = "Signup failed";
                  if (err?.response?.data?.error) {
                    errorMsg = err.response.data.error;
                  } else if (err?.response?.status) {
                    errorMsg = `Error ${err.response.status}: ${err.response.statusText}`;
                  } else if (err?.message) {
                    errorMsg = err.message;
                  }
                  setNotification({
                    type: "error",
                    title: "Error!",
                    message: errorMsg,
                    showIcon: true,
                    duration: 5000,
                  });
                }
              } else {
                // Second step: Verify OTP
                try {
                  const res = await API.post("/auth/verify-otp", {
                    email,
                    otp,
                  });
                  setNotification({
                    type: "success",
                    title: "Success!",
                    message:
                      res.data?.message || "Account created successfully",
                    showIcon: true,
                    duration: 3000,
                  });
                  // Navigate to dashboard after successful verification
                  setTimeout(() => {
                    navigate("/dashboard");
                  }, 1500); // Small delay to show success message
                } catch (err: any) {
                  let errorMsg = "OTP verification failed";
                  if (err?.response?.data?.error) {
                    errorMsg = err.response.data.error;
                  } else if (err?.response?.status) {
                    errorMsg = `Error ${err.response.status}: ${err.response.statusText}`;
                  } else if (err?.message) {
                    errorMsg = err.message;
                  }
                  setNotification({
                    type: "error",
                    title: "Error!",
                    message: errorMsg,
                    showIcon: true,
                    duration: 5000,
                  });
                }
              }
            }}
          >
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-50"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-5 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={otpStep}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-50"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-5 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={otpStep}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="dob"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-50"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={otpStep}
              />
            </div>

            {/* OTP Field - Shows after OTP is sent */}
            {otpStep && (
              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-50"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP sent to your email"
                  className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />

                <button
                  type="button"
                  onClick={async () => {
                    setNotification(null);
                    try {
                      const res = await API.post("/auth/signup", {
                        name,
                        email,
                        dob,
                      });
                      setNotification({
                        type: "success",
                        title: "Success!",
                        message:
                          res.data?.message || "OTP resent to your email",
                        showIcon: true,
                        duration: 3000,
                      });
                    } catch (err: any) {
                      let errorMsg = "Failed to resend OTP";
                      if (err?.response?.data?.error) {
                        errorMsg = err.response.data.error;
                      } else if (err?.response?.status) {
                        errorMsg = `Error ${err.response.status}: ${err.response.statusText}`;
                      } else if (err?.message) {
                        errorMsg = err.message;
                      }
                      setNotification({
                        type: "error",
                        title: "Error!",
                        message: errorMsg,
                        showIcon: true,
                        duration: 5000,
                      });
                    }
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-4 transition-colors"
                >
                  Resend OTP
                </button>
              </div>
            )}
            

            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-zinc-50 shadow hover:bg-blue-600 dark:bg-blue-600 dark:text-zinc-900 dark:hover:bg-blue-700 h-9 px-4 py-2 w-full"
            >
              {otpStep ? "Verify OTP" : "Sign Up"}
            </button>

            {/* Back button when in OTP step */}
            {otpStep && (
              <button
                type="button"
                onClick={() => {
                  setOtpStep(false);
                  setOtp("");
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700 h-9 px-4 py-2 w-full"
              >
                Back to Sign Up
              </button>
            )}
          </form>
          {/* Footer links - More compact */}
          <div className="text-center space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <a
                href="/signin"
                className="font-medium text-zinc-900 dark:text-zinc-50 underline underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
        <div className=" h-full w-full p-2">
          <img
            src="./Login_Background.jpg"
            alt=""
            className="object-cover w-full h-full rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
