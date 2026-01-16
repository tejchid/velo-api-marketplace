import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <SignIn 
        path="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#3b82f6",
            colorText: "white",
          },
          elements: {
            card: "bg-slate-900 border border-slate-800 shadow-2xl",
            headerTitle: "text-slate-50",
            headerSubtitle: "text-slate-400",
            socialButtonsBlockButton: "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700",
            formFieldLabel: "text-slate-300",
            footerActionText: "text-slate-400",
            footerActionLink: "text-blue-400 hover:text-blue-300"
          }
        }}
      />
    </div>
  );
}
