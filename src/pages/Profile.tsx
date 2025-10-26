import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-3">Welcome!</h1>
      <p className="text-lg text-gray-700">Patient ID: {id}</p>
    </div>
  );
}
