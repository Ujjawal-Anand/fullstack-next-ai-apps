import { SignUp } from "@clerk/nextjs";

export default function SingUpPage() {
  return (
    <SignUp
      path="/sign-up"
      routing="path"
      signInUrl="/sign-in"
      redirectUrl={"/new-user"}
      afterSignUpUrl={"/new-user"}
    />
  );
}
