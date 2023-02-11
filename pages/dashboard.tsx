import { User } from "@/src/types";
import useUser from "@/src/useUser";
import useSWR from "swr";

export default function Dashboard() {
  const { data: user, error, isLoading } = useSWR<User>("/api/user");
  return <h1>Hello! {user?.name}</h1>;
}
