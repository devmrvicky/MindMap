import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/components/utils/Logo";
import { Link } from "react-router";
import GoogleAuthBtn from "../../components/buttons/auth/GoogleAuthBtn";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    console.log("Logging in with email:", email);
    // Add authentication logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {/* <h1 className="text-2xl font-bold text-black">ChatGPT</h1> */}
          <Logo />
          <h2 className="text-3xl font-bold mt-6 mb-4 text-black">
            Welcome back
          </h2>
        </div>

        <div className="">
          <div className="p-0 space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
              className="border-gray-300 focus:border-green-500"
              disabled
            />

            <Button
              onClick={handleSubmit}
              className="w-full py-6 bg-green-500 hover:bg-green-600 text-white"
              disabled
            >
              Continue
            </Button>

            <div className="text-center">
              <p className="text-sm">
                Don't have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="text-green-500 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="flex items-center justify-center my-4">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>

            <div className="space-y-3">
              <GoogleAuthBtn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
