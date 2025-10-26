import { useParams } from "react-router-dom";

export default function AIAnalysis() {
  const { id } = useParams();
  return <h1 className="text-xl">AI Analysis for Person {id}</h1>;
}
