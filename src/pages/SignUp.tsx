"use client";
import API from "../utils/api";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../components/ui/toast";



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
      <div className="flex items-center gap-2 mb-4 w-full absolute z-2 top-4 left-3 md:left-6">
        <img
          src="./Logo.png"
          alt="NotesHive Logo"
          className="h-8 w-8 md:h-10 md:w-10"
        />
        <h3 className="text-lg font-semibold">NotesHive</h3>
      </div>
      <div className="flex w-full h-full">
        <div className="relative w-full md:w-2/3 mt-10 max-w-sm mx-auto p-6 space-y-6 bg-white dark:bg-black rounded-lg">
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
        <div className="hidden md:block h-full w-full p-2">
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
