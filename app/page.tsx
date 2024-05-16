import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button variant={"outline"}>
        <Eye size={24} /> 
        click me</Button>
    </main>
  );
}
