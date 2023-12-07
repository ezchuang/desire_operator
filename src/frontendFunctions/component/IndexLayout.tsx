import React from "react";
import SignInUpForm from "./SignInUpForm";
import GuestSignInForm from "./GuestSignInForm";

const IndexLayout: React.FC = () => {
  // const { isVerified } = useVerification();

  return (
    <>
      <div className="flex flex-col">
        {/* NAV */}
        <nav className="bg-blue-500 p-4 text-white fixed w-full z-30">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Content for NAV */}
            <div className="font-bold text-2xl">MySQL Speaker</div>
            {/* Content for Verify User */}
            <div className="flex gap-10">
              <GuestSignInForm />
              <SignInUpForm />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default IndexLayout;
