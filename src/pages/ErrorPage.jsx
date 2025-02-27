import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Oops! Something went wrong.</h1>
      <p className="text-red-500">{error.statusText || error.message}</p>
    </div>
  );
}
