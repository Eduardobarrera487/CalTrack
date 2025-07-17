import { Suspense } from "react";
import AddIngredientsClient from "@/app/_components/AddIngredientsClient";

export default function Page() {
  return (
    <Suspense>
      <AddIngredientsClient />
    </Suspense>
  );
}
