import { useParams } from "react-router-dom";

export default function PersonDetail() {
  const { id } = useParams();
  return <h1 className="text-xl">Person Detail for ID: {id}</h1>;
}
